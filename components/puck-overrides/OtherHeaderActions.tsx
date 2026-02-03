"use client";
import Button from "@components/ui/Button";
import { toast } from "@components/ui/Toast";
import { Config, usePuck, UserGenerics } from "@puckeditor/core";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import UndoRedoButtons from "./UndoRedoButtons";

type OtherHeaderActionsProps<UserConfig extends Config> = {
  saveData: (data: UserGenerics<UserConfig>["UserData"]) => Promise<void>;
};

function OtherHeaderActions<UserConfig extends Config>({
  saveData,
}: OtherHeaderActionsProps<UserConfig>) {
  const router = useRouter();
  const {
    appState: { data },
  } = usePuck<UserConfig>();

  const { mutate: saveMutation, isPending } = useMutation({
    mutationFn: saveData,
    onSuccess: () => toast("Saved successfully"),
  });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
      {/* Undo/Redo - Hidden on mobile in collapsed menu, shown on desktop */}
      <div className="hidden sm:block">
        <UndoRedoButtons />
      </div>

      {/* Action buttons - Stack on mobile, row on desktop */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          onClick={() => router.push("/admin")}
          color="secondary"
          size="small"
          className="w-full sm:w-auto"
        >
          To Admin
        </Button>
      </div>

      {/* Save button - Full width on mobile, auto on desktop */}
      <Button
        onClick={() => saveMutation(data)}
        color="primary"
        className="flex gap-2 items-center justify-center w-full sm:w-auto"
        disabled={isPending}
      >
        Save Changes
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
      </Button>
    </div>
  );
}

export default OtherHeaderActions;
