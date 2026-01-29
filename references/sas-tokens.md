# Azure Blob Storage SAS Token Patterns

Reference documentation for SAS (Shared Access Signature) token generation with `@azure/storage-blob` TypeScript SDK.

## Installation

```bash
npm install @azure/storage-blob @azure/identity
```

## Imports

```typescript
import {
  BlobServiceClient,
  ContainerClient,
  BlockBlobClient,
  BlobSASPermissions,
  ContainerSASPermissions,
  AccountSASPermissions,
  AccountSASServices,
  AccountSASResourceTypes,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  generateAccountSASQueryParameters,
  SASProtocol,
  BlobSASSignatureValues,
  AccountSASSignatureValues,
  UserDelegationKey,
} from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";
```

---

## SAS Token Types

| Type | Signed With | Use Case |
|------|-------------|----------|
| **User Delegation SAS** | Microsoft Entra credentials | Most secure, recommended |
| **Service SAS** | Account key | Container or blob access |
| **Account SAS** | Account key | Multiple services/resources |

---

## Permission Classes

### BlobSASPermissions

Permissions for individual blob access.

```typescript
// Parse from string
const blobPermissions = BlobSASPermissions.parse("racwd");

// Or build programmatically
const permissions = new BlobSASPermissions();
permissions.read = true;      // r - Read blob content
permissions.add = true;       // a - Add blocks to append blob
permissions.create = true;    // c - Create new blob
permissions.write = true;     // w - Write to blob
permissions.delete = true;    // d - Delete blob
permissions.tag = true;       // t - Read/write blob tags
permissions.move = true;      // m - Move blob
permissions.execute = true;   // e - Execute blob
permissions.setImmutabilityPolicy = true; // i - Set immutability policy
permissions.permanentDelete = true;       // y - Permanent delete
```

### ContainerSASPermissions

Permissions for container-level access.

```typescript
// Parse from string
const containerPermissions = ContainerSASPermissions.parse("racwdl");

// Or build programmatically
const permissions = new ContainerSASPermissions();
permissions.read = true;      // r - Read blobs
permissions.add = true;       // a - Add blocks
permissions.create = true;    // c - Create blobs
permissions.write = true;     // w - Write blobs
permissions.delete = true;    // d - Delete blobs
permissions.list = true;      // l - List blobs
permissions.tag = true;       // t - Read/write tags
permissions.move = true;      // m - Move blobs
permissions.execute = true;   // e - Execute
permissions.setImmutabilityPolicy = true;
permissions.permanentDelete = true;
permissions.filterByTags = true; // f - Filter by tags
```

### AccountSASPermissions

Permissions for account-level access.

```typescript
// Parse from string
const accountPermissions = AccountSASPermissions.parse("rwdlacupi");

// Permission flags
// r - Read
// w - Write
// d - Delete
// l - List
// a - Add
// c - Create
// u - Update
// p - Process (queue messages)
// i - Set immutability policy
// t - Tag access
// f - Filter by tags
```

---

## Service SAS - Blob Level

Generate SAS for a specific blob using account key.

```typescript
function generateBlobServiceSAS(
  containerName: string,
  blobName: string,
  accountName: string,
  accountKey: string,
  expiresInMinutes: number = 60
): string {
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

  const startsOn = new Date();
  const expiresOn = new Date(startsOn.valueOf() + expiresInMinutes * 60 * 1000);

  const sasOptions: BlobSASSignatureValues = {
    containerName,
    blobName,
    permissions: BlobSASPermissions.parse("r"), // Read only
    startsOn,
    expiresOn,
    protocol: SASProtocol.Https,
  };

  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    sharedKeyCredential
  ).toString();

  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
}
```

---

## Service SAS - Container Level

Generate SAS for container access.

```typescript
function generateContainerServiceSAS(
  containerName: string,
  accountName: string,
  accountKey: string,
  permissions: string = "rl", // read + list
  expiresInMinutes: number = 60
): string {
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

  const startsOn = new Date();
  const expiresOn = new Date(startsOn.valueOf() + expiresInMinutes * 60 * 1000);

  const sasOptions: BlobSASSignatureValues = {
    containerName,
    permissions: ContainerSASPermissions.parse(permissions),
    startsOn,
    expiresOn,
    protocol: SASProtocol.HttpsAndHttp,
  };

  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    sharedKeyCredential
  ).toString();

  return `https://${accountName}.blob.core.windows.net/${containerName}?${sasToken}`;
}
```

---

## Account SAS

Generate SAS with account-level access across services.

```typescript
function generateAccountSAS(
  accountName: string,
  accountKey: string,
  expiresInMinutes: number = 60
): string {
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

  const sasOptions: AccountSASSignatureValues = {
    services: AccountSASServices.parse("btqf").toString(),  // blob, table, queue, file
    resourceTypes: AccountSASResourceTypes.parse("sco").toString(), // service, container, object
    permissions: AccountSASPermissions.parse("rwdlacupi"),
    protocol: SASProtocol.Https,
    startsOn: new Date(),
    expiresOn: new Date(Date.now() + expiresInMinutes * 60 * 1000),
  };

  const sasToken = generateAccountSASQueryParameters(
    sasOptions,
    sharedKeyCredential
  ).toString();

  return sasToken;
}

