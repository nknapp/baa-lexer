import { LexerTypings, StateDict } from "./types";
import { BaaLexer } from "./BaaLexer";

export { BaaLexer } from "./BaaLexer";

export type { Token, LexerTypings } from "./types";

export function baa<T extends LexerTypings>(states: StateDict<T>): BaaLexer<T> {
    return new BaaLexer(states)
}

