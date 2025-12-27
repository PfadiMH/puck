import Button from "@components/ui/Button";
import { DialogRoot, DialogTrigger } from "@components/ui/Dialog";
import { hasAnyPermissionEvaluator } from "@lib/auth/auth-functions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AddPageModal from "./AddPageModal";

function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-between mb-4">
      <h1>Leitereberiich</h1>
      <div className="flex flex-wrap gap-4">
        {hasAnyPermissionEvaluator(session, "role-permissions:read") && (
          <Button size="medium" onClick={() => router.push("/admin/access")}>
            Access Control
          </Button>
        )}
        <div className="grid grid-rows-2 gap-2">
          {hasAnyPermissionEvaluator(session, "navbar:update") && (
            <Button size="small" onClick={() => router.push("/admin/navbar")}>
              Navbar
            </Button>
          )}

          {hasAnyPermissionEvaluator(session, "footer:update") && (
            <Button size="small" onClick={() => router.push("/admin/footer")}>
              Footer
            </Button>
          )}
        </div>

        {hasAnyPermissionEvaluator(session, "page:create") && (
          <DialogRoot>
            <DialogTrigger>
              <Button color="primary">Add Page</Button>
            </DialogTrigger>

            <AddPageModal />
          </DialogRoot>
        )}
      </div>
    </div>
  );
}

export default Header;
