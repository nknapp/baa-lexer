import { describe, expect, it } from "vitest";
import { Match, Matcher } from "../internal-types";
import { TestTypes } from "../../performance/types";
import { FirstMatchingMatcher } from "./FirstMatchingMatcher";

const matchA: Matcher<TestTypes> = createTestMatcher("A", "a");
const matchA2: Matcher<TestTypes> = createTestMatcher("A2", "a");
const matchB: Matcher<TestTypes> = createTestMatcher("B", "b");
describe("FirstMatchingMatcher", () => {
  it("return null if no matcher matches", () => {
    const matcher = new FirstMatchingMatcher(matchA, matchB);
    expect(matcher.match("z", 0)).toBeNull();
  });

  it("return the match of the first matcher if it matches", () => {
    const matcher = new FirstMatchingMatcher(matchA, matchB);
    expect(matcher.match("a", 0)).toEqual({
      rule: { type: "A", match: "a" },
      text: "a",
      offset: 0,
    });
  });

  it("return the match of the second matcher if that matches ", () => {
    const matcher = new FirstMatchingMatcher(matchA, matchB);
    expect(matcher.match("b", 0)).toEqual({
      rule: { type: "B", match: "b" },
      text: "b",
      offset: 0,
    });
  });

  it("the first matcher has preference ", () => {
    const matcher = new FirstMatchingMatcher(matchA, matchA2);
    expect(matcher.match("a", 0)).toEqual({
      rule: { type: "A", match: "a" },
      text: "a",
      offset: 0,
    });
  });

  it("expectedTypes return the union of all types", () => {
      expect(new FirstMatchingMatcher(matchA, matchB).expectedTypes()).toEqual(["A","B"])
      expect(new FirstMatchingMatcher(matchA, matchA).expectedTypes()).toEqual(["A"])
  })
});

function createTestMatcher(type: string, matchChar: string) {
  return {
    match(string: string, offset: number): Match<TestTypes> | null {
      if (string.charAt(offset) === matchChar) {
        return {
          rule: { type: type, match: matchChar },
          text: matchChar,
          offset,
        };
      }
      return null;
    },
    expectedTypes() {
      return [type];
    },
  };
}
