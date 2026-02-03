# SSO Helper - OAuth2/OIDC Proxy for MiData

SSO Helper is an OAuth2/OIDC proxy that sits between Keycloak and MiData (Swiss Scout Database). It translates MiData user roles into hierarchy levels for Puck authorization.

## Architecture

```
User -> Puck -> Keycloak -> SSO Helper -> MiData (db.scout.ch)
                    ^              |
                    +-- callback --+
```

## How It Works

1. User clicks "Login" on Puck
2. Puck redirects to Keycloak
3. Keycloak's Identity Provider redirects to SSO Helper `/authenticate`
4. SSO Helper redirects to MiData OAuth authorize endpoint (with modified redirect_uri)
5. User authenticates on MiData
6. MiData redirects back to SSO Helper `/callback`
7. SSO Helper forwards the auth code to Keycloak
8. Keycloak exchanges the code for tokens via SSO Helper `/token`
9. Keycloak fetches user info via SSO Helper `/userinfo`
10. SSO Helper enriches the userinfo with `hierarchy_level` based on group mappings
11. User is logged into Puck with appropriate permissions

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTHORIZE_BASE_URL` | MiData OAuth authorize endpoint | `https://db.scout.ch/oauth/authorize` |
| `TOKEN_ENDPOINT_URL` | MiData OAuth token endpoint | `https://db.scout.ch/oauth/token` |
| `USERINFO_ENDPOINT_URL` | MiData OAuth userinfo endpoint | `https://db.scout.ch/oauth/userinfo` |
| `PROXY_REDIRECT_URI` | This server's callback URL (must match MiData OAuth app config) | `https://sso.pfadimh.ch/callback` |
| `FINAL_APP_REDIRECT_URL` | Keycloak broker endpoint to receive the auth code | `https://sso.pfadimh.ch/realms/pfadimh-sso/broker/oidc/endpoint` |
| `ISSUER_BASE_URL` | Keycloak realm URL (for admin UI authentication) | `https://sso.pfadimh.ch/realms/pfadimh-sso` |
| `CLIENT_ID` | Keycloak client ID (for admin UI) | `midata-proxy` |
| `CLIENT_SECRET` | Keycloak client secret | `<secret>` |
| `BASE_URL` | This server's base URL | `https://sso.pfadimh.ch` |
| `SECRET` | JWT signing secret for express-openid-connect | `<random-string>` |
| `CONFIGURATION_JSON` | Initial group-to-role mappings (JSON string) | See below |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DEBUG` | Debug logging | - |

## CONFIGURATION_JSON Format

```json
{
  "groups": [
    {
      "group_id": 1172,
      "roles": ["Group::Abteilung::Abteilungsleitung", "Group::Abteilung::Webmaster"],
      "profile": "leader"
    },
    {
      "group_id": 12460,
      "roles": ["Group::AbteilungsGremium::Leitung"],
      "profile": "admin"
    }
  ]
}
```

### Profile Levels (Hierarchy)

| Profile | Level | Description |
|---------|-------|-------------|
| `admin` | 3 | Full administrative access |
| `leader` | 2 | Leader-level access |
| `member` | 1 | Basic member access |
| `none` | 0 | No special access |

The system calculates the highest hierarchy level from all matching groups.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/authenticate` | GET | Redirects to MiData authorize with modified redirect_uri |
| `/callback` | GET | Receives MiData callback, forwards to Keycloak |
| `/token` | POST | Proxies token exchange to MiData |
| `/userinfo` | GET | Proxies userinfo from MiData, adds hierarchy_level |
| `/proxy-admin/config` | GET | Admin UI for group mappings (requires Keycloak auth with Admin role) |
| `/proxy-admin/config` | POST | Save group mappings |

## Deployment

### Docker

```dockerfile
FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
CMD ["bun", "start"]
```

### Dokploy Configuration

1. Create application from GitHub: `PfadiMH/sso-helper` branch `main`
2. Build type: Dockerfile
3. Set environment variables
4. Add domain routes on `sso.pfadimh.ch`:
   - `/authenticate`
   - `/callback`
   - `/token`
   - `/userinfo`
   - `/proxy-admin`
5. Add file mount for `/app/hierarchy_config.json` (for runtime config changes)

## Production vs Test Configuration

### Production (db.scout.ch)

```env
AUTHORIZE_BASE_URL=https://db.scout.ch/oauth/authorize
TOKEN_ENDPOINT_URL=https://db.scout.ch/oauth/token
USERINFO_ENDPOINT_URL=https://db.scout.ch/oauth/userinfo
```

### Test (pbs.puzzle.ch)

```env
AUTHORIZE_BASE_URL=https://pbs.puzzle.ch/oauth/authorize
TOKEN_ENDPOINT_URL=https://pbs.puzzle.ch/oauth/token
USERINFO_ENDPOINT_URL=https://pbs.puzzle.ch/oauth/userinfo
```

**Note:** Group IDs differ between production and test MiData instances. Update `CONFIGURATION_JSON` accordingly.

## MiData OAuth App Registration

To use this proxy, you need an OAuth application registered on MiData:

1. Contact PBS (Pfadibewegung Schweiz) or your Kantonalverband
2. Request OAuth app registration with:
   - **Redirect URI:** `https://your-domain.com/callback`
   - **Scopes:** `openid`, `profile`, `email`, `with_roles`

## Keycloak Configuration

### Identity Provider Setup

1. Go to Keycloak Admin Console
2. Navigate to: Realm Settings > Identity Providers > Add provider > OpenID Connect v1.0
3. Configure:
   - **Alias:** `oidc` (or custom)
   - **Authorization URL:** `https://your-sso-helper/authenticate`
   - **Token URL:** `https://your-sso-helper/token`
   - **User Info URL:** `https://your-sso-helper/userinfo`
   - **Client ID:** Your MiData OAuth client ID
   - **Client Secret:** Your MiData OAuth client secret
   - **Scopes:** `openid profile email with_roles`

### Client Setup (for Puck)

1. Create a new client: `pfadimh-site`
2. Configure:
   - **Client Protocol:** openid-connect
   - **Access Type:** confidential
   - **Valid Redirect URIs:** `https://your-puck-domain/auth/callback/keycloak`
   - **Web Origins:** `https://your-puck-domain`

## Troubleshooting

### Common Issues

1. **"redirect_uri mismatch"**
   - Ensure `PROXY_REDIRECT_URI` exactly matches the redirect URI registered in MiData

2. **"Invalid client credentials"**
   - Verify `CLIENT_ID` and `CLIENT_SECRET` in Keycloak IdP config

3. **"User has no hierarchy level"**
   - Check `CONFIGURATION_JSON` group IDs match the user's MiData groups
   - Verify the user has one of the configured roles in MiData

4. **Admin UI returns 403**
   - Ensure the user has `Admin` role in Keycloak
   - Check `/proxy-admin/login` authentication works

## Development

```bash
# Install dependencies
bun install

# Run locally
bun start

# With debug logging
DEBUG=express-openid-connect* bun start
```

## Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Main Express server |
| `src/config.ts` | Environment variable loading |
| `src/middleware/authenticate.ts` | OAuth authorize redirect |
| `src/middleware/callback.ts` | OAuth callback handler |
| `src/middleware/token.ts` | Token exchange proxy |
| `src/middleware/userinfo.ts` | Userinfo proxy with transformation |
| `src/utils/transaltor.ts` | Userinfo data transformation |
| `src/utils/hierarchy.ts` | Hierarchy level calculation |
| `hierarchy_config.json` | Runtime group mappings (created automatically) |

## License

MIT
