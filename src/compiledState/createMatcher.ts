import { LexerTypings } from "../types";
import { CompiledRule, Matcher } from "../internal-types";
import { createSingleCharMatcher, isSingleCharRule } from "./SingleCharMatcher";
import { FirstMatchingMatcher } from "./FirstMatchingMatcher";
import { RegexMatcher } from "./RegexMatcher";

export function createMatcher<T extends LexerTypings>(
  rules: CompiledRule<T>[],
  { sticky = false }
): Matcher<T> {
  const singleCharRules: CompiledRule<T>[] = [];
  const rest: CompiledRule<T>[] = [];
  if (!sticky) return new RegexMatcher(rules);

  for (const rule of rules) {
    if (isSingleCharRule(rule)) {
      singleCharRules.push(rule);
    } else {
      rest.push(rule);
    }
  }
  if (singleCharRules.length > 0) {
    return new FirstMatchingMatcher(
      createSingleCharMatcher(singleCharRules),
      new RegexMatcher(rest, { sticky })
    );
  }
  return new RegexMatcher(rest, { sticky });
}
