# Issue: Setup Dev and prod deployments with Dokploy

**Objective:**
Setup automated deployments for Development and Production environments using Dokploy.

**Requirements:**

1.  **Deployment Platform:** Dokploy.
2.  **Environments:**
    *   **Development (Dev):**
        *   Must connect to the **Test Keycloak** instance.
        *   Test Keycloak connects to the Test SSO Helper layer, which connects to the Test instance of Midata.
    *   **Production (Prod):**
        *   Must connect to the **Prod Keycloak** instance.
        *   Prod Keycloak connects to the Prod instance of Midata.
        *   Must connect to the **Prod Database**.

**Configuration Details:**
Each environment needs to be configured with the appropriate Environment Variables in Dokploy.

*   **Common Variables:**
    *   `DATABASE_TYPE=mongodb`
    *   `AUTH_TRUST_HOST` (Set to the deployment URL)
    *   `INTERNAL_API_BASE_URL` (Set to the deployment URL)

*   **Dev Environment Variables:**
    *   `MONGODB_CONNECTION_STRING`: Connection string for Dev DB (if separate) or Test DB.
    *   `MONGODB_DB_NAME`: Database name.
    *   `AUTH_KEYCLOAK_ID`: Client ID for Test Keycloak.
    *   `AUTH_KEYCLOAK_SECRET`: Client Secret for Test Keycloak.
    *   `AUTH_KEYCLOAK_ISSUER`: URL for Test Keycloak Realm (e.g., `https://sso-test.pfadimh.ch/realms/...`).

*   **Prod Environment Variables:**
    *   `MONGODB_CONNECTION_STRING`: Connection string for Prod DB.
    *   `MONGODB_DB_NAME`: Database name.
    *   `AUTH_KEYCLOAK_ID`: Client ID for Prod Keycloak.
    *   `AUTH_KEYCLOAK_SECRET`: Client Secret for Prod Keycloak.
    *   `AUTH_KEYCLOAK_ISSUER`: URL for Prod Keycloak Realm.

**Action Items:**
*   [ ] Configure Dokploy project and services.
*   [ ] Set up Environment Variables for Dev and Prod.
*   [ ] Verify connectivity to Keycloak and Database in both environments.
*   [ ] **Schedule a 1:1 meeting** to discuss the specific deployment approach and obtain necessary server credentials.
