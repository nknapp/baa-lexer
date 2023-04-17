import { describe, expect, it } from "vitest";
import { convertMooRule } from "./convertMooRule";

describe("compileRule", () => {
  it("sets type", () => {
    expect(convertMooRule("A", /a/).type).toEqual("A");
  });

  it("sets lineBreaks", () => {
    expect(convertMooRule("A", /a/).lineBreaks).toBeFalsy();
  });

  it("sets lineBreaks for fallback rules", () => {
    expect(
      convertMooRule("A", { fallback: true, lineBreaks: true }).lineBreaks
    ).toBe(true);
  });

  it("sets 'pop' for object rules with 'pop: 1'", () => {
    expect(convertMooRule("A", { match: /a/, pop: 1 }).pop).toBe(1);
  });

  it("sets 'push' for object rules with 'push'", () => {
    expect(convertMooRule("A", { match: /a/, push: "a" }).push).toBe("a");
  });

  it("sets 'push=null' for object rules without 'push'", () => {
    expect(convertMooRule("A", { match: /a/ }).push).toBeFalsy();
  });

  it("sets 'push=null' for non-object rules", () => {
    expect(convertMooRule("A", "a").push).toBeFalsy();
  });

  it("sets 'next' for object rules with 'next'", () => {
    expect(convertMooRule("A", { match: /a/, next: "a" }).next).toBe("a");
  });

  it("sets 'next=null' for object rules without 'next'", () => {
    expect(convertMooRule("A", { match: /a/ }).next).toBeFalsy();
  });

  it("sets 'next=null' for non-object rules", () => {
    expect(convertMooRule("A", "a").next).toBeFalsy();
  });

  it("sets 'value' for object rules with 'value'", () => {
    const value = () => "a";
    expect(convertMooRule("A", { match: /a/, value }).value).toBe(value);
  });

  it("sets 'value=null' for object rules without 'value'", () => {
    expect(convertMooRule("A", { match: /a/ }).value).toBeFalsy();
  });

  it("sets 'value=null' for non-object rules", () => {
    expect(convertMooRule("A", "a").value).toBeFalsy();
  });

  it("sets 'match=null' for rules without match", () => {
    expect(convertMooRule("A", { fallback: true }).match).toBeFalsy();
  });

  it("sets 'match' for rules with string match", () => {
    expect(convertMooRule("A", { match: "a" }).match).toBe("a");
  });

  it("sets 'match' for simple rules with string match", () => {
    expect(convertMooRule("A", "a").match).toBe("a");
  });

  it("sets 'match' for simple rules with regex match", () => {
    expect(convertMooRule("A", /a/).match).toEqual(/a/);
  });
});
