import { ComponentConfig } from '@measured/puck';
import { match } from 'assert';
import { kMaxLength } from 'buffer';
import React from 'react';

export type IFrameProps = {
    source: string;
    height: string;
    title: string;
}


function IFrame({ source, height, title }: IFrameProps) {
  return <>
  <div className='w-full overflow-hidden'>
    <iframe src={source} width='100%' height={height} title={title}/>
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
            type: "number",
        },
        title: {
            type: "textarea",
        },
    },
};