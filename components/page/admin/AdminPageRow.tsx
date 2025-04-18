"use client";
import Button from "@components/ui/Button";
import { useRouter } from "next/navigation";

type AdminPageRowProps = {
  page: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function AdminPageRow({ page, onDelete, onEdit, onView }: AdminPageRowProps) {
  const router = useRouter();

  return (
    <div
      key={page}
      className="border-2 rounded-xl border-primary p-4 flex justify-between"
    >
      <div>{page}</div>
      <div className="flex flex-wrap gap-3 justify-end">
        <Button size="small" onClick={onView}>
          View
        </Button>
        <Button size="small" onClick={onEdit}>
          Edit
        </Button>
        <Button size="small" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export default AdminPageRow;
