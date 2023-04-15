import { LexerTypings } from "../types";
import { CompiledRule, Matcher } from "../internal-types";
import { createStickySingleCharMatcher, isSingleCharRule } from "./StickySingleCharMatcher";
import { createRegexMatcher } from "./RegexMatcher";

export function createMatcher<T extends LexerTypings>(
  rules: CompiledRule<T>[],
  sticky = false
): Matcher<T> {
  if (!sticky) return createRegexMatcher(rules, sticky);

  const singleCharRules: CompiledRule<T>[] = [];
  const rest: CompiledRule<T>[] = [];

  for (const rule of rules) {
    if (isSingleCharRule(rule)) {
      singleCharRules.push(rule);
    } else {
      rest.push(rule);
    }
  }
  if (singleCharRules.length > 0) {
    const singleChar = createStickySingleCharMatcher(singleCharRules);
    const regex = createRegexMatcher(rest, sticky);
    return {
      match(string: string, offset: number) {
        return singleChar.match(string, offset) ?? regex.match(string, offset);
      },
    };
  }
  return createRegexMatcher(rest, sticky);
}
