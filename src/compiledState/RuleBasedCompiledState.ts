import { LexerTypings } from "../types";
import { CombinedRegex } from "./combineRegex";
import { InternalSyntaxError } from "./InternalSyntaxError";
import { CompiledRule, CompiledState, Match } from "./compileState";


export class RuleBasedCompiledState<T extends LexerTypings>
  implements CompiledState<T>
{
  readonly rules: CompiledRule<T>[];
  readonly regex: CombinedRegex;
  readonly fallback: CompiledRule<T> | null = null;
  readonly error: CompiledRule<T> | null = null;

  pendingMatch: Match<T> | null = null;

  constructor(
    rules: CompiledRule<T>[],
    regex: CombinedRegex,
    fallback: CompiledRule<T> | null,
    error: CompiledRule<T> | null
  ) {
    this.rules = rules;
    this.regex = regex;
    this.fallback = fallback;
    this.error = error;
  }

  nextMatch(string: string, offset: number): Match<T> {
    if (this.pendingMatch != null) {
      const match = this.pendingMatch;
      this.pendingMatch = null;
      return match;
    }
    this.regex.reset(offset);
    const match = this.computeMatch(string, offset);
    if (match == null) {
      const rule =
        this.fallback ?? this.error ?? this.#throwError(string, offset);
      return {
        rule,
        offset,
        text: string.slice(offset, string.length),
      };
    }
    if (match.offset > offset) {
      if (this.fallback) {
        this.pendingMatch = match;
        return {
          rule: this.fallback,
          offset,
          text: string.slice(offset, match.offset),
        };
      } else {
        throw new Error("Error");
      }
    }
    return match;
  }

  #throwError(string: string, offset: number): never {
    const expectedTokens = this.rules.map((rule) => rule.type);
    throw new InternalSyntaxError(expectedTokens, string[offset]);
  }

  computeMatch(string: string, offset: number): Match<T> | null {
    this.regex.matchIndex = offset;
    if (this.regex.exec(string)) {
      const matchingRule = this.rules[this.regex.matchingRegex];
      return {
        rule: matchingRule,
        text: this.regex.match as string,
        offset: this.regex.matchIndex,
      };
    }
    return null;
  }
}
