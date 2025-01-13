import { ComponentConfig } from '@measured/puck';
import { S } from '@measured/puck/dist/resolve-all-data-BoWgijLi';
import React, { CSSProperties, useState } from 'react';

export interface ImageComponentProps {
  src: string;
  alt: string;
  fallbackSrc: string;
}

const ImageComponent = ({
    src,
    alt,
    fallbackSrc,
} : ImageComponentProps) => {
    const [currentSrc, setCurrentSrc] = useState<string>(src);

    const handleError = () => {
        if (fallbackSrc){
            setCurrentSrc(fallbackSrc)
        }
    };

    return (
        <img
        src={currentSrc}
        alt={alt}
        onError={handleError}
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
      },
      fallbackSrc: {
        type: "text",
        label: "Fallback Source",
      },
    },
    defaultProps: {
      src: "",
      alt: "Default Image",
      fallbackSrc: "https://placehold.co/600x400?text=Fallback",
    },
  };
  

export default ImageComponent
