import { describe, expect, it } from "vitest";
import { compileState } from "./compileState";
import { combineRegex } from "./combineRegex";

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
});
