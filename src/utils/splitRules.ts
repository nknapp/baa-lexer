import {
  ErrorRule,
  FallbackRule,
  LexerTypings,
  MatchRule,
  MooState,
  Rule,
  TokenType,
} from "../types";
import { entries } from "./entries";

interface TypeRuleTuple<T extends LexerTypings, R extends Rule<T>> {
  type: TokenType<T>;
  rule: R;
}

export interface SplitRulesReturn<T extends LexerTypings> {
  match: TypeRuleTuple<T, MatchRule<T>>[];
  error: TypeRuleTuple<T, ErrorRule> | null;
  fallback: TypeRuleTuple<T, FallbackRule> | null;
}
export function splitRules<T extends LexerTypings>(
  state: MooState<T>
): SplitRulesReturn<T> {
  const match: TypeRuleTuple<T, MatchRule<T>>[] = [];
  let fallback: TypeRuleTuple<T, FallbackRule> | null = null;
  let error: TypeRuleTuple<T, ErrorRule> | null = null;

  for (const [type, rule] of entries(state)) {
    if (isFallbackRule(rule)) {
      fallback = { type, rule };
      continue;
    }
    if (isErrorRule(rule)) {
      error = { type, rule };
      continue;
    }
    match.push({ type, rule });
  }
  return {
    error,
    match,
    fallback,
  };
}

function isFallbackRule<T extends LexerTypings>(
  rule: Rule<T>
): rule is FallbackRule {
  return (rule as FallbackRule).fallback;
}

function isErrorRule<T extends LexerTypings>(rule: Rule<T>): rule is ErrorRule {
  return (rule as ErrorRule).error;
}
