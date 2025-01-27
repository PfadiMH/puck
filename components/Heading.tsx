import {ComponentConfig} from "@measured/puck";
import React, {createElement} from "react";

export type HeadingProps = {
    text: string,
    textAlign: any,
    marginTop: number,
    marginBottom: number,
    level: string
};

function Heading({text, textAlign, marginTop, marginBottom, level}: HeadingProps) {

    console.log(level);
    let heading = createElement(level, {style: {textAlign,marginTop,marginBottom,minHeight: "12px"}}, text);
    console.log(heading);
    return (
        <div>
            {heading}
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
        level: {
            type: "select",
            options: [
                {label: "h1", value: "h1"},
                {label: "h2", value: "h2"},
                {label: "h3", value: "h3"},
            ],
        },
    },
    defaultProps: {
        text: "Heading",
        textAlign: "center",
        marginTop: 64,
        marginBottom: 64,
        level: "h1",
    }
}
