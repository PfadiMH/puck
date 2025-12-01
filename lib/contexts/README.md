# /lib/contexts

This directory contains the **definition** of React Context objects.

**Key points:**

- This directory is intentionally separated from `/components/contexts` to enforce a clear separation of concerns.
- **Workflow:**
  1.  **Define here (`/lib/contexts`)**: Create the context object and define its type signature. (No React components)
  2.  **Implement there (`/components/contexts`)**: Create a React Provider component that _uses_ the context to provide a value to its children.
