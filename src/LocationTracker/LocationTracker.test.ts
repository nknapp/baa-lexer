import { describe, expect, it } from "vitest";
import { LocationTracker } from "./LocationTracker";

describe("LocationTracker", () => {
  it("has an initial location of 1:0", () => {
    const locationTracker = new LocationTracker();
    expect(locationTracker.current).toEqual({
      line: 1,
      column: 0,
    });
  });

  it("advances the location by the number of chars in the token", () => {
    const locationTracker = new LocationTracker();
    locationTracker.advance("abc");
    expect(locationTracker.current).toEqual({
      line: 1,
      column: 3,
    });
  });

  it("creates a new location for every 'advance'", () => {
    const locationTracker = new LocationTracker();
    const location = locationTracker.current;
    locationTracker.advance("abc");
    expect(location).toEqual({
      line: 1,
      column: 0,
    });
  });

  it("advances lines if line-breaks are in the token", () => {
    const locationTracker = new LocationTracker();
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

  it("'advance' returns the new location", () => {
    const locationTracker = new LocationTracker();
    locationTracker.advance("a\nbc", { multiline: true });
    expect(locationTracker.current).toEqual({
      line: 2,
      column: 2,
    });
    const newLocation = locationTracker.advance("a\n\nbcd", { multiline: true });
    expect(newLocation).toEqual({
      line: 4,
      column: 3,
    });
  });
});
