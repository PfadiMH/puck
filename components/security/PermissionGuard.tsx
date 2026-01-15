"use client";

import { useHasPermission } from "@lib/security/hooks/has-permission";
import { Policy } from "@lib/security/permission-evaluator";
import { PropsWithChildren } from "react";

type PermissionGuardProps = {
  policy: Policy;
};

/**
 * Conditionally renders children when the given permission policy grants access.
 *
 * @param policy - Permission evaluation policy that determines whether the children are rendered
 * @returns The component's children if the policy grants access, otherwise `null`
 */
export function PermissionGuard({
  policy,
  children,
}: PropsWithChildren<PermissionGuardProps>) {
  const hasAccess = useHasPermission(policy);

  // Not authenticated or not authorized
  if (!hasAccess) return null;

  return <>{children}</>;
}