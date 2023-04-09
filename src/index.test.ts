import { Token, LexerTypings, Lexer, baa, withLookAhead } from "./index";
import { parseLocation } from "./test-utils/parseLocation";
import { describe, expect, it } from "vitest";
import { MooStates } from "./index";
import {runTwiceAndExpectTokens} from "./test-utils/expectToken";

describe("moo-like config", () => {
  function createLexer<T extends LexerTypings>(states: MooStates<T>): Lexer<T> {
    return baa(states);
  }

  it("parses an empty string", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /a/,
        },
        B: {
          match: /b/,
        },
      },
    });
    runTwiceAndExpectTokens(lexer, "", []);
  });

  it("parses simple tokens", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /a/,
        },
        B: {
          match: /b/,
        },
      },
    });
    runTwiceAndExpectTokens(lexer, "abab", [
      token("A", "a", "a", "1:0", "1:1"),
      token("B", "b", "b", "1:1", "1:2"),
      token("A", "a", "a", "1:2", "1:3"),
      token("B", "b", "b", "1:3", "1:4"),
    ]);
  });

  it("allows fallback tokens", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /a/,
        },
        DEFAULT: {
          fallback: true,
        },
      },
    });
    runTwiceAndExpectTokens(lexer, "a---a", [
      token("A", "a", "a", "1:0", "1:1"),
      token("DEFAULT", "---", "---", "1:1", "1:4"),
      token("A", "a", "a", "1:4", "1:5"),
    ]);
  });

  it("allows a string, that only consists of fallback", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /a/,
        },
        DEFAULT: {
          fallback: true,
        },
      },
    });
    runTwiceAndExpectTokens(lexer, "---", [token("DEFAULT", "---", "---", "1:0", "1:3")]);
  });

  it("allows a string, that ends with fallback", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /a/,
        },
        DEFAULT: {
          fallback: true,
        },
      },
    });
    runTwiceAndExpectTokens(lexer, "a---", [
      token("A", "a", "a", "1:0", "1:1"),
      token("DEFAULT", "---", "---", "1:1", "1:4"),
    ]);
  });

  it("identifies boundary of fallback token surrounded by multi-char tokens", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /aa/,
        },
        DEFAULT: {
          fallback: true,
        },
      },
    });
    runTwiceAndExpectTokens(lexer, "aa---aa", [
      token("A", "aa", "aa", "1:0", "1:2"),
      token("DEFAULT", "---", "---", "1:2", "1:5"),
      token("A", "aa", "aa", "1:5", "1:7"),
    ]);
  });

  it("throws an error if no token matches", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /aa/,
        },
        B: {
          match: /bb/,
        },
      },
    });
    const tokens = lexer.lex("aa---aa");
    expect(tokens.next().value).toEqual(token("A", "aa", "aa", "1:0", "1:2"));
    expect(() => tokens.next()).toThrow(
      "Syntax error at 1:2, expected one of `A`, `B` but got '-'"
    );
  });

  it("returns an error token containing the rest of the string, if one is configured and nothing matches", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /aa/,
        },
        ERROR: {
          error: true,
        },
      },
    });
    runTwiceAndExpectTokens(lexer, "aa---aa", [
      token("A", "aa", "aa", "1:0", "1:2"),
      token("ERROR", "---aa", "---aa", "1:2", "1:7"),
    ]);
  });

  it("changes state if a 'push' or 'pop' property is set.", () => {
    const lexer = createLexer({
      main: {
        A: { match: /a/ },
        OPEN: {
          match: /\(/,
          push: "brackets",
        },
      },
      brackets: {
        B: { match: /b/ },
        CLOSE: {
          match: /\)/,
          pop: 1,
        },
      },
    });

    runTwiceAndExpectTokens(lexer, "a(b)a", [
      token("A", "a", "a", "1:0", "1:1"),
      token("OPEN", "(", "(", "1:1", "1:2"),
      token("B", "b", "b", "1:2", "1:3"),
      token("CLOSE", ")", ")", "1:3", "1:4"),
      token("A", "a", "a", "1:4", "1:5"),
    ]);
  });

  it("changes state if a 'next' property is set.", () => {
    const lexer = createLexer({
      main: {
        A: { match: /a/ },
        OPEN: {
          match: /\(/,
          next: "brackets",
        },
      },
      brackets: {
        B: { match: /b/ },
        CLOSE: {
          match: /\)/,
          next: "main",
        },
      },
    });

    runTwiceAndExpectTokens(lexer, "a(b)a", [
      token("A", "a", "a", "1:0", "1:1"),
      token("OPEN", "(", "(", "1:1", "1:2"),
      token("B", "b", "b", "1:2", "1:3"),
      token("CLOSE", ")", ")", "1:3", "1:4"),
      token("A", "a", "a", "1:4", "1:5"),
    ]);
  });

  it("'pop' at the end of the string", () => {
    const lexer = createLexer({
      main: {
        A: { match: /a/ },
        OPEN: {
          match: /\(/,
          push: "brackets",
        },
      },
      brackets: {
        B: { match: /b/ },
        CLOSE: {
          match: /\)/,
          pop: 1,
        },
      },
    });

    runTwiceAndExpectTokens(lexer, "a(b)", [
      token("A", "a", "a", "1:0", "1:1"),
      token("OPEN", "(", "(", "1:1", "1:2"),
      token("B", "b", "b", "1:2", "1:3"),
      token("CLOSE", ")", ")", "1:3", "1:4"),
    ]);
  });

  it("pops state correcty when a fallback rule occurs after state-change", () => {
    const lexer = createLexer({
      main: {
        A: { fallback: true },
        OPEN: {
          match: /\(/,
          push: "brackets",
        },
      },
      brackets: {
        B: { match: /b/ },
        CLOSE: {
          match: /\)/,
          pop: 1,
        },
      },
    });

    runTwiceAndExpectTokens(lexer, "a(b)a", [
      token("A", "a", "a", "1:0", "1:1"),
      token("OPEN", "(", "(", "1:1", "1:2"),
      token("B", "b", "b", "1:2", "1:3"),
      token("CLOSE", ")", ")", "1:3", "1:4"),
      token("A", "a", "a", "1:4", "1:5"),
    ]);
  });

  it("resets state when lexer is used again", () => {
    const lexer = createLexer({
      main: {
        A: { fallback: true },
        OPEN: {
          match: /\(/,
          push: "brackets",
        },
      },
      brackets: {
        B: { match: /b/ },
        CLOSE: {
          match: /\)/,
          pop: 1,
        },
      },
    });

    runTwiceAndExpectTokens(lexer, "a(b", [
      token("A", "a", "a", "1:0", "1:1"),
      token("OPEN", "(", "(", "1:1", "1:2"),
      token("B", "b", "b", "1:2", "1:3"),
    ]);
  })

  it("allows concurrent parsing", () => {
    const lexer = createLexer({
      main: {
        A: { match: /a/ },
        B: { match: /b/ },
      },
    });

    const tokens1 = lexer.lex("ab");
    const tokens2 = lexer.lex("ba");

    expect(tokens1.next().value).toEqual(token("A", "a", "a", "1:0", "1:1"));
    expect(tokens2.next().value).toEqual(token("B", "b", "b", "1:0", "1:1"));

    expect(tokens1.next().value).toEqual(token("B", "b", "b", "1:1", "1:2"));
    expect(tokens2.next().value).toEqual(token("A", "a", "a", "1:1", "1:2"));
  });

  it("identifies line-breaks in the fallback rule", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /aa/,
        },
        DEFAULT: {
          fallback: true,
          lineBreaks: true,
        },
      },
    });
    runTwiceAndExpectTokens(lexer, "aa\naa", [
      token("A", "aa", "aa", "1:0", "1:2"),
      token("DEFAULT", "\n", "\n", "1:2", "2:0"),
      token("A", "aa", "aa", "2:0", "2:2"),
    ]);
  });

  it("identifies line-breaks in the match rule", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /a/,
        },
        NEWLINE: {
          match: /\n/,
          lineBreaks: true,
        },
      },
    });
    runTwiceAndExpectTokens(lexer, "a\na", [
      token("A", "a", "a", "1:0", "1:1"),
      token("NEWLINE", "\n", "\n", "1:1", "2:0"),
      token("A", "a", "a", "2:0", "2:1"),
    ]);
  });

  it("transforms values", () => {
    const lexer = createLexer({
      main: {
        A: {
          match: /a/,
          value: (original) => `(${original})`,
        },
        DEFAULT: {
          fallback: true,
        },
      },
    });
    runTwiceAndExpectTokens(lexer, "a", [token("A", "a", "(a)", "1:0", "1:1")]);
  });

  it("uses lookahead to determine token type", () => {
    const lexer = createLexer({
      main: {
        A1: {
          match: withLookAhead(/a/, /1/),
        },
        A2: {
          match: withLookAhead(/a/, /2/),
        },
        NUMBER: {
          match: /\d/,
        },
      },
    });

    runTwiceAndExpectTokens(lexer, "a1a2", [
      token("A1", "a", "a", "1:0", "1:1"),
      token("NUMBER", "1", "1", "1:1", "1:2"),
      token("A2", "a", "a", "1:2", "1:3"),
      token("NUMBER", "2", "2", "1:3", "1:4"),
    ]);
  });

  it("fallback as last token", () => {
    const lexer = createLexer({
      main: {
        A: { match: /a/ },
        B: { fallback: true },
      },
    });
    runTwiceAndExpectTokens(lexer, "ab", [
      token("A", "a", "a", "1:0", "1:1"),
      token("B", "b", "b", "1:1", "1:2"),
    ]);
  });

  it("allows shorthand rules that are just a regex", () => {
    const lexer = createLexer({
      main: {
        A: /a/,
        B: /b/,
      },
    });
    runTwiceAndExpectTokens(lexer, "ab", [
      token("A", "a", "a", "1:0", "1:1"),
      token("B", "b", "b", "1:1", "1:2"),
    ]);
  });

  it("allows shorthand rules that are just a string", () => {
    const lexer = createLexer({
      main: {
        A: "a",
        B: "b",
      },
    });
    runTwiceAndExpectTokens(lexer, "ab", [
      token("A", "a", "a", "1:0", "1:1"),
      token("B", "b", "b", "1:1", "1:2"),
    ]);
  });

  it("allows strings in match rules instead of regex", () => {
    const lexer = createLexer({
      main: {
        A: { match: "a" },
        B: { match: "b" },
      },
    });
    runTwiceAndExpectTokens(lexer, "ab", [
      token("A", "a", "a", "1:0", "1:1"),
      token("B", "b", "b", "1:1", "1:2"),
    ]);
  });

});

type LocationSpec = `${number}:${number}`;
type TestToken = Token<{ tokenType: string; stateName: string }>;

function token(
  type: string,
  original: string,
  value: string,
  start: LocationSpec,
  end: LocationSpec
): TestToken {
  // e.g. 1:0 - 1:5 (columns 0-5 on first line)
  return {
    type,
    original,
    value,
    start: parseLocation(start),
    end: parseLocation(end),
  };
}
