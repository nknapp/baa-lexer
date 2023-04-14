import { LexerTypings, TokenType } from "../types";
import { CompiledRule, Match, Matcher } from "../internal-types";


export class RegexMatcher<T extends LexerTypings> implements Matcher<T> {
  readonly #rules: CompiledRule<T>[];
  readonly #unionRegex: RegExp;
  constructor(rules: CompiledRule<T>[], { sticky = false } = {}) {
    this.#rules = rules;
    const groups = rules.map(toRegexCaptureGroup);
    this.#unionRegex = new RegExp(groups.join("|"), sticky ? "y" : "g");
  }

  match(string: string, offset: number): Match<T> | null {
    this.#unionRegex.lastIndex = offset;
    const match = this.#unionRegex.exec(string);
    if (match != null) {
      for (let i = 1; i <= this.#rules.length; i++) {
        if (match[i] != null) {
          return {
            rule: this.#rules[i - 1],
            offset: match.index,
            text: match[0],
          };
        }
      }
    }
    return null;
  }

  expectedTypes(): TokenType<T>[] {
    return this.#rules.map((rule) => rule.type);
  }
}

function toRegexCaptureGroup(rule: CompiledRule<LexerTypings>): string {
  if (rule.match == null) {
    throw new Error("All rules must have a 'match' property.");
  }
  const source =
    rule.match instanceof RegExp ? rule.match.source : regexEscape(rule.match);
  return `(${source})`;
}

const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
function regexEscape(string: string) {
  return string.replace(reRegExpChar, "\\$&");
}
