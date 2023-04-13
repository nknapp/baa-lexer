import { CombinedRegex, combineRegex } from "./combineRegex";
import { LexerTypings, TokenType } from "../types";
import { CompiledRule, Match, Matcher } from "../internal-types";

export class RegexMatcher<T extends LexerTypings> implements Matcher<T> {
  readonly #rules: CompiledRule<T>[];
  readonly #regex: CombinedRegex;
  constructor(rules: CompiledRule<T>[], { sticky = false } = {}) {
    this.#rules = rules;
    this.#regex = combineRegex(rules.map(regexFromRule), { sticky });
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

const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

function regexFromRule(rule: CompiledRule<LexerTypings>): RegExp {
  if (rule.match == null) throw new Error("Rule with match expected");
  if (rule.match instanceof RegExp) {
    return rule.match;
  }
  return new RegExp(rule.match.replace(reRegExpChar, "\\$&"));
}
