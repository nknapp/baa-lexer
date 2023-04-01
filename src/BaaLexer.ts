import { LexerTypings, Token } from "./index";
import {
  BaaContext,
  StateDict,
  TokenType,
} from "./types";

export class BaaLexer<T extends LexerTypings> {
  #states: StateDict<T>;

  constructor(states: StateDict<T>) {
    this.#states = states;
  }
  *lex(string: string): IterableIterator<Token<T>> {
    const context = new DefaultBaaContext<T>(string);
    while (context.offset < string.length) {
      this.#states.main.process(context);
      yield* context.tokenBuffer
      context.tokenBuffer = []
    }
  }
}

class DefaultBaaContext<T extends LexerTypings> implements BaaContext<T> {
  string: string;
  offset = 0;
  tokenBuffer: Token<T>[] = []


  constructor(string: string) {
    this.string = string;
  }

  addToken(type: TokenType<T>, original: string, value: string): void {
    this.tokenBuffer.push({
      type,
      value,
      original: original,
      start: {
        line: 1,
        column: this.offset,
      },
      end: {
        line: 1,
        column: this.offset + original.length,
      },
    });
    this.offset+=original.length;
  }
}
