import { Input } from "@components/misc/external/input";
import { Label } from "@components/misc/external/label";
import FormGroupForm from "@components/page/FormGroupForm";
import { ComponentConfig, WithId } from "@measured/puck";

export type FormGroupProps = {
  formFields: { label: string; size: number }[];
  buttonLabel: string;
  formRecipientEmail: string;
};

export function FormGroup({
  formFields,
  buttonLabel,
  id,
}: WithId<FormGroupProps>) {
  const groupedFields: { label: string; size: number }[][] = [];
  let tempRow: { label: string; size: number }[] = [];
  formFields.forEach((field, index) => {
    if (field.size === 0) {
      tempRow.push(field);
      if (tempRow.length === 2 || index === formFields.length - 1) {
        groupedFields.push(tempRow);
        tempRow = [];
      }
    } else {
      if (tempRow.length) {
        groupedFields.push(tempRow);
        tempRow = [];
      }
      groupedFields.push([field]);
    }
  });

  return (
    <FormGroupForm componentId={id}>
      <table>
        <thead>
          <tr>
            <th style={{ width: "50%" }}></th>
            <th style={{ width: "50%" }}></th>
          </tr>
        </thead>
        <tbody>
          {groupedFields.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((field, fieldIndex) => (
                <td
                  key={fieldIndex}
                  colSpan={field.size === 0 ? 1 : 2}
                  style={{ padding: "8px" }}
                >
                  <Label htmlFor={field.label}>{field.label}</Label>
                  <Input
                    id={field.label}
                    name={field.label}
                    placeholder={field.label}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>
              <button
                className='bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]'
                type='submit'
              >
                {buttonLabel}
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
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
          type: "number",
          min: 0,
          max: 1,
        },
      },
      defaultItemProps: {
        label: "label",
        size: 1,
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
    formFields: [{ label: "label", size: 1 }],
    buttonLabel: "Sign up",
    formRecipientEmail: "example@example.com",
  },
};
