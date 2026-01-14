import { Permission, hasPermission } from "@lib/security/permissions";
import { PropsWithChildren } from "react";

type ServerPermissionGuardProps = {
  permissions: Permission[];
  requireAll?: boolean;
};

export async function ServerPermissionGuard({
  permissions,
  requireAll,
  children,
}: PropsWithChildren<ServerPermissionGuardProps>) {
  const isAuthorized = await hasPermission(permissions, { requireAll });

  if (!isAuthorized) return null;

  return <>{children}</>;
}
