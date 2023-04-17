import {
  Lexer,
  LexerTypings,
  MooStates,
  StateName,
  StateProcessor,
} from "./types";
import { mapValues } from "./mooAdapter/mapValues";
import { mooState } from "./mooAdapter";
import { createLexer } from "./BaaLexer";
import { createTokenFactory } from "./BaaTokenFactory";

export * from "./types";
export * from "./errors";

export { createTokenFactory } from "./BaaTokenFactory";
export { createMatcher } from "./Matcher";
export { createStateProcessor } from "./BaaStateProcessor";
export { createLexer } from "./BaaLexer";
export { withLookAhead } from "./utils/withLookAhead";

export function baa<T extends LexerTypings>(mooStates: MooStates<T>): Lexer<T> {
  const states: Record<StateName<T>, StateProcessor<T>> = mapValues(
    mooStates,
    (state) => mooState(state)
  );
  return createLexer(states, () => createTokenFactory());
}
