# File Manager
**PfadiMH Design Doc**

**Authors:** Nepomuk Crhonek  
**Last major revision:** 23 Jan 2026  
**Issue:** https://github.com/PfadiMH/puck/issues/46

---

## Summary

Replace base64-embedded images with S3-compatible storage. Add file browser UI for Puck editor and admin.

**Why:** Current approach bloats MongoDB, can't cache, can't optimize with next/image, 900KB limit.

## Code Affected

- `lib/storage/` - S3 client (new)
- `lib/db/` - file metadata collection
- `components/puck-fields/file-picker.tsx` - replaces upload-file
- `components/file-manager/` - browser UI (new)
- `app/api/files/` - upload/list/delete routes (new)
- `app/admin/files/` - admin page (new)
- `docker-compose.dev.yml` - MongoDB + MinIO (new)

## Design

**Storage:** S3-compatible (AWS/R2/MinIO) - provider configured via env vars  
**Metadata:** MongoDB `files` collection  
**Serving:** Public URLs via `next/image` with remotePatterns

```
User -> FilePicker -> API -> S3 (files) + MongoDB (metadata)
                              |
                         Public URL -> next/image optimization
```

**File metadata:**
```typescript
{ _id, filename, s3Key, contentType, size, width?, height?, blurhash?, uploadedBy, createdAt }
```

## Non-goals

- Video support
- Folders/directories
- File versioning
- Migration of existing base64 (separate task)

## Testing

Integration tests with MinIO in Docker.
