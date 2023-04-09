export class InternalSyntaxError extends Error {
  readonly expectedTokenTypes: string[];
  readonly foundChar: string;
  constructor(expectedTokenTypes: string[], foundChar: string) {
    super("Syntax error");
    this.expectedTokenTypes = expectedTokenTypes;
    this.foundChar = foundChar;
  }
}
