import { PermissionGuard } from "@components/security/PermissionGuard";
import Button from "@components/ui/Button";
import { DialogRoot, DialogTrigger } from "@components/ui/Dialog";
import { TableCell, TableRow } from "@components/ui/Table";
import { Role } from "@lib/security/permissions";
import { useHasPermission } from "@lib/security/use-permission";
import { getSecurityConfig, saveSecurityConfig } from "@lib/db/database";
import { queryClient } from "@lib/query-client";
import ConfirmModal from "../admin/ConfirmModal";
import { RoleModal } from "./RoleModal";

type RoleRowProps = {
  role: Role;
  variant?: "table" | "card";
};

function RoleRow({ role, variant = "table" }: RoleRowProps) {
  const handleDelete = async () => {
    const securityConfig = await getSecurityConfig();
    securityConfig.roles = securityConfig.roles.filter((r) => r.name !== role.name);
    await saveSecurityConfig(securityConfig);
    queryClient.invalidateQueries({ queryKey: ["securityConfig"] });
  };

  const canEdit = useHasPermission(["role-permissions:update"]);

  if (variant === "table") {
    return (
      <TableRow key={role.name}>
        <TableCell className="font-bold text-lg text-primary">
          {role.name}
        </TableCell>
        <TableCell className="max-w-md truncate opacity-80 text-sm">
          {role.description}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-3">
            <RoleModal
              mode={canEdit ? "edit" : "view"}
              role={role}
              trigger={
                <Button size="small" color={canEdit ? "primary" : "secondary"}>
                  {canEdit ? "Edit" : "View permissions"}
                </Button>
              }
            />

            <PermissionGuard permissions={["role-permissions:update"]}>
              <DialogRoot>
                <DialogTrigger>
                  <button className="p-1 px-3 text-xs font-bold uppercase rounded border border-red-500/40 text-red-500/80 hover:bg-red-500/10 transition-colors">
                    Delete
                  </button>
                </DialogTrigger>
                <ConfirmModal
                  title="Delete Role"
                  message={`Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`}
                  onConfirm={handleDelete}
                />
              </DialogRoot>
            </PermissionGuard>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-elevated/20 border-b border-primary/10 last:border-0 hover:bg-elevated/30 transition-colors">
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-bold text-xl text-primary truncate">
            {role.name}
          </h3>
          <p className="text-sm opacity-70 line-clamp-2">
            {role.description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <RoleModal
          mode={canEdit ? "edit" : "view"}
          role={role}
          trigger={
            <Button
              size="small"
              color={canEdit ? "primary" : "secondary"}
              className="flex-1"
            >
              {canEdit ? "Edit" : "View"}
            </Button>
          }
        />

        <PermissionGuard permissions={["role-permissions:update"]}>
          <DialogRoot>
            <DialogTrigger>
              <button className="h-8 px-4 text-xs font-bold uppercase rounded border border-red-500/40 text-red-500/80 hover:bg-red-500/10 transition-colors">
                Delete
              </button>
            </DialogTrigger>
            <ConfirmModal
              title="Delete Role"
              message={`Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`}
              onConfirm={handleDelete}
            />
          </DialogRoot>
        </PermissionGuard>
      </div>
    </div>
  );
}

export default RoleRow;
