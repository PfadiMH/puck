"use client";
import Button from "@components/ui/Button";
import { DialogRoot, DialogTrigger } from "@components/ui/Dialog";
import { toast } from "@components/ui/Toast";
import { PageConfig } from "@lib/config/page.config";
import { deletePage, savePage } from "@lib/db/db-actions";
import { queryClient } from "@lib/query-client";
import { usePuck } from "@measured/puck";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmModal from "../page/admin/ConfirmModal";
import UndoRedoButtons from "./UndoRedoButtons";

type PageHeaderActionsProps = {
  path: string;
};

function PageHeaderActions({ path }: PageHeaderActionsProps) {
  const router = useRouter();
  const {
    appState: { data },
  } = usePuck<PageConfig>();

  const handleDelete = async () => {
    await deletePage(path);
    queryClient.invalidateQueries({ queryKey: ["pages"] });
  };

  const { mutate: savePageMutation, isPending } = useMutation({
    mutationFn: async () => {
      await savePage(path, data);
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
    onSuccess: () => toast("Page saved successfully"),
  });

  return (
    <div className="flex gap-4 items-center justify-between">
      <UndoRedoButtons />

      <div className="flex flex-wrap gap-2">
        <DialogRoot>
          <DialogTrigger>
            <Button color="secondary" size="small">
              Delete
            </Button>
          </DialogTrigger>

          <ConfirmModal
            title="Delete Page"
            message="Are you sure you want to delete this page?"
            onConfirm={handleDelete}
          />
        </DialogRoot>

        <Button
          onClick={() => router.push("/admin")}
          color="secondary"
          size="small"
        >
          To Admin
        </Button>

        <Button
          onClick={() => router.push(path)}
          color="secondary"
          size="small"
        >
          View Page
        </Button>
      </div>
      <Button
        onClick={() => savePageMutation()}
        color="primary"
        className="flex gap-2 items-center"
        disabled={isPending}
      >
        Save Changes
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
      </Button>
    </div>
  );
}

export default PageHeaderActions;
