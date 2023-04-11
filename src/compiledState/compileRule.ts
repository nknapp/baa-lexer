import { LexerTypings, Rule, StateName, TokenType } from "../types";
import { CompiledRule, Transform } from "../internal-types";

export function compileRule<T extends LexerTypings>(
  type: TokenType<T>,
  rule: Rule<T>
): CompiledRule<T> {
  if (rule instanceof RegExp) {
    return new CompiledRuleImpl(type, {});
  }
  if (typeof rule === "string") {
    return new CompiledRuleImpl(type, {});
  }
  return new CompiledRuleImpl(type, rule);
}

class CompiledRuleImpl<T extends LexerTypings> {
  type: TokenType<T>;
  push?: StateName<T>;
  pop?: 1;
  next?: StateName<T>;
  lineBreaks?: boolean;
  value?: Transform;

  constructor(
    type: TokenType<T>,
    rule: Partial<Omit<CompiledRule<T>, "type">>
  ) {
    this.type = type;
    this.pop = rule.pop;
    this.push = rule.push;
    this.next = rule.next;
    this.lineBreaks = rule.lineBreaks;
    this.value = rule.value;
  }
}