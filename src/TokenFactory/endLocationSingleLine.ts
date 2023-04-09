import { Location } from "../types";

export function endLocationSingleLine(
  startPosition: Location,
  tokenOriginal: string
): Location {
  return {
    line: startPosition.line,
    column: startPosition.column + tokenOriginal.length,
  };
}
