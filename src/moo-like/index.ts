import { CompiledState, LexerTypings, StateDict } from "../types";
import { regex, rules } from "../rule-based-state";
import { mapValues } from "../utils/mapValues";
import { MatchRule, MooState, MooStates } from "./moo.types";
import { RuleWithType, splitByRuleKind } from "./splitByRuleKind";
import { RegexMatchingRule } from "../rule-based-state/RegexMatcher";

export type {MooState,MooStates} from './moo.types'
export function convertMooConfig<T extends LexerTypings>(
  states: MooStates<T>
): StateDict<T> {
  return mapValues(states, convertMooState);
}

function convertMooState<T extends LexerTypings>(
  mooState: MooState<T>
): CompiledState<T> {
  const { match, fallback, error } = splitByRuleKind(mooState);
  return rules({
    matcher: createMatcher(match),
    fallbackRule: fallback && {
      type: fallback.type,
      lineBreaks: fallback?.rule.lineBreaks,
    },
    errorRule: error && {
      type: error.type,
    },
  });
}

function createMatcher<T extends LexerTypings>(
  match: RuleWithType<T, MatchRule<T>>[]
) {
  return regex(...match.map(toRegexMatchRule));
}

function toRegexMatchRule<T extends LexerTypings>({
  type,
  rule,
}: RuleWithType<T, MatchRule<T>>): RegexMatchingRule<T> {
  return {
    type,
    regex: rule.match,
    lookahead: rule.lookaheadMatch,
    next: rule.next,
    push: rule.push,
    pop: rule.pop,
    value: rule.value
  };
}
