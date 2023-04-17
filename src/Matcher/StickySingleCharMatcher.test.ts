import { describe, expect, it } from "vitest";
import {
  createStickySingleCharMatcher,
  isSingleCharRule,
} from "./StickySingleCharMatcher";
import { BaaRule, Matcher } from "../internal-types";
import { TestTypes } from "../../performance/types";
import { compileRule } from "../mooState/compileRule";
import { LexerTypings } from "baa-lexer";

const ruleDoubleA = compileRule("AA", "aa");
const ruleSingleA = compileRule("A", "a");
const ruleSingleB = compileRule("B", "b");

describe("SingleCharMatcher", () => {
  it("the create-function throws an exception if any rule does not apply ", () => {
    expect(() =>
      createStickySingleCharMatcher([ruleDoubleA, ruleSingleB])
    ).toThrow(new Error("All rules must be single chars"));
  });

  it("return no match for an empty string", () => {
    const matcher = requireStickySingleCharMatcher([ruleSingleA]);
    expect(matcher.match("", 0)).toBeNull();
  });

  it("returns a match for a string rule", () => {
    const matcher = requireStickySingleCharMatcher([ruleSingleA]);
    expect(matcher.match("a", 0)).toEqual({
      rule: ruleSingleA,
      text: "a",
      offset: 0,
    });
  });

  it("returns no match for a matching chars after the offset", () => {
    const matcher = requireStickySingleCharMatcher([ruleSingleA]);
    expect(matcher.match("ba", 0)).toBeNull();
  });

  it("returns no match for a matching chars after the offset", () => {
    const matcher = requireStickySingleCharMatcher([ruleSingleA]);
    expect(matcher.match("ab", 1)).toBeNull();
  });

  it("returns a match for any valid string rule", () => {
    const matcher: Matcher<TestTypes> = requireStickySingleCharMatcher([
      ruleSingleA,
      ruleSingleB,
    ]);
    expect(matcher.match("ab", 0)).toEqual({
      rule: ruleSingleA,
      text: "a",
      offset: 0,
    });
    expect(matcher.match("ab", 1)).toEqual({
      rule: ruleSingleB,
      text: "b",
      offset: 1,
    });
  });

  describe("isSingleCharRule", () => {
    it("returns true for rules that contain a single char", () => {
      expect(isSingleCharRule(compileRule("A", "a"))).toBe(true);
      expect(isSingleCharRule(compileRule("B", "c"))).toBe(true);
    });

    it("returns false for rules that contain a multiple chars", () => {
      expect(isSingleCharRule(compileRule("A", "aa"))).toBe(false);
    });

    it("returns false for rules that contain a Regexes", () => {
      expect(isSingleCharRule(compileRule("A", /a/))).toBe(false);
    });
  });
});

function requireStickySingleCharMatcher<T extends LexerTypings>(
  rules: BaaRule<T>[]
): Matcher<TestTypes> {
  const matcher = createStickySingleCharMatcher(rules);
  if (matcher == null) throw new Error("Expected matcher to be created");
  return matcher;
}
