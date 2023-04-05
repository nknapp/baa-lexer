import {describe, expect, it} from "vitest";
import {combineRegex} from "./combineRegex";


describe("combineRegex", () => {
    it("returns an object with lastIndex, lastGroup, lastMatch", () => {
        expect(combineRegex([/a/])).toHaveProperty("lastIndex")
        expect(combineRegex([/a/])).toHaveProperty("lastGroup")
        expect(combineRegex([/a/])).toHaveProperty("lastMatch")
    })

    it("initially, lastIndex is 0, lastMatch is null, lastGroup is -1", () => {
        expect(combineRegex([/a/]).lastIndex).toBe(0)
        expect(combineRegex([/a/]).lastMatch).toBe(null)
        expect(combineRegex([/a/]).lastGroup).toBe(-1)
    })

    describe("when initialized with a single regex, calling the exec method", () => {


        it("returns true if the regex matches", () => {
            const matchingA = combineRegex([/a/]);
            expect(matchingA.exec("a")).toBe(true)
        })
        it("returns false if the regex does not match", () => {
            const matchingA = combineRegex([/a/]);
            expect(matchingA.exec("b")).toBe(false)
        })

        it("stores the match in lastMatch", () => {
            const matchingA = combineRegex([/a/]);
            matchingA.exec("a");
            expect(matchingA.lastMatch).toBe("a")
        })

        it("stores 0 in lastGroup", () => {
            const matchingA = combineRegex([/a/]);
            matchingA.exec("a");
            expect(matchingA.lastGroup).toBe(0)
        })

        it("stores lastIndex", () => {
            const matchingA = combineRegex([/a/]);
            matchingA.exec("a");
            expect(matchingA.lastIndex).toBe(1)
        })

        it("advances in multiple matches", () => {
            const matchingA = combineRegex([/a/]);
            matchingA.exec("aba");
            matchingA.exec("aba");
            expect(matchingA.lastIndex).toBe(3)
            expect(matchingA.lastMatch).toBe("a")
            expect(matchingA.lastGroup).toBe(0)
        })

        it("with sticky option set, does not jump chars", () => {
            const matchingA = combineRegex([/a/], {sticky: true});
            expect(matchingA.exec("ba")).toBe(false)
        })
    })
})