export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Human-readable max file size for error messages
export const MAX_FILE_SIZE_MB = MAX_FILE_SIZE / (1024 * 1024);

export const ALLOWED_TYPES: string[] = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
];

// Derived accept string for file input elements
export const ACCEPT_STRING = ALLOWED_TYPES.join(",");
