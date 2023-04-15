import { LexerTypings, Rule, TokenType } from "../types";
import { CompiledRule } from "../internal-types";

export function compileRule<T extends LexerTypings>(
  type: TokenType<T>,
  rule: Rule<T>
): CompiledRule<T> {
  if (rule instanceof RegExp || typeof rule === "string") {
    return {
      type,
      pop: undefined,
      push: undefined,
      next: undefined,
      lineBreaks: false,
      value: undefined,
      match: rule,
    };
  }
  const r = rule as Partial<Omit<CompiledRule<T>, "type">>;
  return {
    type,
    pop: r.pop,
    push: r.push,
    next: r.next,
    lineBreaks: r.lineBreaks,
    value: r.value,
    match: r.match ?? null,
  };
}
