import { hasPermission } from "@lib/security/has-permission";
import { Permission } from "@lib/security/permissions";
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
