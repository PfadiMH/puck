# PfadiMH Infrastructure Reference

Quick reference for the current infrastructure state.

## Server

| Item | Value |
|------|-------|
| **IP Address** | `46.225.62.139` |
| **Platform** | Ubuntu 24.04 |
| **Dokploy Panel** | https://deploy.pfadimh.ch |
| **SSH** | `ssh -i ~/.ssh/puck_deploy_key root@46.225.62.139` |

## Domains

| Domain | Service | Status |
|--------|---------|--------|
| `prod.pfadimh.ch` | Puck Production | Active |
| `dev.pfadimh.ch` | Puck Development | Active |
| `sso.pfadimh.ch` | Keycloak + SSO Helper | Active |
| `deploy.pfadimh.ch` | Dokploy Panel | Active |

## Running Services

### Production Environment

| Service | Container Name | Image | Port |
|---------|---------------|-------|------|
| Puck Prod | `puck-prod-sud7fn` | Built from GitHub | 3000 |
| Keycloak | `keycloak-ul2llg` | `quay.io/keycloak/keycloak:latest` | 8080 |
| SSO Helper | `sso-helper-nlmvvu` | Built from GitHub | 3000 |
| MongoDB Prod | `mongodb-prod-ugudot` | `mongo:7` | 27017 |
| Keycloak DB | `keycloak-db-wna4ve` | `postgres:16` | 5432 |

### Development Environment

| Service | Container Name | Image | Port |
|---------|---------------|-------|------|
| Puck Dev | `puck-dev-vqjrt3` | Built from GitHub | 3000 |
| MongoDB Dev | `mongodb-dev-yvs3lk` | `mongo:7` | 27017 |
| MinIO | `minio-i3tuqa` | `minio/minio:latest` | 9000/9001 |

## Credentials Reference

### Dokploy API
```
API Key: claude-goatmeqKTgRknDuhQkuEyWVcnXwSauQlWxDicNzkaSBhcQpXaPkqEgfUoLbTeqTMWCdp
```

### Keycloak Admin
```
URL: https://sso.pfadimh.ch/admin
Username: admin
Password: pYl7o73P4H/5wD86KhS49+QgMsMJuxb6
```

### MongoDB Production
```
Username: admin
Password: OWMj5VeDrrql8fsDlhwC2eH80XnUxr
Database: puck-prod
```

### MongoDB Development
```
Username: admin
Password: e1YFJbSVlfYH4U2wd0UXvbS58sCZdjgS
Database: puck-dev
```

### MinIO (Development S3)
```
Username: minioadmin
Password: T8Znl6sqeKatZyUiubqB1r+HdooglpUH
Bucket: puck-files-dev
```

### Backblaze B2 (Production S3)
```
Bucket: pmh-prod
Key ID: 00347b348ecf72d0000000003
App Key: K003bwpmKBnLnuZRGbvPk96zvym3XZI
Endpoint: s3.eu-central-003.backblazeb2.com
```

### Keycloak Client (for Puck)
```
Client ID: pfadimh-site
Client Secret: Q1UHAjDwItrduY1qaxKWOdWpEU8jPTKL
Issuer: https://sso.pfadimh.ch/realms/pfadimh-sso
```

### SSO Helper (MiData OAuth)
```
Client ID: midata-proxy
Client Secret: rMrDol42K1vs2U3OsEVRl6U6JoZQC3RK
```

## GitHub Repositories

| Repository | Branch | CI/CD |
|------------|--------|-------|
| `PfadiMH/puck` | `master` | Auto-deploy on push |
| `PfadiMH/sso-helper` | `main` | Auto-deploy on push |

## Test Environment (pbs.puzzle.ch)

### Test MiData Accounts
| Role | Email | Password |
|------|-------|----------|
| Stufenleiter | `ullrich_emirhan@hitobito.example.com` | `hito42bito` |
| Abteilungsleiter | `letizia_wilhelm@hitobito.example.com` | `hito42bito` (2FA) |
| Admin | `hussein_kohlmann@hitobito.example.com` | `hito42bito` (2FA) |

### Mailtrap (Test Emails)
```
URL: https://mailtrap.io
Username: hitobito-pbs@puzzle.ch
Password: XydDHtAqZIQh7igTD
2FA: XOKUUE4SEROJWI2S2TS6SFT5VPMN6UPN
```

## Pending Tasks

- [ ] DNS record for `sso-test.pfadimh.ch` (for test Keycloak)
- [ ] OAuth app registration on `pbs.puzzle.ch` (test MiData)
- [ ] Test Keycloak setup
- [ ] Test SSO Helper setup
- [ ] Connect Puck Dev to test auth

## Network

All services run on Docker network `dokploy-network` and can communicate using container names as hostnames.

Example:
```
# From Puck container, connect to MongoDB:
mongodb://admin:password@mongodb-prod-ugudot:27017

# From Keycloak, connect to SSO Helper:
http://sso-helper-nlmvvu:3000
```
