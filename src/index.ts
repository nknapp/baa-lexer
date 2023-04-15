import { LexerTypings, MooStates, Lexer, Token } from "./types";
import {mapValues} from "./utils/mapValues";
import {compileMooState} from "./mooState";
import {createTokenFactory} from "./TokenFactory";
import {createTokenIterator} from "./TokenIterator/TokenIterator";

export type { MooStates, Token, LexerTypings, Lexer, Location, MooState } from "./types";

export { withLookAhead } from "./utils/withLookAhead";
export function baa<T extends LexerTypings>(mooStates: MooStates<T>): Lexer<T> {
  const states = mapValues(mooStates, (state) => compileMooState(state));
  return {
    lex(string: string): IterableIterator<Token<T>> {
      return createTokenIterator(states, string, createTokenFactory());
    }
  }
}
