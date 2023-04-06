import {describe, expect, it} from "vitest";
import {compileState} from "./compileState";
import {combineRegex} from "./combineRegex";



describe('compileState', function () {
    it("an empty state has no rules", () => {
        expect(compileState({})).toEqual({
            rules: [],
            regex: combineRegex([])
        })
    })

    it("a state with one rule", () => {
        expect(compileState({
            A: { match: /a/ }
        })).toEqual({
            rules: [
                { type: "A", match: /a/}
            ],
            regex: combineRegex([/a/])
        })
    })
});