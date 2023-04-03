import { MooState, MooStates } from "../moo-like";
import { TestTypes } from "./types";
import { Rules as MooRules } from "moo";
import { mapValues } from "../utils/mapValues";
import { ObjectMatchRule, Rule } from "../moo-like/moo.types";

export function toMooConfig(
  rules: MooStates<TestTypes>
): Record<string, MooRules> {
  return mapValues(rules, stateToMooState);
}

function stateToMooState(state: MooState<TestTypes>): MooRules {
  return mapValues(state as Record<string, Rule<TestTypes>>, mapRule);
}

function mapRule(rule: Rule<TestTypes>): MooRules[string] {
  if (typeof rule === "object") {
    const matchRule = rule as ObjectMatchRule<TestTypes>;
    if (matchRule.lookaheadMatch != null && matchRule.match instanceof RegExp)
      return {
        ...rule,
        match: new RegExp(
          matchRule.match.source + "(?=" + matchRule.lookaheadMatch.source + ")"
        ),
      };
  }
  return rule;
}
