import { Lexer, LexerTypings, Location, MooStates, Token } from "./types";
import { CompiledState, compileState } from "./utils/compileState";
import { endLocationSingleLine } from "./utils/endLocationSingleLine";

export class BaaLexer<T extends LexerTypings>
  implements Lexer<T>, IterableIterator<Token<T>>
{
  #state: CompiledState<LexerTypings>;
  #string = "";
  #currentLocation: Location = { line: 1, column: 0 };

  constructor(states: MooStates<T>) {
    this.#state = compileState(states.main);
  }

  lex(string: string): IterableIterator<Token<T>> {
    this.#string = string;
    this.#currentLocation = { line: 1, column: 0 };
    return this;
  }

  [Symbol.iterator](): IterableIterator<Token<T>> {
    return this;
  }

  next(): IteratorResult<Token<T>> {
    const regex = this.#state.regex;
    if (regex.exec(this.#string)) {
      const matchingRule = this.#state.rules[regex.lastRegex];
      const original = regex.lastMatch as string;

      const start = this.#currentLocation;
      const end = endLocationSingleLine(start, original);
      this.#currentLocation = end;
      return {
        done: false,
        value: {
          type: matchingRule.type,
          original,
          value: original,
          start,
          end,
        },
      };
    }
    return {
      done: true,
      value: null,
    };
  }
}
