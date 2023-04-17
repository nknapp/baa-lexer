import { LexerTypings, BaaMatchRule, Matcher } from "../types";
import {
  createStickySingleCharMatcher,
  isSingleCharRule,
} from "./StickySingleCharMatcher";
import { createRegexMatcher } from "./RegexMatcher";

export function createMatcher<T extends LexerTypings>(
  rules: BaaMatchRule<T>[],
  sticky = false
): Matcher<T> {
  if (!sticky) return createRegexMatcher(rules, sticky);

  const singleCharRules: BaaMatchRule<T>[] = [];
  const rest: BaaMatchRule<T>[] = [];

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
