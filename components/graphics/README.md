# /components/graphics

This directory is used to store SVG assets that have been converted into reusable React components.

Storing SVGs as components allows for greater control over their appearance and behavior. You can easily apply styles, change colors via props, and add animations or interactions. Each file should export a single component representing one icon or illustration.

**Guidelines:**

- Keep components focused on rendering the SVG markup.
- Use `currentColor` for `fill` or `stroke` properties where possible to allow easy color changes.
- Optimize SVGs before converting them to components to keep the bundle size small.
