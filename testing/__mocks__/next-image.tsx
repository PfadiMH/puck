import React from "react";

/**
 * Mock for next/image that renders a plain <img> element.
 * next/image relies on Next.js internals (React context) that don't exist
 * in the vitest browser environment, so we replace it with a simple img tag
 * that passes through standard HTML attributes.
 */
const MockImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    priority?: boolean;
    quality?: number;
    placeholder?: string;
    blurDataURL?: string;
  }
>(({ fill, priority, quality, placeholder, blurDataURL, ...props }, ref) => {
  return <img ref={ref} {...props} />;
});

MockImage.displayName = "MockImage";

export default MockImage;
