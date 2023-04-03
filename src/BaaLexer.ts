import { LexerTypings, Token } from "./index";
import {BaaContext, Location, StateDict, StateName, TokenType} from "./types";
import {endLocationMultiline} from "./utils/endLocationMultiline";

export class BaaLexer<T extends LexerTypings> {
  #states: StateDict<T>;

  constructor(states: StateDict<T>) {
    this.#states = states;
  }
  *lex(string: string): IterableIterator<Token<T>> {
    const context = new DefaultBaaContext<T>(string);
    while (context.offset < string.length) {
      this.#states[context.currentState].process(context);
      for (let i=0; i<context.tokenBufferIndex; i++) {
        yield context.tokenBuffer[i];
      }
      context.tokenBufferIndex = 0
    }
  }
}

class DefaultBaaContext<T extends LexerTypings> implements BaaContext<T> {
  string: string;
  offset = 0;
  tokenBufferIndex = 0;
  tokenBuffer: Token<T>[] = [];
  #stateStack: StateName<T>[] = ["main"];
  line = 1
  column = 0;
  currentLocation: Location = { line: 1, column: 0 };

  constructor(string: string) {
    this.string = string;
  }

  addToken(type: TokenType<T>, original: string, value: string, lineBreaks: boolean): void {
    const start = this.currentLocation;
    const end: Location = lineBreaks ? endLocationMultiline(start, original) : {
      line: this.currentLocation.line,
      column: this.currentLocation.column + original.length
    }
    this.currentLocation = end
    this.offset += original.length;
    this.tokenBuffer[this.tokenBufferIndex++] ={
      type,
      value,
      original: original,
      start,
      end
    };
  }

  addTokenUpToEnd(type: TokenType<T>) {
    const original = this.string.slice(this.offset);
    this.addToken(type, original, original, true);
  }

  pushState(name: StateName<T>) {
    this.#stateStack.unshift(name);
  }
  replaceState(name: StateName<T>) {
    this.#stateStack[0] = name
  }

  popState() {
    this.#stateStack.shift();
  }

  get currentState(): StateName<T> {
    return this.#stateStack[0];
  }
}
