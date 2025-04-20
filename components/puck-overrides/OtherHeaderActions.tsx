"use client";
import Button from "@components/ui/Button";
import { Config, usePuck, UserGenerics } from "@measured/puck";
import { useRouter } from "next/navigation";
import UndoRedoButtons from "./UndoRedoButtons";

type OtherHeaderActionsProps<UserConfig extends Config> = {
  onPublish?: (data: UserGenerics<UserConfig>["UserData"]) => void;
};

function OtherHeaderActions<UserConfig extends Config>({
  onPublish,
}: OtherHeaderActionsProps<UserConfig>) {
  const router = useRouter();
  const {
    appState: { data },
  } = usePuck<UserConfig>();

  const handlePublish = async () => onPublish && (await onPublish(data));

  return (
    <div className="flex gap-4 items-center justify-between">
      <UndoRedoButtons />

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => router.push("/admin")}
          color="secondary"
          size="small"
        >
          To Admin
        </Button>
      </div>

      <Button onClick={handlePublish} color="primary" className="">
        Save Changes
      </Button>
    </div>
  );
}

export default OtherHeaderActions;
