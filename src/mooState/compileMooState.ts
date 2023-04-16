import { LexerTypings, MooState } from "../types";
import { splitRules } from "./splitRules";
import { createMatcher } from "./createMatcher";
import { CompiledState } from "../internal-types";
import { createCompiledMooStateFn } from "./compileMooStateFn";

export function compileMooState<T extends LexerTypings>(
  state: MooState<T>
): CompiledState<T> {
  const { error, match, fallback } = splitRules(state);
  const matcher = createMatcher(match, fallback == null);
  const expectedTokens = Object.keys(state);

  // return new RuleBasedCompiledState(expectedTokens, matcher, fallback, error)
  return createCompiledMooStateFn(expectedTokens, matcher, fallback, error);
}

export function compileMooStateFn<T extends LexerTypings>(
  state: MooState<T>
): CompiledState<T> {
  const { error, match, fallback } = splitRules(state);
  const matcher = createMatcher(match, fallback == null);
  const expectedTokens = Object.keys(state);

  // return new RuleBasedCompiledState(expectedTokens, matcher, fallback, error)
  return createCompiledMooStateFn(expectedTokens, matcher, fallback, error);
}
