import {BaaContext, CompiledState, LexerTypings} from "../types";
import {RuleMatcher, RuleMatcherFactory} from "./index";


export class RuleBasedState<T extends LexerTypings> implements CompiledState<T>{
    #matcher: RuleMatcher<T>

    constructor(matcher: RuleMatcherFactory<T>) {
        this.#matcher = matcher();
    }

    process(context: BaaContext<T>): void {
        const match = this.#matcher.exec(context.string, context.offset);
        if (match != null) {
            context.addToken(match.rule.type, match.text, match.text);
        } else {
            throw new Error("test");
        }
    }
}