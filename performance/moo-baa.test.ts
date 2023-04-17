import { describe, expect, it } from "vitest";
import { allTests } from "./allTests";
import { baa } from "baa-lexer";
import moo, { Rules as MooRules } from "moo";
import { baaTokenToMooToken } from "./baaTokenToMooToken";

describe("moo-baa sanity tests", function () {
  describe.each(allTests)("moo-baa test: $name ($index)", ({ rules, text }) => {
    it("moo and baa produce the same tokens", () => {
      const baaLexer = baa(rules).lex(text);
      const mooLexer = moo.states(rules as Record<string, MooRules>);
      mooLexer.reset(text);
      const wrappedMoo = baaTokenToMooToken(mooLexer);
      for (let i = 0; i < 20; i++) {
        const mooResult = wrappedMoo.next();
        const baaResult = baaLexer.next();
        expect(mooResult).toEqual(baaResult);
      }
    });
  });
});
