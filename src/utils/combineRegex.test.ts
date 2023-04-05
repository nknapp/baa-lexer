import { describe, expect, it } from "vitest";
import { combineRegex } from "./combineRegex";

describe("combineRegex", () => {
  it("returns an object with lastIndex, lastRegex, lastMatch", () => {
    expect(combineRegex([/a/])).toHaveProperty("lastIndex");
    expect(combineRegex([/a/])).toHaveProperty("lastRegex");
    expect(combineRegex([/a/])).toHaveProperty("lastMatch");
  });

  it("initially, lastIndex is 0, lastMatch is null, lastRegex is -1", () => {
    expect(combineRegex([/a/]).lastIndex).toBe(0);
    expect(combineRegex([/a/]).lastMatch).toBe(null);
    expect(combineRegex([/a/]).lastRegex).toBe(-1);
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
      expect(matchingA.lastMatch).toBe("a");
    });

    it("stores 0 in lastRegex", () => {
      const matchingA = combineRegex([/a/]);
      matchingA.exec("a");
      expect(matchingA.lastRegex).toBe(0);
    });

    it("stores lastIndex", () => {
      const matchingA = combineRegex([/a/]);
      matchingA.exec("a");
      expect(matchingA.lastIndex).toBe(1);
    });

    it("advances in multiple matches", () => {
      const matchingA = combineRegex([/a/]);
      matchingA.exec("aba");
      matchingA.exec("aba");
      expect(matchingA.lastIndex).toBe(3);
      expect(matchingA.lastMatch).toBe("a");
      expect(matchingA.lastRegex).toBe(0);
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
          expect(matchingAB.lastMatch).toBe("b")
      })

      it("stores lastRegex of 1 for the second regex", () => {
          const matchingAB = combineRegex([/a/,/b/])
          matchingAB.exec("xb")
          expect(matchingAB.lastRegex).toBe(1)
      })

      it("stores lastIndex for the second regex", () => {
          const matchingAB = combineRegex([/a/,/b/])
          matchingAB.exec("xb")
          expect(matchingAB.lastIndex).toBe(2)
      })
  })
});
