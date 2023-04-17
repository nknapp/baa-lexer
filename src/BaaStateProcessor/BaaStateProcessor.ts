import { LexerTypings, TokenType } from "../types";
import { UnexpectedToken } from "../errors";
import { BaaRule, StateProcessor, Match, Matcher } from "../internal-types";

export class BaaStateProcessor<T extends LexerTypings>
  implements StateProcessor<T>
{
  private readonly _types: TokenType<T>[];
  private readonly _matcher: Matcher<T>;
  private readonly _fallback: BaaRule<T> | null = null;
  private readonly _error: BaaRule<T> | null = null;

  private _pendingMatch: Match<T> | null = null;

  constructor(
    types: TokenType<T>[],
    matcher: Matcher<T>,
    fallback: BaaRule<T> | null,
    error: BaaRule<T> | null
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
        throw new UnexpectedToken(this._types, string[offset]);
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