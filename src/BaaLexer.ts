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
      yield* context.tokenBuffer;
      context.tokenBuffer = [];
    }
  }
}

class DefaultBaaContext<T extends LexerTypings> implements BaaContext<T> {
  string: string;
  offset = 0;
  tokenBuffer: Token<T>[] = [];
  #stateStack: StateName<T>[] = ["main"];
  currentLocation: Location = { line: 1, column: 0 };

  constructor(string: string) {
    this.string = string;
  }

  addToken(type: TokenType<T>, original: string, value: string): void {
    const start = this.currentLocation;
    const end: Location = endLocationMultiline(start, original)
    this.currentLocation = end
    this.offset += original.length;
    this.tokenBuffer.push({
      type,
      value,
      original: original,
      start,
      end
    });
  }

  addTokenUpToEnd(type: TokenType<T>) {
    const original = this.string.slice(this.offset);
    this.addToken(type, original, original);
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
