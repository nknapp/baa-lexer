import { LexerTypings, TokenType } from "../types";
import { CompiledRule, Match, Matcher } from "../internal-types";

type StringMatchingRule<T extends LexerTypings> = CompiledRule<T> & {
  match: string;
};


export function createSingleCharMatcher<T extends LexerTypings>(
  rules: CompiledRule<T>[]
): Matcher<T>  {
  if (!everyRuleIsSingleChar(rules)) {
    throw new Error("All rules must be single chars")
  }

  const types: TokenType<T>[] = [];
  const rulesByCharCode: StringMatchingRule<T>[] = [];

  for (const rule of rules) {
    types.push(rule.type)
    rulesByCharCode[rule.match.charCodeAt(0)] = rule;
  }
  return {
    match(string: string, offset: number): Match<T> | null {
      const matchingRule = rulesByCharCode[string.charCodeAt(offset)]
      if (matchingRule == null) return null
      return {
        rule: matchingRule,
        offset,
        text: matchingRule.match
      }
    },
    expectedTypes(): TokenType<T>[] {
      return types;
    }
  };
}

export function isSingleCharRule<T extends LexerTypings>(
  rule: CompiledRule<T>
): rule is StringMatchingRule<T> {
  return typeof rule.match === "string" && rule.match.length === 1;
}


function everyRuleIsSingleChar<T extends LexerTypings>(rules: CompiledRule<T>[]): rules is StringMatchingRule<T>[] {
  return rules.every((rule) => isSingleCharRule(rule));
}
