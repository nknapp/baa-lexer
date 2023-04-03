import {
    LexerTypings,
    StateName,
    TokenType,
} from "../types";

export type Rule<T extends LexerTypings> =
    | MatchRule<T>
    | FallbackRule
    | ErrorRule;

export type MatchRule<T extends LexerTypings> = ObjectMatchRule<T> | RegExp | string

export interface ObjectMatchRule<T extends LexerTypings> {
    match: RegExp;
    lineBreaks?: boolean;
    lookaheadMatch?: RegExp;
    push?: StateName<T>;
    pop?: 1;
    next?: StateName<T>;
    value?: (original: string) => string;
}

export interface FallbackRule {
    fallback: true;
    lineBreaks?: boolean;
}

export interface ErrorRule {
    error: true;
}

export type MooState<T extends LexerTypings> = Partial<
    Record<TokenType<T>, Rule<T>>
>;

export type MooStates<T extends LexerTypings> = Record<
    StateName<T>,
    MooState<T>
>;

