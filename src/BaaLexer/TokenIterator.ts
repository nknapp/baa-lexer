import {
  LexerTypings,
  BaaToken,
  Location,
  StateProcessorDict,
  TokenFactory,
} from "../types";
import { ParseError } from "../errors";
import { createStateStack, StateStack } from "./StateStack";

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
    const location = this._tokenFactory.currentLocation;
    try {
      const match = this._states.current.nextMatch(this._string, this._offset);
      this._offset += match.text.length;

      const token = this._tokenFactory.createToken(match);
      if (match.rule.push) this._states.push(match.rule.push);
      if (match.rule.pop) this._states.pop();
      if (match.rule.next) this._states.next(match.rule.next);
      return token;
    } catch (error) {
      if (error instanceof ParseError) {
        error.message = augmentErrorMessage(error.message, location);
      }
      throw error;
    }
  }
}

function augmentErrorMessage(message: string, location: Location): string {
  const { line, column } = location;
  const newMessage = message[0].toLowerCase() + message.slice(1);
  return `Syntax error at ${line}:${column}, ${newMessage}`;
}
