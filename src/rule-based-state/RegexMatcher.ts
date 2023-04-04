import { LexerTypings, TokenType } from "../types";

import { Match, MatchRule, RuleMatcher } from "./RuleBasedState.types";

export interface RegexMatchingRule<T extends LexerTypings>
  extends MatchRule<T> {
  regex: RegExp;
}

export class RegexMatcher<T extends LexerTypings> implements RuleMatcher<T> {
  readonly #rules: RegexMatchingRule<T>[];
  #combinedRegex: RegExp;

  constructor(rules: RegexMatchingRule<T>[], stateHasFallbackRule: boolean) {
    this.#rules = rules;
    const sources = rules.map((rule) => `(${rule.regex.source})`);
    this.#combinedRegex = new RegExp(
      sources.join("|"),
      stateHasFallbackRule ? "g" : "y"
    );
  }

  exec(string: string, offset: number): Match<T> | null {
    this.#combinedRegex.lastIndex = offset;
    const match = this.#combinedRegex.exec(string);
    if (match == null) return null;
    const matchingRule = this.#findMatchIndex(match);
    if (matchingRule >= 0)
      return {
        rule: this.#rules[matchingRule],
        offset: match.index,
        text: match[matchingRule + 1],
      };
    throw new Error("Unexpected error: No matching regex-group.");
  }

  #findMatchIndex(match: RegExpExecArray): number {
    for (let i = 0; i < this.#rules.length; i++) {
      if (match[i + 1] != null) return i;
    }
    return -1;
  }

  expectedTypes(): TokenType<T>[] {
    return this.#rules.map((rule) => rule.type);
  }
}
