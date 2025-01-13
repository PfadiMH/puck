import { ComponentConfig } from "@measured/puck";
import { redirect } from "next/navigation";
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
      onClick={() => {
        window.open(link, "_self");
      }}
      style={{
        margin: "5px",
        padding: "10px 20px",
        backgroundColor: "#007BFF",
        color: "#FFF",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007BFF")}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {label}
    </button>
  );
}

function ButtonGroup({ buttons }: ButtonGroupProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
      }}
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
