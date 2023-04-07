import { describe, expect, it } from "vitest";
import { BaaSyntaxError, compileState } from "./compileState";
import { combineRegex } from "./combineRegex";
import { LexerTypings, MooState } from "../types";

describe("compileState", function () {
  it("an empty state has no rules", () => {
    const state = compileState({});
    expect(state.rules).toEqual([]);
    expect(state.regex).toEqual(combineRegex([], { sticky: true }));
    expect(state.fallback).toBeNull();
  });

  it("a state with one rule", () => {
    const state = compileState({
      A: { match: /a/ },
    });
    expect(state.rules).toEqual([{ type: "A" }]);
    expect(state.regex).toEqual(combineRegex([/a/], { sticky: true }));
    expect(state.fallback).toEqual(null);
  });

  it("a state with a fallback rule", () => {
    const state = compileState({ A: { match: /a/ }, B: { fallback: true } });
    expect(state.rules).toEqual([{ type: "A" }]);
    expect(state.regex).toEqual(combineRegex([/a/], { sticky: false }));
    expect(state.fallback).toEqual({ type: "B" });
  });

  describe(" when there is no match an now fallback rule", () => {
    function expectError<T extends LexerTypings>(
      state1: MooState<T>,
      string: string,
      expectedTokenTypes: string[],
      foundChar: string
    ) {
      const compiledState = compileState(state1);
      try {
        for (let i=0; i<string.length; i++) {
          compiledState.nextMatch(string, i);
        }
        expect.fail("Should throw an exception");
      } catch (error) {
        expect(error).toBeInstanceOf(BaaSyntaxError);
        expect(error).toHaveProperty("expectedTokenTypes", expectedTokenTypes);
        expect(error).toHaveProperty("foundChar", foundChar);
      }
    }

    it("throw BaaSyntaxError containing the expected tokens and the found char", () => {
      expectError(
        {
          A: { match: /a/ },
        },
        "b",
        ["A"],
        "b"
      );
    });
    it("throw BaaSyntaxError with different values for a different state and string", () => {
      expectError(
          {
            B: { match: /b/ },
          },
          "c",
          ["B"],
          "c"
      );
    });
    it("throw BaaSyntaxError with different foundChar from different offset", () => {
      expectError(
          {
            B: { match: /b/ },
          },
          "bbc",
          ["B"],
          "c"
      );
    });
  });
});
