"use client";

import { useSession } from "next-auth/react";
import { hasPermission, Policy } from "../permission-evaluator";

/**
 * Determines whether the current authenticated session satisfies the provided permission policy.
 *
 * If there is no active session, this hook returns false.
 *
 * @param policy - Permission policy to evaluate against the current session
 * @returns `true` if a session exists and satisfies `policy`, `false` otherwise.
 */
export function useHasPermission(policy: Policy): boolean {
  const { data: session } = useSession();

  if (!session) return false;

  return hasPermission(session, policy);
}