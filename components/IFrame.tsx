import { ComponentConfig } from '@measured/puck';
import React from 'react';

export type IFrameProps = {
    source: string;
    height: string;
    title: string;
}


function IFrame({ source, height, title }: IFrameProps) {
  return <>
  <div className='w-full flex flex-col justify-center overflow-hidden items-center'>
    <iframe src={source} width='100%' height={height} title={title}></iframe>
  </div>
  </>
}

export const iframeConfig: ComponentConfig<IFrameProps> = {
    render: IFrame,
    fields: {
        source: {
            type: "textarea",
        },
        height: {
            type: "textarea",
        },
        title: {
            type: "textarea",
        },
    },
};