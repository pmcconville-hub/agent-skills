# Semantic Ranking Reference - @azure/search-documents

> Reference documentation for semantic search and ranking patterns in the Azure AI Search TypeScript SDK.
> 
> **SDK Version**: 12.x  
> **Source**: [azure-sdk-for-js](https://github.com/Azure/azure-sdk-for-js/blob/3d73b62136d4f89a74a325329bb838280f37f0d0/sdk/search/search-documents/src/indexModels.ts#L1078-L1123)

## SemanticSearchOptions Interface

The `SemanticSearchOptions` interface configures semantic ranking behavior within a search request.

```typescript
interface SemanticSearchOptions {
  /** Name of the semantic configuration to use */
  configurationName?: string;
  
  /** Error handling: 'partial' (default) or 'fail' */
  errorMode?: SemanticErrorMode;
  
  /** Timeout for semantic enrichment in milliseconds */
  maxWaitInMilliseconds?: number;
  
  /** Extract answers from key passages */
  answers?: QueryAnswer;
  
  /** Extract captions with highlighting */
  captions?: QueryCaption;
  
  /** Generate query rewrites for better recall */
  queryRewrites?: QueryRewrites;
  
  /** Separate query for semantic reranking */
  semanticQuery?: string;
  
  /** Fields to use for semantic search */
  semanticFields?: string[];
  
  /** Enable debugging information */
  debugMode?: QueryDebugMode;
}
```

**Source**: [indexModels.ts#L1078-L1123](https://github.com/Azure/azure-sdk-for-js/blob/3d73b62136d4f89a74a325329bb838280f37f0d0/sdk/search/search-documents/src/indexModels.ts#L1078-L1123)

---

## Basic Semantic Search

Enable semantic ranking with `queryType: "semantic"`:

```typescript
import { SearchClient, AzureKeyCredential } from "@azure/search-documents";

interface Hotel {
  hotelId: string;
  hotelName: string;
  description: string;
  category: string;
}

const client = new SearchClient<Hotel>(
  "https://<service>.search.windows.net",
  "hotels-index",
  new AzureKeyCredential("<api-key>")
);

const results = await client.search("luxury hotel with ocean view", {
  queryType: "semantic",
  semanticSearchOptions: {
    configurationName: "my-semantic-config",
  },
  select: ["hotelId", "hotelName", "description"],
});

for await (const result of results.results) {
  console.log(`${result.document.hotelName}`);
  console.log(`  Score: ${result.score}, Reranker: ${result.rerankerScore}`);
}
```

**Note**: Semantic search requires a semantic configuration defined in your index.

---

## Extractive Captions

Extract representative passages with highlighting:

```typescript
interface ExtractiveQueryCaption {
  captionType: "extractive";
  highlight?: boolean;           // Enable highlighting (default: true)
  maxCaptionLength?: number;     // Max characters per caption
}
```

```typescript
const results = await client.search("What amenities do luxury hotels offer?", {
  queryType: "semantic",
  semanticSearchOptions: {
    configurationName: "my-semantic-config",
    captions: {
      captionType: "extractive",
      highlight: true,
    },
  },
});

for await (const result of results.results) {
  console.log(`Hotel: ${result.document.hotelName}`);
  
  // Access captions from the result
  if (result.captions) {
    for (const caption of result.captions) {
      console.log(`  Caption: ${caption.text}`);
      console.log(`  Highlighted: ${caption.highlights}`);
    }
  }
}
```

**Source**: [QueryCaptionResult](https://github.com/Azure/azure-sdk-for-js/blob/3d73b62136d4f89a74a325329bb838280f37f0d0/sdk/search/search-documents/src/generated/data/models/index.ts#L336-L349)

---

## Extractive Answers

Extract direct answers for Q&A scenarios:

```typescript
interface ExtractiveQueryAnswer {
  answerType: "extractive";
  count?: number;           // Number of answers (default: 1)
  threshold?: number;       // Confidence threshold (default: 0.7)
  maxAnswerLength?: number; // Max characters per answer
}
```

```typescript
const results = await client.search("What are the most luxurious hotels?", {
  queryType: "semantic",
  semanticSearchOptions: {
    configurationName: "my-semantic-config",
    answers: {
      answerType: "extractive",
      count: 3,
      threshold: 0.7,
    },
  },
  top: 5,
});

// Answers are returned at the response level, not per-document
if (results.answers) {
  for (const answer of results.answers) {
    console.log(`Answer (score: ${answer.score}):`);
    console.log(`  Document: ${answer.key}`);
    console.log(`  Text: ${answer.text}`);
    console.log(`  Highlighted: ${answer.highlights}`);
  }
}
```

**Source**: [QueryAnswerResult](https://github.com/Azure/azure-sdk-for-js/blob/3d73b62136d4f89a74a325329bb838280f37f0d0/sdk/search/search-documents/src/generated/data/models/index.ts#L168-L191)

---

## Query Rewrites

Generate alternative queries to improve recall:

```typescript
interface GenerativeQueryRewrites {
  rewritesType: "generative";
  count?: number;  // Number of rewrites (default: 10)
}
```

```typescript
const results = await client.search("cheap hotels downtown", {
  queryType: "semantic",
  semanticSearchOptions: {
    configurationName: "my-semantic-config",
    queryRewrites: {
      rewritesType: "generative",
      count: 5,
    },
  },
});

// Check what type of rewrite was used
console.log(`Rewrite type: ${results.semanticQueryRewritesResultType}`);
```

---

## Semantic + Hybrid Search

Combine semantic ranking with vector search for best results:

```typescript
const results = await client.search("luxury hotel with spa", {
  // Enable semantic ranking
  queryType: "semantic",
  semanticSearchOptions: {
    configurationName: "my-semantic-config",
    captions: { captionType: "extractive", highlight: true },
    answers: { answerType: "extractive", count: 3 },
  },
  
  // Add vector search
  vectorSearchOptions: {
    queries: [
      {
        kind: "vector",
        vector: queryEmbedding,  // Pre-computed embedding
        fields: ["descriptionVector"],
        kNearestNeighborsCount: 50,
      },
    ],
  },
  
  // Text search fields
  searchFields: ["hotelName", "description"],
  
  top: 10,
  select: ["hotelId", "hotelName", "description", "rating"],
});
```

---

## Semantic Query Override

Use a different query for semantic reranking than for retrieval:

```typescript
const results = await client.search("hotel pool wifi", {
  queryType: "semantic",
  semanticSearchOptions: {
    configurationName: "my-semantic-config",
    // Use natural language for semantic reranking
    semanticQuery: "What hotels have a swimming pool and free wifi?",
  },
});
```

---

## Debug Mode

Enable debugging to understand semantic processing:

```typescript
const results = await client.search("luxury", {
  queryType: "semantic",
  semanticSearchOptions: {
    configurationName: "my-semantic-config",
    errorMode: "fail",      // Fail on errors instead of partial results
    debugMode: "semantic",  // Enable semantic debug info
  },
});

for await (const result of results.results) {
  const debug = result.documentDebugInfo?.semantic;
  if (debug) {
    console.log(`Title field: ${debug.titleField?.name} (${debug.titleField?.state})`);
    console.log(`Content fields:`, debug.contentFields);
    console.log(`Keyword fields:`, debug.keywordFields);
    console.log(`Reranker input:`, debug.rerankerInput);
  }
}
```

**Debug info includes**:
- `titleField`: Which field was used as title and its state (used/unused)
- `contentFields`: Content fields sent to semantic enrichment
- `keywordFields`: Keyword fields sent to semantic enrichment
- `rerankerInput`: Raw concatenated strings sent to the reranker

---

## Error Handling

Control semantic search error behavior:

```typescript
const results = await client.search("query", {
  queryType: "semantic",
  semanticSearchOptions: {
    configurationName: "my-semantic-config",
    errorMode: "partial",           // Return partial results on error (default)
    maxWaitInMilliseconds: 5000,    // Timeout after 5 seconds
  },
});

// Check for partial results
if (results.semanticErrorReason) {
  console.log(`Semantic error: ${results.semanticErrorReason}`);
  console.log(`Result type: ${results.semanticSearchResultsType}`);
}
```

---

## Index Configuration for Semantic Search

Configure semantic search in your index definition:

```typescript
import { SearchIndexClient, AzureKeyCredential } from "@azure/search-documents";

const indexClient = new SearchIndexClient(endpoint, new AzureKeyCredential(apiKey));

await indexClient.createIndex({
  name: "hotels-semantic-index",
  fields: [
    { name: "hotelId", type: "Edm.String", key: true },
    { name: "hotelName", type: "Edm.String", searchable: true },
    { name: "description", type: "Edm.String", searchable: true },
    { name: "tags", type: "Collection(Edm.String)", searchable: true },
  ],
  semanticSearch: {
    configurations: [
      {
        name: "my-semantic-config",
        prioritizedFields: {
          titleField: { fieldName: "hotelName" },
          contentFields: [
            { fieldName: "description" },
          ],
          keywordsFields: [
            { fieldName: "tags" },
          ],
        },
      },
    ],
  },
});
```

---

## Complete Example

Full semantic search with all features:

```typescript
import { SearchClient, AzureKeyCredential } from "@azure/search-documents";

interface Hotel {
  hotelId: string;
  hotelName: string;
  description: string;
  descriptionVector: number[];
  category: string;
  rating: number;
}

async function semanticHybridSearch(
  client: SearchClient<Hotel>,
  query: string,
  queryVector: number[]
) {
  const results = await client.search(query, {
    // Semantic ranking
    queryType: "semantic",
    semanticSearchOptions: {
      configurationName: "hotel-semantic-config",
      answers: { answerType: "extractive", count: 3, threshold: 0.7 },
      captions: { captionType: "extractive", highlight: true },
      queryRewrites: { rewritesType: "generative", count: 5 },
      errorMode: "partial",
      maxWaitInMilliseconds: 10000,
    },
    
    // Vector search
    vectorSearchOptions: {
      queries: [
        {
          kind: "vector",
          vector: queryVector,
          fields: ["descriptionVector"],
          kNearestNeighborsCount: 50,
        },
      ],
    },
    
    // Text search
    searchFields: ["hotelName", "description"],
    
    // Results
    top: 10,
    includeTotalCount: true,
    select: ["hotelId", "hotelName", "description", "rating"],
  });

  // Process answers (response-level)
  console.log("=== Answers ===");
  if (results.answers) {
    for (const answer of results.answers) {
      console.log(`[${answer.score.toFixed(2)}] ${answer.text}`);
    }
  }

  // Process documents with captions
  console.log("\n=== Results ===");
  for await (const result of results.results) {
    console.log(`\n${result.document.hotelName} (${result.document.rating}★)`);
    console.log(`  Score: ${result.score}, Reranker: ${result.rerankerScore}`);
    
    if (result.captions?.[0]) {
      console.log(`  Caption: ${result.captions[0].highlights || result.captions[0].text}`);
    }
  }

  // Check for errors
  if (results.semanticErrorReason) {
    console.log(`\nWarning: ${results.semanticErrorReason}`);
  }
}
```

---

## Related Documentation

- [Vector Search Reference](./vector-search.md)
- [Azure AI Search Semantic Ranking Overview](https://learn.microsoft.com/azure/search/semantic-search-overview)
- [Configure Semantic Ranking](https://learn.microsoft.com/azure/search/semantic-how-to-query-request)
- [Extractive Answers and Captions](https://learn.microsoft.com/azure/search/semantic-answers)
