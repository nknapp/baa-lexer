import {LexerTypings, Token} from "../types";
import {CompiledStateDict, TokenFactory} from "../internal-types";
import {createStateStack} from "./StateStack";
import {InternalSyntaxError} from "../InternalSyntaxError";

const DONE = {
    done: true,
    value: undefined,
} as const;

export function createTokenIterator<T extends LexerTypings>(
    states: CompiledStateDict<T>,
    string: string,
    tokenFactory: TokenFactory<T>
): IterableIterator<Token<T>>  {

    let offset = 0;
    const stateStack = createStateStack(states);

    function nextToken(): Token<T> | null {
        if (offset >= string.length) {
            return null;
        }
        const match = nextMatchOrSyntaxError();
        offset += match.text.length;
        const token = tokenFactory.createToken(match);

        if (match.rule.push) stateStack.push(match.rule.push);
        if (match.rule.pop) stateStack.pop();
        if (match.rule.next) stateStack.next(match.rule.next);

        return token;
    }


    function nextMatchOrSyntaxError() {
        try {
            return stateStack.current.nextMatch(string, offset);
        } catch (error) {
            if (error instanceof InternalSyntaxError) {
                throw new Error(syntaxError(error));
            }
            throw error;
        }
    }
    function syntaxError(error: InternalSyntaxError) {
        const { line, column } = tokenFactory.currentLocation;
        const types = error.expectedTokenTypes
            .map((type) => "`" + type + "`")
            .join(", ");
        return `Syntax error at ${line}:${column}, expected one of ${types} but got '${error.foundChar}'`;
    }


    return {
        [Symbol.iterator](): IterableIterator<Token<T>> {
            return this;
        },
        next(): IteratorResult<Token<T>> {
            const token = nextToken();
            return token == null ? DONE : { done: false, value: token };
        }
    }
}
