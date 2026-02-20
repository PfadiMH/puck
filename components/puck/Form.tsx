import { ComponentConfig } from "@puckeditor/core";
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
  label: "Formular",
  fields: {
    formTitle: {
      type: "text",
      label: "Formular-Titel",
    },
    recipientEmail: {
      type: "text",
      label: "Empfänger E-Mails (mehrere mit Komma trennen)",
    },
    submitButtonText: {
      type: "text",
      label: "Button-Text",
    },
    successMessage: {
      type: "text",
      label: "Erfolgsmeldung",
    },
    fields: {
      type: "array",
      label: "Formular-Felder",
      getItemSummary: (field) => field.label || "Neues Feld",
      arrayFields: {
        label: {
          type: "text",
          label: "Bezeichnung",
        },
        type: {
          type: "select",
          label: "Feldtyp",
          options: [
            { label: "Kurzer Text", value: "shortText" },
            { label: "Langer Text", value: "longText" },
            { label: "Zahl", value: "number" },
            { label: "Radio Buttons", value: "radio" },
            { label: "Checkboxen", value: "checkbox" },
          ],
        },
        placeholder: {
          type: "text",
          label: "Platzhalter",
        },
        required: {
          type: "radio",
          label: "Pflichtfeld",
          options: [
            { label: "Ja", value: true },
            { label: "Nein", value: false },
          ],
        },
        width: {
          type: "radio",
          label: "Breite",
          options: [
            { label: "Volle Breite", value: "full" },
            { label: "Halbe Breite", value: "half" },
          ],
        },
        minLength: {
          type: "number",
          label: "Min. Länge / Wert",
        },
        maxLength: {
          type: "number",
          label: "Max. Länge / Wert",
        },
        options: {
          type: "textarea",
          label: "Optionen (kommagetrennt, für Radio/Checkbox)",
        },
      },
    },
  },
  defaultProps: {
    recipientEmail: "",
    formTitle: "Kontaktformular",
    submitButtonText: "Absenden",
    successMessage: "Vielen Dank für Ihre Nachricht!",
    fields: [],
  },
};
