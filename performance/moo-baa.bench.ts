/// <reference types="vite/client" />
import { baa as mooBaa } from "baa-lexer";
import { baaFn } from "../src/baaFn";
import moo, { Rules as MooRules } from "moo";
import { bench, describe } from "vitest";
import { allTests } from "./allTests";
import { baaTokenToMooToken } from "./baaTokenToMooToken";

describe.each(allTests)("moo-baa test: $name ($index)", ({ rules, text }) => {
  const baaLexer = baaFn(rules);
  bench("baaFn", () => {
    for (const ignoredToken of baaLexer.lex(text)) {
      /* do nothing */
    }
  });

  const baaClassLexer = mooBaa(rules);
  bench("baa", () => {
    for (const ignoredToken of baaClassLexer.lex(text)) {
      /* do nothing */
    }
  });

  const mooLexer = moo.states(rules as Record<string, MooRules>);
  bench("moo", () => {
    mooLexer.reset(text);
    for (const ignoredToken of baaTokenToMooToken(mooLexer)) {
      /* do nothing */
    }
  });
});
