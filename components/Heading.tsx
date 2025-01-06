import {ComponentConfig} from "@measured/puck";
import React from "react";

export type HeadingProps = {
    text: string,
    textAlign: any,
    marginTop: number,
    marginBottom: number
};

function Heading({text, textAlign, marginTop, marginBottom}: HeadingProps) {
    return (
        <div>
            <h1 style={{textAlign, marginTop, marginBottom}}>{text}</h1>
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
        marginTop: {
            type: "number",
            min: 0
        },
        marginBottom: {
            type: "number",
            min: 0
        },
    },
    defaultProps: {
        text: "Heading",
        textAlign: "center",
        marginTop: 64,
        marginBottom: 64,
    }
}
