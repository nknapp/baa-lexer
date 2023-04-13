import { LexerTypings, TokenType } from "../types";
import { CompiledRule, Match, Matcher } from "../internal-types";

type StringMatchingRule<T extends LexerTypings> = CompiledRule<T> & {
  match: string;
};

export function createSingleCharMatcher<T extends LexerTypings>(
  rules: CompiledRule<T>[]
): Matcher<T>  {
  if (rules.some(rule => !isSingleCharRule(rule))) {
    throw new Error("All rules must be single chars")
  }
  return new SingleCharMatcher<T>(rules as StringMatchingRule<T>[]);
}

export function isSingleCharRule<T extends LexerTypings>(
  rule: CompiledRule<T>
): rule is StringMatchingRule<T> {
  return typeof rule.match === "string" && rule.match.length === 1;
}

class SingleCharMatcher<T extends LexerTypings> implements Matcher<T> {
  readonly #types: TokenType<T>[];
  readonly #rulesByCharCode: StringMatchingRule<T>[];

  constructor(rules: StringMatchingRule<T>[]) {
    this.#types = [];
    this.#rulesByCharCode = [];
    for (const rule of rules) {
      this.#types.push(rule.type)
      this.#rulesByCharCode[rule.match.charCodeAt(0)] = rule;
    }
  }

  match(string: string, offset: number): Match<T> | null {
    const matchingRule = this.#rulesByCharCode[string.charCodeAt(offset)]
    if (matchingRule == null) return null
    return {
      rule: matchingRule,
      offset,
      text: matchingRule.match
    }
  }

  expectedTypes(): TokenType<T>[] {
    return this.#types;
  }
}
