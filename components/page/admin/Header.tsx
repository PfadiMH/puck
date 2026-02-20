import { PermissionGuard } from "@components/security/PermissionGuard";
import Button from "@components/ui/Button";
import { DialogRoot, DialogTrigger } from "@components/ui/Dialog";
import { useRouter } from "next/navigation";
import AddPageModal from "./AddPageModal";

function Header() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <h1 className="text-2xl md:text-3xl font-bold">Leitereberiich</h1>

      {/* Mobile: Stack buttons vertically, Desktop: Horizontal layout */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <PermissionGuard policy={{ all: ["role-permissions:read"] }}>
          <Button
            size="medium"
            onClick={() => router.push("/admin/security")}
            className="w-full sm:w-auto"
          >
            Security Manager
          </Button>
        </PermissionGuard>

        {/* Navbar & Footer buttons - side by side on all screens */}
        <div className="flex gap-2">
          <PermissionGuard policy={{ all: ["navbar:update"] }}>
            <Button
              size="small"
              onClick={() => router.push("/admin/navbar")}
              className="flex-1 sm:flex-none"
            >
              Navbar
            </Button>
          </PermissionGuard>

          <PermissionGuard policy={{ all: ["footer:update"] }}>
            <Button
              size="small"
              onClick={() => router.push("/admin/footer")}
              className="flex-1 sm:flex-none"
            >
              Footer
            </Button>
          </PermissionGuard>
        </div>

        <PermissionGuard policy={{ all: ["files:read"] }}>
          <Button size="medium" onClick={() => router.push("/admin/files")}>
            Files
          </Button>
        </PermissionGuard>

        <PermissionGuard policy={{ all: ["page:create"] }}>
          <DialogRoot>
            <DialogTrigger>
              <Button color="primary" className="w-full sm:w-auto">
                Add Page
              </Button>
            </DialogTrigger>

            <AddPageModal />
          </DialogRoot>
        </PermissionGuard>
      </div>
    </div>
  );
}

export default Header;
