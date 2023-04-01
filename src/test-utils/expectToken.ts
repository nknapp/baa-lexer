import {LexerTypings, Token} from "../types";
import {BaaLexer} from "../BaaLexer";
import {expect} from "vitest";
import {parseLocation} from "./parseLocation";

export function expectTokens<T extends LexerTypings>(
    lexer: BaaLexer<T>,
    template: string,
    expectedTokens: TestToken[]
) {
    for (let i = 0; i < 2; i++) {
        const actualTokens = [...lexer.lex(template)];
        try {
            expect(actualTokens).toEqual(expectedTokens);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log("Unexpected tokens for template", template, actualTokens);
            throw error;
        }
    }
}

type LocationSpec = `${number}:${number}`;
type TestToken = Token<{ tokenType: string; stateName: string }>;

export function token(
    type: string,
    original: string,
    value: string,
    start: LocationSpec,
    end: LocationSpec
): TestToken {
    // e.g. 1:0 - 1:5 (columns 0-5 on first line)
    return {
        type,
        original,
        value,
        start: parseLocation(start),
        end: parseLocation(end),
    };
}
