# /lib/db

This directory abstracts and isolates all database interactions.

**Key points:**

- This directory creates a clear data access layer, preventing database-specific code from leaking into the application.
- **Responsibilities:**
  - Establish and manage the database connection (e.g., `mongo.ts`).
  - Define functions to fetch data (e.g., `getPageByPath`, `getAllPages`).
  - Define functions to write data (e.g., `savePage`, `deletePage`).
  - Handle data serialization/deserialization (e.g., `json.ts` for MongoDB types).
