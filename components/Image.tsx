import { ComponentConfig } from '@measured/puck';
import Image from 'next/image'
import { useState } from 'react';

export interface ImageComponentProps {
  src: string;
  alt: string;
}

const ImageComponent = ({
    src,
    alt,
} : ImageComponentProps) => {
    

    return (
        <Image
        src={src}
        alt={alt}
        style={{  
          display: "block",
          margin: "0 auto",
          width: "100%",
          height: "auto",
          maxWidth: "100%",
        }}
        />
    );
};

export const imageConfig: ComponentConfig<ImageComponentProps> = {
    render: ImageComponent,
    fields: {
      src: {
        type: "text",
        label: "Image Source",
      },
      alt: {
        type: "text",
        label: "Alt Text",
      }
    },
    defaultProps: {
      src: "https://placehold.co/600x400",
      alt: "Default Image"
    },
  };
  

export default ImageComponent
