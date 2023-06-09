import { BaaMatchRule, Match, Matcher, LexerTypings } from "../types";
import { toRegexCaptureGroup } from "./toRegexCaptureGroup";

export function createRegexMatcher<T extends LexerTypings>(
  rules: BaaMatchRule<T>[],
  sticky: boolean
): Matcher<T> {
  const groups = rules.map(toRegexCaptureGroup);
  const unionRegex = new RegExp(groups.join("|"), sticky ? "y" : "g");

  return {
    match(string: string, offset: number): Match<T> | null {
      unionRegex.lastIndex = offset;
      const match = unionRegex.exec(string);
      if (match != null) {
        for (let i = 1; i <= rules.length; i++) {
          if (match[i] != null) {
            return {
              rule: rules[i - 1],
              offset: match.index,
              text: match[0],
            };
          }
        }
      }
      return null;
    },
    debug() {
      return {
        type: "regexMatcher",
        rules,
        sticky,
      };
    },
  };
}
