/**
 * Copilot Client
 *
 * Wraps code generation for generating code with skill context.
 * Manages sessions, sends prompts, and captures generated code.
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import type {
  GenerationResult,
  GenerationConfig,
  CopilotClient,
} from "./types.js";
import { DEFAULT_GENERATION_CONFIG } from "./types.js";

// =============================================================================
// Mock Client
// =============================================================================

/**
 * Mock client for testing without real SDK.
 * Returns predefined responses for test scenarios.
 */
export class MockCopilotClient implements CopilotClient {
  private mockResponses: Map<string, string> = new Map();

  /**
   * Add a mock response for a specific scenario.
   */
  addMockResponse(scenarioName: string, response: string): void {
    this.mockResponses.set(scenarioName, response);
  }

  /**
   * Generate a mock response.
   */
  async generate(
    prompt: string,
    skillName: string,
    config?: GenerationConfig,
    scenarioName?: string
  ): Promise<GenerationResult> {
    // If scenarioName is provided, use it to look up the response
    if (scenarioName && this.mockResponses.has(scenarioName)) {
      return {
        code: this.mockResponses.get(scenarioName)!,
        prompt,
        skillName: "mock",
        model: "mock",
        tokensUsed: 0,
        durationMs: 0,
        rawResponse: "",
      };
    }

    // Default mock response (fallback for missing scenario)
    return {
      code: "# No mock response configured for this prompt\npass",
      prompt,
      skillName: "mock",
      model: "mock",
      tokensUsed: 0,
      durationMs: 0,
      rawResponse: "",
    };
  }
}

// =============================================================================
// Skill Copilot Client
// =============================================================================

/**
 * Client for generating code with skill context.
 *
 * Features:
 * - Loads skill content as context
 * - Manages conversation sessions
 * - Extracts code from responses
 * - Falls back to mock client if SDK unavailable
 */
export class SkillCopilotClient implements CopilotClient {
  private static readonly SKILLS_DIR = ".github/skills";

  private basePath: string;
  private skillsDir: string;
  private useMock: boolean;
  private mockClient: MockCopilotClient;
  private skillCache: Map<string, string> = new Map();

  constructor(basePath?: string, useMock: boolean = false) {
    this.basePath = basePath ?? process.cwd();
    this.skillsDir = join(this.basePath, SkillCopilotClient.SKILLS_DIR);
    this.useMock = useMock || !checkCopilotAvailable();
    this.mockClient = new MockCopilotClient();
  }

  /**
   * Load skill content as context for code generation.
   */
  loadSkillContext(skillName: string): string {
    if (this.skillCache.has(skillName)) {
      return this.skillCache.get(skillName)!;
    }

    const skillDir = join(this.skillsDir, skillName);
    if (!existsSync(skillDir)) {
      throw new Error(`Skill not found: ${skillName}`);
    }

    const contextParts: string[] = [];

    // Load main SKILL.md
    const skillMd = join(skillDir, "SKILL.md");
    if (existsSync(skillMd)) {
      contextParts.push(`# Skill: ${skillName}\n\n`);
      contextParts.push(readFileSync(skillMd, "utf-8"));
    }

    // Load reference files
    const refsDir = join(skillDir, "references");
    if (existsSync(refsDir)) {
      const refFiles = readdirSync(refsDir).filter(
        (f) => f.endsWith(".md") && f !== "acceptance-criteria.md"
      );
      for (const refFile of refFiles) {
        const refPath = join(refsDir, refFile);
        const stem = refFile.replace(/\.md$/, "");
        contextParts.push(`\n\n# Reference: ${stem}\n\n`);
        contextParts.push(readFileSync(refPath, "utf-8"));
      }
    }

    const context = contextParts.join("\n");
    this.skillCache.set(skillName, context);
    return context;
  }

