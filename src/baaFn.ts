import { Lexer, LexerTypings, MooStates, Token } from "./types";
import { mapValues } from "./utils/mapValues";
import { compileMooState } from "./mooState";
import { createTokenIterator } from "./TokenIterator/tokenIteratorFn";
import { createTokenFactory } from "./TokenFactory";

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
  return {
    lex(string: string): IterableIterator<Token<T>> {
      return createTokenIterator(states, string, createTokenFactory());
    },
  };
}
