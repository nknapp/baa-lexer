import {
  TokenType,
  BaaRule,
  LexerTypings,
  Match,
  Matcher,
  StateProcessor,
  BaaContext,
} from "../types";
import { UnexpectedToken } from "../errors";

export function createStateProcessor<T extends LexerTypings>(
  types: TokenType<T>[],
  matcher: Matcher<T>,
  fallback: BaaRule<T> | null,
  error: BaaRule<T> | null
): StateProcessor<T> {
  return {
    nextMatch(
      string: string,
      offset: number,
      context: BaaContext<T>
    ): Match<T> {
      if (context.pendingMatch != null) {
        const match = context.pendingMatch;
        context.pendingMatch = null;
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
        context.pendingMatch = match;
        return {
          rule: fallback,
          offset,
          text: string.slice(offset, match.offset),
        };
      }
      return match;
    },
    debug() {
      return {
        type: "baaState",
        matcher: matcher.debug(),
        fallback,
      };
    },
  };
}
