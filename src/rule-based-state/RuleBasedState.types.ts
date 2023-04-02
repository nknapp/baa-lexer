import { LexerTypings, StateName, TokenType } from "../types";

export interface BaseRule<T extends LexerTypings> {
  type: TokenType<T>;
}

export type ErrorRule<T extends LexerTypings> = BaseRule<T>;
export interface FallbackRule<T extends LexerTypings> extends BaseRule<T> {
  lineBreaks?: boolean;
}
export interface MatchRule<T extends LexerTypings> extends BaseRule<T> {
  pop?: 1;
  push?: StateName<T>;
  next?: StateName<T>;
  lineBreaks?: boolean;
  value?: (original: string) => string;
}

export interface Match<T extends LexerTypings> {
  rule: MatchRule<T>;
  text: string;
  offset: number;
}

export type RuleMatcherFactory<T extends LexerTypings> = (
  fallbackEnabled: boolean
) => RuleMatcher<T>;

export interface RuleMatcher<T extends LexerTypings> {
  exec(string: string, offset: number): Match<T> | null;
  expectedTypes(): TokenType<T>[];
}
