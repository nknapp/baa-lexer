import { LexerTypings, StateDict } from "./types";
import { BaaLexer } from "./BaaLexer";
import {MooStates, convertMooConfig} from "./moo-like";

export { BaaLexer } from "./BaaLexer";

export type { Token, LexerTypings } from "./types";

export {rules, regex, withLookAhead} from './rule-based-state'

export function baa<T extends LexerTypings>(states: StateDict<T>): BaaLexer<T> {
    return new BaaLexer(states)
}

export function moo<T extends LexerTypings>(states: MooStates<T>): BaaLexer<T> {
    return new BaaLexer<T>(convertMooConfig(states))
}

