"use client";

import { useHasPermission } from "@lib/security/hooks/has-permission";
import { Policy } from "@lib/security/permission-evaluator";
import { PropsWithChildren } from "react";

type PermissionGuardProps = {
  policy: Policy;
};

export function PermissionGuard({
  policy,
  children,
}: PropsWithChildren<PermissionGuardProps>) {
  const hasAccess = useHasPermission(policy);

  // Not authenticated or not authorized
  if (!hasAccess) return null;

  return <>{children}</>;
}
