import {LexerTypings, Rule, StateName, TokenType} from "../types";
import {CompiledRule, Transform} from "../internal-types";

export function compileRule<T extends LexerTypings>(
  type: TokenType<T>,
  rule: Rule<T>
): CompiledRule<T> {
  let lineBreaks = false
  let pop = false
  let push: StateName<T> | null = null
  let next: StateName<T> | null = null
  let value: Transform | null = null
  if (typeof rule === 'object') {
    lineBreaks = ("lineBreaks" in rule && rule.lineBreaks) ?? false
    pop = ("pop" in rule && rule.pop === 1)
    push = ("push" in rule ? rule.push : null) ?? null
    next = ("next" in rule ? rule.next : null) ?? null
    value = ("value" in rule ? rule.value : null) ?? null
  }

  return {type, lineBreaks, pop, push, next, value}
}

