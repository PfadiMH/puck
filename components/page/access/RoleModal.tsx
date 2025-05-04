import Button from "@components/ui/Button";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogTitle,
} from "@components/ui/Dialog";
import Input from "@components/ui/Input";
import { assignablePermissions, RoleMetadata } from "@lib/auth/permissions";

type PermissionModalProps = {
  roleName: string;
  roleMetadata: RoleMetadata;
  isEditing: boolean;
};

export function RoleModal({
  roleMetadata,
  isEditing,
  roleName,
}: PermissionModalProps) {
  const assignablePermissions1 = assignablePermissions;
  return (
    <Dialog>
      <DialogTitle>Role {isEditing ? "Editor" : "Viewer"}</DialogTitle>
      <div className="flex-col flex gap-3">
        <p>Role name</p>
        <Input
          disabled={!isEditing}
          className="disabled:bg-primary/10 disabled:border-0"
          value={roleName}
          placeholder="OFI-Leiter"
        />
        <p>Description</p>
        <Input
          disabled={!isEditing}
          className="disabled:bg-primary/10 disabled:border-0"
          value={roleMetadata.description}
          placeholder="Description"
        />
        <p>Perimissions</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {assignablePermissions1.map((permission) => {
            const isAssigned = roleMetadata.permissions.includes(permission);
            return (
              <label
                key={permission}
                // Adjusted styles to better match the image: background, padding, gap
                className="flex items-center gap-2.5 rounded bg-primary/20 p-3 data-[disabled=true]:bg-primary/10"
                data-disabled={!isEditing}
              >
                <input
                  type="checkbox"
                  // Add onChange handler if needed for editing
                  // onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                  // Custom styled checkbox to match the image's square
                  className="appearance-none w-3.5 h-3.5 border border-primary/60 rounded-sm bg-transparent checked:bg-primary/60 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:border-primary/30 disabled:checked:bg-primary/30 shrink-0"
                />
                {/* Allow text to break if needed */}
                <span className="break-words">{permission}</span>
              </label>
            );
          })}
        </div>
      </div>
      <DialogActions>
        <DialogClose>
          <Button>{isEditing ? "Cancel" : "Close"}</Button>
        </DialogClose>
        {isEditing && (
          <Button color="primary" onClick={() => console.log("Saving")}>
            Confirm
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
