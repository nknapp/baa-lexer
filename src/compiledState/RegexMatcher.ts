import { CombinedRegex } from "./combineRegex";
import { LexerTypings } from "../types";
import { CompiledRule, Match } from "../internal-types";

export class RegexMatcher<T extends LexerTypings> {
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

  expectedTypes() {
    return this.#rules.map((rule) => rule.type);
  }
}
