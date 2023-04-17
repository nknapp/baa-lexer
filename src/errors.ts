
export class ParseError extends Error {

  constructor(message: string) {
    super(message);
  }
}

export class UnexpectedToken extends ParseError {
  readonly expected: string[];
  readonly found: string;

  constructor(expectedTokenTypes: string[], foundChar: string) {
    const types = expectedTokenTypes
        .map((type) => `\`${type}\``)
        .join(", ");
    super(`Expected one of ${types} but got '${foundChar}'`);
    this.expected = expectedTokenTypes;
    this.found = foundChar;
  }
}