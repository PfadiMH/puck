# /lib/contexts

This directory is used for the **definition** of React Context objects using the `createContext` API.

It is intentionally separated from `/components/contexts` to enforce a clear separation of concerns:

1.  **Define here (`/lib/contexts`)**: Create the context object and define its type signature. This file contains no React components, only the context definition itself.
2.  **Implement there (`/components/contexts`)**: Create a React Provider component that _uses_ the context defined here to provide a value to its children.

This pattern makes the data shape of your context clear and reusable, separating the data contract from its implementation.

**Example Workflow:**

1.  Create `lib/contexts/theme-context.ts` to define `ThemeContext`.
2.  Create `components/contexts/ThemeProvider.tsx` which imports `ThemeContext` and renders `<ThemeContext.Provider value={...}>`.
