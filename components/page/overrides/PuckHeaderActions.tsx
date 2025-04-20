"use client";
import BackSvg from "@components/graphics/BackSvg";
import ForwardSvg from "@components/graphics/ForwardSvg";
import Button from "@components/ui/Button";
import { DialogRoot, DialogTrigger } from "@components/ui/Dialog";
import cn from "@lib/cn";
import { PageConfig } from "@lib/config/page.config";
import { deletePage, savePage } from "@lib/db/database";
import { queryClient } from "@lib/query-client";
import { usePuck } from "@measured/puck";
import { useRouter } from "next/navigation";
import ConfirmModal from "../admin/ConfirmModal";

type PuckHeaderActionsProps = {
  path: string;
};

function PuckHeaderActions({ path }: PuckHeaderActionsProps) {
  const router = useRouter();
  const {
    history: { back, forward, hasPast, hasFuture },
    appState: { data },
  } = usePuck<PageConfig>();

  const handleDelete = async () => {
    await deletePage(path);
    queryClient.invalidateQueries({ queryKey: ["pages"] });
  };

  const handlePublish = async () => {
    await savePage(path, data);
    queryClient.invalidateQueries({ queryKey: ["pages"] });
  };

  return (
    <div className="flex gap-4 items-center justify-between">
      <div className="flex gap-2">
        <button
          className={cn(
            "w-6 h-6 cursor-pointer opacity-50",
            hasPast && "opacity-100"
          )}
          onClick={back}
          disabled={!hasPast}
          aria-label="Back"
          title="Back"
        >
          <BackSvg />
        </button>
        <button
          className={cn(
            "w-6 h-6 cursor-pointer opacity-50",
            hasFuture && "opacity-100"
          )}
          onClick={forward}
          disabled={!hasFuture}
          aria-label="Forward"
          title="Forward"
        >
          <ForwardSvg />
        </button>
      </div>
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
      <Button onClick={handlePublish} color="primary" className="">
        Save Changes
      </Button>
    </div>
  );
}

export default PuckHeaderActions;
