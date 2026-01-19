"use client";

import { useSession } from "next-auth/react";
import { hasPermission, Policy } from "../permission-evaluator";

export function useHasPermission(policy: Policy): boolean {
  const { data: session } = useSession();

  if (!session) return false;

  return hasPermission(session, policy);
}
