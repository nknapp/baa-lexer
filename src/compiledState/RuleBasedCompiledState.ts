import { LexerTypings } from "../types";
import { InternalSyntaxError } from "./InternalSyntaxError";
import { CompiledRule, CompiledState, Match } from "./compileState";
import { RegexMatcher } from "./RegexMatcher";

export class RuleBasedCompiledState<T extends LexerTypings>
  implements CompiledState<T>
{
  readonly matcher: RegexMatcher<T>;
  readonly fallback: CompiledRule<T> | null = null;
  readonly error: CompiledRule<T> | null = null;

  pendingMatch: Match<T> | null = null;

  constructor(
    matcher: RegexMatcher<T>,
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
    this.matcher.reset(offset);
    const match = this.matcher.match(string, offset);
    if (match == null) {
      return this.#fallbackOrError(string, offset, string.length);
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
        // This cannot happen since all
        throw new Error("Unexpected error");
      }
    }
    return match;
  }

  #fallbackOrError(string: string, startOffset: number, endOffset: number) {
    const rule =
      this.fallback ?? this.error ?? this.#throwError(string, startOffset);
    return {
      rule,
      offset: startOffset,
      text: string.slice(startOffset, endOffset),
    };
  }

  #throwError(string: string, offset: number): never {
    const expectedTokens = this.matcher.expectedTypes();
    throw new InternalSyntaxError(expectedTokens, string[offset]);
  }
}
