import { baa } from "baa-lexer";

const lexer = baa({
  main: {
    A: "a",
    FALLBACK: { fallback: true },
    B: "b",
  },
});

for (const token of lexer.lex("a b")) {
  console.log(token);
}
/*
{ type: 'A',  original: 'a',value: 'a',start: { line: 1, column: 0 },end: { line: 1, column: 1 } }
{ type: 'FALLBACK', original: ' ', value: ' ', start: { line: 1, column: 1 }, end: { line: 1, column: 2 } }
{ type: 'B', original: 'b', value: 'b', start: { line: 1, column: 2 }, end: { line: 1, column: 3 } }
 */
