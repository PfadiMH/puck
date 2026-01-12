import { PermissionGuard } from "@components/security/PermissionGuard";
import Button from "@components/ui/Button";
import { DialogRoot, DialogTrigger } from "@components/ui/Dialog";
import { useRouter } from "next/navigation";
import AddPageModal from "./AddPageModal";

function Header() {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2 justify-between mb-4">
      <h1>Leitereberiich</h1>
      <div className="flex flex-wrap gap-4">
        <PermissionGuard permissions={["role-permissions:read"]}>
          <Button size="medium" onClick={() => router.push("/admin/security")}>
            Security Manager
          </Button>
        </PermissionGuard>
        <div className="grid grid-rows-2 gap-2">
          <PermissionGuard permissions={["navbar:update"]}>
            <Button size="small" onClick={() => router.push("/admin/navbar")}>
              Navbar
            </Button>
          </PermissionGuard>

          <PermissionGuard permissions={["footer:update"]}>
            <Button size="small" onClick={() => router.push("/admin/footer")}>
              Footer
            </Button>
          </PermissionGuard>
        </div>

        <PermissionGuard permissions={["page:create"]}>
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
