import {
  LexerTypings,
  MatchRule,
  MooState,
  ObjectMatchRule,
  Rule,
  StateName,
  TokenType,
} from "../types";
import { combineRegex } from "./combineRegex";
import { splitRules } from "./splitRules";
import { RuleBasedCompiledState } from "./RuleBasedCompiledState";

export interface CompiledRule<T extends LexerTypings> {
  type: TokenType<T>;
  push?: StateName<T>;
  pop?: 1;
  next?: StateName<T>;
  lineBreaks: boolean;
}

export interface Match<T extends LexerTypings> {
  rule: CompiledRule<T>;
  text: string;
  offset: number;
}

export interface CompiledState<T extends LexerTypings> {
  nextMatch(string: string, offset: number): Match<T>;
}

export function compileState<T extends LexerTypings>(
  state: MooState<T>
): CompiledState<T> {
  const { error, match, fallback } = splitRules(state);
  const regexes: RegExp[] = [];
  const rules: CompiledRule<T>[] = [];
  for (const { type, rule } of match) {
    const normalizedRule = normalizeRule(rule);
    regexes.push(regexFromRule(rule));
    rules.push({
      type,
      push: normalizedRule.push,
      pop: normalizedRule.pop,
      next: normalizedRule.next,
      lineBreaks: normalizedRule.lineBreaks ?? false,
    });
  }
  const combinedRegex = combineRegex(regexes, { sticky: fallback == null });
  return new RuleBasedCompiledState<T>(
    rules,
    combinedRegex,
    fallback
      ? { type: fallback.type, lineBreaks: fallback.rule.lineBreaks ?? false }
      : null,
    error ? { type: error.type, lineBreaks: false } : null
  );
}

function regexFromRule<T extends LexerTypings>(rule: Rule<T>): RegExp {
  return (rule as { match: RegExp }).match;
}

function normalizeRule<T extends LexerTypings>(
  rule: MatchRule<T>
): ObjectMatchRule<T> {
  return rule as ObjectMatchRule<T>;
}
