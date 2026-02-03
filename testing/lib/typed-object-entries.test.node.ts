import { mapObjectEntries, objectEntries, objectFromEntries } from "@lib/typed-object-entries";
import { describe, expect, test } from "vitest";

describe("objectEntries", () => {
  describe("basic functionality", () => {
    test("returns key-value pairs", () => {
      expect(objectEntries({ a: 1, b: 2 })).toEqual([["a", 1], ["b", 2]]);
    });

    test("handles empty object", () => {
      expect(objectEntries({})).toEqual([]);
    });

    test("handles single property", () => {
      expect(objectEntries({ only: "one" })).toEqual([["only", "one"]]);
    });
  });

  describe("value types", () => {
    test("handles string values", () => {
      expect(objectEntries({ a: "hello", b: "world" })).toEqual([["a", "hello"], ["b", "world"]]);
    });

    test("handles boolean values", () => {
      expect(objectEntries({ active: true, disabled: false })).toEqual([["active", true], ["disabled", false]]);
    });

    test("handles null values", () => {
      expect(objectEntries({ a: null })).toEqual([["a", null]]);
    });

    test("handles undefined values", () => {
      expect(objectEntries({ a: undefined })).toEqual([["a", undefined]]);
    });

    test("handles nested objects", () => {
      const nested = { inner: { deep: 1 } };
      expect(objectEntries(nested)).toEqual([["inner", { deep: 1 }]]);
    });

    test("handles array values", () => {
      expect(objectEntries({ items: [1, 2, 3] })).toEqual([["items", [1, 2, 3]]]);
    });

    test("handles mixed value types", () => {
      const mixed = { num: 1, str: "text", bool: true, nil: null };
      expect(objectEntries(mixed)).toEqual([
        ["num", 1],
        ["str", "text"],
        ["bool", true],
        ["nil", null],
      ]);
    });
  });
});

describe("objectFromEntries", () => {
  describe("basic functionality", () => {
    test("reconstructs object from entries", () => {
      expect(objectFromEntries([["a", 1], ["b", 2]])).toEqual({ a: 1, b: 2 });
    });

    test("handles empty array", () => {
      expect(objectFromEntries([])).toEqual({});
    });

    test("handles single entry", () => {
      expect(objectFromEntries([["only", "one"]])).toEqual({ only: "one" });
    });
  });

  describe("edge cases", () => {
    test("handles duplicate keys (last wins)", () => {
      expect(objectFromEntries([["a", 1], ["a", 2]])).toEqual({ a: 2 });
    });

    test("handles nested object values", () => {
      expect(objectFromEntries([["nested", { deep: true }]])).toEqual({ nested: { deep: true } });
    });

    test("handles array values", () => {
      expect(objectFromEntries([["items", [1, 2, 3]]])).toEqual({ items: [1, 2, 3] });
    });

    test("handles numeric string keys", () => {
      expect(objectFromEntries([["123", "value"]])).toEqual({ "123": "value" });
    });
  });

  describe("roundtrip", () => {
    test("objectFromEntries reverses objectEntries", () => {
      const original = { a: 1, b: 2, c: 3 };
      expect(objectFromEntries(objectEntries(original))).toEqual(original);
    });

    test("handles complex object roundtrip", () => {
      const complex = { str: "hello", num: 42, arr: [1, 2], obj: { nested: true } };
      expect(objectFromEntries(objectEntries(complex))).toEqual(complex);
    });
  });
});

describe("mapObjectEntries", () => {
  describe("value transformation", () => {
    test("transforms numeric values", () => {
      const result = mapObjectEntries({ a: 1, b: 2 }, ([k, v]) => [k, v * 2]);
      expect(result).toEqual({ a: 2, b: 4 });
    });

    test("transforms string values", () => {
      const result = mapObjectEntries({ a: "hello", b: "world" }, ([k, v]) => [k, v.toUpperCase()]);
      expect(result).toEqual({ a: "HELLO", b: "WORLD" });
    });

    test("handles empty object", () => {
      const result = mapObjectEntries({}, ([k, v]) => [k, v]);
      expect(result).toEqual({});
    });

    test("handles single property", () => {
      const result = mapObjectEntries({ only: 5 }, ([k, v]) => [k, v + 1]);
      expect(result).toEqual({ only: 6 });
    });
  });

  describe("type transformation", () => {
    test("changes value types", () => {
      const result = mapObjectEntries({ a: 1, b: 2 }, ([k, v]) => [k, String(v)]);
      expect(result).toEqual({ a: "1", b: "2" });
    });

    test("converts to boolean", () => {
      const result = mapObjectEntries({ a: 0, b: 1 }, ([k, v]) => [k, v > 0]);
      expect(result).toEqual({ a: false, b: true });
    });
  });

  describe("edge cases", () => {
    test("identity function returns equivalent object", () => {
      const original = { a: 1, b: 2 };
      const result = mapObjectEntries(original, ([k, v]) => [k, v]);
      expect(result).toEqual(original);
    });

    test("handles null values", () => {
      const result = mapObjectEntries({ a: null }, ([k, v]) => [k, v ?? "default"]);
      expect(result).toEqual({ a: "default" });
    });

    test("handles undefined values", () => {
      const result = mapObjectEntries({ a: undefined }, ([k, v]) => [k, v ?? "fallback"]);
      expect(result).toEqual({ a: "fallback" });
    });
  });
});
