import { Lexer, LexerTypings } from "../types";
import { BaaLexer } from "./BaaLexer";
import { StateProcessorDict, TokenFactory } from "../internal-types";

export { BaaLexer } from "./BaaLexer";

export function createLexer<T extends LexerTypings>(
  states: StateProcessorDict<T>,
  createTokenFactory: () => TokenFactory<T>
): Lexer<T> {
  return new BaaLexer(states, createTokenFactory);
}
