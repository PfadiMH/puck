import { Input } from "@components/misc/external/input";
import { FormField } from "./FormGroup";

export function FormGroupRow({ row }: { row: FormField[] }) {
  return (
    <div className='flex'>
      {row.map((field, index) => (
        <span className='flex grow mt-2 mb-2' key={`field-${index}`}>
          <span className='flex grow'>
            <span
              className={`${field.size === "full" ? "flex-1" : "flex-1/2"} ${
                index === 0 ? "mr-2" : ""
              }`}
            >
              <label htmlFor={field.label}>{field.label}</label>
              <Input
                id={field.label}
                name={field.label}
                placeholder={field.placeholder}
                required={field.required}
                type={field.type}
              />
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
