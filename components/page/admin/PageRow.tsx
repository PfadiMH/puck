import { PermissionGuard } from "@components/security/PermissionGuard";
import Button from "@components/ui/Button";
import { DialogRoot, DialogTrigger } from "@components/ui/Dialog";
import { TableCell, TableRow } from "@components/ui/Table";
import { deletePage } from "@lib/db/db-actions";
import { queryClient } from "@lib/query-client";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

type PageRowProps = {
  page: string;
  variant?: "table" | "card";
};

function PageRow({ page, variant = "table" }: PageRowProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/editor${page}`);
  };

  const handleView = () => {
    router.push(page);
  };

  const handleDelete = async () => {
    await deletePage(page);
    queryClient.invalidateQueries({ queryKey: ["pages"] });
  };

  if (variant === "table") {
    return (
      <TableRow>
        <TableCell className="font-medium text-primary">{page}</TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-3">
            <Button size="small" color="primary" onClick={handleView}>
              View
            </Button>
            <PermissionGuard policy={{ all: ["page:update"] }}>
              <Button size="small" onClick={handleEdit}>
                Edit
              </Button>
            </PermissionGuard>
            <PermissionGuard policy={{ all: ["page:delete"] }}>
              <DialogRoot>
                <DialogTrigger>
                  <button type="button" className="p-1 px-3 text-xs font-bold uppercase rounded border border-red-500/40 text-red-500/80 hover:bg-red-500/10 transition-colors">
                    Delete
                  </button>
                </DialogTrigger>
                <ConfirmModal
                  title="Delete Page"
                  message="Are you sure you want to delete this page?"
                  onConfirm={handleDelete}
                />
              </DialogRoot>
            </PermissionGuard>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  // Card variant for mobile
  return (
    <div className="flex flex-col gap-3 p-4 bg-elevated/20 border-b border-primary/10 last:border-0 hover:bg-elevated/30 transition-colors">
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-bold text-lg text-primary truncate">{page}</h3>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-1">
        <Button
          size="small"
          color="primary"
          onClick={handleView}
          className="flex-1"
        >
          View
        </Button>
        <PermissionGuard policy={{ all: ["page:update"] }}>
          <Button size="small" onClick={handleEdit} className="flex-1">
            Edit
          </Button>
        </PermissionGuard>
        <PermissionGuard policy={{ all: ["page:delete"] }}>
          <DialogRoot>
            <DialogTrigger>
              <button type="button" className="h-8 px-4 text-xs font-bold uppercase rounded border border-red-500/40 text-red-500/80 hover:bg-red-500/10 transition-colors">
                Delete
              </button>
            </DialogTrigger>
            <ConfirmModal
              title="Delete Page"
              message="Are you sure you want to delete this page?"
              onConfirm={handleDelete}
            />
          </DialogRoot>
        </PermissionGuard>
      </div>
    </div>
  );
}

export default PageRow;
