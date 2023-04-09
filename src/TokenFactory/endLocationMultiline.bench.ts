import { describe, bench } from "vitest";
import { endLocationMultiline } from "./endLocationMultiline";
import { Location } from "../types";

describe.each([
  { name: "single line", string: "string ".repeat(200) },
  { name: "linebreak at start", string: "\n" + "string ".repeat(200) },
  { name: "linebreak at end", string: "string ".repeat(200) + "\n" },
  { name: "many linebreaks", string: "\nstring ".repeat(200) },
])("$name", () => {
  bench("endLocationMultiline", () => {
    endLocationMultiline({ line: 4, column: 4 }, "string ".repeat(200));
  });

  bench("splitStrategy", () => {
    splitStrategy({ line: 4, column: 4 }, "string ".repeat(200));
  });

  bench("reExecStrategy", () => {
    reExecStrategy({ line: 4, column: 4 }, "string ".repeat(200));
  });

  bench("iterateIndexOf", () => {
    iterateIndexOf({ line: 4, column: 4 }, "string ".repeat(200));
  });
});

// When trying out new implementations, put the original implementation here
// and modify endLocationMultiline to make comparisons.
function splitStrategy(startPosition: Location, substring: string): Location {
  const lines = substring.split(/\n/);
  const nrLines = lines.length - 1;
  if (nrLines > 0) {
    const lastLine = lines[lines.length - 1];
    return {
      line: startPosition.line + nrLines,
      column: lastLine.length,
    };
  }
  return {
    line: startPosition.line,
    column: startPosition.column + substring.length,
  };
}

function reExecStrategy(startPosition: Location, substring: string): Location {
  const reNewline = /\n/g;
  let linebreaks = 0;
  let lastLineBreak = -1;
  while (reNewline.exec(substring)) {
    linebreaks++;
    lastLineBreak = reNewline.lastIndex;
  }
  if (linebreaks === 0) {
    return {
      line: startPosition.line,
      column: startPosition.column + substring.length,
    };
  }
  return {
    line: startPosition.line + linebreaks,
    column: substring.length - lastLineBreak,
  };
}
function iterateIndexOf(startPosition: Location, substring: string): Location {
  let lastLineBreak = -1;
  let current = substring.indexOf("\n");
  if (current < 0) {
    return {
      line: startPosition.line,
      column: startPosition.column + substring.length,
    };
  }
  let linebreaks = 0;
  while (current >= 0) {
    lastLineBreak = current;
    current = substring.indexOf("\n", current + 1);
    linebreaks++;
  }
  return {
    line: startPosition.line + linebreaks,
    column: substring.length - lastLineBreak - 1,
  };
}
