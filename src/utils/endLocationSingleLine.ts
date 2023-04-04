import { Location } from "../types";

export function endLocationSingleLine(
  startPosition: Location,
  tokenOriginal: string
) {
  return {
    line: startPosition.line,
    column: startPosition.column + tokenOriginal.length,
  };
}
