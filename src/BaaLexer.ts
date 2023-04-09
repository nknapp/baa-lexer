import {Lexer, LexerTypings, Location, MooStates, StateName, Token} from "./types";
import {CompiledState, compileState, Match} from "./compiledState";
import { mapValues } from "./utils/mapValues";
import { TokenIterator } from "./TokenIterator";

export class BaaLexer<T extends LexerTypings> implements Lexer<T> {
  readonly #states: Record<StateName<T>, CompiledState<T>>;

  constructor(states: MooStates<T>) {
    this.#states = mapValues(states, (state) => compileState(state));
  }

  lex(string: string): IterableIterator<Token<T>> {
    return new TokenIterator<T>(this.#states, string);
  }

  #createToken(match: Match<T>, start: Location, end: Location) {
    return {
      type: match.rule.type,
      original: match.text,
      value: match.rule.value ? match.rule.value(match.text) : match.text,
      start,
      end,
    };
  }
}
