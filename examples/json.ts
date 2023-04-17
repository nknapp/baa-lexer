import { baa, LexerTypings } from "baa-lexer";

interface Typings extends LexerTypings {
  stateName: "main";
  tokenType: "{" | "}" | "[" | "]" | "," | ":" | "space" | "NUMBER" | "STRING" | "TRUE" | "FALSE" | "NULL";
}

const lexer = baa<Typings>({
  main: {
    "{": "{",
    "}": "}",
    "[": "[",
    "]": "]",
    ",": ",",
    ":": ":",
    space: { match: /\s+/, lineBreaks: true },
    NUMBER: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
    STRING: /"(?:\\["bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
    TRUE: /true\b/,
    FALSE: /false\b/,
    NULL: /null\b/,
  },
});

for (const token of lexer.lex('{ "abc": "x" }')) {
    switch (token.type) {
      case "FALSE":
    }
}