# /lib/assets

This directory contains static asset files that are imported directly into the application's code.

**Key points:**

- Use this directory for assets that are directly imported and used in the code.
- **Examples:**
  - Custom font files (`.ttf`, `.woff`, `.otf`) used with `@font-face` or `@next/font`.
- **Avoid:** Do not place large media files (images, videos) here. These should be served from a CDN.
