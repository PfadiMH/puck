import { SectionThemeProvider } from "@components/contexts/SectionThemeProvider";
import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

vi.mock("@lib/actions/submit-form", () => ({
  submitForm: vi.fn(),
}));

import { FormClient, FormClientProps } from "@components/puck/FormClient";

const defaultProps: FormClientProps = {
  componentId: "Form-test-123",
  formTitle: "Test Formular",
  submitButtonText: "Absenden",
  successMessage: "Danke!",
  fields: [],
};

function renderForm(props: Partial<FormClientProps> = {}) {
  return render(
    <SectionThemeProvider theme="sun">
      <FormClient {...defaultProps} {...props} />
    </SectionThemeProvider>
  );
}

describe("Form Component", () => {
  test("renders form title", async () => {
    const screen = await renderForm({ formTitle: "Kontakt" });
    expect(screen.getByText("Kontakt")).toBeVisible();
  });

  test("renders short text field", async () => {
    const screen = await renderForm({
      fields: [
        {
          label: "Name",
          type: "shortText",
          placeholder: "Dein Name",
          required: true,
          width: "full",
        },
      ],
    });
    expect(screen.getByText("Name")).toBeVisible();
    expect(screen.getByPlaceholder("Dein Name")).toBeVisible();
  });

  test("renders long text field", async () => {
    const screen = await renderForm({
      fields: [
        {
          label: "Nachricht",
          type: "longText",
          placeholder: "Deine Nachricht",
          required: false,
          width: "full",
        },
      ],
    });
    expect(screen.getByText("Nachricht")).toBeVisible();
  });

  test("renders number field", async () => {
    const screen = await renderForm({
      fields: [
        {
          label: "Alter",
          type: "number",
          required: false,
          width: "half",
        },
      ],
    });
    expect(screen.getByText("Alter")).toBeVisible();
  });

  test("renders radio buttons", async () => {
    const screen = await renderForm({
      fields: [
        {
          label: "Geschlecht",
          type: "radio",
          options: "Männlich, Weiblich, Divers",
          required: true,
          width: "full",
        },
      ],
    });
    expect(screen.getByText("Geschlecht")).toBeVisible();
    expect(screen.getByText("Männlich")).toBeVisible();
    expect(screen.getByText("Weiblich")).toBeVisible();
    expect(screen.getByText("Divers")).toBeVisible();
  });

  test("renders checkboxes", async () => {
    const screen = await renderForm({
      fields: [
        {
          label: "Interessen",
          type: "checkbox",
          options: "Sport, Musik, Kunst",
          required: false,
          width: "full",
        },
      ],
    });
    expect(screen.getByText("Interessen")).toBeVisible();
    expect(screen.getByText("Sport")).toBeVisible();
    expect(screen.getByText("Musik")).toBeVisible();
  });

  test("renders submit button with custom text", async () => {
    const screen = await renderForm({ submitButtonText: "Senden" });
    expect(screen.getByText("Senden")).toBeVisible();
  });

  test("shows required indicator", async () => {
    const screen = await renderForm({
      fields: [
        {
          label: "Pflichtfeld",
          type: "shortText",
          required: true,
          width: "full",
        },
      ],
    });
    expect(screen.getByText("*")).toBeVisible();
  });

  test("half width field has correct class", async () => {
    const screen = await renderForm({
      fields: [
        {
          label: "Halb",
          type: "shortText",
          required: false,
          width: "half",
        },
      ],
    });
    const container = screen.container.querySelector(".md\\:w-1\\/2");
    expect(container).toBeTruthy();
  });
});
