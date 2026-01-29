# Vector Search Reference - @azure/search-documents

> Reference documentation for vector and hybrid search patterns in the Azure AI Search TypeScript SDK.
> 
> **SDK Version**: 12.x  
> **Source**: [azure-sdk-for-js](https://github.com/Azure/azure-sdk-for-js/blob/3d73b62136d4f89a74a325329bb838280f37f0d0/sdk/search/search-documents/src/indexModels.ts#L1147-L1157)

## VectorSearchOptions Interface

The `VectorSearchOptions` interface configures vector search behavior within a search request.

```typescript
interface VectorSearchOptions<TModel extends object> {
  /** Array of vector queries to execute */
  queries: VectorQuery<TModel>[];
  
  /** When to apply filters: 'preFilter' (default) or 'postFilter' */
  filterMode?: VectorFilterMode;
}
```

**Source**: [indexModels.ts#L1147-L1157](https://github.com/Azure/azure-sdk-for-js/blob/3d73b62136d4f89a74a325329bb838280f37f0d0/sdk/search/search-documents/src/indexModels.ts#L1147-L1157)

---

## Vector Query Types

The SDK supports four types of vector queries:

| Kind | Description | Use Case |
|------|-------------|----------|
| `vector` | Raw vector embedding | Pre-computed embeddings |
| `text` | Text to be vectorized | Integrated vectorization |
| `imageUrl` | Image URL to vectorize | Image search |
| `imageBinary` | Base64 image to vectorize | Image search |

### BaseVectorQuery Properties

All vector query types share these properties:

```typescript
interface BaseVectorQuery<TModel extends object> {
  kind: "vector" | "text" | "imageUrl" | "imageBinary";
  kNearestNeighborsCount?: number;  // Number of nearest neighbors (k)
  fields?: SearchFieldArray<TModel>; // Vector fields to search
  exhaustive?: boolean;              // Use exhaustive search (slower, more accurate)
  weight?: number;                   // Relative weight (default: 1.0)
  threshold?: VectorThreshold;       // Similarity threshold
  filterOverride?: string;           // Per-query OData filter
  perDocumentVectorLimit?: number;   // Max vectors per document (0 = unlimited)
}
```

---

## Basic Vector Search

Search using a pre-computed embedding vector:

```typescript
import { SearchClient, AzureKeyCredential } from "@azure/search-documents";

interface Hotel {
  hotelId: string;
  hotelName: string;
  description: string;
  descriptionVector: number[];
}

const client = new SearchClient<Hotel>(
  "https://<service>.search.windows.net",
  "hotels-index",
  new AzureKeyCredential("<api-key>")
);

// Pre-computed embedding for "luxury hotel with pool"
const queryVector: number[] = [0.01, -0.02, 0.03, /* ... 1536 dimensions */];

const results = await client.search("*", {
  vectorSearchOptions: {
    queries: [
      {
        kind: "vector",
        vector: queryVector,
        fields: ["descriptionVector"],
        kNearestNeighborsCount: 10,
      },
    ],
  },
  select: ["hotelId", "hotelName", "description"],
});

for await (const result of results.results) {
  console.log(`${result.document.hotelName} (score: ${result.score})`);
}
```

---

## Hybrid Search (Text + Vector)

Combine keyword search with vector search for better relevance:

```typescript
const results = await client.search("luxury pool spa", {
  // Text search configuration
  searchFields: ["hotelName", "description"],
  queryType: "simple",
  
  // Vector search configuration
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
  
  // Return top 10 results
  top: 10,
  select: ["hotelId", "hotelName", "description", "rating"],
});
```

---

## Integrated Vectorization (Text Query)

Let Azure AI Search vectorize your text query automatically:

```typescript
// Requires a vectorizer configured in the index
const results = await client.search("*", {
  vectorSearchOptions: {
    queries: [
      {
        kind: "text",
        text: "What are the most luxurious hotels with ocean views?",
        fields: ["descriptionVector"],
        kNearestNeighborsCount: 10,
      },
    ],
  },
});
```

---

## Multi-Vector Search

Search across multiple vector fields simultaneously:

```typescript
interface MultilingualHotel {
  hotelId: string;
  hotelName: string;
  descriptionVectorEn: number[];
  descriptionVectorFr: number[];
}

const client = new SearchClient<MultilingualHotel>(endpoint, indexName, credential);

const results = await client.search("*", {
  vectorSearchOptions: {
    queries: [
      {
        kind: "vector",
        vector: englishEmbedding,
        fields: ["descriptionVectorEn"],
        kNearestNeighborsCount: 25,
        weight: 1.0,
      },
      {
        kind: "vector",
        vector: frenchEmbedding,
        fields: ["descriptionVectorFr"],
        kNearestNeighborsCount: 25,
        weight: 0.8,  // Lower weight for secondary language
      },
    ],
  },
});
```

---

## Vector Filtering

### Global Filter (Pre-Filter)

Apply filter before vector search (default behavior):

```typescript
const results = await client.search("*", {
  filter: "rating ge 4 and category eq 'Luxury'",
  vectorSearchOptions: {
    filterMode: "preFilter",  // Default - filter first, then vector search
    queries: [
      {
        kind: "vector",
        vector: queryVector,
        fields: ["descriptionVector"],
        kNearestNeighborsCount: 10,
      },
    ],
  },
});
```

### Post-Filter

Apply filter after vector search (larger candidate set):

```typescript
const results = await client.search("*", {
  filter: "rating ge 4",
  vectorSearchOptions: {
    filterMode: "postFilter",  // Vector search first, then filter
    queries: [
      {
        kind: "vector",
        vector: queryVector,
        fields: ["descriptionVector"],
        kNearestNeighborsCount: 50,  // Request more to account for filtering
      },
    ],
  },
});
```

### Per-Query Filter Override

Apply different filters to different vector queries:

```typescript
const results = await client.search("luxury hotel", {
  filter: "rating ge 3",  // Global filter
  vectorSearchOptions: {
    queries: [
      {
        kind: "vector",
        vector: queryVector,
        fields: ["descriptionVector"],
        kNearestNeighborsCount: 20,
        filterOverride: "city eq 'Seattle'",  // Override for this query only
      },
    ],
  },
});
```

---

## Vector Thresholds

Filter results by similarity score:

```typescript
// Filter by vector similarity metric
const results = await client.search("*", {
  vectorSearchOptions: {
    queries: [
      {
        kind: "vector",
        vector: queryVector,
        fields: ["descriptionVector"],
        kNearestNeighborsCount: 50,
        threshold: {
          kind: "vectorSimilarity",
          value: 0.8,  // Only return results with similarity >= 0.8
        },
      },
    ],
  },
});

// Filter by search score
const results2 = await client.search("*", {
  vectorSearchOptions: {
    queries: [
      {
        kind: "vector",
        vector: queryVector,
        fields: ["descriptionVector"],
        kNearestNeighborsCount: 50,
        threshold: {
          kind: "searchScore",
          value: 0.5,  // Only return results with @search.score >= 0.5
        },
      },
    ],
  },
});
```

---

## Exhaustive Search

Use exhaustive k-NN for ground truth evaluation:

```typescript
const results = await client.search("*", {
  vectorSearchOptions: {
    queries: [
      {
        kind: "vector",
        vector: queryVector,
        fields: ["descriptionVector"],
        kNearestNeighborsCount: 10,
        exhaustive: true,  // Slower but exact results
      },
    ],
  },
});
```

---

## Index Configuration for Vector Search

Configure vector search in your index definition:

```typescript
import { SearchIndexClient, AzureKeyCredential } from "@azure/search-documents";

const indexClient = new SearchIndexClient(endpoint, new AzureKeyCredential(apiKey));

await indexClient.createIndex({
  name: "hotels-vector-index",
  fields: [
    { name: "hotelId", type: "Edm.String", key: true },
    { name: "hotelName", type: "Edm.String", searchable: true },
    { name: "description", type: "Edm.String", searchable: true },
    {
      name: "descriptionVector",
      type: "Collection(Edm.Single)",
      searchable: true,
      vectorSearchDimensions: 1536,
      vectorSearchProfileName: "my-vector-profile",
    },
  ],
  vectorSearch: {
    algorithms: [
      {
        name: "my-hnsw-config",
        kind: "hnsw",
        parameters: {
          m: 4,
          efConstruction: 400,
          efSearch: 500,
          metric: "cosine",
        },
      },
    ],
    profiles: [
      {
        name: "my-vector-profile",
        algorithmConfigurationName: "my-hnsw-config",
      },
    ],
  },
});
```

---

## Complete Hybrid Search Example

Full example combining all features:

```typescript
import { SearchClient, AzureKeyCredential, odata } from "@azure/search-documents";

interface Hotel {
  hotelId: string;
  hotelName: string;
  description: string;
  descriptionVector: number[];
  category: string;
  rating: number;
  city: string;
}

async function hybridSearch(
  client: SearchClient<Hotel>,
  query: string,
  queryVector: number[],
  filters: { minRating?: number; city?: string }
) {
  const filterParts: string[] = [];
  if (filters.minRating) filterParts.push(`rating ge ${filters.minRating}`);
  if (filters.city) filterParts.push(`city eq '${filters.city}'`);
  
  const results = await client.search(query, {
    // Text search
    searchFields: ["hotelName", "description"],
    queryType: "simple",
    searchMode: "any",
    
    // Vector search
    vectorSearchOptions: {
      filterMode: "preFilter",
      queries: [
        {
          kind: "vector",
          vector: queryVector,
          fields: ["descriptionVector"],
          kNearestNeighborsCount: 50,
          weight: 1.5,  // Boost vector results
        },
      ],
    },
    
    // Filtering
    filter: filterParts.length > 0 ? filterParts.join(" and ") : undefined,
    
    // Results
    top: 10,
    skip: 0,
    includeTotalCount: true,
    select: ["hotelId", "hotelName", "description", "rating", "city"],
    
    // Facets for filtering UI
    facets: ["category,count:5", "city,count:10"],
  });

  console.log(`Total results: ${results.count}`);
  console.log(`Facets:`, results.facets);
  
  for await (const result of results.results) {
    console.log(`[${result.score}] ${result.document.hotelName}`);
  }
}
```

---

## Related Documentation

- [Semantic Ranking Reference](./semantic-ranking.md)
- [Azure AI Search Vector Search Overview](https://learn.microsoft.com/azure/search/vector-search-overview)
- [Vector Search How-To Query](https://learn.microsoft.com/azure/search/vector-search-how-to-query)
- [Vector Search Filters](https://learn.microsoft.com/azure/search/vector-search-filters)
