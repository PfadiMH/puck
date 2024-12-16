import {ComponentConfig} from "@measured/puck";
import React from "react";

export type HeadingComponentProps = {
    text: string,
    textAlign: any,
};

function HeadingComponent({text, textAlign}: HeadingComponentProps) {
    return (
        <div style={{padding: 64}}>
            <h1 style={{textAlign}}>{text}</h1>
        </div>
    )
};

export const headingComponentConfig: ComponentConfig<HeadingComponentProps> = {
    render: HeadingComponent,
    fields: {
        text: {type: "text"},
        textAlign: {
            type: "radio",
            options: [
                {label: "Left", value: "left"},
                {label: "Center", value: "center"},
                {label: "Right", value: "right"},
            ],
        },
    },
    defaultProps: {
        text: "HeadingComponent",
        textAlign: "center",
    }
}
