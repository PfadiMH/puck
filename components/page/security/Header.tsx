"use client";

import { PermissionGuard } from "@components/security/PermissionGuard";
import Button from "@components/ui/Button";
import { useRouter } from "next/navigation";
import { RoleModal } from "./RoleModal";

function Header() {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2 justify-between mb-4">
      <h1>SECURITY MANAGER</h1>
      <div className="flex flex-wrap gap-4">
        <Button size="medium" onClick={() => router.push("/admin")}>
          Back to Admin
        </Button>

        <PermissionGuard permissions={["role-permissions:update"]}>
          <RoleModal
            mode="add"
            trigger={<Button color="primary">Add Role</Button>}
          />
        </PermissionGuard>
      </div>
    </div>
  );
}

export default Header;
