import { LexerTypings, MatchRule, MooState, ObjectMatchRule } from "../types";
import { combineRegex } from "./combineRegex";
import { splitRules } from "./splitRules";
import { RuleBasedCompiledState } from "./RuleBasedCompiledState";
import { escapeRegExp } from "../utils/regex-escape";
import { RegexMatcher } from "./RegexMatcher";
import { CompiledRule, CompiledState } from "../internal-types";
import { compileRule } from "./compileRule";

export function compileState<T extends LexerTypings>(
  state: MooState<T>
): CompiledState<T> {
  const { error, match, fallback } = splitRules(state);
  const regexes: RegExp[] = [];
  const rules: CompiledRule<T>[] = [];
  const fastMatch: (number|null)[] = []
  for (const { type, rule } of match) {
    const normalizedRule = normalizeRule(rule);
    regexes.push(regexFromRule(normalizedRule));
    rules.push(compileRule(type, rule));
    const code = typeof normalizedRule.match === 'string' && normalizedRule.match.length === 1 ? normalizedRule.match.charCodeAt(0) : null
    fastMatch.push(code)
  }
  const combinedRegex = combineRegex(regexes, { sticky: fallback == null, fastMatch });
  return new RuleBasedCompiledState<T>(
    new RegexMatcher<T>(rules, combinedRegex),
    fallback ? compileRule(fallback.type, fallback.rule) : null,
    error ? compileRule(error.type, error.rule) : null
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
