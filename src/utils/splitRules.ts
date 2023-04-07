import {
    FallbackRule,
    LexerTypings, MatchRule,
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
  fallback: TypeRuleTuple<T, FallbackRule> | null;
}
export function splitRules<T extends LexerTypings>(
  state: MooState<T>
): SplitRulesReturn<T> {
  const match: TypeRuleTuple<T, MatchRule<T>>[] = [];
  let fallback: TypeRuleTuple<T, FallbackRule> | null = null;
  for (const [type, rule] of entries(state)) {
    if (isFallbackRule(rule)) {
      fallback = { type, rule };
      continue;
    }
    match.push({ type, rule });
  }
  return {
    match,
    fallback,
  };
}

function isFallbackRule<T extends LexerTypings>(
  rule: Rule<T>
): rule is FallbackRule {
  return (rule as FallbackRule).fallback;
}
