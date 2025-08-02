import { textConfig } from "@components/puck/Text";
import { PuckContext } from "@measured/puck";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("Text component", () => {
  it("renders the component unchanged", () => {
    const { container } = render(
      <textConfig.render
        {...{
          id: "test-id",
          ...textConfig.defaultProps!,
          puck: {} as PuckContext,
        }}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders the component with default props from the config", () => {
    render(
      <textConfig.render
        {...{
          id: "test-id",
          ...textConfig.defaultProps!,
          puck: {} as PuckContext,
        }}
      />
    );

    const textElement = screen.getByText(textConfig.defaultProps!.text);
    expect(textElement).toBeInTheDocument();
  });

  it("renders the component with custom props", () => {
    const customText = "This is a custom text";
    render(
      <textConfig.render
        {...{
          id: "test-id",
          text: customText,
          puck: {} as PuckContext,
        }}
      />
    );

    const textElement = screen.getByText(customText);
    expect(textElement).toBeInTheDocument();
  });
});
