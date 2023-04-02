import { describe, expect, it } from "vitest";
import { baa, regex, rules } from "./index";
import { expectTokens, token } from "./test-utils/expectToken";

describe("baa-lexer", () => {
  it("returns an empty iterator for an empty string", () => {
    const tokens = baa({
      main: rules({
        matcher: regex({ type: "A", regex: /a/ }, { type: "B", regex: /b/ }),
      }),
    }).lex("");
    expect(tokens.next()).toEqual({ done: true, value: undefined });
  });

  describe("a lexer with regex-state", () => {
    it("parses a string with one token", () => {
      const lexer = baa({
        main: rules({
          matcher: regex({ type: "A", regex: /a/ }, { type: "B", regex: /b/ }),
        }),
      });
      expectTokens(lexer, "a", [token("A", "a", "a", "1:0", "1:1")]);
    });

    it("parses a string with two tokens", () => {
      const lexer = baa({
        main: rules({
          matcher: regex({ type: "A", regex: /a/ }, { type: "B", regex: /b/ }),
        }),
      });
      expectTokens(lexer, "ab", [
        token("A", "a", "a", "1:0", "1:1"),
        token("B", "b", "b", "1:1", "1:2"),
      ]);
    });

    it("fills gaps with fallback token", () => {
      const lexer = baa({
        main: rules({
          matcher: regex({ type: "A", regex: /a/ }, { type: "B", regex: /b/ }),
          fallbackRule: { type: "FALLBACK" },
        }),
      });
      expectTokens(lexer, "a--b", [
        token("A", "a", "a", "1:0", "1:1"),
        token("FALLBACK", "--", "--", "1:1", "1:3"),
        token("B", "b", "b", "1:3", "1:4"),
      ]);
    });

    describe("if no token matches", () => {
      it("throws an error", () => {
        const lexer = baa({
          main: rules({
            matcher: regex(
              { type: "A", regex: /a/ },
              { type: "B", regex: /b/ }
            ),
          }),
        });
        const tokens = lexer.lex("a-a");
        expect(tokens.next().value).toEqual(token("A", "a", "a", "1:0", "1:1"));
        expect(() => tokens.next()).toThrow(
          "Syntax error at 1:1, expected one of `A`, `B` but got '-'"
        );
      });

      it("returns an error token for the rest of the string, if configured", () => {
        const lexer = baa({
          main: rules({
            matcher: regex(
              { type: "A", regex: /a/ },
              { type: "B", regex: /b/ }
            ),
            errorRule: { type: "ERROR" },
          }),
        });
        const tokens = lexer.lex("a--");
        expect(tokens.next().value).toEqual(token("A", "a", "a", "1:0", "1:1"));
        expect(tokens.next().value).toEqual(
          token("ERROR", "--", "--", "1:1", "1:3")
        );
      });

      it("returns a fallback token for the rest of the string, if configured", () => {
        const lexer = baa({
          main: rules({
            matcher: regex(
              { type: "A", regex: /a/ },
              { type: "B", regex: /b/ }
            ),
            fallbackRule: { type: "FALLBACK" },
          }),
        });
        const tokens = lexer.lex("a--");
        expect(tokens.next().value).toEqual(token("A", "a", "a", "1:0", "1:1"));
        expect(tokens.next().value).toEqual(
          token("FALLBACK", "--", "--", "1:1", "1:3")
        );
      });

      it("returns a fallback token for the rest of the string, if fallback AND error are configured", () => {
        const lexer = baa({
          main: rules({
            matcher: regex(
              { type: "A", regex: /a/ },
              { type: "B", regex: /b/ }
            ),
            fallbackRule: { type: "FALLBACK" },
            errorRule: { type: "ERROR" },
          }),
        });
        const tokens = lexer.lex("a--");
        expect(tokens.next().value).toEqual(token("A", "a", "a", "1:0", "1:1"));
        expect(tokens.next().value).toEqual(
          token("FALLBACK", "--", "--", "1:1", "1:3")
        );
      });
    });
  });
  it("allows concurrent parsing", () => {
    const lexer = baa({
      main: rules({
        matcher: regex({ type: "A", regex: /a/ }, { type: "B", regex: /b/ }),
      }),
    });

    const tokens1 = lexer.lex("ab");
    const tokens2 = lexer.lex("ba");

    expect(tokens1.next().value).toEqual(token("A", "a", "a", "1:0", "1:1"));
    expect(tokens2.next().value).toEqual(token("B", "b", "b", "1:0", "1:1"));

    expect(tokens1.next().value).toEqual(token("B", "b", "b", "1:1", "1:2"));
    expect(tokens2.next().value).toEqual(token("A", "a", "a", "1:1", "1:2"));
  });

  it("changes state if a 'push' or 'pop' property is set.", () => {
    const lexer = baa({
      main: rules({
        matcher: regex(
          { type: "A", regex: /a/ },
          { type: "OPEN", regex: /\(/, push: "brackets" }
        ),
      }),
      brackets: rules({
        matcher: regex(
          { type: "B", regex: /b/ },
          { type: "CLOSE", regex: /\)/, pop: 1 }
        ),
      }),
    });

    expectTokens(lexer, "a(b)a", [
      token("A", "a", "a", "1:0", "1:1"),
      token("OPEN", "(", "(", "1:1", "1:2"),
      token("B", "b", "b", "1:2", "1:3"),
      token("CLOSE", ")", ")", "1:3", "1:4"),
      token("A", "a", "a", "1:4", "1:5"),
    ]);
  });

  it("changes state if a 'next' property is set.", () => {
    const lexer = baa({
      main: rules({
        matcher: regex(
          { type: "A", regex: /a/ },
          { type: "OPEN", regex: /\(/, next: "brackets" }
        ),
      }),
      brackets: rules({
        matcher: regex(
          { type: "B", regex: /b/ },
          { type: "CLOSE", regex: /\)/, next: "main" }
        ),
      }),
    });

    expectTokens(lexer, "a(b)a", [
      token("A", "a", "a", "1:0", "1:1"),
      token("OPEN", "(", "(", "1:1", "1:2"),
      token("B", "b", "b", "1:2", "1:3"),
      token("CLOSE", ")", ")", "1:3", "1:4"),
      token("A", "a", "a", "1:4", "1:5"),
    ]);
  });

  it("does not push to the state stack when using 'next'.", () => {
    const lexer = baa({
      main: rules({
        matcher: regex({ type: "A", regex: /a/, push: "bb" }),
      }),
      bb: rules({
        matcher: regex({ type: "B", regex: /b/, next: "cc" }),
      }),
      cc: rules({
        matcher: regex({ type: "C", regex: /c/, pop: 1 }),
      }),
    });

    expectTokens(lexer, "abca", [
      token("A", "a", "a", "1:0", "1:1"),
      token("B", "b", "b", "1:1", "1:2"),
      token("C", "c", "c", "1:2", "1:3"),
      token("A", "a", "a", "1:3", "1:4"),
    ]);
  });

  it("'pop' at the end of the string", () => {
    const lexer = baa({
      main: rules({
        matcher: regex(
          { type: "A", regex: /a/ },
          { type: "OPEN", regex: /\(/, next: "brackets" }
        ),
      }),
      brackets: rules({
        matcher: regex(
          { type: "B", regex: /b/ },
          { type: "CLOSE", regex: /\)/, next: "main" }
        ),
      }),
    });

    expectTokens(lexer, "a(b)", [
      token("A", "a", "a", "1:0", "1:1"),
      token("OPEN", "(", "(", "1:1", "1:2"),
      token("B", "b", "b", "1:2", "1:3"),
      token("CLOSE", ")", ")", "1:3", "1:4"),
    ]);
  });

  it("pops state correcty when a fallback rule occurs after state-change", () => {
    const lexer = baa({
      main: rules({
        matcher: regex(
          { type: "A", regex: /a/ },
          { type: "OPEN", regex: /\(/, next: "brackets" }
        ),
      }),
      brackets: rules({
        matcher: regex(
          { type: "B", regex: /b/ },
          { type: "CLOSE", regex: /\)/, next: "main" }
        ),
      }),
    });

    expectTokens(lexer, "a(b)a", [
      token("A", "a", "a", "1:0", "1:1"),
      token("OPEN", "(", "(", "1:1", "1:2"),
      token("B", "b", "b", "1:2", "1:3"),
      token("CLOSE", ")", ")", "1:3", "1:4"),
      token("A", "a", "a", "1:4", "1:5"),
    ]);
  });

  describe("identifies line breaks", () => {
    it("in the fallback rule", () => {
      const lexer = baa({
        main: rules({
          matcher: regex({
            type: "A",
            regex: /aa/,
          }),
          fallbackRule: {
            type: "DEFAULT",
            lineBreaks: true,
          },
        }),
      });
      expectTokens(lexer, "aa\naa", [
        token("A", "aa", "aa", "1:0", "1:2"),
        token("DEFAULT", "\n", "\n", "1:2", "2:0"),
        token("A", "aa", "aa", "2:0", "2:2"),
      ]);
    });

    it("in the match rule", () => {
      const lexer = baa({
        main: rules({
          matcher: regex(
            { type: "A", regex: /a/ },
            { type: "NEWLINE", regex: /\n/, lineBreaks: true }
          ),
        }),
      });
      expectTokens(lexer, "a\na", [
        token("A", "a", "a", "1:0", "1:1"),
        token("NEWLINE", "\n", "\n", "1:1", "2:0"),
        token("A", "a", "a", "2:0", "2:1"),
      ]);
    });
  });
});
