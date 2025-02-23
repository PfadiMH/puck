import { CustomField } from "@measured/puck";

export const uploadFile: CustomField = {
  type: "custom",
  label: "Upload File",
  render: (props: {
    field: CustomField<{}>;
    name: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
  }) => {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
        <input
          type="file"
          className="hidden"
          id={props.id}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 900 * 1024) {
                alert("File size exceeds 900KB");
                return;
              }
              const reader = new FileReader();
              reader.onload = () => {
                props.onChange(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <label htmlFor={props.id} className="flex flex-col items-center justify-center w-full h-full">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 7l6 6m0 0l6-6m-6 6V3"
            ></path>
          </svg>
          <span className="mt-2 text-sm text-gray-600">Drag & drop or click to upload</span>
        </label>
        {props.value && (
          <div className="mt-4">
            <img src={props.value} alt="Uploaded file" className="max-w-full h-auto rounded-lg" />
          </div>
        )}
      </div>
    );
  },
};
