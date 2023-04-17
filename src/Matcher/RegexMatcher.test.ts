import { describe, expect, it } from "vitest";
import { createRegexMatcher } from "./RegexMatcher";
import { convertMooRule } from "../mooAdapter/convertMooRule";
import {BaaMatchRule } from "../internal-types";
import {LexerTypings} from "baa-lexer";

const ruleRegexA = convertMooRule("A", /a/) as BaaMatchRule<LexerTypings>;

describe("RegexMatcher", () => {
  it("an empty string does not match", () => {
    if (ruleRegexA.match == null) throw new Error();
    const matcher = createRegexMatcher([ruleRegexA], false);
    expect(matcher.match("", 0)).toBeNull();
  });
});
