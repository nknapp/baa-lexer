import { LexerTypings, Token } from "./index";
import {
  BaaContext,
  CompiledState,
  Location,
  StateDict,
  StateName,
  TokenType,
} from "./types";
import { endLocationMultiline } from "./utils/endLocationMultiline";
import { endLocationSingleLine } from "./utils/endLocationSingleLine";

export class BaaLexer<T extends LexerTypings> {
  readonly #states: StateDict<T>;

  constructor(states: StateDict<T>) {
    this.#states = states;
  }
  *lex(string: string): IterableIterator<Token<T>> {
    const context = new DefaultBaaContext<T>(string, this.#states);
    while (context.offset < string.length) {
      context.currentState.process(context);
      for (let i = 0; i < context.tokenBufferIndex; i++) {
        yield context.tokenBuffer[i];
      }
      context.tokenBufferIndex = 0;
    }
  }
}

class DefaultBaaContext<T extends LexerTypings> implements BaaContext<T> {
  string: string;
  offset = 0;
  tokenBufferIndex = 0;
  tokenBuffer: Token<T>[] = [];
  readonly #stateStack: CompiledState<T>[];
  currentState: CompiledState<T>;
  currentLocation: Location = { line: 1, column: 0 };
  readonly #states: StateDict<T>;

  constructor(string: string, states: StateDict<T>) {
    this.string = string;
    this.#states = states;
    this.#stateStack = [this.#states.main];
    this.currentState = this.#states.main;
  }

  addToken(
    type: TokenType<T>,
    original: string,
    value: string,
    lineBreaks: boolean
  ): void {
    const start = this.currentLocation;
    const end: Location = lineBreaks
      ? endLocationMultiline(start, original)
      : endLocationSingleLine(start, original);
    this.currentLocation = end;
    this.offset += original.length;
    this.tokenBuffer[this.tokenBufferIndex++] = {
      type,
      value,
      original,
      start,
      end,
    };
  }

  addTokenUpToEnd(type: TokenType<T>) {
    const original = this.string.slice(this.offset);
    this.addToken(type, original, original, true);
  }

  pushState(name: StateName<T>) {
    this.currentState = this.#states[name];
    this.#stateStack.unshift(this.currentState);
  }
  replaceState(name: StateName<T>) {
    this.currentState = this.#states[name];
    this.#stateStack[0] = this.currentState;
  }

  popState() {
    this.#stateStack.shift();
    this.currentState = this.#stateStack[0];
  }
}
