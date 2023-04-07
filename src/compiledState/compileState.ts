import {
  LexerTypings,
  MatchRule,
  MooState,
  ObjectMatchRule,
  StateName,
  TokenType,
} from "../types";
import { combineRegex } from "./combineRegex";
import { splitRules } from "./splitRules";
import { RuleBasedCompiledState } from "./RuleBasedCompiledState";
import { escapeRegExp } from "../utils/regex-escape";
import { RegexMatcher } from "./RegexMatcher";

export interface CompiledRule<T extends LexerTypings> {
  type: TokenType<T>;
  push?: StateName<T>;
  pop?: 1;
  next?: StateName<T>;
  lineBreaks: boolean;
  value?: (original: string) => string;
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
    regexes.push(regexFromRule(normalizedRule));
    rules.push({
      type,
      push: normalizedRule.push,
      pop: normalizedRule.pop,
      next: normalizedRule.next,
      value: normalizedRule.value,
      lineBreaks: normalizedRule.lineBreaks ?? false,
    });
  }
  const combinedRegex = combineRegex(regexes, { sticky: fallback == null });
  return new RuleBasedCompiledState<T>(
    new RegexMatcher<T>(rules, combinedRegex),
    fallback
      ? { type: fallback.type, lineBreaks: fallback.rule.lineBreaks ?? false }
      : null,
    error ? { type: error.type, lineBreaks: false } : null
  );
}

function normalizeRule<T extends LexerTypings>(
  rule: MatchRule<T>
): ObjectMatchRule<T> {
  if (rule instanceof RegExp || typeof rule === "string") {
    return { match: rule };
  }
  return rule;
}

function regexFromRule(rule: ObjectMatchRule<LexerTypings>): RegExp {
  if (rule.match instanceof RegExp) {
    return rule.match;
  }
  return new RegExp(escapeRegExp(rule.match));
}
