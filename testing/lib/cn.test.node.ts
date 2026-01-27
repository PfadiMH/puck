import cn from "@lib/cn";
import { describe, expect, test } from "vitest";

describe("cn", () => {
  describe("basic merging", () => {
    test("merges multiple class strings", () => {
      expect(cn("flex", "items-center")).toBe("flex items-center");
    });

    test("returns empty string with no arguments", () => {
      expect(cn()).toBe("");
    });

    test("handles single class", () => {
      expect(cn("flex")).toBe("flex");
    });

    test("handles empty string", () => {
      expect(cn("")).toBe("");
    });

    test("handles multiple empty strings", () => {
      expect(cn("", "", "")).toBe("");
    });

    test("trims whitespace", () => {
      expect(cn("  flex  ", "  gap-2  ")).toBe("flex gap-2");
    });
  });

  describe("tailwind conflict resolution", () => {
    test("resolves conflicting padding classes", () => {
      expect(cn("p-2", "p-4")).toBe("p-4");
    });

    test("resolves conflicting color classes", () => {
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    test("resolves conflicting margin classes", () => {
      expect(cn("m-2", "m-4", "m-8")).toBe("m-8");
    });

    test("keeps non-conflicting classes", () => {
      expect(cn("p-2", "m-4")).toBe("p-2 m-4");
    });

    test("resolves conflicting flex classes", () => {
      expect(cn("flex-row", "flex-col")).toBe("flex-col");
    });
  });

  describe("conditional classes with objects", () => {
    test("includes class when condition is true", () => {
      expect(cn("flex", { "font-bold": true })).toBe("flex font-bold");
    });

    test("excludes class when condition is false", () => {
      expect(cn("flex", { "font-bold": false })).toBe("flex");
    });

    test("handles multiple conditions", () => {
      expect(cn({ flex: true, hidden: false, "gap-2": true })).toBe("flex gap-2");
    });

    test("handles empty object", () => {
      expect(cn({})).toBe("");
    });

    test("handles object with all false values", () => {
      expect(cn({ flex: false, hidden: false })).toBe("");
    });
  });

  describe("array handling", () => {
    test("handles flat array", () => {
      expect(cn(["p-2", "m-2"])).toBe("p-2 m-2");
    });

    test("handles empty array", () => {
      expect(cn([])).toBe("");
    });

    test("handles nested arrays", () => {
      expect(cn(["flex", ["gap-2", "items-center"]])).toBe("flex gap-2 items-center");
    });

    test("handles array with falsy values", () => {
      expect(cn(["flex", null, undefined, "gap-2"])).toBe("flex gap-2");
    });
  });

  describe("falsy value filtering", () => {
    test("filters undefined", () => {
      expect(cn("flex", undefined, "gap-2")).toBe("flex gap-2");
    });

    test("filters null", () => {
      expect(cn("flex", null, "gap-2")).toBe("flex gap-2");
    });

    test("filters false", () => {
      expect(cn("flex", false, "gap-2")).toBe("flex gap-2");
    });

    test("filters 0", () => {
      expect(cn("flex", 0, "gap-2")).toBe("flex gap-2");
    });

    test("handles only falsy values", () => {
      expect(cn(null, undefined, false, 0, "")).toBe("");
    });
  });

  describe("mixed inputs", () => {
    test("handles string, object, and array together", () => {
      expect(cn("flex", { "font-bold": true }, ["gap-2", "p-4"])).toBe(
        "flex font-bold gap-2 p-4"
      );
    });

    test("handles complex nested structure", () => {
      expect(
        cn("base", [{ conditional: true }, "nested"], { outer: false })
      ).toBe("base conditional nested");
    });
  });
});
