# Puck Deployment Guide

This document describes how to deploy Puck (PfadiMH website builder) using Dokploy.

## Architecture Overview

```
                                    +------------------+
                                    |   Backblaze B2   |
                                    |   (S3 Storage)   |
                                    +--------^---------+
                                             |
+------------------+    +------------------+ | +------------------+
|   prod.pfadimh.ch|    |  sso.pfadimh.ch  | | |   MongoDB Prod   |
|   (Puck Prod)    |--->|    (Keycloak +   |-+-|                  |
+------------------+    |    SSO Helper)   |   +------------------+
                        +------------------+
                                 |
                                 v
                        +------------------+
                        |   db.scout.ch    |
                        |    (MiData)      |
                        +------------------+

+------------------+    +------------------+   +------------------+
|  dev.pfadimh.ch  |    |      MinIO       |   |   MongoDB Dev    |
|   (Puck Dev)     |--->|   (Local S3)     |---|                  |
+------------------+    +------------------+   +------------------+
```

## Server Details

| Item | Value |
|------|-------|
| **Server IP** | `46.225.62.139` |
| **Dokploy Panel** | `https://deploy.pfadimh.ch` |
| **SSH Access** | `ssh -i ~/.ssh/puck_deploy_key root@46.225.62.139` |

## Environment Variables

### Production Environment

```env
# Database
DATABASE_TYPE=mongodb
MONGODB_CONNECTION_STRING=mongodb://admin:<password>@mongodb-prod-<id>:27017
MONGODB_DB_NAME=puck-prod

# Authentication
AUTH_SECRET=<base64-random-string>
AUTH_TRUST_HOST=true
AUTH_URL=https://prod.pfadimh.ch
AUTH_KEYCLOAK_ID=pfadimh-site
AUTH_KEYCLOAK_SECRET=<keycloak-client-secret>
AUTH_KEYCLOAK_ISSUER=https://sso.pfadimh.ch/realms/pfadimh-sso

# Application
INTERNAL_API_BASE_URL=https://prod.pfadimh.ch

# S3 Storage (Backblaze B2)
S3_ENDPOINT=https://s3.eu-central-003.backblazeb2.com
S3_REGION=eu-central-003
S3_BUCKET=pmh-prod
S3_ACCESS_KEY_ID=<backblaze-key-id>
S3_SECRET_ACCESS_KEY=<backblaze-app-key>
S3_PUBLIC_URL=https://prod.pfadimh.ch/api/files
```

### Development Environment

```env
# Database
DATABASE_TYPE=mongodb
MONGODB_CONNECTION_STRING=mongodb://admin:<password>@mongodb-dev-<id>:27017
MONGODB_DB_NAME=puck-dev

# Authentication (Mock Auth for Dev)
AUTH_SECRET=<base64-random-string>
AUTH_TRUST_HOST=true
AUTH_URL=https://dev.pfadimh.ch
MOCK_AUTH=true

# Application
INTERNAL_API_BASE_URL=https://dev.pfadimh.ch

# S3 Storage (MinIO - Local)
S3_ENDPOINT=http://minio-<id>:9000
S3_REGION=auto
S3_BUCKET=puck-files-dev
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=<minio-password>
S3_PUBLIC_URL=https://dev.pfadimh.ch/api/files
```

## Dokploy Setup

### Creating the Application

1. Log into Dokploy at `https://deploy.pfadimh.ch`
2. Select project "PfadiMH"
3. Select environment (production/development)
4. Click "Add Service" > "Application"
5. Configure:
   - **Name:** `puck-prod` or `puck-dev`
   - **Source:** Git (Custom URL)
   - **Git URL:** `https://github.com/PfadiMH/puck.git`
   - **Branch:** `master`
   - **Build Type:** Dockerfile
   - **Dockerfile:** `Dockerfile`
   - **Context Path:** `.`

### Adding Domain

1. Go to Application > Domains
2. Add domain:
   - **Host:** `prod.pfadimh.ch` or `dev.pfadimh.ch`
   - **Port:** `3000`
   - **Path:** `/`
   - **HTTPS:** Yes
   - **Certificate:** Let's Encrypt

### Environment Variables

1. Go to Application > Environment
2. Paste the environment variables from above
3. Click "Save"
4. Redeploy the application

## CI/CD - Auto-Deploy on Push

### Current Setup

The applications are configured with:
- **Source:** GitHub (custom Git URL)
- **Auto Deploy:** Enabled (on push to branch)

When you push to the `master` branch:
1. Dokploy detects the push (via polling or webhook)
2. Pulls the latest code
3. Builds a new Docker image using the Dockerfile
4. Deploys the new container
5. Routes traffic to the new container

### Manual Webhook (If Needed)

If auto-deploy isn't working, you can trigger manually:

