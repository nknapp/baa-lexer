import {
  TokenType,
  BaaRule,
  LexerTypings,
  Match,
  Matcher,
  StateProcessor,
} from "../types";
import { UnexpectedToken } from "../errors";

export function createStateProcessor<T extends LexerTypings>(
  types: TokenType<T>[],
  matcher: Matcher<T>,
  fallback: BaaRule<T> | null,
  error: BaaRule<T> | null
): StateProcessor<T> {
  let pendingMatch: Match<T> | null = null;

  return {
    nextMatch(string: string, offset: number): Match<T> {
      if (pendingMatch != null) {
        const match = pendingMatch;
        pendingMatch = null;
        return match;
      }
      const match = matcher.match(string, offset);
      if (match == null) {
        const rule = fallback ?? error;
        if (rule == null) throw new UnexpectedToken(types, string[offset]);
        return {
          rule,
          offset,
          text: string.slice(offset),
        };
      }
      if (match.offset > offset && fallback) {
        pendingMatch = match;
        return {
          rule: fallback,
          offset,
          text: string.slice(offset, match.offset),
        };
      }
      return match;
    },
  };
}
