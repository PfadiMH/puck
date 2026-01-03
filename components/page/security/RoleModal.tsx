import Button from "@components/ui/Button";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/Dialog";
import Input from "@components/ui/Input";
import { toast } from "@components/ui/Toast";
import { getSecurityConfig, saveSecurityConfig } from "@lib/db/database";
import { queryClient } from "@lib/query-client";
import {
  Permission,
  Role
} from "@lib/security/permissions";
import { useEffect, useState } from "react";

interface PermissionModalProps {
  role?: Role;
  mode: "add" | "edit" | "view";
  trigger: React.ReactNode;
}

const MODE_CONFIG = {
  add: {
    title: "Creator",
    isReadOnly: false,
    cancelLabel: "Cancel",
    showSave: true,
  },
  edit: {
    title: "Editor",
    isReadOnly: false,
    cancelLabel: "Cancel",
    showSave: true,
  },
  view: {
    title: "Viewer",
    isReadOnly: true,
    cancelLabel: "Close",
    showSave: false,
  },
} as const;

export function RoleModal({
  role: initialRole,
  mode,
  trigger,
}: PermissionModalProps) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role>(
    initialRole || { name: "", description: "", permissions: [] }
  );

  const config = MODE_CONFIG[mode];

  useEffect(() => {
    if (open) {
      setRole(initialRole || { name: "", description: "", permissions: [] });
    }
  }, [open, initialRole]);

  const handlePermissionChange = (permission: Permission, checked: boolean) => {
    setRole((prev) => {
      const newPermissions = checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter((p) => p !== permission);
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSave = async () => {
    try {
      const securityConfig = await getSecurityConfig();
      const existingIndex = securityConfig.roles.findIndex((r) => r.name === role.name);

      if (existingIndex > -1) {
        securityConfig.roles[existingIndex] = role;
      } else {
        securityConfig.roles.push(role);
      }

      await saveSecurityConfig(securityConfig);
      queryClient.invalidateQueries({ queryKey: ["securityConfig"] });
      setOpen(false);
      toast.success("Role saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save role");
    }
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
    setRole((prev) => {
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
    <DialogRoot open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger}
      </DialogTrigger>
      <Dialog className="sm:max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <DialogTitle>
            Role {config.title}
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
                disabled={config.isReadOnly}
                className="disabled:bg-primary/10 disabled:border-0"
                value={role.name}
                onChange={(e) => setRole((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="OFI-Leiter"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold uppercase opacity-60">Description</label>
              <Input
                disabled={config.isReadOnly}
                className="disabled:bg-primary/10 disabled:border-0"
                value={role.description}
                onChange={(e) =>
                  setRole((prev) => ({
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
                  role.permissions.includes(p as Permission)
                );
                const someSelected = permissions.some((p) =>
                  role.permissions.includes(p as Permission)
                );

                return (
                  <div key={group} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center bg-primary/10 px-3 py-1.5 rounded-t-lg border-b border-primary/20">
                      <span className="font-rockingsoda text-xl">{group}</span>
                      {!config.isReadOnly && (
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold uppercase hover:text-primary transition-colors">
                          <div className="relative flex items-center justify-center w-3 h-3">
                            <input
                              type="checkbox"
                              checked={allSelected}
                              ref={(el) => {
                                if (el) el.indeterminate = someSelected && !allSelected;
                              }}
                              onChange={(e) => toggleGroup(permissions as unknown as Permission[], e.target.checked)}
                              className="peer w-3 h-3 appearance-none border border-primary/60 rounded-sm checked:bg-primary/60 indeterminate:bg-primary/40 focus:outline-none"
                            />
                            <svg
                              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="4"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-0.5 bg-white opacity-0 peer-indeterminate:opacity-100 transition-opacity rounded-full" />
                          </div>
                          Select All
                        </label>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {permissions.map((permission) => {
                        const isAssigned = role.permissions.includes(permission as Permission);
                        return (
                          <label
                            key={permission}
                            className="flex items-center gap-2.5 rounded bg-primary/5 p-2 px-3 border border-primary/10 hover:bg-primary/10 transition-colors cursor-pointer data-[disabled=true]:cursor-default data-[disabled=true]:opacity-70"
                            data-disabled={config.isReadOnly}
                          >
                            <div className="relative flex items-center justify-center w-3.5 h-3.5 shrink-0">
                              <input
                                type="checkbox"
                                disabled={config.isReadOnly}
                                checked={isAssigned}
                                onChange={(e) =>
                                  handlePermissionChange(permission as Permission, e.target.checked)
                                }
                                className="peer appearance-none w-3.5 h-3.5 border border-primary/60 rounded-sm bg-transparent checked:bg-primary/60 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:border-primary/30 disabled:checked:bg-primary/30 shrink-0"
                              />
                              <svg
                                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="4"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
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
            <Button>{config.cancelLabel}</Button>
          </DialogClose>
          {config.showSave && (
            <Button color="primary" onClick={handleSave}>
              Confirm
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </DialogRoot>
  );
}
