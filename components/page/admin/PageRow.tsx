import Button from "@components/ui/Button";
import { DialogRoot, DialogTrigger } from "@components/ui/Dialog";
import { TableCell, TableRow } from "@components/ui/Table";
import { hasAnyPermissionEvaluator } from "@lib/auth/auth-functions";
import { deletePage } from "@lib/db/database";
import { queryClient } from "@lib/query-client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

type PageRowProps = {
  page: string;
};

function PageRow({ page }: PageRowProps) {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session) return null;

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

  return (
    <TableRow>
      <TableCell>{page}</TableCell>
      <TableCell className="flex flex-wrap gap-3 justify-end">
        {hasAnyPermissionEvaluator(session, "page:delete") && (
          <DialogRoot>
            <DialogTrigger>
              <Button size="small">Delete</Button>
            </DialogTrigger>

            <ConfirmModal
              title="Delete Page"
              message="Are you sure you want to delete this page?"
              onConfirm={handleDelete}
            />
          </DialogRoot>
        )}
        {hasAnyPermissionEvaluator(session, "page:update") && (
          <Button size="small" onClick={handleEdit}>
            Edit
          </Button>
        )}
        <Button size="small" color="primary" onClick={handleView}>
          View
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default PageRow;
