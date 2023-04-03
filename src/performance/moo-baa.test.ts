import { describe, expect, it } from "vitest";
import { allTests } from "./allTests";
import { moo as mooBaa } from "../index";
import moo from "moo";
import { toMooConfig } from "./toMooConfig";

describe("moo-baa sanity tests", function () {
  describe.each(allTests)("moo-baa test: $name ($index)", ({ rules, text }) => {
    const baaLexer = mooBaa(rules);
    const mooLexer = moo.states(toMooConfig(rules));
    it("moo and baa produce the same tokens", () => {
      mooLexer.reset(text);
      const mooCount = [...mooLexer].length;
      const baaCount = [...baaLexer.lex(text)].length;
      expect(mooCount).toEqual(baaCount);
    });
  });
});