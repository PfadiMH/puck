"use client";

import { PermissionGuard } from "@components/auth/PermissionGuard";
import Button from "@components/ui/Button";
import { DialogRoot, DialogTrigger } from "@components/ui/Dialog";
import { useRouter } from "next/navigation";
import { RoleModal } from "./RoleModal";

function Header() {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2 justify-between mb-4">
      <h1>ACCESS MANAGMENT</h1>
      <div className="flex flex-wrap gap-4">
        <Button size="medium" onClick={() => router.push("/admin")}>
          Back to Admin
        </Button>

        <PermissionGuard permissions={["role-permissions:update"]}>
          <DialogRoot>
            <DialogTrigger>
              <Button color="primary">Add Role</Button>
            </DialogTrigger>
            <RoleModal isEditing={true} isAdding={true} />
          </DialogRoot>
        </PermissionGuard>
      </div>
    </div>
  );
}

export default Header;
