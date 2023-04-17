import {
  BaaRule,
  createLexer,
  createStateProcessor,
  createTokenFactory,
  Match,
  Matcher,
} from "../src";
import { mooState } from "../src/mooAdapter";

type MyLexerTypings = {
  tokenType: "A" | "B" | "OPEN" | "CLOSE";
  stateName: "braces";
};

const OPEN = {
  type: "OPEN",
  next: "braces",
} satisfies BaaRule<MyLexerTypings>;

const A = {
  type: "A",
} satisfies BaaRule<MyLexerTypings>;

class CustomMatcher implements Matcher<MyLexerTypings> {
  match(string: string, offset: number): Match<MyLexerTypings> | null {
    switch (string.charCodeAt(offset)) {
      case 40:
        return {
          rule: OPEN,
          text: "(",
          offset,
        };
      case 97:
        return {
          rule: A,
          text: "a",
          offset,
        };
    }
    return null;
  }
}

const lexer = createLexer<MyLexerTypings>(
  {
    main: createStateProcessor<MyLexerTypings>(
      ["A", "OPEN"],
      new CustomMatcher(),
      null,
      null
    ),
    braces: mooState({
      B: "b",
      CLOSE: {
        match: ")",
        pop: 1,
      },
    }),
  },
  createTokenFactory
);


// eslint-disable-next-line no-console
console.log([...lexer.lex("a(b)a")])