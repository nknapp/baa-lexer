import { Location } from "../types";

export function createLocationTracker() {
  return {
    current: { line: 1, column: 0 },
    advance(token: string, { multiline = false } = {}): Location {
      return (this.current = nextLocation(this.current, token, multiline));
    },
  };
}

function nextLocation(
    current: Location,
    token: string,
    multiline: boolean
) {
  if (!multiline) {
    return singleLine(current, token);
  }
  const firstNewline = token.indexOf("\n");
  if (firstNewline < 0) {
    return singleLine(current, token);
  }
  return multiLine(current, token, firstNewline);
}

function multiLine(current: Location, token: string, firstNewline: number) {
  let line = current.line;
  let lastNewline = firstNewline;
  let next: number = firstNewline;
  while (next >= 0) {
    line++;
    lastNewline = next;
    next = token.indexOf("\n", next + 1);
  }
  const column = token.length - lastNewline - 1;
  return { line, column };
}

function singleLine(current: Location, token: string) {
  return { line: current.line, column: current.column + token.length };
}
