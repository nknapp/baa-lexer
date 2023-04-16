import {LexerTypings, MooStates, Lexer, Token, StateName} from "./types";
import { mapValues } from "./utils/mapValues";
import { compileMooState } from "./mooState";
import { TokenFactoryImpl } from "./TokenFactory/TokenFactory";
import {CompiledState, CompiledStateDict} from "./internal-types";
import {TokenIterator} from "./TokenIterator";
import {createTokenIterator} from "./TokenIterator/tokenIteratorFn";


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
  const states: Record<StateName<T>, CompiledState<T>> = mapValues(mooStates, (state) => compileMooState(state));
  return new BaaLexer<T>(states)
}

class BaaLexer<T extends LexerTypings> {
  readonly #states: Record<StateName<T>, CompiledState<T>>;

  constructor(states: CompiledStateDict<T>) {
    this.#states = states
  }
  lex(string: string): IterableIterator<Token<T>> {
    return createTokenIterator(this.#states, string, new TokenFactoryImpl());
  }
}