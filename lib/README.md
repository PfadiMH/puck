# /lib

This directory contains utility functions, configuration files, business logic, and other non-React-component code that supports the application.

It serves as a centralized location for shared logic that can be used across different parts of the application, including server components, API routes, and even client-side components. The goal is to keep this code separate from the UI layer (`/components`) and the routing layer (`/app`).

- **/assets**: For static asset files like fonts that are imported directly into the codebase.
- **/config**: For the core configuration files of the Puck CMS.
- **/contexts**: For the definition of React Context objects.
- **/db**: For all database connection and query logic.

You will also find standalone utility files here, such as:

- `cn.ts`: A helper function for conditionally combining CSS class names, typically used with Tailwind CSS.
- `query-client.ts`: A singleton instance of the React Query client.
