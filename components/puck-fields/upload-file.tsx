import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { saveFile } from "@lib/storage/storage";
import { CustomField } from "@measured/puck";

type UploadFileProps = string | undefined;

function UploadFile({
  id,
  onChange,
  value,
}: CustomFieldRenderProps<UploadFileProps>) {
  const uploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const id = await saveFile(file, "a handsome image");
      onChange(id);
    }
  };

  return (
    <div className="p-[3px] relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(18,100%,50%)] to-[hsl(12,56%,54%)] rounded-lg" />
      <div className="px-8 py-2 bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
        <label className="text-white cursor-pointer" htmlFor="file-upload">
          Upload Images
        </label>
        <input
          id="file-upload"
          type="file"
          name="filefield"
          accept=".jpg, .jpeg, .png"
          multiple
          onChange={uploadFiles}
          className="hidden"
        />
      </div>
    </div>
  );
}

export const uploadFileField: CustomField<UploadFileProps> = {
  type: "custom",
  label: "Upload File",
  render: UploadFile,
};
