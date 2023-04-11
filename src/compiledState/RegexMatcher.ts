import { CombinedRegex } from "./combineRegex";
import { LexerTypings, TokenType } from "../types";
import { CompiledRule, Match, Matcher } from "../internal-types";

export class RegexMatcher<T extends LexerTypings> implements Matcher<T> {
  readonly #rules: CompiledRule<T>[];
  readonly #regex: CombinedRegex;
  constructor(rules: CompiledRule<T>[], regex: CombinedRegex) {
    this.#rules = rules;
    this.#regex = regex;
  }

  match(string: string, offset: number): Match<T> | null {
    this.#regex.reset(offset);
    if (this.#regex.exec(string)) {
      const matchingRule = this.#rules[this.#regex.matchingRegex];
      return {
        rule: matchingRule,
        text: this.#regex.match as string,
        offset: this.#regex.matchIndex,
      };
    }
    return null;
  }

  expectedTypes(): TokenType<T>[] {
    return this.#rules.map((rule) => rule.type);
  }
}
