import Button from "@components/ui/Button";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogTitle,
} from "@components/ui/Dialog";
import Input from "@components/ui/Input";
import {
  assignablePermissions,
  Permission,
  RoleMetadata,
} from "@lib/auth/permissions";
import { getSecurityConfig, saveSecurityConfig } from "@lib/db/database";
import { queryClient } from "@lib/query-client";
import { useState } from "react";

interface PermissionModalProps {
  roleName?: string;
  roleMetadata?: RoleMetadata;
  isEditing: boolean;
  isAdding?: boolean;
}

export function RoleModal({
  roleName: initialRoleName,
  roleMetadata: initialRoleMetadata,
  isEditing,
  isAdding,
}: PermissionModalProps) {
  const [roleName, setRoleName] = useState(initialRoleName || "");
  const [roleMetadata, setRoleMetadata] = useState(
    initialRoleMetadata || { description: "", permissions: [] }
  );

  const handlePermissionChange = (permission: Permission, checked: boolean) => {
    setRoleMetadata((prev) => {
      const newPermissions = checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter((p) => p !== permission);
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSave = async () => {
    const securityConfig = await getSecurityConfig();
    if (isAdding && roleName) {
      securityConfig.roles[roleName] = roleMetadata;
    } else if (roleName) {
      securityConfig.roles[roleName] = roleMetadata;
    }
    await saveSecurityConfig(securityConfig);
    queryClient.invalidateQueries({ queryKey: ["securityConfig"] });
  };

  return (
    <Dialog>
      <DialogTitle>
        Role {isEditing ? "Editor" : isAdding ? "Creator" : "Viewer"}
      </DialogTitle>
      <div className="flex-col flex gap-3">
        <p>Role name</p>
        <Input
          disabled={!isEditing && !isAdding}
          className="disabled:bg-primary/10 disabled:border-0"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="OFI-Leiter"
        />
        <p>Description</p>
        <Input
          disabled={!isEditing && !isAdding}
          className="disabled:bg-primary/10 disabled:border-0"
          value={roleMetadata.description}
          onChange={(e) =>
            setRoleMetadata((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          placeholder="Description"
        />
        <p>Perimissions</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {assignablePermissions.map((permission) => {
            const isAssigned = roleMetadata.permissions.includes(permission);
            return (
              <label
                key={permission}
                className="flex items-center gap-2.5 rounded bg-primary/20 p-3 data-[disabled=true]:bg-primary/10"
                data-disabled={!isEditing && !isAdding}
              >
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  checked={isAssigned}
                  onChange={(e) =>
                    handlePermissionChange(permission, e.target.checked)
                  }
                  className="appearance-none w-3.5 h-3.5 border border-primary/60 rounded-sm bg-transparent checked:bg-primary/60 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:border-primary/30 disabled:checked:bg-primary/30 shrink-0"
                />
                <span className="break-words">{permission}</span>
              </label>
            );
          })}
        </div>
      </div>
      <DialogActions>
        <DialogClose>
          <Button>{isEditing || isAdding ? "Cancel" : "Close"}</Button>
        </DialogClose>
        <DialogClose>
          {(isEditing || isAdding) && (
            <Button color="primary" onClick={handleSave}>
              Confirm
            </Button>
          )}
        </DialogClose>
      </DialogActions>
    </Dialog>
  );
}
