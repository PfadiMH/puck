import FormGroupForm from "@components/page/FormGroupForm";
import { ComponentConfig, WithId } from "@measured/puck";
import { useMemo } from "react";
import { FormGroupRow } from "./FormGropRow";

export type FormGroupProps = {
  formFields: FormField[];
  buttonLabel: string;
  formRecipientEmail: string;
};

export type FormField = {
  label: string;
  size: string;
  placeholder: string;
  required: boolean;
};

export function FormGroup({
  formFields,
  buttonLabel,
  id,
}: WithId<FormGroupProps>) {
  const groupedFields =
    useMemo(() => {
      const fields: Array<FormField[]> = [];
      let tempRow: FormField[] = [];
      for (let i = 0; i < formFields.length; i++) {
        if (formFields[i].size === "half" && tempRow.length === 1) {
          tempRow.push(formFields[i]);
          fields.push(tempRow);
          tempRow = [];
        } else if (formFields[i].size === "half" && tempRow.length === 0) {
          tempRow.push(formFields[i]);
          if (i === formFields.length - 1) {
            fields.push(tempRow);
            tempRow = [];
          }
        } else if (formFields[i].size === "full") {
          if (tempRow.length > 0) {
            fields.push(tempRow);
            tempRow = [];
          }
          fields.push([formFields[i]]);
        }
      }
      return fields;
    }, [formFields]) || [];

  return (
    <FormGroupForm componentId={id}>
      {groupedFields.map((row, rowIndex) => (
        <FormGroupRow row={row} key={`row-${rowIndex}`} />
      ))}
      {groupedFields.length > 0 ? (
        <button
          className='bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]'
          type='submit'
        >
          {buttonLabel}
        </button>
      ) : (
        <span></span>
      )}
    </FormGroupForm>
  );
}

export const formGroupConfig: ComponentConfig<FormGroupProps> = {
  render: FormGroup,
  fields: {
    formFields: {
      type: "array",
      label: "Form Fields",
      getItemSummary: (item) => {
        return item.label;
      },
      arrayFields: {
        label: {
          type: "text",
        },
        placeholder: {
          type: "text",
        },
        required: {
          type: "radio",
          options: [
            { value: true, label: "Required" },
            { value: false, label: "Not required" },
          ],
        },
        size: {
          type: "radio",
          options: [
            { value: "full", label: "full" },
            { value: "half", label: "half" },
          ],
        },
      },
      defaultItemProps: {
        label: "label",
        placeholder: "placeholder",
        size: "full",
        required: false,
      },
    },
    buttonLabel: {
      type: "text",
    },
    formRecipientEmail: {
      type: "text",
    },
  },
  defaultProps: {
    formFields: [
      {
        label: "label",
        size: "full",
        placeholder: "placeholder",
        required: false,
      },
    ],
    buttonLabel: "Send response",
    formRecipientEmail: "example@example.com",
  },
};
