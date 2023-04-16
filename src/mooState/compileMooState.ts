import { LexerTypings, MooState } from "../types";
import { splitRules } from "./splitRules";
import { createMatcher } from "./createMatcher";
import { CompiledState } from "../internal-types";
import {CompiledMooState} from "./CompiledMooState";

export function compileMooState<T extends LexerTypings>(
  state: MooState<T>
): CompiledState<T> {
  const { error, match, fallback } = splitRules(state);
  const matcher = createMatcher(match, fallback == null);
  const expectedTokens = Object.keys(state);

  return new CompiledMooState(expectedTokens, matcher, fallback, error)
}

