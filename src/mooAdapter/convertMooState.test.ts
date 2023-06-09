import { describe, expect, it } from "vitest";
import { mooState } from "./index";
import { LexerTypings, MooState } from "../types";
import { UnexpectedToken } from "../errors";

function baaContext() {
  return { pendingMatch: null };
}

describe("compileState", function () {
  it("a state without fallback rule matches at the current offset", () => {
    const state = mooState({
      A: { match: /a/ },
    });

    expect(state.nextMatch("a", 0, baaContext())).toEqual({
      offset: 0,
      rule: expect.objectContaining({ type: "A" }),
      text: "a",
    });
  });

  describe("when there is no match an now fallback rule", () => {
    function expectError<T extends LexerTypings>(
      state1: MooState<T>,
      string: string,
      expectedTokenTypes: string[],
      foundChar: string
    ) {
      const compiledState = mooState(state1);
      try {
        for (let i = 0; i < string.length; i++) {
          compiledState.nextMatch(string, i, baaContext());
        }
        expect.fail("Should throw an exception");
      } catch (error) {
        expect(error).toBeInstanceOf(UnexpectedToken);
        expect(error).toHaveProperty("expected", expectedTokenTypes);
        expect(error).toHaveProperty("found", foundChar);
      }
    }

    it("throw InternalSyntaxError containing the expected tokens and the found char", () => {
      expectError(
        {
          A: { match: /a/ },
        },
        "b",
        ["A"],
        "b"
      );
    });
    it("throw InternalSyntaxError with different values for a different state and string", () => {
      expectError(
        {
          B: { match: /b/ },
        },
        "c",
        ["B"],
        "c"
      );
    });
    it("throw InternalSyntaxError with different foundChar from different offset", () => {
      expectError(
        {
          B: { match: /b/ },
        },
        "bbc",
        ["B"],
        "c"
      );
    });

    it("delivers error token", () => {
      const state = mooState({
        A: { match: /a/ },
        ERROR: { error: true },
      });
      expect(state.nextMatch("ba", 0, baaContext())).toEqual({
        rule: expect.objectContaining({ type: "ERROR" }),
        text: "ba",
        offset: 0,
      });
    });
  });

  it("'push' property is part of the match", () => {
    const state = mooState({
      A: { match: /a/, push: "newState" },
    });
    expect(state.nextMatch("a", 0, baaContext())).toEqual({
      rule: expect.objectContaining({ type: "A", push: "newState" }),
      text: "a",
      offset: 0,
    });
  });

  it("'pop' property is part of the match", () => {
    const state = mooState({
      A: { match: /a/, pop: 1 },
    });
    expect(state.nextMatch("a", 0, baaContext())).toEqual({
      rule: expect.objectContaining({ type: "A", pop: 1 }),
      text: "a",
      offset: 0,
    });
  });

  it("'next' property is part of the match", () => {
    const state = mooState({
      A: { match: /a/, next: "newState" },
    });
    expect(state.nextMatch("a", 0, baaContext())).toEqual({
      rule: expect.objectContaining({ type: "A", next: "newState" }),
      text: "a",
      offset: 0,
    });
  });

  it("'lineBreaks' property is part of the match for match-rules", () => {
    const state = mooState({
      A: { match: /a/, lineBreaks: true },
    });
    expect(state.nextMatch("a", 0, baaContext())).toEqual({
      rule: expect.objectContaining({ type: "A", lineBreaks: true }),
      text: "a",
      offset: 0,
    });
  });

  it("'lineBreaks' property is part of the match for fallback-rules", () => {
    const state = mooState({
      A: { match: /a/ },
      B: { fallback: true, lineBreaks: true },
    });
    expect(state.nextMatch("b", 0, baaContext())).toEqual({
      rule: expect.objectContaining({ type: "B", lineBreaks: true }),
      text: "b",
      offset: 0,
    });
  });

  it("'value' property is part of the match", () => {
    const value = (v: string) => `(${v})`;
    const state = mooState({
      A: { match: /a/, value },
    });
    expect(state.nextMatch("a", 0, baaContext())).toEqual({
      rule: expect.objectContaining({ type: "A", value }),
      text: "a",
      offset: 0,
    });
  });
});
