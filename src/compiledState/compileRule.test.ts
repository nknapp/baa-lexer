import { describe, expect, it } from "vitest";
import { compileRule } from "./compileRule";

describe("compileRule", () => {
  it("sets type", () => {
    expect(compileRule("A", /a/).type).toEqual("A");
  });

  it("sets lineBreaks", () => {
    expect(compileRule("A", /a/).lineBreaks).toBeFalsy();
  });

  it("sets lineBreaks for fallback rules", () => {
    expect(compileRule("A", {fallback: true, lineBreaks: true}).lineBreaks).toBe(true);
  });

  it("sets 'pop' for object rules with 'pop: 1'", () => {
    expect(compileRule("A", { match: /a/, pop: 1 }).pop).toBe(1);
  });

  it("sets 'push' for object rules with 'push'", () => {
    expect(compileRule("A", { match: /a/, push: "a" }).push).toBe("a");
  });

  it("sets 'push=null' for object rules without 'push'", () => {
    expect(compileRule("A", { match: /a/ }).push).toBeFalsy()
  });

  it("sets 'push=null' for non-object rules", () => {
    expect(compileRule("A", "a").push).toBeFalsy()
  });

  it("sets 'next' for object rules with 'next'", () => {
    expect(compileRule("A", { match: /a/, next: "a" }).next).toBe("a");
  });

  it("sets 'next=null' for object rules without 'next'", () => {
    expect(compileRule("A", { match: /a/ }).next).toBeFalsy();
  });

  it("sets 'next=null' for non-object rules", () => {
    expect(compileRule("A", "a").next).toBeFalsy();
  });

  it("sets 'value' for object rules with 'value'", () => {
    const value = () => "a";
    expect(compileRule("A", { match: /a/, value: value }).value).toBe(value);
  });

  it("sets 'value=null' for object rules without 'value'", () => {
    expect(compileRule("A", { match: /a/ }).value).toBeFalsy();
  });

  it("sets 'value=null' for non-object rules", () => {
    expect(compileRule("A", "a").value).toBeFalsy();
  });
});