// Usage
const sasToken = generateAccountSAS(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net?${sasToken}`
);
```

---

## User Delegation SAS (Recommended)

Most secure option - uses Microsoft Entra credentials instead of account key.

```typescript
async function generateUserDelegationBlobSAS(
  accountName: string,
  containerName: string,
  blobName: string,
  permissions: string = "r",
  expiresInMinutes: number = 10
): Promise<string> {
  // Use managed identity or Azure CLI credentials
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    new DefaultAzureCredential()
  );

  // Time boundaries
  const TEN_MINUTES = 10 * 60 * 1000;
  const now = new Date();
  const startsOn = new Date(now.valueOf() - TEN_MINUTES); // Start slightly before now
  const expiresOn = new Date(now.valueOf() + expiresInMinutes * 60 * 1000);

  // Get user delegation key (time-limited)
  const userDelegationKey: UserDelegationKey = await blobServiceClient.getUserDelegationKey(
    startsOn,
    expiresOn
  );

  // Generate SAS with user delegation key
  const sasOptions: BlobSASSignatureValues = {
    containerName,
    blobName,
    permissions: BlobSASPermissions.parse(permissions),
    protocol: SASProtocol.HttpsAndHttp,
    startsOn,
    expiresOn,
  };

  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    userDelegationKey,
    accountName
  ).toString();

  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
}
```

### User Delegation SAS for Container

```typescript
async function generateUserDelegationContainerSAS(
  accountName: string,
  containerName: string,
  permissions: string = "rl",
  expiresInMinutes: number = 10
): Promise<string> {
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    new DefaultAzureCredential()
  );

  const now = new Date();
  const startsOn = new Date(now.valueOf() - 10 * 60 * 1000);
  const expiresOn = new Date(now.valueOf() + expiresInMinutes * 60 * 1000);

  const userDelegationKey = await blobServiceClient.getUserDelegationKey(
    startsOn,
    expiresOn
  );

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      permissions: ContainerSASPermissions.parse(permissions),
      protocol: SASProtocol.HttpsAndHttp,
      startsOn,
      expiresOn,
    },
    userDelegationKey,
    accountName
  ).toString();

  return `https://${accountName}.blob.core.windows.net/${containerName}?${sasToken}`;
}
```

---

## Using SAS Tokens

### Create Client from SAS URL

```typescript
// Blob client from SAS URL
const blobClient = new BlockBlobClient(sasUrl);
await blobClient.uploadData(buffer);

// Container client from SAS URL
const containerClient = new ContainerClient(sasUrl);
for await (const blob of containerClient.listBlobsFlat()) {
  console.log(blob.name);
}

// Service client from SAS token
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net?${sasToken}`
);
```

### Generate SAS URL from Existing Client

```typescript
async function getSignedUrl(
  blockBlobClient: BlockBlobClient,
  expiresInSeconds: number = 3600
): Promise<string> {
  // Requires client created with StorageSharedKeyCredential
  return await blockBlobClient.generateSasUrl({
    permissions: BlobSASPermissions.parse("r"),
    startsOn: new Date(),
    expiresOn: new Date(Date.now() + expiresInSeconds * 1000),
  });
}
```

---

## Stored Access Policies

Use stored access policies for revocable SAS tokens.

```typescript
async function createStoredAccessPolicy(
  containerClient: ContainerClient,
  policyName: string
): Promise<void> {
  const startsOn = new Date();
  const expiresOn = new Date(startsOn.valueOf() + 24 * 60 * 60 * 1000); // 24 hours

  await containerClient.setAccessPolicy(undefined, [
    {
      id: policyName,
      accessPolicy: {
        startsOn,
        expiresOn,
        permissions: "rl", // read + list
      },
    },
  ]);
}

// Generate SAS using stored policy
function generateSASWithPolicy(
  containerName: string,
  blobName: string,
  policyName: string,
  sharedKeyCredential: StorageSharedKeyCredential
): string {
  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      identifier: policyName, // Reference stored policy
    },
    sharedKeyCredential
  ).toString();

  return sasToken;
}
```

---

## Best Practices

### Security

1. **Prefer User Delegation SAS** - More secure than account key
2. **Minimum Permissions** - Grant only required permissions
3. **Short Expiration** - Use shortest practical expiration time
4. **HTTPS Only** - Use `SASProtocol.Https` in production
5. **Start Time Buffer** - Set `startsOn` slightly before current time to handle clock skew

### Time Management

```typescript
// Best practice: Handle clock skew
const CLOCK_SKEW_BUFFER = 5 * 60 * 1000; // 5 minutes
const now = new Date();
const startsOn = new Date(now.valueOf() - CLOCK_SKEW_BUFFER);
const expiresOn = new Date(now.valueOf() + desiredDuration);
```

### IP Restrictions

```typescript
const sasOptions: BlobSASSignatureValues = {
  containerName,
  blobName,
  permissions: BlobSASPermissions.parse("r"),
  startsOn,
  expiresOn,
  ipRange: { start: "168.1.5.60", end: "168.1.5.70" }, // Restrict to IP range
};
```

### Content Disposition

```typescript
const sasOptions: BlobSASSignatureValues = {
  containerName,
  blobName,
  permissions: BlobSASPermissions.parse("r"),
  expiresOn,
  contentDisposition: "attachment; filename=download.pdf",
  contentType: "application/pdf",
};
```

---

## Common Permission Patterns

| Use Case | Permissions |
|----------|-------------|
| Read-only download | `r` |
| Upload new file | `cw` |
| List and read | `rl` |
| Full blob access | `racwd` |
| Full container access | `racwdl` |

## References

- [Service SAS Documentation](https://learn.microsoft.com/en-us/azure/storage/blobs/sas-service-create-javascript)
- [User Delegation SAS Documentation](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-create-user-delegation-sas-javascript)
- [Account SAS Documentation](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-account-delegation-sas-create-javascript)
- [SAS Best Practices](https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview#best-practices-when-using-sas)
