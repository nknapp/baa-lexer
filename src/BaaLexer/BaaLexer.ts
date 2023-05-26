import {
  LexerTypings,
  StateName,
  BaaToken,
  StateProcessor,
  StateProcessorDict,
  TokenFactory,
  Debuggable,
} from "../types";
import { TokenIterator } from "./TokenIterator";
import { mapValues } from "../mooAdapter/mapValues";

export class BaaLexer<T extends LexerTypings> implements Debuggable {
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

  debug() {
    return mapValues(this._states, (state) => state.debug());
  }
}
