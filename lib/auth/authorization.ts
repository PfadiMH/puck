import { getRolesPermissions } from "@lib/db/database";
import { Session } from "next-auth";
import { forbidden, unauthorized } from "next/navigation";
import { auth } from "./auth";
import { Permission } from "./permissions";

type EvaluationFunction = (session: Session, ...args: any) => Promise<boolean>;

/**
 * Helper function to convert any function that takes a session as its first parameter
 * into an EvaluationFunction without needing to write (session) => each time
 */
export function createEvaluator<T extends any[]>(
  fn: (session: Session, ...args: T) => Promise<boolean>,
  ...args: T
): EvaluationFunction {
  return (session: Session) => fn(session, ...args);
}

export async function requireAuth(
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

export async function hasAnyPermission(
  session: Session,
  ...permissions: Permission[]
): Promise<boolean> {
  if (!session?.user) {
    return false;
  }

  // Check if the user has any of the required permissions
  const userPermissions = await getRolesPermissions(session.user.roles);
  return permissions.some((permission) => userPermissions.includes(permission));
}

export async function hasAllPermissions(
  session: Session,
  ...permissions: Permission[]
): Promise<boolean> {
  if (!session?.user) {
    return false;
  }

  const userPermissions = await getRolesPermissions(session.user.roles);
  return permissions.every((permission) =>
    userPermissions.includes(permission)
  );
}

/* Example usage of requireAuth with hasPermission using the createEvaluator

export async function requireAuthWithPermissions(
  ...permissions: Permission[]
): Promise<Session> {
  return requireAuth(createEvaluator(hasPermission, ...permissions));
}

 */
