# Puck Deployment Guide

This document describes how to deploy Puck using Dokploy, including preview deployments for pull requests.

## Architecture Overview

### Production Deployment
```
                                    +------------------+
                                    |   Backblaze B2   |
                                    |   (S3 Storage)   |
                                    +--------^---------+
                                             |
+------------------+    +------------------+ | +------------------+
|  prod.pfadimh.ch |    |  sso.pfadimh.ch  | | |   MongoDB Prod   |
|   (Puck Prod)    |--->|    (Keycloak)    |-+-|                  |
+------------------+    +------------------+   +------------------+
```

### Preview/Development Deployment (All-in-One Container)
```
+------------------------------------------+
|         Preview Container                |
|  +------------+  +--------+  +-------+   |
|  |  Puck App  |  | MongoDB|  | MinIO |   |
|  |  (Next.js) |  |        |  | (S3)  |   |
|  +------------+  +--------+  +-------+   |
+------------------------------------------+
```

## Deployment Options

### Option 1: Standard Deployment (Production)

Use the standard `Dockerfile` for production deployments with external MongoDB and S3 storage.

**Required services:**
- MongoDB instance (external)
- S3-compatible storage (Backblaze B2, AWS S3, etc.)
- Keycloak for authentication (optional, can use mock auth)

### Option 2: Preview Container (Development/PR Previews)

Use `Dockerfile.preview` for self-contained deployments that include everything in one container.

**Included services:**
- Next.js application
- MongoDB (local instance)
- MinIO (S3-compatible storage)
- Supervisord (process manager)

This is ideal for:
- Pull request preview deployments
- Development environments
- Demo instances
- Testing without external dependencies

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTH_SECRET` | NextAuth secret (base64 random string) | `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | Trust the host header | `true` |
| `AUTH_URL` | Public URL of the application | `https://your-domain.com` |
| `DATABASE_TYPE` | Database type | `mongodb` |
| `MONGODB_CONNECTION_STRING` | MongoDB connection string | `mongodb://user:pass@host:27017` |
| `MONGODB_DB_NAME` | Database name | `puck` |
| `S3_ENDPOINT` | S3 endpoint URL | `https://s3.amazonaws.com` |
| `S3_REGION` | S3 region | `us-east-1` |
| `S3_BUCKET` | S3 bucket name | `my-bucket` |
| `S3_ACCESS_KEY_ID` | S3 access key | |
| `S3_SECRET_ACCESS_KEY` | S3 secret key | |
| `S3_PUBLIC_URL` | Public URL for file access | `https://your-domain.com/api/files` |

### Authentication Variables

#### For Keycloak Auth (Production)
| Variable | Description |
|----------|-------------|
| `AUTH_KEYCLOAK_ID` | Keycloak client ID |
| `AUTH_KEYCLOAK_SECRET` | Keycloak client secret |
| `AUTH_KEYCLOAK_ISSUER` | Keycloak issuer URL |
| `AUTH_KEYCLOAK_IDP_HINT` | (Optional) Identity provider hint |

#### For Mock Auth (Development/Preview)
| Variable | Description |
|----------|-------------|
| `MOCK_AUTH` | Set to `true` to enable mock authentication |

## Preview Container Setup

### Building the Preview Container

```bash
docker build -f Dockerfile.preview -t puck-preview .
```

### Running Locally

```bash
docker run -p 3000:3000 \
  -e AUTH_SECRET=$(openssl rand -base64 32) \
  -e AUTH_URL=http://localhost:3000 \
  -e MOCK_AUTH=true \
  puck-preview
```

### Dokploy Configuration

1. Create a new application in Dokploy
2. Configure Git source:
   - **Repository:** Your Puck fork/repository
   - **Branch:** PR branch or `master`
3. Build settings:
   - **Build Type:** Dockerfile
   - **Dockerfile Path:** `Dockerfile.preview`
4. Environment variables:
   ```env
   AUTH_SECRET=<generate-random-secret>
   AUTH_URL=https://your-preview-domain.com
   AUTH_TRUST_HOST=true
   MOCK_AUTH=true
   ```
5. Add domain and enable HTTPS

### Container Startup Behavior

When the preview container starts:

1. **supervisord** launches all three services
2. MongoDB starts and waits to be ready
3. MinIO starts and waits to be ready
4. `preview-init.sh` runs:
   - Creates the `puck-files` bucket in MinIO
   - Initializes MongoDB with required collections
5. Next.js application starts

All services are managed by supervisord and will be automatically restarted if they crash.

## Mock Authentication

When `MOCK_AUTH=true` is set:

1. The Keycloak login button is hidden
2. A development sign-in page is available at `/auth/dev/signin`
3. You can sign in with any email without a real authentication provider
4. Useful for development, testing, and preview deployments

**Note:** Mock auth works in production builds when explicitly enabled. This is intentional for preview deployments.

## File Structure

```
.
├── Dockerfile              # Production container (app only)
├── Dockerfile.preview      # Preview container (app + MongoDB + MinIO)
├── supervisord.preview.conf # Process manager config for preview
├── scripts/
│   └── preview-init.sh     # Initialization script for preview container
└── docs/
    └── DEPLOYMENT.md       # This file
```

## Troubleshooting

### Preview Container Issues

**MongoDB not starting:**
- Check container logs: `docker logs <container>`
- MongoDB data is stored at `/data/mongodb`
- Try removing the volume and restarting

**MinIO not accessible:**
- MinIO runs on port 9000 (S3 API) and 9001 (Console) internally
- Check that the `puck-files` bucket was created
- View MinIO console at port 9001 (if exposed)

**App not starting:**
- Check that MongoDB and MinIO are ready (init script output)
- Verify environment variables are set correctly
- Check Next.js build output for errors

### Authentication Issues

**Keycloak login not appearing:**
- Verify `MOCK_AUTH` is not set to `true`
- Check Keycloak environment variables are set
- Ensure Keycloak issuer URL is accessible

**Mock auth not working:**
- Ensure `MOCK_AUTH=true` is set
- Navigate to `/auth/dev/signin` directly
- Check that `AUTH_URL` matches your domain

### S3/MinIO Issues

**File uploads failing:**
- Verify S3 credentials are correct
- Check bucket exists and is accessible
- For MinIO, ensure init script ran successfully
- Check CORS configuration allows your domain

## Security Considerations

1. **Never commit credentials** to the repository
2. Use Dokploy's environment variable management for secrets
3. Rotate `AUTH_SECRET` periodically
4. For production, always use real authentication (Keycloak)
5. Mock auth should only be used for development/preview environments
