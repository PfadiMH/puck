"use client";

import { PermissionGuard } from "@components/security/PermissionGuard";
import { Pencil } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function EditPageButton() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <PermissionGuard policy={{ any: ["page:update"] }}>
      <button
        onClick={() => router.push(`/admin/editor${pathname}`)}
        className="fixed z-50 p-4 rounded-full shadow-lg cursor-pointer bg-primary text-contrast-primary hover:bg-primary/90 active:bg-primary/80 transition-colors"
        style={{ bottom: '1.5rem', right: '1.5rem' }}
        aria-label="Edit this page"
      >
        <Pencil size={24} />
      </button>
    </PermissionGuard>
  );
}
