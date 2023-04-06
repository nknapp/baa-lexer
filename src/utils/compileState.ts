import { LexerTypings, MooState, Rule, TokenType } from "../types";
import { CombinedRegex, combineRegex } from "./combineRegex";

export interface CompiledRule<T extends LexerTypings> {
  type: TokenType<T>;
  match: RegExp;
}

export interface CompiledState<T extends LexerTypings> {
    rules: CompiledRule<T>[],
    regex: CombinedRegex
}
export function compileState<T extends LexerTypings>(state: MooState<T>): CompiledState<T> {
    const rules = entries(state as Record<TokenType<T>,Rule<T>>).map(entry => {
      return compileRule(entry[0],entry[1]);
    })
    return {
        rules,
        regex: combineRegex(rules.map(rule => rule.match))
    }
}

function compileRule<T extends LexerTypings>(type: TokenType<T>, rule: Rule<T>) {
    return {
        type,
        match: regexFromRule(rule)
    };
}


function regexFromRule<T extends LexerTypings>(rule: Rule<T>): RegExp {
    return (rule as {match: RegExp}).match
}

const entries = Object.entries as <K extends string,V>(object: Record<K,V>) => [K,V][]