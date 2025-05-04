import { Input } from "@components/misc/external/input";
import { Label } from "@components/misc/external/label";
import FormGroupForm from "@components/page/FormGroupForm";
import { ComponentConfig, WithId } from "@measured/puck";

export type FormGroupProps = {
  formFields: { label: string; size: string }[];
  buttonLabel: string;
  formRecipientEmail: string;
};

export function FormGroup({
  formFields,
  buttonLabel,
  id,
}: WithId<FormGroupProps>) {
  const groupedFields: { label: string; size: string }[][] = [];
  let tempRow: { label: string; size: string }[] = [];
  formFields.forEach((field, index) => {
    if (field.size === "full") {
      groupedFields.push([field]);
    } else if (field.size === "half") {
      if (tempRow.length === 0) {
        tempRow.push(field);
        if (index === formFields.length - 1) {
          groupedFields.push(tempRow);
        }
      } else if (tempRow.length === 1) {
        tempRow.push(field);
        groupedFields.push(tempRow);
        tempRow = [];
      }
    }
  });
  return (
    <FormGroupForm componentId={id}>
      {groupedFields.map((row) => (
        <div className='flex'>
          {row.map((field, index) => (
            <span className='flex grow mt-2 mb-2'>
              {field.size === "full" ? (
                <span className='flex grow flex-col'>
                  <Label htmlFor={field.label}>{field.label}</Label>
                  <Input
                    id={field.label}
                    name={field.label}
                    placeholder={field.label}
                  />
                </span>
              ) : (
                <span className='flex grow'>
                  <span className='flex-1/2'>
                    <Label htmlFor={field.label}>{field.label}</Label>
                    <Input
                      id={field.label}
                      name={field.label}
                      placeholder={field.label}
                    />
                  </span>
                  {index === 0 ? (
                    <span>
                      {row.length - 1 !== index ? (
                        <span className='p-1'></span>
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
      arrayFields: {
        label: {
          type: "text",
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
        size: "full",
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
    formFields: [{ label: "label", size: "full" }],
    buttonLabel: "Send response",
    formRecipientEmail: "example@example.com",
  },
};
