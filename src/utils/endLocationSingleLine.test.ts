import { describe, expect, it } from "vitest";

import { endLocationSingleLine } from "./endLocationSingleLine";

describe("endLocationSingleLine", () => {
  it("increases the column index by the number of chars", () => {
    expect(endLocationSingleLine({ line: 5, column: 5 }, "abc")).toEqual({
      line: 5,
      column: 8,
    });
  });
});
