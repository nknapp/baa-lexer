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
      if (context.nextToken != null) {
        yield context.nextToken;
      }
    }
  }
}

class DefaultBaaContext<T extends LexerTypings> implements BaaContext<T> {
  string: string;
  offset = 0;
  nextToken: Token<T> | null = null;


  constructor(string: string) {
    this.string = string;
  }

  addToken(type: TokenType<T>, original: string, value: string): void {
    this.nextToken = {
      type,
      value,
      original: original,
      start: {
        line: 1,
        column: this.offset,
      },
      end: {
        line: 1,
        column: this.offset + 1,
      },
    };
    this.offset++;
  }
}
