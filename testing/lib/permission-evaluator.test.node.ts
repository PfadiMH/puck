import { hasPermission, type Policy } from "@lib/security/permission-evaluator";
import type { Permission } from "@lib/security/security-config";
import type { Session } from "next-auth";
import { describe, expect, test } from "vitest";

const createSession = (permissions: Permission[]): Session => ({
  user: { permissions } as Session["user"],
  expires: "",
});

describe("hasPermission", () => {
  describe("invalid session handling", () => {
    test("returns false when session is null", () => {
      expect(hasPermission(null, { any: ["page:update"] })).toBe(false);
    });

    test("returns false when session is undefined", () => {
      expect(hasPermission(undefined, { any: ["page:update"] })).toBe(false);
    });

    test("returns false when session.user is undefined", () => {
      expect(hasPermission({} as Session, { any: ["page:update"] })).toBe(false);
    });

    test("returns false when session.user is null", () => {
      expect(hasPermission({ user: null } as unknown as Session, { any: ["page:update"] })).toBe(false);
    });
  });

  describe("global-admin bypass", () => {
    test("returns true for global-admin with any policy", () => {
      const session = createSession(["global-admin"]);
      expect(hasPermission(session, { any: ["page:update"] })).toBe(true);
    });

    test("returns true for global-admin with all policy", () => {
      const session = createSession(["global-admin"]);
      expect(hasPermission(session, { all: ["page:create", "page:delete"] })).toBe(true);
    });

    test("returns true for global-admin with combined policy", () => {
      const session = createSession(["global-admin"]);
      expect(hasPermission(session, { any: ["page:update"], all: ["page:delete"] })).toBe(true);
    });

    test("returns true for global-admin with empty policy", () => {
      const session = createSession(["global-admin"]);
      expect(hasPermission(session, {})).toBe(true);
    });

    test("global-admin with other permissions still bypasses", () => {
      const session = createSession(["global-admin", "page:update"]);
      expect(hasPermission(session, { all: ["page:delete", "page:create"] })).toBe(true);
    });
  });

  describe("any policy", () => {
    test("returns true when user has first permission", () => {
      const session = createSession(["page:update"]);
      expect(hasPermission(session, { any: ["page:update", "page:delete"] })).toBe(true);
    });

    test("returns true when user has last permission", () => {
      const session = createSession(["page:delete"]);
      expect(hasPermission(session, { any: ["page:update", "page:delete"] })).toBe(true);
    });

    test("returns true when user has multiple matching permissions", () => {
      const session = createSession(["page:update", "page:delete"]);
      expect(hasPermission(session, { any: ["page:update", "page:delete"] })).toBe(true);
    });

    test("returns false when user has none of the permissions", () => {
      const session = createSession(["admin-ui:read"]);
      expect(hasPermission(session, { any: ["page:update", "page:delete"] })).toBe(false);
    });

    test("returns true with empty any array", () => {
      const session = createSession(["admin-ui:read"]);
      expect(hasPermission(session, { any: [] })).toBe(true);
    });

    test("returns true with single permission match", () => {
      const session = createSession(["page:update"]);
      expect(hasPermission(session, { any: ["page:update"] })).toBe(true);
    });
  });

  describe("all policy", () => {
    test("returns true when user has every permission", () => {
      const session = createSession(["page:update", "page:delete"]);
      expect(hasPermission(session, { all: ["page:update", "page:delete"] })).toBe(true);
    });

    test("returns false when user is missing one permission", () => {
      const session = createSession(["page:update"]);
      expect(hasPermission(session, { all: ["page:update", "page:delete"] })).toBe(false);
    });

    test("returns false when user is missing all permissions", () => {
      const session = createSession(["admin-ui:read"]);
      expect(hasPermission(session, { all: ["page:update", "page:delete"] })).toBe(false);
    });

    test("returns true with empty all array", () => {
      const session = createSession(["admin-ui:read"]);
      expect(hasPermission(session, { all: [] })).toBe(true);
    });

    test("returns true when user has extra permissions", () => {
      const session = createSession(["page:update", "page:delete", "page:create"]);
      expect(hasPermission(session, { all: ["page:update", "page:delete"] })).toBe(true);
    });

    test("handles single permission requirement", () => {
      const session = createSession(["page:update"]);
      expect(hasPermission(session, { all: ["page:update"] })).toBe(true);
    });
  });

  describe("combined any and all policies", () => {
    test("returns true when both policies are satisfied", () => {
      const session = createSession(["page:update", "page:delete", "admin-ui:read"]);
      const policy: Policy = { any: ["admin-ui:read"], all: ["page:update", "page:delete"] };
      expect(hasPermission(session, policy)).toBe(true);
    });

    test("returns false when any policy fails", () => {
      const session = createSession(["page:update", "page:delete"]);
      const policy: Policy = { any: ["admin-ui:read"], all: ["page:update", "page:delete"] };
      expect(hasPermission(session, policy)).toBe(false);
    });

    test("returns false when all policy fails", () => {
      const session = createSession(["admin-ui:read", "page:update"]);
      const policy: Policy = { any: ["admin-ui:read"], all: ["page:update", "page:delete"] };
      expect(hasPermission(session, policy)).toBe(false);
    });

    test("returns false when both policies fail", () => {
      const session = createSession(["page:create"]);
      const policy: Policy = { any: ["admin-ui:read"], all: ["page:update", "page:delete"] };
      expect(hasPermission(session, policy)).toBe(false);
    });
  });

  describe("empty policy", () => {
    test("returns true for authenticated user with permissions", () => {
      const session = createSession(["admin-ui:read"]);
      expect(hasPermission(session, {})).toBe(true);
    });

    test("returns true for authenticated user with empty permissions", () => {
      const session = createSession([]);
      expect(hasPermission(session, {})).toBe(true);
    });
  });

  describe("edge cases", () => {
    test("handles user with empty permissions array", () => {
      const session = createSession([]);
      expect(hasPermission(session, { any: ["page:update"] })).toBe(false);
    });

    test("handles duplicate permissions in user", () => {
      const session = createSession(["page:update", "page:update"]);
      expect(hasPermission(session, { any: ["page:update"] })).toBe(true);
    });

    test("handles duplicate permissions in policy", () => {
      const session = createSession(["page:update"]);
      expect(hasPermission(session, { all: ["page:update", "page:update"] })).toBe(true);
    });
  });
});
