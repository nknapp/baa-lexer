import { CompiledState, LexerTypings, TokenType } from "../types";
import { RegexMatcher, RegexMatchingRule } from "./RegexMatcher";
import { RuleBasedState } from "./RuleBasedState";

export function rules<T extends LexerTypings>(
  matcher: RuleMatcherFactory<T>
): CompiledState<T> {
  return new RuleBasedState<T>(matcher);
}

export interface BaseRule<T extends LexerTypings> {
  type: TokenType<T>;
}

export interface Match<T extends LexerTypings> {
  rule: BaseRule<T>;
  text: string;
  offset: number;
}

export type RuleMatcherFactory<T extends LexerTypings> = () => RuleMatcher<T>;

export interface RuleMatcher<T extends LexerTypings> {
  exec(string: string, offset: number): Match<T> | null;
}

export function regex<T extends LexerTypings>(
  ...rules: RegexMatchingRule<T>[]
): RuleMatcherFactory<T> {
  return () => new RegexMatcher(rules);
}
