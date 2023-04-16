import { LexerTypings, MooState } from "../types";
import { CompiledRule } from "../internal-types";
import { compileRule } from "./compileRule";

export interface SplitRulesReturn<T extends LexerTypings> {
  match: CompiledRule<T>[];
  error: CompiledRule<T> | null;
  fallback: CompiledRule<T> | null;
}
export function splitRules<T extends LexerTypings>(
  state: MooState<T>
): SplitRulesReturn<T> {
  const match: CompiledRule<T>[] = [];
  let fallback: CompiledRule<T> | null = null;
  let error: CompiledRule<T> | null = null;

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
