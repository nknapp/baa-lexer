import { LexerTypings, MooRule, TokenType } from "../types";
import { BaaRule } from "../internal-types";

export function convertMooRule<T extends LexerTypings>(
  type: TokenType<T>,
  rule: MooRule<T>
) {
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
  const r = rule as Partial<Omit<BaaRule<T>, "type">>;
  return {
    type,
    pop: r.pop,
    push: r.push,
    next: r.next,
    lineBreaks: r.lineBreaks,
    value: r.value,
    match: r.match,
  };
}
