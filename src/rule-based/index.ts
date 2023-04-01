import { CompiledState, LexerTypings, TokenType } from "../types";
import { RegexMatcher, RegexMatchingRule } from "./RegexMatcher";
import { RuleBasedState } from "./RuleBasedState";

export interface RulesOptions<T extends LexerTypings> {
  matcher: RuleMatcherFactory<T>;
  fallback?: FallbackRule<T>;
}

export function rules<T extends LexerTypings>(
  options: RulesOptions<T>
): CompiledState<T> {
  return new RuleBasedState<T>(options);
}

export interface BaseRule<T extends LexerTypings> {
  type: TokenType<T>;
}

export type FallbackRule<T extends LexerTypings> = BaseRule<T>;

export interface Match<T extends LexerTypings> {
  rule: BaseRule<T>;
  text: string;
  offset: number;
}

export type RuleMatcherFactory<T extends LexerTypings> = (fallbackEnabled: boolean) => RuleMatcher<T>;

export interface RuleMatcher<T extends LexerTypings> {
  exec(string: string, offset: number): Match<T> | null;
}

export function regex<T extends LexerTypings>(
  ...rules: RegexMatchingRule<T>[]
): RuleMatcherFactory<T> {
  return (fallbackEnabled) => new RegexMatcher(rules, fallbackEnabled);
}
