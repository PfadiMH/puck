"use client";

import { Permission } from "@lib/auth/permissions";
import { useSession } from "next-auth/react";
import { hasAllPermissionsEvaluator, hasAnyPermissionEvaluator } from "./auth-functions";

export function useHasPermission(
  permissions: Permission[],
  requireAll: boolean = false
): boolean {
  const { data: session } = useSession();

  if (!session) return false;

  return requireAll
    ? hasAllPermissionsEvaluator(session, ...permissions)
    : hasAnyPermissionEvaluator(session, ...permissions);
}
