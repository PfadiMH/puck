"use client";

import "client-only";

import { Permission } from "@lib/auth/permissions";
import { useHasPermission } from "@lib/auth/use-has-permission";
import { ReactNode } from "react";

interface PermissionGuardProps {
  permissions: Permission[];
  requireAll?: boolean;
  children: ReactNode;
}

export function PermissionGuard({
  permissions,
  requireAll = false,
  children,
}: PermissionGuardProps) {
  const isAuthorized = useHasPermission(permissions, { requireAll });

  if (!isAuthorized) return null;

  return <>{children}</>;
}
