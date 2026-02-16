import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { Upload, X } from "lucide-react";
import { CustomField } from "@puckeditor/core";

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
        <div style={{ marginTop: "16px", position: "relative" }}>
          <img
            src={value}
            alt="Uploaded file"
            className="max-w-full h-auto rounded-lg"
          />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              backgroundColor: "#6b7280",
              color: "white",
              borderRadius: "50%",
              padding: "4px",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Remove image"
          >
            <X style={{ width: "16px", height: "16px" }} />
          </button>
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
