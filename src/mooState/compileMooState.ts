import { LexerTypings, MooState } from "../types";
import { splitRules } from "./splitRules";
import { createMatcher } from "./createMatcher";
import { CompiledState, Match } from "../internal-types";
import { InternalSyntaxError } from "../InternalSyntaxError";

export function compileMooState<T extends LexerTypings>(
  state: MooState<T>
): CompiledState<T> {
  const { error, match, fallback } = splitRules(state);
  const matcher = createMatcher(match, fallback == null);

  let pendingMatch: Match<T> | null = null;

  function throwError(string: string, offset: number): never {
    const expectedTokens = match.map(rule => rule.type)
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
