# /lib/db

This directory abstracts and isolates all interactions with the database. Its purpose is to create a clear data access layer, ensuring that database-specific code does not leak into the rest of the application.

All logic for connecting to the database, defining data models/schemas, and performing CRUD (Create, Read, Update, Delete) operations should reside here. By centralizing this logic, you make the application more maintainable and easier to migrate to a different database technology in the future.

**Responsibilities:**

- Establishing and managing the database connection (e.g., `mongo.ts`).
- Defining functions to fetch data (e.g., `getPageByPath`, `getAllPages`).
- Defining functions to write data (e.g., `savePage`, `deletePage`).
- Handling data serialization and deserialization if necessary (e.g., `json.ts` for handling non-serializable MongoDB types).

By using this directory as the single source of truth for data access, your server components and API routes can remain agnostic about the underlying database implementation.
