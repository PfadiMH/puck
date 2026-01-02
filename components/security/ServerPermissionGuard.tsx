import { hasPermission } from "@lib/auth/has-permission-hook";
import { Permission } from "@lib/auth/permissions";
import { PropsWithChildren } from "react";

type ServerPermissionGuardProps = {
  permissions: Permission[];
  requireAll?: boolean;
};

export async function ServerPermissionGuard({
  permissions,
  requireAll = false,
  children,
}: PropsWithChildren<ServerPermissionGuardProps>) {
  const isAuthorized = await hasPermission(permissions, { requireAll });

  if (!isAuthorized) return null;

  return <>{children}</>;
}
