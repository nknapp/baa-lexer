/// <reference types="vite/client" />
import { moo as mooBaa } from "../index";
import moo, { Rules as MooRules } from "moo";
import { bench, describe } from "vitest";
import { allTests } from "./allTests";

describe.each(allTests)("moo-baa test: $name ($index)", ({ rules, text }) => {
  const baaLexer = mooBaa(rules);
  bench("baa", () => {
    for (const ignoredToken of baaLexer.lex(text)) {
      /* do nothing */
    }
  });

  const mooLexer = moo.states(rules as Record<string, MooRules>);
  bench("moo", () => {
    mooLexer.reset(text);
    for (const ignoredToken of mooLexer) {
      /* do nothing */
    }
  });
});