```bash
curl -X POST "http://46.225.62.139:3000/api/application.deploy" \
  -H "Content-Type: application/json" \
  -H "x-api-key: <api-key>" \
  -d '{"applicationId": "<app-id>"}'
```

## Database Setup

### MongoDB (Production)

```bash
# Connection string format
mongodb://admin:<password>@mongodb-prod-<id>:27017

# Collections created automatically:
# - puck-data (pages, navbar, footer)
# - security (roles, permissions)
# - files (file metadata)
```

### MongoDB (Development)

```bash
# Connection string format
mongodb://admin:<password>@mongodb-dev-<id>:27017
```

## S3 Storage Setup

### Backblaze B2 (Production)

1. Create a B2 bucket named `pmh-prod`
2. Create application key with read/write access
3. Configure CORS:
   ```json
   [
     {
       "allowedOrigins": ["https://prod.pfadimh.ch"],
       "allowedOperations": ["s3_get", "s3_put", "s3_delete"],
       "maxAgeSeconds": 3600
     }
   ]
   ```

### MinIO (Development)

MinIO is deployed as a Dokploy application:
- **Image:** `minio/minio`
- **Command:** `minio server /data --console-address :9001`
- **Ports:** 9000 (S3 API), 9001 (Console)

Create bucket:
```bash
# Via MinIO Console or mc CLI
mc mb myminio/puck-files-dev
mc policy set download myminio/puck-files-dev
```

## Keycloak Setup

### Realm: `pfadimh-sso`

1. Create realm "pfadimh-sso"
2. Add Identity Provider (OpenID Connect):
   - **Alias:** `oidc`
   - **Authorization URL:** `https://sso.pfadimh.ch/authenticate`
   - **Token URL:** `https://sso.pfadimh.ch/token`
   - **User Info URL:** `https://sso.pfadimh.ch/userinfo`
   - **Client ID:** MiData OAuth client ID
   - **Client Secret:** MiData OAuth client secret

3. Create Client "pfadimh-site":
   - **Client Protocol:** openid-connect
   - **Access Type:** confidential
   - **Valid Redirect URIs:** `https://prod.pfadimh.ch/auth/callback/keycloak`

### Admin Credentials

| Field | Value |
|-------|-------|
| **URL** | `https://sso.pfadimh.ch/admin` |
| **Username** | `admin` |
| **Password** | (stored securely) |

## Troubleshooting

### Auth Routes Return 404

**Cause:** Old Docker image without auth routes.

**Solution:** Rebuild from GitHub:
```bash
curl -X POST "http://46.225.62.139:3000/api/application.deploy" \
  -H "Content-Type: application/json" \
  -H "x-api-key: <api-key>" \
  -d '{"applicationId": "<app-id>"}'
```

### Auth Redirect Shows localhost

**Cause:** Missing `AUTH_URL` environment variable.

**Solution:** Add `AUTH_URL=https://your-domain.com` to environment variables.

### S3 Upload Fails

**Cause:** CORS or credentials issue.

**Solutions:**
1. Check S3 credentials are correct
2. Verify CORS configuration allows the domain
3. Check bucket exists and is accessible

### Database Connection Failed

**Cause:** Wrong connection string or MongoDB not running.

**Solutions:**
1. Verify MongoDB container is running: `docker ps | grep mongo`
2. Check connection string uses correct container name
3. Verify credentials are correct

## Useful Commands

```bash
# SSH to server
ssh -i ~/.ssh/puck_deploy_key root@46.225.62.139

# Check running containers
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}'

# Check container logs
docker logs <container-name> --tail 100

# Check application status via API
curl -s -X GET "http://46.225.62.139:3000/api/application.one?applicationId=<app-id>" \
  -H "x-api-key: <api-key>" | jq '.applicationStatus'

# Trigger deployment
curl -s -X POST "http://46.225.62.139:3000/api/application.deploy" \
  -H "Content-Type: application/json" \
  -H "x-api-key: <api-key>" \
  -d '{"applicationId": "<app-id>"}'
```

## Application IDs

| Application | ID |
|-------------|-----|
| Puck Prod | `vL45SZuzKYqgGaqkmuNvg` |
| Puck Dev | `qzW2rv8aJy0rYQdW4REuq` |
| SSO Helper | `yF87IdKjr4LaR8xPV02OL` |
| Keycloak | `qZsiACLXdXzoiYd9GFc0R` |
| MinIO | `J9pW45Zw4UC2g89xQRw5U` |
| MongoDB Prod | `ILeTxjgA1ejIR-Le2IqKs` |
| MongoDB Dev | `2xlOUkoNIVe-xzM3kt_nL` |
| Keycloak DB | `aaWRNwa2ksSdjf5Rz_3XI` |
