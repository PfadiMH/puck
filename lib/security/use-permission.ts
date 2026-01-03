"use client";

import { Permission } from "@lib/security/permissions";
import { useSession } from "next-auth/react";
import { hasPermissionEvaluator } from "./permission-utils";

export function useHasPermission(
  permissions: Permission[],
  options: { requireAll?: boolean } = {}
): boolean {
  const { data: session } = useSession();

  if (!session) return false;

  return hasPermissionEvaluator(session, permissions, options);
}
