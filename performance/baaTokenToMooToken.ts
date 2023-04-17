import { Lexer } from "moo";
import { BaaToken, LexerTypings } from "baa-lexer";

export function* baaTokenToMooToken(
  moo: Lexer
): Generator<BaaToken<LexerTypings>> {
  const first = moo.next();
  if (first == null) return;
  let previous = first;
  let token = null;
  while ((token = moo.next()) != null) {
    yield {
      type: previous.type as string,
      original: previous.text,
      value: previous.value,
      start: { line: previous.line, column: previous.col - 1 },
      end: { line: token.line, column: token.col - 1 },
    };
    previous = token;
  }
  if (previous != null) {
    const end =
      previous.lineBreaks === 0
        ? {
            line: previous.line,
            column: previous.col + previous.text.length - 1,
          }
        : {
            line: previous.line + previous.lineBreaks,
            column: previous.text.length - previous.text.lastIndexOf("\n") - 1,
          };
    yield {
      type: previous.type as string,
      original: previous.text,
      value: previous.value,
      start: { line: previous.line, column: previous.col - 1 },
      end,
    };
  }
}
