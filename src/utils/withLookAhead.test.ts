import { describe, expect, it } from "vitest";
import { withLookAhead } from "./withLookAhead";

describe("withLookahead", () => {
  it("creates a regex", () => {
    expect(withLookAhead(/a/, /b/)).toBeInstanceOf(RegExp);
  });

  it("regex does not match any arbitrary string", () => {
    const result = withLookAhead(/a/, /b/);
    expect("bb".match(result)).toBeNull();
  });

  it("regex matches first param followed by second", () => {
    const result = withLookAhead(/a/, /b/);
    expect("ab".match(result)).not.toBeNull();
  });
  it("regex matches first param followed by second (different regex", () => {
    const result = withLookAhead(/c/, /b/);
    expect("cb".match(result)).not.toBeNull();
  });

  it("regex does not match first param followed by string not matching the lookahead", () => {
    const result = withLookAhead(/c/, /b/);
    expect("cb".match(result)).not.toBeNull();
  });

  it("wrapping the resulting regex into a matching group only returns the first part", () => {
    const result = withLookAhead(/c/, /b/);
    const wrapped = new RegExp("(" + result.source + ")");
    expect("cb".match(wrapped)?.[1]).toEqual("c");
  });
});
