import { Lexer, LexerTypings, MooStates, StateName, Token } from "./types";
import { CompiledState, compileState } from "./compiledState";
import { mapValues } from "./utils/mapValues";
import { TokenIterator } from "./TokenIterator";

export class BaaLexer<T extends LexerTypings> implements Lexer<T> {
  readonly #states: Record<StateName<T>, CompiledState<T>>;

  constructor(states: MooStates<T>) {
    this.#states = mapValues(states, (state) => compileState(state));
  }

  lex(string: string): IterableIterator<Token<T>> {
    return new TokenIterator<T>(this.#states, string);
  }
}
