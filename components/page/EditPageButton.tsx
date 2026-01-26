"use client";

import { PermissionGuard } from "@components/security/PermissionGuard";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

type EditPageButtonProps = {
  path: string;
};

export function EditPageButton({ path }: EditPageButtonProps) {
  const router = useRouter();

  return (
    <PermissionGuard policy={{ any: ["page:update"] }}>
      <button
        onClick={() => router.push(`/admin/editor${path}`)}
        className="fixed z-50 p-4 rounded-full shadow-lg cursor-pointer bg-primary text-contrast-primary hover:bg-primary/90 active:bg-primary/80 transition-colors"
        style={{ bottom: '1.5rem', right: '1.5rem' }}
        aria-label="Edit this page"
      >
        <Pencil size={24} />
      </button>
    </PermissionGuard>
  );
}
