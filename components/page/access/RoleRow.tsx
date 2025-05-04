import Button from "@components/ui/Button";
import { DialogRoot, DialogTrigger } from "@components/ui/Dialog";
import { TableCell, TableRow } from "@components/ui/Table";
import { RoleMetadata } from "@lib/auth/permissions";
import ConfirmModal from "../admin/ConfirmModal";
import { RoleModal } from "./RoleModal";

type RoleRowProps = {
  roleName: string;
  roleMetadata: RoleMetadata;
};

function RoleRow({ roleName, roleMetadata }: RoleRowProps) {
  return (
    <TableRow key={roleName}>
      <TableCell>{roleName}</TableCell>
      <TableCell>{roleMetadata.description}</TableCell>
      <TableCell className="flex flex-wrap gap-3 justify-end">
        <DialogRoot>
          <DialogTrigger>
            <Button size="small">Delete</Button>
          </DialogTrigger>
          <ConfirmModal
            title="Delete Role"
            message="Are you sure you want to delete this role?"
          />
        </DialogRoot>
        <Button size="small">Edit</Button>
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