  /**
   * Generate code using Copilot with skill context.
   */
  async generate(
    prompt: string,
    skillName: string,
    config?: GenerationConfig,
    scenarioName?: string
  ): Promise<GenerationResult> {
    const cfg = config ?? DEFAULT_GENERATION_CONFIG;

    // Build full prompt with skill context
    let skillContext = "";
    if (cfg.includeSkillContext) {
      skillContext = this.loadSkillContext(skillName);
    }

    if (this.useMock) {
      return this.mockClient.generate(prompt, skillName, config, scenarioName);
    }

    // Use real SDK
    return this.generateWithCopilot(prompt, skillName, skillContext, cfg);
  }

  /**
   * Build the full prompt with skill context.
   */
  private buildPrompt(userPrompt: string, skillContext: string): string {
    return `You are an expert developer. Use the following skill documentation as reference for correct SDK usage patterns.

<skill-context>
${skillContext}
</skill-context>

<task>
${userPrompt}
</task>

Generate only code. Follow the patterns from the skill documentation exactly.
`;
  }

  /**
   * Generate code using the actual Copilot SDK.
   */
  private async generateWithCopilot(
    prompt: string,
    skillName: string,
    skillContext: string,
    config: GenerationConfig
  ): Promise<GenerationResult> {
    const startTime = Date.now();

    // Build full prompt
    const fullPrompt = this.buildPrompt(prompt, skillContext);

    // Note: The real @github/copilot-sdk integration would go here
    // For now, we throw an error since the SDK isn't widely available
    throw new Error(
      "Real Copilot SDK integration not implemented. Use --mock flag."
    );

    // When SDK is available, the code would look something like:
    // const client = new CopilotSDK.Client();
    // const response = await client.complete({
    //   prompt: fullPrompt,
    //   model: config.model,
    //   maxTokens: config.maxTokens,
    //   temperature: config.temperature,
    // });
    //
    // const code = this.extractCode(response.content);
    // return {
    //   code,
    //   prompt: fullPrompt,
    //   skillName,
    //   model: config.model,
    //   tokensUsed: response.usage?.totalTokens ?? 0,
    //   durationMs: Date.now() - startTime,
    //   rawResponse: response.content,
    // };
  }

  /**
   * Extract code from a response.
   */
  private extractCode(response: string): string {
    // Look for code blocks
    const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
    const blocks: string[] = [];
    let match;

    while ((match = codeBlockRegex.exec(response)) !== null) {
      if (match[1]) {
        blocks.push(match[1].trim());
      }
    }

    if (blocks.length > 0) {
      return blocks.join("\n\n");
    }

    // If no code blocks, try to find code-like content
    const lines = response.split("\n");
    const codeLines: string[] = [];
    let inCode = false;

    for (const line of lines) {
      // Heuristic: lines starting with import, def, class, or indented
      if (
        line.startsWith("import ") ||
        line.startsWith("from ") ||
        line.startsWith("def ") ||
        line.startsWith("class ") ||
        line.startsWith("function ") ||
        line.startsWith("const ") ||
        line.startsWith("let ") ||
        line.startsWith("using ") ||
        line.startsWith("    ") ||
        line.startsWith("\t")
      ) {
        inCode = true;
        codeLines.push(line);
      } else if (inCode && line.trim() === "") {
        codeLines.push(line);
      } else if (inCode && !line.startsWith("#") && line.trim()) {
        // Non-code line, might be end of code
        if (line.length > 0 && !/^[a-zA-Z]/.test(line.charAt(0))) {
          codeLines.push(line);
        }
      }
    }

    return codeLines.join("\n").trim() || response;
  }

  /**
   * Add a mock response for a specific test scenario.
   */
  addMockResponse(scenarioName: string, response: string): void {
    this.mockClient.addMockResponse(scenarioName, response);
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Check if Copilot SDK is available.
 * Note: In the TypeScript version, we always default to mock mode
 * since the @github/copilot-sdk isn't widely available yet.
 */
export function checkCopilotAvailable(): boolean {
  // For now, always return false to use mock mode
  // When the SDK becomes available, we can add proper detection
  return false;
}

/**
 * Create a client based on availability.
 */
export function createClient(
  basePath?: string,
  useMock: boolean = true
): SkillCopilotClient {
  return new SkillCopilotClient(basePath, useMock);
}
