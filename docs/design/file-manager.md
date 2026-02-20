# File Manager
**PfadiMH Design Doc**

**Authors:** Nepomuk Crhonek  
**Last major revision:** 02 Feb 2026  
**Issue:** https://github.com/PfadiMH/puck/issues/46

---

## Summary

Replace base64-embedded images with S3-compatible storage. Add file browser UI for Puck editor and admin with folder organization and tagging support.

**Why:** Current approach bloats MongoDB, can't cache, can't optimize with next/image, 900KB limit.

## Code Affected

- `lib/storage/` - S3 client, image processing
- `lib/files/` - Server actions, React Query hooks (new)
- `lib/db/` - file metadata collection with pagination
- `components/puck-fields/file-picker.tsx` - replaces upload-file
- `components/file-manager/` - browser UI
- `app/api/files/` - upload/list/delete routes (thin wrappers around server actions)
- `app/admin/files/` - admin page
- `docker-compose.dev.yml` - MongoDB + MinIO

## Design

**Storage:** S3-compatible (AWS/R2/MinIO) - provider configured via env vars  
**Metadata:** MongoDB `files` collection  
**Serving:** Public URLs via `next/image` with remotePatterns

```text
User -> FilePicker -> Server Actions -> S3 (files) + MongoDB (metadata)
                                         |
                                    Public URL -> next/image optimization
```

**File metadata:**
```typescript
{
  _id, filename, s3Key, contentType, size,
  width?, height?, blurhash?,           // Image metadata
  folder?, tags?,                        // Organization
  uploadedBy, createdAt
}
```

## Key Decisions

### 1. Virtual Folders (Path String) vs. Nested Folders

**Decision:** Virtual folders using a path string (e.g., `/events/2024`)

**Rationale:**
- Simpler implementation - no need for folder documents, parent-child relationships, or recursive queries
- Better performance - single index on `folder` field vs. recursive graph lookups
- Easier to move files - just update the path string
- Sufficient for the use case - we don't need complex folder operations like ACLs per folder

**Alternatives considered:**
- Real nested folder documents: More complex, requires managing folder lifecycle, recursive delete handling

### 2. Freeform Tags vs. Predefined List

**Decision:** Freeform tags, normalized to lowercase

**Rationale:**
- Flexibility for domain-specific terms (e.g., "wasseraktivitaeten", event names)
- No admin overhead to manage a tag list
- Lowercase normalization prevents duplicates like "Event" vs "event"

**Trade-offs:**
- May accumulate unused/misspelled tags over time
- Future: Could add tag cleanup utilities or autocomplete from existing tags

### 3. Infinite Scroll vs. Page Numbers

**Decision:** Infinite scroll with cursor-based pagination

**Rationale:**
- Better UX for browsing large file collections
- More modern feel, matches user expectations from other file managers
- Cursor pagination is more efficient than offset for large datasets

**Implementation:**
- `useFilesInfinite()` hook using React Query's `useInfiniteQuery`
- Server-side cursor pagination in MongoDB
- "Select all" operates on server-side query, not just loaded items

### 4. Server Actions vs. API Routes Only

**Decision:** Server actions as primary interface, API routes as thin wrappers

**Rationale:**
- Consistent with codebase pattern (`lib/db/db-actions.ts`)
- Server actions work directly with React Query
- Type safety across client-server boundary
- API routes kept for backwards compatibility and non-React clients

### 5. React Query for State Management

**Decision:** Use React Query (`@tanstack/react-query`) for all file operations

**Rationale:**
- Already used in codebase for other data fetching
- Automatic cache invalidation on mutations
- Built-in loading/error states
- Infinite query support

## Non-goals

- Video support
- File versioning
- Migration of existing base64 (separate task)
- Per-folder permissions (all files share same permission model)

## Future Considerations

- **LLM-generated descriptions:** Add AI descriptions/embeddings for semantic search
- **Bulk operations:** Select multiple files for move/delete/tag
- **Image editing:** Basic crop/resize before upload
- **CDN integration:** Cache invalidation for updated files

## Testing

Integration tests with MinIO in Docker.

```bash
docker compose -f docker-compose.dev.yml up -d
bun run dev
```
