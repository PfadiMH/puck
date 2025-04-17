"use client";
import Button from "@components/ui/Button";
import { useRouter } from "next/navigation";

type AdminHeaderActionsProps = {
  onClickAddPage: () => void;
};

function AdminHeaderActions({ onClickAddPage }: AdminHeaderActionsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2 justify-between mb-4">
      <h1>Leitereberiich</h1>
      <div className="flex flex-wrap gap-4">
        <div className="grid grid-rows-2 gap-2">
          <Button size="small" onClick={() => router.push("/admin/navbar")}>
            Navbar
          </Button>
          <Button size="small" onClick={() => router.push("/admin/footer")}>
            Footer
          </Button>
        </div>
        <Button onClick={onClickAddPage}>Add Page</Button>
      </div>
    </div>
  );
}

export default AdminHeaderActions;
