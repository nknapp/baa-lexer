import { LexerTypings, MooState, Rule, TokenType } from "../types";
import { combineRegex } from "./combineRegex";
import { splitRules } from "./splitRules";
import { RuleBasedCompiledState } from "./RuleBasedCompiledState";

export interface CompiledRule<T extends LexerTypings> {
  type: TokenType<T>;
}

export interface Match<T extends LexerTypings> {
  rule: CompiledRule<T>;
  text: string;
  offset: number;
}

export interface CompiledState<T extends LexerTypings> {
  nextMatch(string: string, offset: number): Match<T>
}

export function compileState<T extends LexerTypings>(
  state: MooState<T>
): CompiledState<T> {
  const { error, match, fallback } = splitRules(state);
  const regexes: RegExp[] = [];
  const rules: CompiledRule<T>[] = [];
  for (const { type, rule } of match) {
    regexes.push(regexFromRule(rule));
    rules.push({ type });
  }
  const combinedRegex = combineRegex(regexes, { sticky: fallback == null });
  return new RuleBasedCompiledState<T>(
    rules,
    combinedRegex,
    fallback ? { type: fallback.type } : null,
    error? { type: error.type } : null
  );
}


function regexFromRule<T extends LexerTypings>(rule: Rule<T>): RegExp {
  return (rule as { match: RegExp }).match;
}
