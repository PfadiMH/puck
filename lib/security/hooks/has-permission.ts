"use client";

import { Permission, checkPermission } from "@lib/security/permissions";
import { useSession } from "next-auth/react";

export function useHasPermission(
  permissions: Permission[],
  options?: { requireAll?: boolean }
): boolean {
  const { data: session } = useSession();

  if (!session) return false;

  return checkPermission(session, permissions, options);
}
