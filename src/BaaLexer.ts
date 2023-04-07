import {
  Lexer,
  LexerTypings,
  Location,
  MooStates,
  StateName,
  Token,
} from "./types";
import {
  CompiledState,
  compileState,
  InternalSyntaxError,
  Match,
} from "./compiledState";
import { LocationTracker } from "./LocationTracker";
import { mapValues } from "./utils/mapValues";

const DONE = {
  done: true,
  value: undefined,
} as const;

export class BaaLexer<T extends LexerTypings>
  implements Lexer<T>, IterableIterator<Token<T>>
{
  #state: CompiledState<T>;
  #string = "";
  #location = new LocationTracker();

  #offset = -1;
  #states: Record<StateName<T>, CompiledState<T>>;
  #stateStack: CompiledState<T>[];

  constructor(states: MooStates<T>) {
    this.#states = mapValues(states, (state) => compileState(state));
    this.#stateStack = [this.#states.main];
    this.#state = this.#states.main;
  }

  lex(string: string): IterableIterator<Token<T>> {
    this.#string = string;
    this.#location = new LocationTracker();
    this.#offset = 0;
    return this;
  }

  [Symbol.iterator](): IterableIterator<Token<T>> {
    return this;
  }

  next(): IteratorResult<Token<T>> {
    if (this.#offset >= this.#string.length) {
      return DONE;
    }
    const match = this.#nextMatchOrThrowSyntaxError();
    this.#offset += match.text.length;

    const start = this.#location.current;
    this.#location.advance(match.text, {multiline: match.rule.lineBreaks});
    const end = this.#location.current;

    const token = this.#createToken(match, start, end);

    if (match.rule.push != null) {
      const newState = this.#states[match.rule.push];
      this.#stateStack.unshift(newState);
      this.#state = newState;
    }
    if (match.rule.pop != null) {
      this.#stateStack.shift()
      this.#state = this.#stateStack[0]
    }
    if (match.rule.next != null) {
      this.#state = this.#states[match.rule.next];
    }

    return {
      done: false,
      value: token,
    };
  }

  #nextMatchOrThrowSyntaxError() {
    try {
      return this.#state.nextMatch(this.#string, this.#offset);
    } catch (error) {
      if (error instanceof InternalSyntaxError) {
        throw new Error(this.#createSyntaxErrorMessage(error));
      }
      throw error;
    }
  }

  #createSyntaxErrorMessage(error: InternalSyntaxError) {
    const line = this.#location.current.line;
    const column = this.#location.current.column;
    const types = error.expectedTokenTypes
      .map((type) => "`" + type + "`")
      .join(", ");
    return `Syntax error at ${line}:${column}, expected one of ${types} but got '${error.foundChar}'`;
  }

  #createToken(match: Match<T>, start: Location, end: Location) {
    return {
      type: match.rule.type,
      original: match.text,
      value: match.rule.value ? match.rule.value(match.text) : match.text,
      start,
      end,
    };
  }
}
