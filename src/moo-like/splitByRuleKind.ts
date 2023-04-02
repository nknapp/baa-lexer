import {
  ErrorRule,
  FallbackRule,
  MatchRule,
  MooState,
  Rule,
} from "./moo.types";
import {LexerTypings, TokenType} from "../types";

export interface RuleWithType<T extends LexerTypings, R extends Rule<T>> {
  type: TokenType<T>;
  rule: R;
}

interface SplitRulesReturn<T extends LexerTypings> {
  fallback?: RuleWithType<T, FallbackRule>;
  error?: RuleWithType<T, ErrorRule>;
  match: RuleWithType<T, MatchRule<T>>[];
}

export function splitByRuleKind<T extends LexerTypings>(
  rules: MooState<T>
): SplitRulesReturn<T> {
  const result: SplitRulesReturn<T> = {
    match: [],
  };
  for (const [type, rule] of entries(rules)) {
    if (isFallbackRule(rule)) {
      result.fallback = { type, rule };
    } else if (isErrorRule(rule)) {
      result.error = { type, rule };
    } else {
      result.match.push({ type, rule });
    }
  }
  return result;
}

function entries<K extends string, V>(object: Partial<Record<K, V>>): [K, V][] {
  return Object.entries(object) as [K, V][];
}

function isErrorRule<T extends LexerTypings>(rule: Rule<T>): rule is ErrorRule {
  return (rule as ErrorRule).error;
}
export function isFallbackRule<T extends LexerTypings>(
  rule: Rule<T>
): rule is FallbackRule {
  return (rule as FallbackRule).fallback;
}
