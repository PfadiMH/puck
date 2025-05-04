import { Session } from "next-auth";
import { forbidden, unauthorized } from "next/navigation";
import { auth } from "./auth-client";
import { Permission } from "./permissions";

type EvaluationFunction = (
  session: Session,
  ...args: any
) => Promise<boolean> | boolean;

export async function requirePageAuth(
  ...evaluations: EvaluationFunction[]
): Promise<Session> {
  const session = await auth();

  // 1. Authentication Check
  if (!session?.user) {
    forbidden();
  }

  // 2. Authorization/Evaluation Check (only if authenticated)
  if (evaluations.length > 0) {
    for (const evaluation of evaluations) {
      const isAuthorized = await evaluation(session);
      if (!isAuthorized) {
        unauthorized();
      }
    }
  }

  return session;
}

// its important to catch the errors thrown here by *components* who call them. (not the actions)
export async function requireActionAuth(
  ...evaluations: EvaluationFunction[]
): Promise<Session> {
  const session = await auth();

  // 1. Authentication Check
  if (!session?.user) {
    throw new Error("Unauthenticated");
  }

  // 2. Authorization/Evaluation Check (only if authenticated)
  if (evaluations.length > 0) {
    for (const evaluation of evaluations) {
      const isAuthorized = await evaluation(session);
      if (!isAuthorized) {
        throw new Error("Unauthorized");
      }
    }
  }

  return session;
}

// Can be used on both client and server components / actions
export function hasAnyPermissionEvaluator(
  session: Session,
  ...permissions: Permission[]
): boolean {
  if (!session?.user) {
    return false;
  }

  if (session.user.permissions.includes("global-admin")) return true; // Admin Bypass

  // Check if the user has any of the required permissions
  return permissions.some((permission) =>
    session.user.permissions.includes(permission)
  );
}

export function hasAnyPermission(...permissions: Permission[]) {
  return (session: Session) =>
    hasAnyPermissionEvaluator(session, ...permissions);
}

// Can be used on both client and server components / actions
export function hasAllPermissionsEvaluator(
  session: Session,
  ...permissions: Permission[]
): boolean {
  if (!session?.user) {
    return false;
  }

  if (session.user.permissions.includes("global-admin")) return true; // Admin Bypass

  // Check if the user has all of the required permissions
  return permissions.every((permission) =>
    session.user.permissions.includes(permission)
  );
}

export function hasAllPermissions(...permissions: Permission[]) {
  return (session: Session) =>
    hasAllPermissionsEvaluator(session, ...permissions);
}

/* Example usage of requireAuth with hasPermission using the createEvaluator

export async function PageXYZ(): Promise<NexPage> {
  requirePageAuth(hasPermission, "page:update"));

  return xyz;
}

 */
