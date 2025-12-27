import { PermissionGuard } from "@components/auth/PermissionGuard";
import Button from "@components/ui/Button";
import { DialogRoot, DialogTrigger } from "@components/ui/Dialog";
import { TableCell, TableRow } from "@components/ui/Table";
import { RoleMetadata } from "@lib/auth/permissions";
import { useHasPermission } from "@lib/auth/use-has-permission";
import { getSecurityConfig, saveSecurityConfig } from "@lib/db/database";
import { queryClient } from "@lib/query-client";
import ConfirmModal from "../admin/ConfirmModal";
import { RoleModal } from "./RoleModal";

type RoleRowProps = {
  roleName: string;
  roleMetadata: RoleMetadata;
  variant?: "table" | "card";
};

function RoleRow({ roleName, roleMetadata, variant = "table" }: RoleRowProps) {
  const handleDelete = async () => {
    const securityConfig = await getSecurityConfig();
    delete securityConfig.roles[roleName];
    await saveSecurityConfig(securityConfig);
    queryClient.invalidateQueries({ queryKey: ["securityConfig"] });
  };

  const canEdit = useHasPermission(["role-permissions:update"]);

  if (variant === "table") {
    return (
      <TableRow key={roleName}>
        <TableCell className="font-bold text-lg text-primary">
          {roleName}
        </TableCell>
        <TableCell className="max-w-md truncate opacity-80 text-sm">
          {roleMetadata.description}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-3">
            <DialogRoot>
              <DialogTrigger>
                <Button size="small" color={canEdit ? "primary" : "secondary"}>
                  {canEdit ? "Edit" : "View permissions"}
                </Button>
              </DialogTrigger>
              <RoleModal
                isEditing={canEdit}
                roleMetadata={roleMetadata}
                roleName={roleName}
              />
            </DialogRoot>

            <PermissionGuard permissions={["role-permissions:update"]}>
              <DialogRoot>
                <DialogTrigger>
                  <button className="p-1 px-3 text-xs font-bold uppercase rounded border border-red-500/40 text-red-500/80 hover:bg-red-500/10 transition-colors">
                    Delete
                  </button>
                </DialogTrigger>
                <ConfirmModal
                  title="Delete Role"
                  message={`Are you sure you want to delete the role "${roleName}"? This action cannot be undone.`}
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
            {roleName}
          </h3>
          <p className="text-sm opacity-70 line-clamp-2">
            {roleMetadata.description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <DialogRoot>
          <DialogTrigger>
            <Button
              size="small"
              color={canEdit ? "primary" : "secondary"}
              className="flex-1"
            >
              {canEdit ? "Edit" : "View"}
            </Button>
          </DialogTrigger>
          <RoleModal
            isEditing={canEdit}
            roleMetadata={roleMetadata}
            roleName={roleName}
          />
        </DialogRoot>

        <PermissionGuard permissions={["role-permissions:update"]}>
          <DialogRoot>
            <DialogTrigger>
              <button className="h-8 px-4 text-xs font-bold uppercase rounded border border-red-500/40 text-red-500/80 hover:bg-red-500/10 transition-colors">
                Delete
              </button>
            </DialogTrigger>
            <ConfirmModal
              title="Delete Role"
              message={`Are you sure you want to delete the role "${roleName}"? This action cannot be undone.`}
              onConfirm={handleDelete}
            />
          </DialogRoot>
        </PermissionGuard>
      </div>
    </div>
  );
}

export default RoleRow;
