import { Lexer, LexerTypings, MooStates, StateName } from "./types";
import { mapValues } from "./mooAdapter/mapValues";
import { StateProcessor } from "./internal-types";
import { mooState } from "./mooAdapter";
import { createLexer } from "./BaaLexer";
import { createTokenFactory } from "./BaaTokenFactory";

export type {
  MooStates,
  BaaToken,
  LexerTypings,
  Lexer,
  Location,
  MooState,
} from "./types";

export { ParseError, UnexpectedToken} from './errors'

export { createTokenFactory } from "./BaaTokenFactory";
export { createMatcher } from "./Matcher";
export { createStateProcessor } from "./BaaStateProcessor";
export { createLexer } from "./BaaLexer";
export type {
  Matcher,
  Match,
  StateProcessor,
  BaaRule,
  BaaMatchRule,
  TokenFactory,
} from "./internal-types";

export { withLookAhead } from "./utils/withLookAhead";

export function baa<T extends LexerTypings>(mooStates: MooStates<T>): Lexer<T> {
  const states: Record<StateName<T>, StateProcessor<T>> = mapValues(
    mooStates,
    (state) => mooState(state)
  );
  return createLexer(states, () => createTokenFactory());
}
