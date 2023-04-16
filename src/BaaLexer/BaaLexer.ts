import { LexerTypings, StateName, Token } from "../types";
import {CompiledState, CompiledStateDict, TokenFactory} from "../internal-types";
import { TokenIterator } from "./TokenIterator";

export class BaaLexer<T extends LexerTypings> {
  private readonly _states: Record<StateName<T>, CompiledState<T>>;
  private readonly _createTokenFactory: () => TokenFactory<T>;

  constructor(states: CompiledStateDict<T>, tokenFactory: () => TokenFactory<T>) {
    this._createTokenFactory = tokenFactory;
    this._states = states;
  }
  lex(string: string): IterableIterator<Token<T>> {
    return new TokenIterator(this._states, string, this._createTokenFactory());
  }
}
