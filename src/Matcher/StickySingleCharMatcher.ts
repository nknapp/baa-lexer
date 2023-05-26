import { LexerTypings } from "../types";
import { BaaRule, Match, Matcher } from "../types";

interface StringMatchingRule<T extends LexerTypings> extends BaaRule<T> {
  match: string;
}

export function createStickySingleCharMatcher<T extends LexerTypings>(
  rules: BaaRule<T>[]
): Matcher<T> {
  if (!everyRuleIsSingleChar(rules)) {
    throw new Error("All rules must be single chars");
  }

  const rulesByCharCode: StringMatchingRule<T>[] = [];

  for (const rule of rules) {
    rulesByCharCode[rule.match.charCodeAt(0)] = rule;
  }
  return {
    match(string: string, offset: number): Match<T> | null {
      const matchingRule = rulesByCharCode[string.charCodeAt(offset)];
      if (matchingRule == null) return null;
      return {
        rule: matchingRule,
        offset,
        text: matchingRule.match,
      };
    },
    debug(): Record<string, unknown> {
      return { type: "stickySingleCharMatcher", rules };
    },
  };
}

export function isSingleCharRule<T extends LexerTypings>(
  rule: BaaRule<T>
): rule is StringMatchingRule<T> {
  return typeof rule.match === "string" && rule.match.length === 1;
}

function everyRuleIsSingleChar<T extends LexerTypings>(
  rules: BaaRule<T>[]
): rules is StringMatchingRule<T>[] {
  return rules.every((rule) => isSingleCharRule(rule));
}
