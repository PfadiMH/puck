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
        <div className="grid grid-rows-2 gap-2">
          <Button size="small" onClick={() => router.push("/admin/navbar")}>
            Navbar
          </Button>
          <Button size="small" onClick={() => router.push("/admin/footer")}>
            Footer
          </Button>
        </div>

        <DialogRoot>
          <DialogTrigger>
            <Button color="primary">Add Page</Button>
          </DialogTrigger>

          <AddPageModal />
        </DialogRoot>
      </div>
    </div>
  );
}

export default Header;
