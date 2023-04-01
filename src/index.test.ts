import { describe, expect, it } from "vitest";
import { baa } from "./index";
import { expectTokens, token } from "./test-utils/expectToken";
import { regex, rules } from "./rule-based";

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
          fallback: { type: "FALLBACK" },
        }),
      });
      expectTokens(lexer, "a--b", [
        token("A", "a", "a", "1:0", "1:1"),
        token("FALLBACK", "--", "--", "1:1", "1:3"),
        token("B", "b", "b", "1:3", "1:4"),
      ]);
    });
  });
});
