import { describe, expect, it } from "vitest";
import { RegexMatcher } from "./RegexMatcher";

describe("RegexMatcher", function () {
  it("returns null if the regex does not match", () => {
    const matcher = new RegexMatcher([{ type: "A", regex: /a/ }]);
    expect(matcher.exec("c", 0)).toEqual(null);
  });

  it("matches a single regex", () => {
    const matcher = new RegexMatcher([{ type: "A", regex: /a/ }]);
    expect(matcher.exec("a", 0)).toEqual({
      rule: { type: "A", regex: /a/ },
      offset: 0,
      text: "a",
    });
  });

  it("matches a multiple rules", () => {
    const matcher = new RegexMatcher([
      { type: "A", regex: /a/ },
      { type: "B", regex: /b/ },
    ]);
    expect(matcher.exec("ab", 1)).toEqual({
      rule: { type: "B", regex: /b/ },
      offset: 1,
      text: "b",
    });
  });
});
