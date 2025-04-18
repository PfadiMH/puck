"use client";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AddPageModalProps = {
  onClose: () => void;
};

function AddPageModal({ onClose }: AddPageModalProps) {
  const [newPagePath, setNewPagePath] = useState("");
  const router = useRouter();

  const handleCreate = () => {
    if (newPagePath.trim() !== "") {
      router.push(`/admin/editor/${newPagePath.trim()}`);
      onClose();
    } else {
      alert("Please enter a page name.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50">
      <div className="bg-elevated p-6 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Add New Page</h2>
        <Input
          type="text"
          placeholder="Enter new page path"
          className="w-full mb-4"
          value={newPagePath}
          onChange={(e) => setNewPagePath(e.target.value)}
        />
        <div className="flex flex-wrap justify-end gap-4">
          <Button size="small" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" size="small" onClick={handleCreate}>
            Create Page
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddPageModal;
