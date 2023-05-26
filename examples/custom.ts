import {
  BaaRule,
  createLexer,
  createStateProcessor,
  createTokenFactory,
  Match,
  mooState,
} from "baa-lexer";

type MyLexerTypings = {
  tokenType: "A" | "B" | "FALLBACK" | "OPEN" | "CLOSE";
  stateName: "braces";
};

const OPEN = {
  type: "OPEN",
  next: "braces",
} satisfies BaaRule<MyLexerTypings>;

const A = {
  type: "A",
} satisfies BaaRule<MyLexerTypings>;

const customRegex = /[(a]/g;
const customMatcher = createStateProcessor<MyLexerTypings>(
  ["A", "OPEN"],
  {
    match(string: string, offset: number): Match<MyLexerTypings> | null {
      customRegex.lastIndex = offset;
      const match = customRegex.exec(string);
      if (match == null || match.index == null) return null;
      switch (string.charCodeAt(match.index)) {
        case 40:
          return {
            rule: OPEN,
            text: "(",
            offset: match.index,
          };
        case 97:
          return {
            rule: A,
            text: "a",
            offset: match.index,
          };
      }
      return null;
    },
    debug() {
      return { type: "customMatcher" };
    },
  },
  { type: "FALLBACK", lineBreaks: true },
  null
);

const lexer = createLexer<MyLexerTypings>(
  {
    main: customMatcher,
    braces: mooState({
      B: "b",
      CLOSE: {
        match: ")",
        next: "main",
      },
    }),
  },
  createTokenFactory
);

// eslint-disable-next-line no-console
console.log([...lexer.lex("a  (b)a")]);
