import { LexerTypings, TokenType } from "../types";
import { InternalSyntaxError } from "../InternalSyntaxError";
import { CompiledRule, CompiledState, Match, Matcher } from "../internal-types";

export class RuleBasedCompiledState<T extends LexerTypings>
  implements CompiledState<T>
{
  private readonly _types: TokenType<T>[];
  private readonly _matcher: Matcher<T>;
  private readonly _fallback: CompiledRule<T> | null = null;
  private readonly _error: CompiledRule<T> | null = null;

  private _pendingMatch: Match<T> | null = null;

  constructor(
    types: TokenType<T>[],
    matcher: Matcher<T>,
    fallback: CompiledRule<T> | null,
    error: CompiledRule<T> | null
  ) {
    this._types = types;
    this._matcher = matcher;
    this._fallback = fallback;
    this._error = error;
  }

  nextMatch(string: string, offset: number): Match<T> {
    if (this._pendingMatch != null) {
      const match = this._pendingMatch;
      this._pendingMatch = null;
      return match;
    }
    const match = this._matcher.match(string, offset);
    if (match == null) {
      const rule = this._fallback ?? this._error;
      if (rule == null) {
        throw new InternalSyntaxError(this._types, string[offset]);
      }
      return {
        rule,
        offset,
        text: string.slice(offset),
      };
    }
    if (match.offset > offset) {
      if (this._fallback) {
        this._pendingMatch = match;
        return {
          rule: this._fallback,
          offset,
          text: string.slice(offset, match.offset),
        };
      } else {
        // This cannot happen, because if there is no fallback, the regex gets the "/y" flag
        throw new Error("Unexpected error");
      }
    }
    return match;
  }
}
