import {BaaContext, CompiledState, LexerTypings} from "../types";
import {FallbackRule, RuleMatcher, RulesOptions} from "./index";


export class RuleBasedState<T extends LexerTypings> implements CompiledState<T>{
    #matcher: RuleMatcher<T>
    #fallback?: FallbackRule<T>

    constructor({matcher, fallback} : RulesOptions<T>) {
        this.#fallback = fallback
        this.#matcher = matcher(fallback != null);
    }

    process(context: BaaContext<T>): void {
        const match = this.#matcher.exec(context.string, context.offset);
        if (match != null) {
            if (match.offset > context.offset && this.#fallback != null) {
                const original = context.string.slice(context.offset, match.offset)
                context.addToken(this.#fallback.type, original, original);
            }
            context.addToken(match.rule.type, match.text, match.text);
        } else {
            throw new Error("test");
        }
    }
}