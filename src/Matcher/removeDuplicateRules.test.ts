import { describe, it, expect } from "vitest";
import { removeDuplicateRules } from "./removeDuplicateRules";

describe("removeDuplicateRules", () => {
  it("returns the input if it has only one rule", () => {
    const result = removeDuplicateRules([{ type: "A", match: /a/ }]);
    expect(result).toEqual([{ type: "A", match: /a/ }]);
  });

  it("returns the input if it the rules have different matches", () => {
    const result = removeDuplicateRules([
      { type: "A", match: /a/ },
      { type: "B", match: /b/ },
    ]);
    expect(result).toEqual([
      { type: "A", match: /a/ },
      { type: "B", match: /b/ },
    ]);
  });

  it("removes the second rule, if two rules have the same match", () => {
    const result = removeDuplicateRules([
      { type: "A", match: /a/ },
      { type: "B", match: /a/ },
    ]);
    expect(result).toEqual([{ type: "A", match: /a/ }]);
  });
  it("removes the second rule, if two rules have the same string", () => {
    const result = removeDuplicateRules([
      { type: "A", match: "a" },
      { type: "B", match: "a" },
    ]);
    expect(result).toEqual([{ type: "A", match: "a" }]);
  });
  it("removes the second rule, if two have the same regex capturing group", () => {
    const result = removeDuplicateRules([
      { type: "A", match: "a" },
      { type: "B", match: /a/ },
    ]);
    expect(result).toEqual([{ type: "A", match: "a" }]);
  });
});
