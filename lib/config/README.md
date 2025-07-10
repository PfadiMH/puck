# /lib/config

This directory contains the core configuration files for the Puck Content Management System. Each config file defines an "editable surface" of the website, specifying which components an editor can use and what global settings are available.

Each configuration object typically defines:

- **`components`**: A mapping of all the React components from `/components/puck/` that are available to be used in this specific editor instance.
- **`root`**: The props and fields available at the root level of the editable area. For a page, this might include SEO metadata like `title` and `description`. For a navbar, this might be empty.
- **`fields`**: (Optional) Global definitions for custom fields used across multiple components in this configuration.

**Files:**

- `page.config.ts`: Config for the main page content, used in `/app/admin/editor/[[...editPath]]`.
- `navbar.config.ts`: Config for the global navbar, used in `/app/admin/navbar`.
- `footer.config.ts`: Config for the global footer, used in `/app/admin/footer`.

### Further Reading

- Puck API Reference for `Config`: https://puckeditor.com/docs/api-reference/configuration/config
