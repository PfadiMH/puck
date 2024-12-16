import {ComponentConfig} from "@measured/puck";
import React from "react";

export type HeadingProps = {
    text: string,
    textAlign: any,
};

function Heading({text, textAlign}: HeadingProps) {
    return (
        <div style={{padding: 64}}>
            <h1 style={{textAlign}}>{text}</h1>
        </div>
    )
}

export const headingConfig: ComponentConfig<HeadingProps> = {
    render: Heading,
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
        text: "Heading",
        textAlign: "center",
    }
}
