# Development Environment

## Overview

The development environment uses **test MiData (pbs.puzzle.ch)** for authentication, completely isolated from production data.

## URLs

| Service | URL |
|---------|-----|
| **Puck Dev** | https://puck.dev.pfadimh.ch |
| **Test SSO Helper** | https://sso.dev.pfadimh.ch |
| **Test MiData** | https://pbs.puzzle.ch |
| **Keycloak** | https://sso.pfadimh.ch (shared with prod) |

## Architecture

```
puck.dev.pfadimh.ch
        |
        v
sso.pfadimh.ch (Keycloak)
   [IdP: oidc-test]
        |
        v
sso.dev.pfadimh.ch (Test SSO Helper)
        |
        v
pbs.puzzle.ch (Test MiData)
```

## Test Accounts

These are **shared public test accounts** for the PBS test environment. Do NOT use real data!

| Role | Email | Password |
|------|-------|----------|
| Stufenleiter | `ullrich_emirhan@hitobito.example.com` | `hito42bito` |
| Abteilungsleiter | `letizia_wilhelm@hitobito.example.com` | `hito42bito` |
| Admin | `hussein_kohlmann@hitobito.example.com` | `hito42bito` |

### 2FA Codes (Required for Admin/Abteilungsleiter)

Use any TOTP authenticator app (FreeOTP, Google Authenticator, Bitwarden, etc.)

**Admin (hussein_kohlmann):**
```
MNQWMODBMRTDAYLDGIZDGMTEGUYDANDDGJSTKOBQGE2DQZBQMU3DAMDGME4TONZRMRSTSZBYMU4GEYJXGJSDOZBXMMYTGNBWGFQWKYZTMI2WKZJTG5STMMBQGBRDCZBUMYZTIMLCG5QTGNRVGA3TANJVMQYTAYJWGJRDIYLDMM3DAM3CMNSTQNLCGI2GGYTBGY3TKYRQG5QTG
```

**Abteilungsleiter (letizia_wilhelm):**
```
MQ3DONDBMQ3WKY3EME4GKNZTHBRGEZBTGU3DSMDCGIYWGZRTGVTGKZBUMQYWIZRXGY3GENBTME2WEMBXMZTDGYZTHAZTQN3GGUZTCODCHFRTSODGMY2DCZRVMUYGGZBRMNRTMOJXHE3DIOJVMY4TAYZQGVTDSMJTGZQWGZDEGZRDGOBYMNRWCMLFGAYTKYRUGFQWCZTCGJSGM
```

## Mailtrap (Test Emails)

Emails from the test environment are NOT delivered. They are collected in Mailtrap:

| Setting | Value |
|---------|-------|
| URL | https://mailtrap.io |
| Username | `hitobito-pbs@puzzle.ch` |
| Password | `XydDHtAqZIQh7igTD` |
| 2FA TOTP | `XOKUUE4SEROJWI2S2TS6SFT5VPMN6UPN` |

## OAuth Application (pbs.puzzle.ch)

Registered OAuth app for the dev environment:

| Setting | Value |
|---------|-------|
| Name | pfadimh Dev |
| Client ID | `kmqtRthrnw2LQwb9xaGXlCbH8yjtqewl2XN9IG1IMiM` |
| Client Secret | `gaEZ_gOKwHbwi5xieeXF_eVYX3vSVMHzh5eWu-ZkVqg` |
| Redirect URI | `https://sso.dev.pfadimh.ch/callback` |

## Environment Variables (Puck Dev)

```env
# Auth
AUTH_SECRET=<secret>
AUTH_TRUST_HOST=true
AUTH_URL=https://puck.dev.pfadimh.ch
AUTH_KEYCLOAK_ID=pfadimh-site-dev
AUTH_KEYCLOAK_SECRET=c4IrWCO3XKpyd0Gn4sI2hWOOUf17rbQ1
AUTH_KEYCLOAK_ISSUER=https://sso.pfadimh.ch/realms/pfadimh-sso
AUTH_KEYCLOAK_IDP_HINT=oidc-test

# Database
MONGODB_CONNECTION_STRING=mongodb://admin:<password>@mongodb-dev:27017
MONGODB_DB_NAME=puck-dev

# S3 (MinIO)
S3_ENDPOINT=http://minio:9000
S3_BUCKET=puck-files-dev
```

## Environment Variables (Test SSO Helper)

```env
AUTHORIZE_BASE_URL=https://pbs.puzzle.ch/oauth/authorize
TOKEN_ENDPOINT_URL=https://pbs.puzzle.ch/oauth/token
USERINFO_ENDPOINT_URL=https://pbs.puzzle.ch/oauth/userinfo
BASE_URL=https://sso.dev.pfadimh.ch
PROXY_REDIRECT_URI=https://sso.dev.pfadimh.ch/callback
FINAL_APP_REDIRECT_URL=https://sso.pfadimh.ch/realms/pfadimh-sso/broker/oidc-test/endpoint
```

## Keycloak Configuration

### Identity Provider: oidc-test

| Setting | Value |
|---------|-------|
| Alias | `oidc-test` |
| Display Name | `MiData Test (pbs.puzzle.ch)` |
| Authorization URL | `https://sso.dev.pfadimh.ch/authenticate` |
| Token URL | `https://sso.dev.pfadimh.ch/token` |
| User Info URL | `https://sso.dev.pfadimh.ch/userinfo` |
| Client ID | `kmqtRthrnw2LQwb9xaGXlCbH8yjtqewl2XN9IG1IMiM` |
| Scopes | `openid email name with_roles` |

### Client: pfadimh-site-dev

| Setting | Value |
|---------|-------|
| Client ID | `pfadimh-site-dev` |
| Redirect URIs | `https://puck.dev.pfadimh.ch/auth/callback/keycloak` |
| Web Origins | `https://puck.dev.pfadimh.ch` |

## Notes

1. **Test data can be reset anytime** - Don't rely on persistent test data
2. **Group IDs differ** between test and production MiData
3. **No real emails** - Check Mailtrap for test emails
4. The `AUTH_KEYCLOAK_IDP_HINT=oidc-test` env var ensures automatic redirect to test MiData

## Comparison: Dev vs Prod

| Aspect | Development | Production |
|--------|-------------|------------|
| URL | puck.dev.pfadimh.ch | prod.pfadimh.ch |
| MiData | pbs.puzzle.ch (test) | db.scout.ch (real) |
| SSO Helper | sso.dev.pfadimh.ch | sso.pfadimh.ch |
| IdP Alias | oidc-test | oidc |
| Accounts | Shared test accounts | Real scout accounts |
| Database | puck-dev | puck-prod |
| S3 Bucket | puck-files-dev (MinIO) | pmh-prod (Backblaze) |
