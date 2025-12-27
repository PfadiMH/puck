import { hasPermission } from "@lib/auth/has-permission";
import { Permission } from "@lib/auth/permissions";
import { ReactNode } from "react";

interface ServerPermissionGuardProps {
  permissions: Permission[];
  requireAll?: boolean;
  children: ReactNode;
}

export async function ServerPermissionGuard({
  permissions,
  requireAll = false,
  children,
}: ServerPermissionGuardProps) {
  const isAuthorized = await hasPermission(permissions, requireAll);

  if (!isAuthorized) return null;

  return <>{children}</>;
}
