import { LexerTypings } from "../types";
import { InternalSyntaxError } from "../InternalSyntaxError";
import { CompiledRule, CompiledState, Match, Matcher } from "../internal-types";

export function ruleState<T extends LexerTypings>(
  matcher: Matcher<T>,
  fallback: CompiledRule<T> | null,
  error: CompiledRule<T> | null
): CompiledState<T> {
  let pendingMatch: Match<T> | null = null;

  function throwError(string: string, offset: number): never {
    const expectedTokens = matcher.expectedTypes();
    throw new InternalSyntaxError(expectedTokens, string[offset]);
  }

  return {
    nextMatch(string: string, offset: number): Match<T> {
      if (pendingMatch != null) {
        const match = pendingMatch;
        pendingMatch = null;
        return match;
      }
      const match = matcher.match(string, offset);
      if (match == null) {
        const rule = fallback ?? error ?? throwError(string, offset);
        return {
          rule,
          offset,
          text: string.slice(offset),
        };
      }
      if (match.offset > offset) {
        if (fallback) {
          pendingMatch = match;
          return {
            rule: fallback,
            offset,
            text: string.slice(offset, match.offset),
          };
        } else {
          // This cannot happen, because if there is no fallback, the regex gets the "/y" flag
          throw new Error("Unexpected error");
        }
      }
      return match;
    },
  };
}
