import { Location } from "../types";
import { endLocationSingleLine } from "./endLocationSingleLine";

export function endLocationMultiline(
  startPosition: Location,
  tokenOriginal: string
): Location {
  let lastLineBreak = -1;
  let current = tokenOriginal.indexOf("\n");
  if (current < 0) {
    return endLocationSingleLine(startPosition, tokenOriginal);
  }
  let linebreaks = 0;
  while (current >= 0) {
    lastLineBreak = current;
    current = tokenOriginal.indexOf("\n", current + 1);
    linebreaks++;
  }
  return {
    line: startPosition.line + linebreaks,
    column: tokenOriginal.length - lastLineBreak - 1,
  };
}
