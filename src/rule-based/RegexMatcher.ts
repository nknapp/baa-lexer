import { BaseRule, Match, RuleMatcher } from "./index";
import { LexerTypings } from "../types";

export interface RegexMatchingRule<T extends LexerTypings> extends BaseRule<T> {
  regex: RegExp;
}

export class RegexMatcher<T extends LexerTypings> implements RuleMatcher<T> {
  #rules: RegexMatchingRule<T>[];
  #combinedRegex: RegExp;

  constructor(rules: RegexMatchingRule<T>[], fallbackEnabled: boolean) {
    this.#rules = rules;
    const sources = rules.map((rule) => `(${rule.regex.source})`);
    this.#combinedRegex = new RegExp(sources.join("|"), fallbackEnabled ? "g" : "gy");
  }

  exec(string: string, offset: number): Match<T> | null {
    this.#combinedRegex.lastIndex = offset;
    const match = this.#combinedRegex.exec(string);
    if (match == null) return null;
    for (let i = 0; i < this.#rules.length; i++) {
      if (match[i + 1] != null) {
        return {
          rule: this.#rules[i],
          offset: match.index,
          text: match[i + 1],
        };
      }
    }
    throw new Error("Unexpected error: No matching regex-group.");
  }
}
