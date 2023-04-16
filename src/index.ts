import {LexerTypings, MooStates, Lexer, Token, StateName} from "./types";
import { mapValues } from "./utils/mapValues";
import { compileMooState } from "./mooState";
import { TokenFactoryImpl } from "./TokenFactory/TokenFactory";
import {createTokenIterator, TokenIterator} from "./TokenIterator/TokenIterator";
import {createTokenFactory} from "./TokenFactory";
import {CompiledState} from "./internal-types";

export type {
  MooStates,
  Token,
  LexerTypings,
  Lexer,
  Location,
  MooState,
} from "./types";

export { withLookAhead } from "./utils/withLookAhead";
export function baa<T extends LexerTypings>(mooStates: MooStates<T>): Lexer<T> {
  const states = mapValues(mooStates, (state) => compileMooState(state));
  return {
    lex(string: string): IterableIterator<Token<T>> {
      return createTokenIterator(states, string, createTokenFactory());
    },
  };
}

export function baaClass<T extends LexerTypings>(mooStates: MooStates<T>): Lexer<T> {
  return new BaaLexer<T>(mooStates)
}

class BaaLexer<T extends LexerTypings> {
  readonly #states: Record<StateName<T>, CompiledState<T>>;

  constructor(mooStates: MooStates<T>) {
    this.#states = mapValues(mooStates, (state) => compileMooState(state));
  }
  lex(string: string): IterableIterator<Token<T>> {
    return new TokenIterator(this.#states, string, new TokenFactoryImpl());
  }
}