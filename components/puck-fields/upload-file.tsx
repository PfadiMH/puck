import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { Upload } from "lucide-react";
import { CustomField } from "@measured/puck";

type UploadFileProps = string | undefined;

function UploadFile({
  id,
  onChange,
  value,
}: CustomFieldRenderProps<UploadFileProps>) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 900 * 1024) {
        alert("File size exceeds 900KB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
      <input type="file" className="hidden" id={id} onChange={handleChange} />
      <label
        htmlFor={id}
        className="flex flex-col items-center justify-center w-full h-full"
      >
        <Upload className="w-12 h-12 text-gray-400" />
        <span className="mt-2 text-sm text-gray-600">
          Drag & drop or click to upload
        </span>
      </label>
      {value && (
        <div className="mt-4">
          <img
            src={value}
            alt="Uploaded file"
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}
    </div>
  );
}

export const uploadFileField: CustomField<UploadFileProps> = {
  type: "custom",
  label: "Upload File",
  render: UploadFile,
};
