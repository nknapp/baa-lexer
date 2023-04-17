import { LexerTypings, BaaToken } from "../types";
import { InternalSyntaxError } from "../InternalSyntaxError";
import { createStateStack, StateStack } from "./StateStack";
import { StateProcessorDict, TokenFactory } from "../internal-types";

const DONE = {
  done: true,
  value: undefined,
} as const;

export class TokenIterator<T extends LexerTypings>
  implements IterableIterator<BaaToken<T>>
{
  private readonly _string: string;
  private readonly _states: StateStack<T>;
  private readonly _tokenFactory: TokenFactory<T>;

  private _offset: number;

  constructor(
    states: StateProcessorDict<T>,
    string: string,
    tokenFactory: TokenFactory<T>
  ) {
    this._string = string;
    this._offset = 0;
    this._states = createStateStack(states);
    this._tokenFactory = tokenFactory;
  }

  [Symbol.iterator](): IterableIterator<BaaToken<T>> {
    return this;
  }

  next(): IteratorResult<BaaToken<T>> {
    const token = this.nextToken();
    return token == null ? DONE : { done: false, value: token };
  }

  nextToken(): BaaToken<T> | null {
    if (this._offset >= this._string.length) {
      return null;
    }
    const match = this._nextMatchOrSyntaxError();
    this._offset += match.text.length;
    const token = this._tokenFactory.createToken(match);

    if (match.rule.push) this._states.push(match.rule.push);
    if (match.rule.pop) this._states.pop();
    if (match.rule.next) this._states.next(match.rule.next);

    return token;
  }

  private _nextMatchOrSyntaxError() {
    try {
      return this._states.current.nextMatch(this._string, this._offset);
    } catch (error) {
      if (error instanceof InternalSyntaxError) {
        throw new Error(this._syntaxError(error));
      }
      throw error;
    }
  }
  private _syntaxError(error: InternalSyntaxError) {
    const { line, column } = this._tokenFactory.currentLocation;
    const types = error.expectedTokenTypes
      .map((type) => "`" + type + "`")
      .join(", ");
    return `Syntax error at ${line}:${column}, expected one of ${types} but got '${error.foundChar}'`;
  }
}
