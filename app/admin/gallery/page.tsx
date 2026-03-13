import { GalleryAdmin } from "@components/admin/GalleryAdmin";
import { requireServerPermission } from "@lib/security/server-guard";

export default async function AdminGalleryPage() {
  await requireServerPermission({ all: ["calendar:read"] });

  return (
    <main className="max-w-6xl mx-auto p-6">
      <GalleryAdmin />
    </main>
  );
}
