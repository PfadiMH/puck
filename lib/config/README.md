# /lib/config

This directory contains the core configuration files for the Puck CMS. Each file defines an "editable surface" of the website.

## Configuration Structure

To make a custom React component available in any of the editor surfaces, you need to register it within the corresponding configuration file.

1. Import the component's configuration object that you exported from its file in the `/components/puck` directory.
2. In the page.config.ts, navbar.config.ts, or footer.config.ts file, add your imported component configuration to the main `config`.

## Files

- `page.config.ts`: Defines the configuration for the main page content editor, accessible at `/app/admin/editor/[[...editPath]]`.
- `navbar.config.ts`: Defines the configuration for the global navbar editor, accessible at `/app/admin/navbar`.
- `footer.config.ts`: Defines the configuration for the global footer editor, accessible at `/app/admin/footer`.

## Further Reading

- [Puck API Reference for `Config`](https://puckeditor.com/docs/api-reference/configuration/config)
