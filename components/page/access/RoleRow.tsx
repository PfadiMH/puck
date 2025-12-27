import Button from "@components/ui/Button";
import { DialogRoot, DialogTrigger } from "@components/ui/Dialog";
import { TableCell, TableRow } from "@components/ui/Table";
import { hasAnyPermissionEvaluator } from "@lib/auth/auth-functions";
import { RoleMetadata } from "@lib/auth/permissions";
import { getSecurityConfig, saveSecurityConfig } from "@lib/db/database";
import { queryClient } from "@lib/query-client";
import { useSession } from "next-auth/react";
import ConfirmModal from "../admin/ConfirmModal";
import { RoleModal } from "./RoleModal";

type RoleRowProps = {
  roleName: string;
  roleMetadata: RoleMetadata;
};

function RoleRow({ roleName, roleMetadata }: RoleRowProps) {
  const { data: session } = useSession();
  const handleDelete = async () => {
    const securityConfig = await getSecurityConfig();
    delete securityConfig.roles[roleName];
    await saveSecurityConfig(securityConfig);
    queryClient.invalidateQueries({ queryKey: ["securityConfig"] });
  };

  return (
    <TableRow key={roleName}>
      <TableCell>{roleName}</TableCell>
      <TableCell>{roleMetadata.description}</TableCell>
      <TableCell className="flex flex-wrap gap-3 justify-end">
        {session && hasAnyPermissionEvaluator(session, "role-permissions:update") && (
          <>
            <DialogRoot>
              <DialogTrigger>
                <Button size="small">Delete</Button>
              </DialogTrigger>
              <ConfirmModal
                title="Delete Role"
                message="Are you sure you want to delete this role?"
                onConfirm={handleDelete}
              />
            </DialogRoot>
            <DialogRoot>
              <DialogTrigger>
                <Button size="small">Edit</Button>
              </DialogTrigger>
              <RoleModal
                isEditing={true}
                roleMetadata={roleMetadata}
                roleName={roleName}
              />
            </DialogRoot>
          </>
        )}
        <DialogRoot>
          <DialogTrigger>
            <Button size="small" color="primary">
              View Permissions
            </Button>
          </DialogTrigger>
          <RoleModal
            isEditing={false}
            roleMetadata={roleMetadata}
            roleName={roleName}
          />
        </DialogRoot>
      </TableCell>
    </TableRow>
  );
}

export default RoleRow;
