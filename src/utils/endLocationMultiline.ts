import { Location } from "../types";

export function endLocationMultiline(
  startPosition: Location,
  substring: string
): Location {
  let lastLineBreak = -1;
  let current = substring.indexOf("\n");
  if (current < 0) {
    return {
      line: startPosition.line,
      column: startPosition.column + substring.length,
    };
  }
  let linebreaks = 0;
  while (current >= 0 && linebreaks < 20) {
    lastLineBreak = current;
    current = substring.indexOf("\n", current + 1);
    linebreaks++;
  }
  return {
    line: startPosition.line + linebreaks,
    column: substring.length - lastLineBreak - 1,
  };
}
