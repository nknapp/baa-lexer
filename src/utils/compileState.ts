import {
  FallbackRule,
  LexerTypings,
  MooState,
  Rule,
  TokenType,
} from "../types";
import { CombinedRegex, combineRegex } from "./combineRegex";

export interface CompiledRule<T extends LexerTypings> {
  type: TokenType<T>;
}

export interface Match<T extends LexerTypings> {
  rule: CompiledRule<T>;
  text: string;
  offset: number;
}

export function compileState<T extends LexerTypings>(
  state: MooState<T>
): CompiledState<T> {
  return new CompiledState<T>(state);
}

export class CompiledState<T extends LexerTypings> {
  readonly rules: CompiledRule<T>[];
  readonly regex: CombinedRegex;
  readonly fallback: CompiledRule<T> | null = null;

  pendingMatch: Match<T> | null = null;

  constructor(state: MooState<T>) {
    const regexes: RegExp[] = [];
    this.rules = [];
    const stateRecord = state as Record<TokenType<T>, Rule<T>>;
    for (const [type, rule] of entries(stateRecord)) {
      if (isFallbackRule(rule)) {
        this.fallback = { type };
      } else {
        regexes.push(regexFromRule(rule));
        this.rules.push({ type });
      }
    }
    this.regex = combineRegex(regexes, { sticky: this.fallback == null });
  }

  nextMatch(string: string, offset: number): Match<T>{
    if (this.pendingMatch != null) {
      const match = this.pendingMatch;
      this.pendingMatch = null;
      return match;
    }
    const match = this.computeMatch(string, offset);
    if (match == null) {
      if (this.fallback != null) {
        return { rule: this.fallback, offset, text: string.slice(offset, string.length) };
      }
      throw new Error("Error")
    }
    if (match.offset > offset) {
      if (this.fallback) {
        this.pendingMatch = match;
        return {
          rule: this.fallback,
          offset,
          text: string.slice(offset, match.offset),
        };
      } else { throw new Error("Error")}
    }
    return match;
  }

  computeMatch(string: string, offset: number): Match<T> | null {
    this.regex.lastIndex = offset
    if (this.regex.exec(string)) {
      const matchingRule = this.rules[this.regex.lastRegex];
      return {
        rule: matchingRule,
        text: this.regex.lastMatch as string,
        offset: this.regex.lastIndex - 1,
      };
    }
    return null;
  }
}

function isFallbackRule<T extends LexerTypings>(
  rule: Rule<T>
): rule is FallbackRule {
  return (rule as FallbackRule).fallback;
}

function regexFromRule<T extends LexerTypings>(rule: Rule<T>): RegExp {
  return (rule as { match: RegExp }).match;
}

const entries = Object.entries as <K extends string, V>(
  object: Record<K, V>
) => [K, V][];
