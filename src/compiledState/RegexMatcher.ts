import { CompiledRule, Match } from "./compileState";
import { CombinedRegex } from "./combineRegex";
import { LexerTypings } from "../types";

export class RegexMatcher<T extends LexerTypings> {
  #rules: CompiledRule<T>[];
  #regex: CombinedRegex;
  constructor(rules: CompiledRule<T>[], regex: CombinedRegex) {
    this.#rules = rules;
    this.#regex = regex;
  }

  reset(offset: number) {
    this.#regex.reset(offset);
  }

  match(string: string, offset: number): Match<T> | null {
    this.#regex.matchIndex = offset;
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
