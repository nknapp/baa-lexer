import { LexerTypings, MooStates, Lexer } from "./types";
import { BaaLexer } from "./BaaLexer";

export type { MooStates, Token, LexerTypings, Lexer } from "./types";

export { withLookAhead } from "./utils/withLookAhead";
export function baa<T extends LexerTypings>(states: MooStates<T>): Lexer<T> {
  return new BaaLexer<T>(states);
}
