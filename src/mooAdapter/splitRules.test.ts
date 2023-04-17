import { describe, expect, it } from "vitest";
import { splitRules } from "./splitRules";

describe("splitRules", () => {
  it("empty state has no match rules", () => {
    const result = splitRules({});
    expect(result.match).toEqual([]);
  });

  it("empty state has no fallback rule", () => {
    const result = splitRules({});
    expect(result.fallback).toBeNull();
  });

  it("state with one match rule", () => {
    const result = splitRules({
      A: { match: /a/ },
    });
    expect(result.match).toEqual([{ type: "A", match: /a/ }]);
  });

  it("state with multiple match rule", () => {
    const result = splitRules({
      A: { match: /a/ },
      B: { match: /b/ },
    });
    expect(result.match).toEqual([
      { type: "A", match: /a/ },
      { type: "B", match: /b/ },
    ]);
  });

  it("state with a fallback rule", () => {
    const result = splitRules({
      A: { match: /a/ },
      B: { fallback: true },
    });
    expect(result.fallback).toEqual({ type: "B" });
    expect(result.match).toEqual([{ type: "A", match: /a/ }]);
  });

  it("state with a error rule", () => {
    const result = splitRules({
      A: { match: /a/ },
      B: { error: true },
    });
    expect(result.error).toEqual({ type: "B" });
    expect(result.match).toEqual([{ type: "A", match: /a/ }]);
  });
});
