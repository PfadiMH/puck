import { FileManager } from "@components/file-manager";
import { requireServerPermission } from "@lib/security/server-guard";
import Link from "next/link";

export default async function AdminFilesPage() {
  await requireServerPermission({ all: ["files:read", "files:create", "files:delete"] });

  return (
    <main className="max-w-6xl mx-auto p-6">
      <Link href="/admin" className="text-sm text-contrast-ground/70 hover:text-contrast-ground flex items-center gap-1 mb-4">
        ← Back to Overview
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">File Manager</h1>
        <p className="text-contrast-ground/60 mt-1">
          Upload and manage files for your website
        </p>
      </div>

      <FileManager showUploader={true} />
    </main>
  );
}
