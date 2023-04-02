import { LexerTypings } from "../types";
import { RegexMatcher, RegexMatchingRule } from "./RegexMatcher";
import { RuleMatcherFactory } from "./RuleBasedState.types";

export function regex<T extends LexerTypings>(
  ...rules: RegexMatchingRule<T>[]
): RuleMatcherFactory<T> {
  return (fallbackEnabled) => new RegexMatcher(rules, fallbackEnabled);
}