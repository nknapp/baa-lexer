export class LocationTracker {
  current = { line: 1, column: 0 };

  advance(token: string) {
    // eslint-disable-next-line prefer-const
    let { line, column } = this.current;
    column += token.length;
    this.current = { line, column };
  }
}
