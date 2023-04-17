import { LexerTypings, MooState } from "../types";
import { BaaRule } from "../internal-types";
import { compileRule } from "./compileRule";

export interface SplitRulesReturn<T extends LexerTypings> {
  match: BaaRule<T>[];
  error: BaaRule<T> | null;
  fallback: BaaRule<T> | null;
}
export function splitRules<T extends LexerTypings>(
  state: MooState<T>
): SplitRulesReturn<T> {
  const match: BaaRule<T>[] = [];
  let fallback: BaaRule<T> | null = null;
  let error: BaaRule<T> | null = null;

  for (const [type, rule] of entries(state)) {
    const compiledRule = compileRule(type, rule);
    if (Object.hasOwn(rule as object, "fallback")) {
      fallback = compiledRule;
    } else if (Object.hasOwn(rule as object, "error")) {
      error = compiledRule;
    } else {
      match.push(compiledRule);
    }
  }
  return {
    error,
    match,
    fallback,
  };
}

const entries = Object.entries as <K extends string, V>(
    object: Partial<Record<K, V>>
) => [K, V][];
