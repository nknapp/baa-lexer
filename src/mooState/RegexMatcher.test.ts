import { describe, expect, it } from "vitest";
import { createRegexMatcher } from "./RegexMatcher";
import { compileRule } from "./compileRule";

const ruleRegexA = compileRule("A", /a/);
describe("RegexMatcher", () => {
  it("an empty string does not match", () => {
    const matcher = createRegexMatcher([ruleRegexA], false);
    expect(matcher.match("", 0)).toBeNull();
  });

  it("cannot be built with a fallback rule", () => {
    expect(() =>
      createRegexMatcher([compileRule("A", { fallback: true })], false)
    ).toThrowError(new Error("All rules must have a 'match' property."));
  });
});
