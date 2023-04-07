import { describe, expect, it } from "vitest";
import { combineRegex } from "./combineRegex";

describe("combineRegex", () => {
  it("initially, lastIndex is 0, lastMatch is null, lastRegex is -1", () => {
    expect(combineRegex([/a/]).matchIndex).toBe(0);
    expect(combineRegex([/a/]).match).toBe(null);
    expect(combineRegex([/a/]).matchingRegex).toBe(-1);
  });

  describe("when initialized with a single regex, calling the exec method", () => {
    it("returns true if the regex matches", () => {
      const matchingA = combineRegex([/a/]);
      expect(matchingA.exec("a")).toBe(true);
    });
    it("returns false if the regex does not match", () => {
      const matchingA = combineRegex([/a/]);
      expect(matchingA.exec("b")).toBe(false);
    });

    it("stores the match in lastMatch", () => {
      const matchingA = combineRegex([/a/]);
      matchingA.exec("a");
      expect(matchingA.match).toBe("a");
    });

    it("stores 0 in lastRegex", () => {
      const matchingA = combineRegex([/a/]);
      matchingA.exec("aa");
      expect(matchingA.matchingRegex).toBe(0);
    });

    it("stores matching position within string as 'matchIndex'", () => {
      const matchingA = combineRegex([/a/]);
      matchingA.exec("a");
      expect(matchingA.matchIndex).toBe(0);
    });

    it("advances in multiple matches", () => {
      const matchingA = combineRegex([/a/]);
      matchingA.exec("aba");
      matchingA.exec("aba");
      expect(matchingA.matchIndex).toBe(2);
      expect(matchingA.match).toBe("a");
      expect(matchingA.matchingRegex).toBe(0);
    });

    it("with sticky option set, does not jump chars", () => {
      const matchingA = combineRegex([/a/], { sticky: true });
      expect(matchingA.exec("ba")).toBe(false);
    });
  });

  describe("with multiple regexes", () => {
      it("also matches the second string string", () => {
          const matchingAB = combineRegex([/a/,/b/])
          expect(matchingAB.exec("xb")).toBe(true)
      })

      it("stores the match for the seconds regex", () => {
          const matchingAB = combineRegex([/a/,/b/])
          matchingAB.exec("xb")
          expect(matchingAB.match).toBe("b")
      })

      it("stores matchingRegex of 1 for the second regex", () => {
          const matchingAB = combineRegex([/a/,/b/])
          matchingAB.exec("xb")
          expect(matchingAB.matchingRegex).toBe(1)
      })

      it("stores matchingIndex for the second regex", () => {
          const matchingAB = combineRegex([/a/,/b/])
          matchingAB.exec("xb")
          expect(matchingAB.matchIndex).toBe(1)
      })

      it("starts matching at 'lastIndex", () => {
          const matchingAB = combineRegex([/a/,/b/])
          matchingAB.reset(1)
          matchingAB.exec("ab")
          expect(matchingAB.match).toEqual("b")
      })
  })
});
