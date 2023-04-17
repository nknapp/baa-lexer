import { LexerTypings, MooState } from "../types";
import { splitRules } from "./splitRules";
import { createMatcher } from "../Matcher";
import { StateProcessor } from "../internal-types";
import { createStateProcessor } from "../BaaStateProcessor";

export function mooState<T extends LexerTypings>(
  state: MooState<T>
): StateProcessor<T> {
  const { error, match, fallback } = splitRules(state);
  const matcher = createMatcher(match, fallback == null);
  const expectedTokens = Object.keys(state);

  return createStateProcessor(expectedTokens, matcher, fallback, error);
}