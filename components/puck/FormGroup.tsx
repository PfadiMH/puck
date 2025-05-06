import { Input } from "@components/misc/external/input";
import { Label } from "@components/misc/external/label";
import FormGroupForm from "@components/page/FormGroupForm";
import { ComponentConfig, WithId } from "@measured/puck";

export type FormGroupProps = {
  formFields: FormField[];
  buttonLabel: string;
  formRecipientEmail: string;
};

type FormField = {
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
  const groupedFields: Array<FormField[]> = [];
  let tempRow: FormField[] = [];
  formFields.forEach((field, index) => {
    if (field.size === "half" && tempRow.length === 1) {
      tempRow.push(field);
      groupedFields.push(tempRow);
      tempRow = [];
    } else if (field.size === "half" && tempRow.length === 0) {
      tempRow.push(field);
      if (index === formFields.length - 1) {
        groupedFields.push(tempRow);
        tempRow = [];
      }
    } else if (field.size === "full") {
      if (tempRow.length > 0) {
        groupedFields.push(tempRow);
        tempRow = [];
      }
      groupedFields.push([field]);
    }
  });

  return (
    <FormGroupForm componentId={id}>
      {groupedFields.map((row, rowIndex) => (
        <div className='flex' key={`row-${rowIndex}`}>
          {row.map((field, index) => (
            <span className='flex grow mt-2 mb-2' key={`field-${index}`}>
              {field.size === "full" ? (
                <span className='flex grow'>
                  <span className='flex-1'>
                    <Label htmlFor={field.label}>{field.label}</Label>
                    <Input
                      id={field.label}
                      name={field.label}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  </span>
                </span>
              ) : (
                <span className='flex grow'>
                  <span className='flex-1/2'>
                    <Label htmlFor={field.label}>{field.label}</Label>
                    <Input
                      id={field.label}
                      name={field.label}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  </span>
                  {index === 0 && row.length - 1 !== index ? (
                    <span>
                      {row.length - 1 !== index ? (
                        <span className='pr-1 pl-1'></span>
                      ) : (
                        <span></span>
                      )}
                    </span>
                  ) : (
                    <span></span>
                  )}
                </span>
              )}
            </span>
          ))}
        </div>
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
