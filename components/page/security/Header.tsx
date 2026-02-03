"use client";

import { PermissionGuard } from "@components/security/PermissionGuard";
import Button from "@components/ui/Button";
import { useRouter } from "next/navigation";
import { RoleModal } from "./RoleModal";

function Header() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <h1 className="text-2xl md:text-3xl font-bold">Security Manager</h1>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
        <Button
          size="medium"
          onClick={() => router.push("/admin")}
          className="w-full sm:w-auto"
        >
          Back to Admin
        </Button>

        <PermissionGuard policy={{ all: ["role-permissions:update"] }}>
          <RoleModal
            mode="add"
            trigger={
              <Button color="primary" className="w-full sm:w-auto">
                Add Role
              </Button>
            }
          />
        </PermissionGuard>
      </div>
    </div>
  );
}

export default Header;
