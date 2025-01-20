import { ComponentConfig } from "@measured/puck";
import React from "react";

export type ButtonGroup = {
  label: string;
  link: string;
};

export type ButtonGroupProps = {
  buttons: ButtonGroup[];
};

function Button({ label, link }: ButtonGroup) {
  return (
    <button
      onClick={(e) => {
        if(e.ctrlKey)
          window.open(link, "_blank")
        else{
          window.open(link, "_self");
        }
      }}
      className="m-1 px-5 py-2 bg-blue-500 text-white rounded-md transition-transform duration-300 ease-in-out hover:bg-blue-700 active:scale-95"
    >
      {label}
    </button>
  );
}

function ButtonGroup({ buttons }: ButtonGroupProps) {
  return (
    <div
      className="flex justify-center items-center flex-wrap gap-2"
      >
      {buttons.map((button, index) => (
        <Button key={index} {...button} />
      ))}
    </div>
  );
}

export const buttonGroupConfig: ComponentConfig<ButtonGroupProps> = {
  render: ButtonGroup,
  fields: {
    buttons: {
      type: "array",
      label: "Buttons",
      arrayFields: {
        label: {
          type: "text",
          label: "Button Name",
        },
        link: {
          type: "text",
          label: "Full link",
        },
      },
    },
  },
  defaultProps: {
    buttons: [{ label: "Button 1", link: "hello " }],
  },
};
