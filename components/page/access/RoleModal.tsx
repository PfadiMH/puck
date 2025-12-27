import Button from "@components/ui/Button";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogTitle,
} from "@components/ui/Dialog";
import Input from "@components/ui/Input";
import {
  Permission,
  RoleMetadata
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

  const permissionGroups = {
    System: ["admin-ui:read"],
    Content: ["page:create", "page:update", "page:delete"],
    Assets: ["asset:create", "asset:update", "asset:delete"],
    Roles: ["role-permissions:read", "role-permissions:update"],
    Navigation: ["navbar:update", "footer:update"],
    Global: ["global-admin"],
  } as const;

  const toggleGroup = (permissions: Permission[], checked: boolean) => {
    setRoleMetadata((prev) => {
      let newPermissions = [...prev.permissions];
      if (checked) {
        permissions.forEach((p) => {
          if (!newPermissions.includes(p)) newPermissions.push(p);
        });
      } else {
        newPermissions = newPermissions.filter((p) => !permissions.includes(p));
      }
      return { ...prev, permissions: newPermissions };
    });
  };

  return (
    <Dialog className="sm:max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <DialogTitle>
          Role {isEditing ? "Editor" : isAdding ? "Creator" : "Viewer"}
        </DialogTitle>
        <DialogClose>
          <button className="text-contrast-ground/60 hover:text-contrast-ground transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </DialogClose>
      </div>

      <div className="flex-col flex gap-4 max-h-[70vh] overflow-y-auto pr-2 
        scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent 
        hover:scrollbar-thumb-primary/60 transition-colors">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold uppercase opacity-60">Role Name</label>
            <Input
              disabled={!isEditing && !isAdding}
              className="disabled:bg-primary/10 disabled:border-0"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="OFI-Leiter"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold uppercase opacity-60">Description</label>
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
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-bold uppercase opacity-60 border-b border-primary/20 pb-1">Permissions</label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
            {Object.entries(permissionGroups).map(([group, permissions]) => {
              const allSelected = permissions.every((p) =>
                roleMetadata.permissions.includes(p as Permission)
              );
              const someSelected = permissions.some((p) =>
                roleMetadata.permissions.includes(p as Permission)
              );

              return (
                <div key={group} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center bg-primary/10 px-3 py-1.5 rounded-t-lg border-b border-primary/20">
                    <span className="font-rockingsoda text-xl">{group}</span>
                    {(isEditing || isAdding) && (
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold uppercase hover:text-primary transition-colors">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = someSelected && !allSelected;
                          }}
                          onChange={(e) => toggleGroup(permissions as unknown as Permission[], e.target.checked)}
                          className="w-3 h-3 appearance-none border border-primary/60 rounded-sm checked:bg-primary/60 indeterminate:bg-primary/40 focus:outline-none"
                        />
                        Select All
                      </label>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {permissions.map((permission) => {
                      const isAssigned = roleMetadata.permissions.includes(permission as Permission);
                      return (
                        <label
                          key={permission}
                          className="flex items-center gap-2.5 rounded bg-primary/5 p-2 px-3 border border-primary/10 hover:bg-primary/10 transition-colors cursor-pointer data-[disabled=true]:cursor-default data-[disabled=true]:opacity-70"
                          data-disabled={!isEditing && !isAdding}
                        >
                          <input
                            type="checkbox"
                            disabled={!isEditing && !isAdding}
                            checked={isAssigned}
                            onChange={(e) =>
                              handlePermissionChange(permission as Permission, e.target.checked)
                            }
                            className="appearance-none w-3.5 h-3.5 border border-primary/60 rounded-sm bg-transparent checked:bg-primary/60 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:border-primary/30 disabled:checked:bg-primary/30 shrink-0"
                          />
                          <span className="text-sm truncate">{permission}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <DialogActions>
        <DialogClose>
          <Button>{isEditing || isAdding ? "Cancel" : "Close"}</Button>
        </DialogClose>
        {(isEditing || isAdding) && (
          <DialogClose>
            <Button color="primary" onClick={handleSave}>
              Confirm
            </Button>
          </DialogClose>
        )}
      </DialogActions>
    </Dialog>
  );
}
