import {
  LexerTypings,
  MooState,
  Rule,
  TokenType,
} from "../types";
import { CombinedRegex, combineRegex } from "./combineRegex";
import { splitRules } from "./splitRules";

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
  const { error, match, fallback } = splitRules(state);
  const regexes: RegExp[] = [];
  const rules: CompiledRule<T>[] = [];
  for (const { type, rule } of match) {
    regexes.push(regexFromRule(rule));
    rules.push({ type });
  }
  const combinedRegex = combineRegex(regexes, { sticky: fallback == null });
  return new CompiledState<T>(
    rules,
    combinedRegex,
    fallback ? { type: fallback.type } : null,
    error? { type: error.type } : null
  );
}

export class CompiledState<T extends LexerTypings> {
  readonly rules: CompiledRule<T>[];
  readonly regex: CombinedRegex;
  readonly fallback: CompiledRule<T> | null = null;
  readonly error: CompiledRule<T> | null = null;

  pendingMatch: Match<T> | null = null;

  constructor(
    rules: CompiledRule<T>[],
    regex: CombinedRegex,
    fallback: CompiledRule<T> | null,
    error: CompiledRule<T> | null
  ) {
    this.rules = rules;
    this.regex = regex;
    this.fallback = fallback;
    this.error = error;
  }

  nextMatch(string: string, offset: number): Match<T> {
    if (this.pendingMatch != null) {
      const match = this.pendingMatch;
      this.pendingMatch = null;
      return match;
    }
    this.regex.reset(offset);
    const match = this.computeMatch(string, offset);
    if (match == null) {
      const rule = this.fallback ?? this.error ?? this.#throwError(string, offset)
      return {
        rule,
        offset,
        text: string.slice(offset, string.length),
      };
    }
    if (match.offset > offset) {
      if (this.fallback) {
        this.pendingMatch = match;
        return {
          rule: this.fallback,
          offset,
          text: string.slice(offset, match.offset),
        };
      } else {
        throw new Error("Error");
      }
    }
    return match;
  }

  #throwError(string: string, offset: number): never {
    const expectedTokens = this.rules.map(rule => rule.type)
    throw new BaaSyntaxError(expectedTokens, string[offset]);
  }

  computeMatch(string: string, offset: number): Match<T> | null {
    this.regex.matchIndex = offset;
    if (this.regex.exec(string)) {
      const matchingRule = this.rules[this.regex.matchingRegex];
      return {
        rule: matchingRule,
        text: this.regex.match as string,
        offset: this.regex.matchIndex,
      };
    }
    return null;
  }
}

export class BaaSyntaxError  extends Error {
  readonly expectedTokenTypes: string[];
  readonly foundChar: string;
  constructor(expectedTokenTypes: string[], foundChar: string) {
    super("Syntax error")
    this.expectedTokenTypes = expectedTokenTypes;
    this.foundChar = foundChar
  }
}

function regexFromRule<T extends LexerTypings>(rule: Rule<T>): RegExp {
  return (rule as { match: RegExp }).match;
}
