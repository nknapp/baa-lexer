import { LexerTypings, MooState } from "../types";
import { splitRules } from "./splitRules";
import { RuleBasedCompiledState } from "./RuleBasedCompiledState";
import { CompiledRule, CompiledState } from "../internal-types";
import { compileRule } from "./compileRule";
import { createMatcher } from "./createMatcher";

export function compileState<T extends LexerTypings>(
  state: MooState<T>
): CompiledState<T> {
  const { error, match, fallback } = splitRules(state);
  const compiledMatchRules: CompiledRule<T>[] = [];
  for (const { type, rule } of match) {
    compiledMatchRules.push(compileRule(type, rule));
  }
  return new RuleBasedCompiledState<T>(
    createMatcher(compiledMatchRules, { sticky: fallback == null }),
    fallback ? compileRule(fallback.type, fallback.rule) : null,
    error ? compileRule(error.type, error.rule) : null
  );
}
