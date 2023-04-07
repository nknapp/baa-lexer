import { Lexer, LexerTypings, Location, MooStates, Token } from "./types";
import {
  CompiledRule,
  CompiledState,
  compileState, InternalSyntaxError,
  Match,
} from "./compiledState";
import { LocationTracker } from "./location/LocationTracker";

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

  #match = "";
  #offset = -1;
  #rule: CompiledRule<T> | null = null;

  constructor(states: MooStates<T>) {
    this.#state = compileState(states.main);
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
    this.#location.advance(match.text);
    const end = this.#location.current;

    return {
      done: false,
      value: this.#createToken(match, start, end),
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
      value: match.text,
      start,
      end,
    };
  }
}
