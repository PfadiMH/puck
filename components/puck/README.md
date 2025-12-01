# /components/puck

This directory contains React components specifically designed for use as building blocks within the Puck editor.

**Key points:**

- **Important:** All components must be registered in `lib/config/page.config.ts` to be available in the Puck editor.
- [Puck Docs on Defining Components](https://puckeditor.com/docs/integrating-puck/component-configuration)

### Component Configuration

Each component within this directory must export two key items for it to be registered and utilized in `page.config.ts`: a `config` object and a `config` type.

This `config` specifies how the component should be rendered and what fields are available for editing.

- `render`: This property is a function that returns the React component to be rendered. It receives the props as defined in the `fields` object.
- `fields`: This is an object that defines the editable fields for the component in the Puck editor. The value is an object that specifies the type of input to be used in the editor (e.g., "text", "select").
