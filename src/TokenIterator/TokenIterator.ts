import { LexerTypings, Location, Token } from "../types";
import { InternalSyntaxError } from "../InternalSyntaxError";
import { createStateStack, StateStack } from "./StateStack";
import { CompiledStateDict, TokenFactory } from "../internal-types";
import { token } from "../test-utils/expectToken";

const DONE = {
  done: true,
  value: undefined,
} as const;

export function createTokenIterator<T extends LexerTypings>(
  states: CompiledStateDict<T>,
  string: string,
  tokenFactory: TokenFactory<T>
): IterableIterator<Token<T>> {
  const stack = createStateStack(states);
  let offset = 0;

  function nextToken() {
    if (offset >= string.length) {
      return DONE;
    }
    const match = nextMatchOrSyntaxError();
    offset += match.text.length;
    const token = tokenFactory.createToken(match);

    if (match.rule.push) stack.push(match.rule.push);
    if (match.rule.pop) stack.pop();
    if (match.rule.next) stack.next(match.rule.next);

    return {
      done: false,
      value: token,
    };
  }

  function nextMatchOrSyntaxError() {
    try {
      return stack.current.nextMatch(string, offset);
    } catch (error) {
      if (error instanceof InternalSyntaxError) {
        throw new Error(syntaxError(error, tokenFactory.currentLocation));
      }
      throw error;
    }
  }

  const result: IterableIterator<Token<T>> = {
    [Symbol.iterator]: () => result,
    next: nextToken,
  };
  return result;
}

function syntaxError(error: InternalSyntaxError, location: Location): string {
  const { line, column } = location;
  const types = error.expectedTokenTypes
    .map((type) => "`" + type + "`")
    .join(", ");
  return `Syntax error at ${line}:${column}, expected one of ${types} but got '${error.foundChar}'`;
}

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
    this.states = createStateStack(states);
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
        throw new Error(this.#syntaxError(error));
      }
      throw error;
    }
  }
  #syntaxError(error: InternalSyntaxError) {
    const { line, column } = this.#tokenFactory.currentLocation;
    const types = error.expectedTokenTypes
      .map((type) => "`" + type + "`")
      .join(", ");
    return `Syntax error at ${line}:${column}, expected one of ${types} but got '${error.foundChar}'`;
  }
}
