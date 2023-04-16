import { LexerTypings, MooState, TokenType } from "../types";
import { splitRules } from "./splitRules";
import { createMatcher } from "./createMatcher";
import { CompiledRule, CompiledState, Match, Matcher } from "../internal-types";
import { InternalSyntaxError } from "../InternalSyntaxError";
import {RuleBasedCompiledState} from "./RuleBasedCompiledState";

export function compileMooState<T extends LexerTypings>(
    state: MooState<T>
): CompiledState<T> {
  const { error, match, fallback } = splitRules(state);
  const matcher = createMatcher(match, fallback == null);
  const expectedTokens = Object.keys(state)

 // return new RuleBasedCompiledState(expectedTokens, matcher, fallback, error)
  return createCompiledMooStateFn(expectedTokens, matcher, fallback, error);
}

function createCompiledMooStateFn<T extends LexerTypings>(
  types: TokenType<T>[],
  matcher: Matcher<T>,
  fallback: CompiledRule<T> | null,
  error: CompiledRule<T> | null
) {
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
        const rule = fallback ?? error
        if (rule == null) throw new InternalSyntaxError(types, string[offset]);
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
