import { Location } from "../types";

export function endLocationMultiline(
  startPosition: Location,
  tokenOriginal: string
): Location {
  let { line, column } = startPosition;
  let offset = 0;
  const advance = () => {
    const nextNewline = tokenOriginal.indexOf("\n", offset);
    if (nextNewline < 0) {
      column += tokenOriginal.length - offset;
    } else {
      line++;
      column = 0;
      offset = nextNewline + 1;
      advance();
    }
  };
  advance();

  return {
    line,
    column,
  };
}
