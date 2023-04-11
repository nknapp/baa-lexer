import { LexerTypings } from "../types";
import { InternalSyntaxError } from "../InternalSyntaxError";
import { CompiledRule, CompiledState, Match, Matcher } from "../internal-types";

export class RuleBasedCompiledState<T extends LexerTypings>
  implements CompiledState<T>
{
  readonly matcher: Matcher<T>;
  readonly fallback: CompiledRule<T> | null = null;
  readonly error: CompiledRule<T> | null = null;

  pendingMatch: Match<T> | null = null;

  constructor(
    matcher: Matcher<T>,
    fallback: CompiledRule<T> | null,
    error: CompiledRule<T> | null
  ) {
    this.matcher = matcher;
    this.fallback = fallback;
    this.error = error;
  }

  nextMatch(string: string, offset: number): Match<T> {
    if (this.pendingMatch != null) {
      const match = this.pendingMatch;
      this.pendingMatch = null;
      return match;
    }
    const match = this.matcher.match(string, offset);
    if (match == null) {
      const rule =
        this.fallback ?? this.error ?? this.#throwError(string, offset);
      return this.#createMatch(rule, offset, string);
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
        // This cannot if there is no fallback, the regex gets the "/y" flag
        throw new Error("Unexpected error");
      }
    }
    return match;
  }

  #createMatch(rule: CompiledRule<T>, offset: number, string: string) {
    return {
      rule,
      offset,
      text: string.slice(offset),
    };
  }

  #throwError(string: string, offset: number): never {
    const expectedTokens = this.matcher.expectedTypes();
    throw new InternalSyntaxError(expectedTokens, string[offset]);
  }
}
