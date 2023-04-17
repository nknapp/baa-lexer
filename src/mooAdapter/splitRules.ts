import { BaaMatchRule, BaaRule, LexerTypings, MooState } from "../types";
import { convertMooRule } from "./convertMooRule";

export interface SplitRulesReturn<T extends LexerTypings> {
  match: BaaMatchRule<T>[];
  error: BaaRule<T> | null;
  fallback: BaaRule<T> | null;
}
export function splitRules<T extends LexerTypings>(
  state: MooState<T>
): SplitRulesReturn<T> {
  const match: BaaMatchRule<T>[] = [];
  let fallback: BaaRule<T> | null = null;
  let error: BaaRule<T> | null = null;

  for (const [type, rule] of entries(state)) {
    if (Object.hasOwn(rule as object, "fallback")) {
      fallback = convertMooRule(type, rule);
    } else if (Object.hasOwn(rule as object, "error")) {
      error = convertMooRule(type, rule);
    } else {
      match.push(convertMooRule(type, rule) as BaaMatchRule<T>);
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
