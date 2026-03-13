import { ComponentConfig } from "@puckeditor/core";
import { optionalNumberField } from "@components/puck-fields/optional-number-field";
import { FormClient, FormField } from "./FormClient";

export type { FormField, FormFieldType } from "./FormClient";

export interface FormProps {
  recipientEmail: string;
  formTitle: string;
  submitButtonText: string;
  successMessage: string;
  fields: FormField[];
  editMode?: boolean;
}

function Form({
  formTitle,
  submitButtonText,
  successMessage,
  fields,
  editMode,
  id,
}: FormProps & { id: string }) {
  return (
    <FormClient
      componentId={id}
      formTitle={formTitle}
      submitButtonText={submitButtonText}
      successMessage={successMessage}
      fields={fields}
      editMode={editMode}
    />
  );
}

export const formConfig: ComponentConfig<FormProps> = {
  render: Form,
  label: "Form",
  fields: {
    formTitle: {
      type: "text",
      label: "Form Title",
    },
    recipientEmail: {
      type: "text",
      label: "Recipient Emails (separate multiple with comma)",
    },
    submitButtonText: {
      type: "text",
      label: "Button Text",
    },
    successMessage: {
      type: "text",
      label: "Success Message",
    },
    fields: {
      type: "array",
      label: "Form Fields",
      getItemSummary: (field) => field.label || "New Field",
      arrayFields: {
        label: {
          type: "text",
          label: "Label",
        },
        type: {
          type: "select",
          label: "Field Type",
          options: [
            { label: "Short Text", value: "shortText" },
            { label: "Long Text", value: "longText" },
            { label: "Number", value: "number" },
            { label: "Radio Buttons", value: "radio" },
            { label: "Checkboxes", value: "checkbox" },
          ],
        },
        placeholder: {
          type: "text",
          label: "Placeholder",
        },
        required: {
          type: "radio",
          label: "Required",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        width: {
          type: "radio",
          label: "Width",
          options: [
            { label: "Full Width", value: "full" },
            { label: "Half Width", value: "half" },
          ],
        },
        minLength: optionalNumberField({ label: "Min Length / Value", min: 0 }),
        maxLength: optionalNumberField({ label: "Max Length / Value", min: 0 }),
        options: {
          type: "textarea",
          label: "Options (comma-separated, for Radio/Checkbox)",
        },
      },
    },
  },
  defaultProps: {
    recipientEmail: "",
    formTitle: "Contact Form",
    submitButtonText: "Submit",
    successMessage: "Thank you for your message!",
    fields: [],
  },
};
