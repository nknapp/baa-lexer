import { LexerTypings, StateName, Token } from "../types";
import {
  CompiledState,
  CompiledStateDict,
  TokenFactory,
} from "../internal-types";
import { TokenIterator } from "../TokenIterator";
import { TokenFactoryImpl } from "../TokenFactory/TokenFactory";

export class BaaLexer<T extends LexerTypings> {
  private readonly _states: Record<StateName<T>, CompiledState<T>>;
  private readonly _tokenFactoryFactory: () => TokenFactory<T>;

  constructor(
    states: CompiledStateDict<T>,
    { tokenFactory: tokenFactoryFactory = () => new TokenFactoryImpl() } = {}
  ) {
    this._states = states;
    this._tokenFactoryFactory = tokenFactoryFactory;
  }
  lex(string: string): IterableIterator<Token<T>> {
    return new TokenIterator(this._states, string, this._tokenFactoryFactory());
  }
}
