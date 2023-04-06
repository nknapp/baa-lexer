import { describe, expect, it } from "vitest";
import { allTests } from "./allTests";
import { moo as mooBaa } from "../index";
import moo, { Rules as MooRules } from "moo";

describe("moo-baa sanity tests", function () {
  describe.each(allTests)("moo-baa test: $name ($index)", ({ rules, text }) => {
    it("moo and baa produce the same tokens", () => {
      const baaLexer = mooBaa(rules);
      const mooLexer = moo.states(rules as Record<string, MooRules>);
      mooLexer.reset(text);
      const mooCount = [...mooLexer].length;
      const baaCount = [...baaLexer.lex(text)].length;
      expect(mooCount).toEqual(baaCount);
    });
  });
});