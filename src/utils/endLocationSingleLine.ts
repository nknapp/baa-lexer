import { Location } from "../types";

export class LocationImpl {
  line: number;
  column: number;

  constructor(line: number, column: number) {
    this.line = line;
    this.column = column;
  }

  advanceColumns(columns: number) {
    return new LocationImpl(this.line, this.column + columns);
  }
}

export function endLocationSingleLine(
  startPosition: Location,
  tokenOriginal: string
): Location {
  return {
    line: startPosition.line,
    column: startPosition.column + tokenOriginal.length,
  };
}
