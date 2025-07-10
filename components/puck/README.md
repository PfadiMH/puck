# /components/puck

This is a critical directory for the CMS. It contains all the React components that are made available to a content editor inside the Puck visual editor.

These are the fundamental building blocks that users can drag, drop, and configure to create pages. Each component here must be registered in the main Puck configuration file (`lib/config/page.config.ts`) to appear in the editor.

**Examples:**

- `Heading`: A simple text heading with options for size and alignment.
- `Hero`: A large banner component with an image and a title.
- `Flex`: A layout component that allows editors to arrange other components in rows or columns.

### Further Reading

- Puck Docs on Defining Components: https://puckeditor.com/docs/integrating-puck/component-configuration
