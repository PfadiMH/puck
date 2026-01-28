import { FileManager } from "@components/file-manager";
import { requireServerPermission } from "@lib/security/server-guard";

export default async function AdminFilesPage() {
  await requireServerPermission({ all: ["files:read"] });

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">File Manager</h1>
        <p className="text-gray-500 mt-1">
          Upload and manage files for your website
        </p>
      </div>

      <FileManager showUploader={true} />
    </main>
  );
}
