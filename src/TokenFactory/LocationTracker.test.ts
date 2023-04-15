import { describe, expect, it } from "vitest";
import { createLocationTracker } from "./LocationTracker";

describe("LocationTracker", () => {
  it("has an initial location of 1:0", () => {
    const locationTracker = createLocationTracker();
    expect(locationTracker.current).toEqual({
      line: 1,
      column: 0,
    });
  });

  it("advances the location by the number of chars in the token", () => {
    const locationTracker = createLocationTracker();
    locationTracker.advance("abc");
    expect(locationTracker.current).toEqual({
      line: 1,
      column: 3,
    });
  });

  it("creates a new location for every 'advance'", () => {
    const locationTracker = createLocationTracker();
    const location = locationTracker.current;
    locationTracker.advance("abc");
    expect(location).toEqual({
      line: 1,
      column: 0,
    });
  });

  it("handles single-line tokens correctly, even if 'multiline' is specified", () => {
    const locationTracker = createLocationTracker();
    locationTracker.advance("abc", {multiline: true});
    expect(locationTracker.current).toEqual({
      line: 1,
      column: 3,
    });
    locationTracker.advance("abc", {multiline: true});
    expect(locationTracker.current).toEqual({
      line: 1,
      column: 6,
    });
  });

  it("advances a single newline", () => {
    const locationTracker = createLocationTracker();
    locationTracker.advance("\n", {multiline: true});
    expect(locationTracker.current).toEqual({
      line: 2,
      column: 0,
    });
  });

  it("advances lines if line-breaks are in the token", () => {
    const locationTracker = createLocationTracker();
    locationTracker.advance("a\nbc", { multiline: true });
    expect(locationTracker.current).toEqual({
      line: 2,
      column: 2,
    });
    locationTracker.advance("a\n\nbcd", { multiline: true });
    expect(locationTracker.current).toEqual({
      line: 4,
      column: 3,
    });
  });

  it("advances any number of lines", () => {
    const locationTracker = createLocationTracker();
    locationTracker.advance("a\n\nb\n\n\ncd", { multiline: true });
    expect(locationTracker.current).toEqual({
      line: 6,
      column: 2,
    });
  });


  it("'advance' returns the new location", () => {
    const locationTracker = createLocationTracker();
    locationTracker.advance("a\nbc", { multiline: true });
    expect(locationTracker.current).toEqual({
      line: 2,
      column: 2,
    });
    const newLocation = locationTracker.advance("a\n\nbcd", {
      multiline: true,
    });
    expect(newLocation).toEqual({
      line: 4,
      column: 3,
    });
  });

  describe("nextline", () => {
    it("return 1 for a single newline", () => {
      expect(nextLine("\n",0)).toEqual(1)
    })
    it("jumps to the first char of the new line", () => {
      expect(nextLine(" \n ",0)).toEqual(2)
    })

    it("jumps to the end of the string if no newline is there", () => {
      expect(nextLine("ab",0)).toEqual(2)
    })

    it("starts searching a provided offset", () => {
      expect(nextLine("012\n45\n78",4)).toEqual(7)
    })

    it("can be used in for-next-loop for count lines and determine last newline", () => {
      let lines = 0;
      const string = "012\n45\n78"
      let lastNewline = 0
      for (let i=0; i<string.length; i=nextLine(string, i)) {
        lines++;
        lastNewline = i
      }
      expect(lines).toEqual(3)
      expect(lastNewline).toEqual(7)
    })

  })
});


function nextLine(string: string, offset: number): number {
  const nextNewline = string.indexOf("\n", offset);
  return nextNewline < 0 ? string.length : nextNewline + 1
}