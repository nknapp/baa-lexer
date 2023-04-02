import { BaaContext, CompiledState, LexerTypings } from "../types";

import {
  ErrorRule,
  FallbackRule,
  Match,
  RuleMatcher,
} from "./RuleBasedState.types";
import { RulesOptions } from "./RuleBasedState.factory";

export class RuleBasedState<T extends LexerTypings>
  implements CompiledState<T>
{
  #matcher: RuleMatcher<T>;
  #fallbackRule?: FallbackRule<T>;
  #errorRule?: ErrorRule<T>;

  constructor({ matcher, fallbackRule, errorRule }: RulesOptions<T>) {
    this.#fallbackRule = fallbackRule;
    this.#errorRule = errorRule;
    this.#matcher = matcher(fallbackRule != null);
  }

  process(context: BaaContext<T>): void {
    const match = this.#matcher.exec(context.string, context.offset);
    if (match != null) {
      if (match.offset > context.offset && this.#fallbackRule != null) {
        const original = context.string.slice(context.offset, match.offset);
        context.addToken(this.#fallbackRule.type, original, original);
      }
      context.addToken(
        match.rule.type,
        match.text,
        match.rule.value == null ? match.text : match.rule.value(match.text)
      );
      this.#handleStateChange(match, context);
    } else {
      context.addTokenUpToEnd(
        this.#fallbackRule?.type ??
          this.#errorRule?.type ??
          this.#throwSyntaxError(context)
      );
    }
  }

  #handleStateChange(match: Match<T>, context: BaaContext<T>) {
    if (match.rule.push) {
      context.pushState(match.rule.push);
    } else if (match.rule.next) {
      context.replaceState(match.rule.next);
    } else if (match.rule.pop) {
      context.popState();
    }
  }

  #throwSyntaxError(context: BaaContext<T>): never {
    const offset = context.offset;
    const found = context.string[offset];
    const expectedTypes = this.#matcher
      .expectedTypes()
      .map((type) => "`" + type + "`")
      .join(", ");
    throw new Error(
      `Syntax error at 1:${offset}, expected one of ${expectedTypes} but got '${found}'`
    );
  }
}
