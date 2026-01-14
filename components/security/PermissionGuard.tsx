"use client";

import { useHasPermission } from "@lib/security/hooks/has-permission";
import { Permission } from "@lib/security/permissions";
import { PropsWithChildren } from "react";

type PermissionGuardProps = {
  permissions: Permission[];
  requireAll?: boolean;
};

export function PermissionGuard({
  permissions,
  requireAll,
  children,
}: PropsWithChildren<PermissionGuardProps>) {
  const isAuthorized = useHasPermission(permissions, { requireAll });

  if (!isAuthorized) return null;

  return <>{children}</>;
}
