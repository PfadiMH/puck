"use client";

import { Permission } from "@lib/auth/permissions";
import { useSession } from "next-auth/react";
import { hasPermissionEvaluator } from "./auth-functions";

export function useHasPermission(
  permissions: Permission[],
  options: { requireAll?: boolean } = {}
): boolean {
  const { data: session } = useSession();

  if (!session) return false;

  return hasPermissionEvaluator(session, permissions, options);
}
