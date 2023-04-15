import { LexerTypings } from "../types";
import { CompiledRule, Match, Matcher } from "../internal-types";

export function createRegexMatcher<T extends LexerTypings>(
  rules: CompiledRule<T>[],
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
  };
}

function toRegexCaptureGroup(rule: CompiledRule<LexerTypings>): string {
  if (rule.match == null) {
    throw new Error("All rules must have a 'match' property.");
  }
  const source =
    rule.match instanceof RegExp ? rule.match.source : regexEscape(rule.match);
  return `(${source})`;
}

const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
function regexEscape(string: string) {
  return string.replace(reRegExpChar, "\\$&");
}
