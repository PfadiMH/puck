import { PermissionGuard } from "@components/security/PermissionGuard";
import Button from "@components/ui/Button";
import { DialogRoot, DialogTrigger } from "@components/ui/Dialog";
import { useRouter } from "next/navigation";
import AddPageModal from "./AddPageModal";

/**
 * Render the admin header with title and permission-protected action controls.
 *
 * The header displays the application title and a right-aligned action area that
 * conditionally renders controls based on permission policies. Actions include
 * navigation to security, navbar, and footer administration pages, and a dialog
 * trigger to add a page.
 *
 * @returns A JSX element containing the header layout with title and permission-guarded action buttons and modal trigger.
 */
function Header() {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2 justify-between mb-4">
      <h1>Leitereberiich</h1>
      <div className="flex flex-wrap gap-4">
        <PermissionGuard policy={{ all: ["role-permissions:read"] }}>
          <Button size="medium" onClick={() => router.push("/admin/security")}>
            Security Manager
          </Button>
        </PermissionGuard>
        <div className="grid grid-rows-2 gap-2">
          <PermissionGuard policy={{ all: ["navbar:update"] }}>
            <Button size="small" onClick={() => router.push("/admin/navbar")}>
              Navbar
            </Button>
          </PermissionGuard>

          <PermissionGuard policy={{ all: ["footer:update"] }}>
            <Button size="small" onClick={() => router.push("/admin/footer")}>
              Footer
            </Button>
          </PermissionGuard>
        </div>

        <PermissionGuard policy={{ all: ["page:create"] }}>
          <DialogRoot>
            <DialogTrigger>
              <Button color="primary">Add Page</Button>
            </DialogTrigger>

            <AddPageModal />
          </DialogRoot>
        </PermissionGuard>
      </div>
    </div>
  );
}

export default Header;