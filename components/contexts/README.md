# /components/contexts

This directory is used for creating and housing React Context **Provider** components.

These components are responsible for wrapping parts of the application (or the entire app) to provide shared state, functions, or other values to the entire component tree below them. This avoids the need for "prop drilling."

**Examples:**

- A `ThemeProvider` to provide theme data (colors, fonts).
- An `AuthProvider` to share user session information.
- A `QueryProvider` to provide a React Query client instance.

### Further Reading

- Official React Docs on Context: https://react.dev/learn/passing-data-deeply-with-context
