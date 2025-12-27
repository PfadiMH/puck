"use client";
import Button from "@components/ui/Button";
import { DialogRoot, DialogTrigger } from "@components/ui/Dialog";
import { hasAnyPermissionEvaluator } from "@lib/auth/auth-functions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RoleModal } from "./RoleModal";

function Header() {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-between mb-4">
      <h1>ACCESS MANAGMENT</h1>
      <div className="flex flex-wrap gap-4">
        <Button size="medium" onClick={() => router.push("/admin")}>
          Back to Admin
        </Button>

        {hasAnyPermissionEvaluator(session, "role-permissions:update") && (
          <DialogRoot>
            <DialogTrigger>
              <Button color="primary">Add Role</Button>
            </DialogTrigger>
            <RoleModal isEditing={false} isAdding={true} />
          </DialogRoot>
        )}
      </div>
    </div>
  );
}

export default Header;
