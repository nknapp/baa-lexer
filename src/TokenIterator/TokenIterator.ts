import { LexerTypings, Token } from "../types";
import { InternalSyntaxError } from "../InternalSyntaxError";
import { StateStack } from "./StateStack";
import { CompiledStateDict, TokenFactory } from "../internal-types";

const DONE = {
  done: true,
  value: undefined,
} as const;

export class TokenIterator<T extends LexerTypings>
  implements IterableIterator<Token<T>>
{
  readonly #string: string;
  readonly states: StateStack<T>;
  readonly #tokenFactory: TokenFactory<T>;

  #offset: number;

  constructor(
    states: CompiledStateDict<T>,
    string: string,
    tokenFactory: TokenFactory<T>
  ) {
    this.#string = string;
    this.#offset = 0;
    this.states = new StateStack<T>(states);
    this.#tokenFactory = tokenFactory;
  }

  [Symbol.iterator](): IterableIterator<Token<T>> {
    return this;
  }

  next(): IteratorResult<Token<T>> {
    if (this.#offset >= this.#string.length) {
      return DONE;
    }
    const match = this.#nextMatchOrSyntaxError();
    this.#offset += match.text.length;
    const token = this.#tokenFactory.createToken(match);

    if (match.rule.push) this.states.push(match.rule.push);
    if (match.rule.pop) this.states.pop();
    if (match.rule.next) this.states.next(match.rule.next);

    return {
      done: false,
      value: token,
    };
  }

  #nextMatchOrSyntaxError() {
    try {
      return this.states.current.nextMatch(this.#string, this.#offset);
    } catch (error) {
      if (error instanceof InternalSyntaxError) {
        throw new Error(this.#createSyntaxErrorMessage(error));
      }
      throw error;
    }
  }
  #createSyntaxErrorMessage(error: InternalSyntaxError) {
    const { line, column } = this.#tokenFactory.currentLocation;
    const types = error.expectedTokenTypes
      .map((type) => "`" + type + "`")
      .join(", ");
    return `Syntax error at ${line}:${column}, expected one of ${types} but got '${error.foundChar}'`;
  }
}
