import { Location } from "../types";

export function createLocationTracker() {

  function nextLocation(token: string, multiline: boolean) {
    if (!multiline) {
      return singleLine(token);
    }
    const firstNewline = token.indexOf("\n");
    if (firstNewline < 0) {
      return singleLine(token);
    }
    return multiLine(token, firstNewline);
  }

  function multiLine(token: string, firstNewline: number) {
    let line = result.current.line;
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

  function singleLine(token: string) {
    const { line, column } = result.current;
    return { line, column: column + token.length };
  }


  const result = {
    current: { line: 1, column: 0 },
    advance(token: string, { multiline = false } = {}): Location {
      result.current = nextLocation(token, multiline);
      return result.current;
    }

  }

  return result
}
