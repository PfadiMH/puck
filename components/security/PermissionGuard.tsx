"use client";

import { Permission } from "@lib/auth/permissions";
import { useHasPermission } from "@lib/auth/use-has-permission-hook";
import { PropsWithChildren } from "react";

type PermissionGuardProps = {
  permissions: Permission[];
  requireAll?: boolean;
};

export function PermissionGuard({
  permissions,
  requireAll = false,
  children,
}: PropsWithChildren<PermissionGuardProps>) {
  const isAuthorized = useHasPermission(permissions, { requireAll });

  if (!isAuthorized) return null;

  return <>{children}</>;
}
