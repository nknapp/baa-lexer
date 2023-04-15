import { Lexer, LexerTypings, MooStates, Token } from "./types";
import { compileState } from "./compiledState";
import { mapValues } from "./utils/mapValues";
import { TokenFactoryImpl } from "./TokenFactory/TokenFactoryImpl";
import { CompiledStateDict } from "./internal-types";
import { TokenIterator } from "./TokenIterator";

export class BaaLexer<T extends LexerTypings> implements Lexer<T> {
  readonly #states: CompiledStateDict<T>;

  constructor(states: MooStates<T>) {
    this.#states = mapValues(states, (state) => compileState(state));
  }

  lex(string: string): IterableIterator<Token<T>> {
    return new TokenIterator(this.#states, string, new TokenFactoryImpl());
  }
}
