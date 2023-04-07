import { Lexer, LexerTypings, Location, MooStates, Token } from "./types";
import {
  BaaSyntaxError,
  CompiledRule,
  CompiledState,
  compileState,
  Match,
} from "./utils/compileState";
import { endLocationSingleLine } from "./utils/endLocationSingleLine";

const DONE = {
  done: true,
  value: undefined,
} as const;

export class BaaLexer<T extends LexerTypings>
  implements Lexer<T>, IterableIterator<Token<T>>
{
  #state: CompiledState<T>;
  #string = "";
  #currentLocation: Location = { line: 1, column: 0 };

  #match = "";
  #offset = -1;
  #rule: CompiledRule<T> | null = null;

  constructor(states: MooStates<T>) {
    this.#state = compileState(states.main);
  }

  lex(string: string): IterableIterator<Token<T>> {
    this.#string = string;
    this.#currentLocation = { line: 1, column: 0 };
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
    const match = this.#tryNextMatch();
    this.#offset += match.text.length;

    const start = this.#currentLocation;
    this.#advanceLocation(match.text);
    const end = this.#currentLocation;
    this.#currentLocation = end;
    return {
      done: false,
      value: this.#createToken(match, start, end),
    };
  }

  #tryNextMatch() {
    try {
      return this.#state.nextMatch(this.#string, this.#offset);
    } catch (error) {
      if (error instanceof BaaSyntaxError) {
        throw new Error(this.#createSyntaxErrorMessage(error));
      }
      throw error;
    }
  }

  #createSyntaxErrorMessage(error: BaaSyntaxError) {
    const line = this.#currentLocation.line;
    const column = this.#currentLocation.column;
    const types = error.expectedTokenTypes
      .map((type) => "`" + type + "`")
      .join(", ");
    return `Syntax error at ${line}:${column}, expected one of ${types} but got '${error.foundChar}'`;
  }

  #advanceLocation(text: string) {
    this.#currentLocation = endLocationSingleLine(this.#currentLocation, text);
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
