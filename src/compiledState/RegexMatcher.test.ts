import { describe, expect, it } from "vitest";
import { RegexMatcher } from "./RegexMatcher";
import { compileRule } from "./compileRule";

const ruleRegexA = compileRule("A", /a/);
describe("RegexMatcher", () => {
  it("an empty string does not match", () => {
    const matcher = new RegexMatcher([ruleRegexA], { sticky: false });
    expect(matcher.match("", 0)).toBeNull();
  });

  it("cannot be built with a fallback rule", () => {
    expect(
      () => new RegexMatcher([compileRule("A", { fallback: true })])
    ).toThrowError(new Error("All rules must have a 'match' property."));
  });
});
