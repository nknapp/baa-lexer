import { Lexer, LexerTypings, MooStates } from "./types";
import { mapValues } from "./utils/mapValues";
import { compileMooState } from "./mooState";
import {BaaFnLexer} from "./Lexer/BaaFnLexer";

export type {
  MooStates,
  Token,
  LexerTypings,
  Lexer,
  Location,
  MooState,
} from "./types";

export { withLookAhead } from "./utils/withLookAhead";
export function baaFn<T extends LexerTypings>(
  mooStates: MooStates<T>
): Lexer<T> {
  const states = mapValues(mooStates, (state) => compileMooState(state));
  return new BaaFnLexer(states);
}
