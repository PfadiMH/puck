# /components/ui

This directory contains the core design system of the application. It houses generic, reusable, and presentational UI primitives.

These components should be "dumb" and contain no application-specific business logic. They are the atomic building blocks (Buttons, Inputs, Cards, Dialogs, etc.) that are composed together to build all other components and features in the application. They are often developed and tested in isolation using Storybook.

**Guidelines:**

- Components should be highly reusable and flexible.
- Styling and variants should be controlled via props.
- They should be agnostic to where they are used.

**Examples:**

- `Button.tsx`
- `Input.tsx`
- `Card.tsx`
- `Table.tsx`
- `Dialog.tsx`

### Further Reading

- Storybook Docs on what a story is: https://storybook.js.org/docs/get-started/whats-a-story
