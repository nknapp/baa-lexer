import {
  LexerTypings,
  StateName,
  BaaToken,
  StateProcessor,
  StateProcessorDict,
  TokenFactory,
} from "../types";
import { TokenIterator } from "./TokenIterator";

export class BaaLexer<T extends LexerTypings> {
  private readonly _states: Record<StateName<T>, StateProcessor<T>>;
  private readonly _createTokenFactory: () => TokenFactory<T>;

  constructor(
    states: StateProcessorDict<T>,
    tokenFactory: () => TokenFactory<T>
  ) {
    this._createTokenFactory = tokenFactory;
    this._states = states;
  }
  lex(string: string): IterableIterator<BaaToken<T>> {
    return new TokenIterator(this._states, string, this._createTokenFactory());
  }
}
