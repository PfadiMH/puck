"use client";

import { PermissionGuard } from "@components/security/PermissionGuard";
import Button from "@components/ui/Button";
import { useRouter } from "next/navigation";
import { RoleModal } from "./RoleModal";

/**
 * Renders the header for the Security Manager UI with navigation and role-management controls.
 *
 * The header shows the "SECURITY MANAGER" title, a "Back to Admin" button that navigates to "/admin",
 * and an "Add Role" action button that opens a role creation modal when the current user satisfies
 * the policy requiring `role-permissions:update`.
 *
 * @returns The header React element containing the title and action controls.
 */
function Header() {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2 justify-between mb-4">
      <h1>SECURITY MANAGER</h1>
      <div className="flex flex-wrap gap-4">
        <Button size="medium" onClick={() => router.push("/admin")}>
          Back to Admin
        </Button>

        <PermissionGuard policy={{ all: ["role-permissions:update"] }}>
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