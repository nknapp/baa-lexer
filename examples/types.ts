import { baa } from "baa-lexer";

interface Typings {
  tokenType: "OPEN" | "CLOSE";
  stateName: "main" | "other";
}

const lexer = baa<Typings>({
  main: {
    OPEN: { match: "(", push: "other" },
  },
  other: {
    CLOSE: { match: ")", pop: 1 },
  },
});

for (const token of lexer.lex("abc")) {
  switch (token.type) {
    case "OPEN":
  }
}
