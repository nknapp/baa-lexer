import {Lexer, LexerTypings, MooStates, Token} from "./types";

export class BaaLexer<T extends LexerTypings> implements Lexer<T> {
  constructor(states: MooStates<T>) {
  }
  *lex(string: string): IterableIterator<Token<T>> {
  }
}
