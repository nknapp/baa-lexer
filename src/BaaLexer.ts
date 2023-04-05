import {Lexer, LexerTypings, MooStates, Token} from "./types";

export class BaaLexer<T extends LexerTypings> implements Lexer<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  constructor(states: MooStates<T>) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  *lex(string: string): IterableIterator<Token<T>> {
  }
}
