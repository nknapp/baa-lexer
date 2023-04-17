import {
  Lexer,
  LexerTypings,
  StateProcessorDict,
  TokenFactory,
} from "../types";
import { BaaLexer } from "./BaaLexer";

export { BaaLexer } from "./BaaLexer";

export function createLexer<T extends LexerTypings>(
  states: StateProcessorDict<T>,
  createTokenFactory: () => TokenFactory<T>
): Lexer<T> {
  return new BaaLexer(states, createTokenFactory);
}
