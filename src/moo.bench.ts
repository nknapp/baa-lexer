import { bench, describe } from "vitest";
import { moo as mooBaa } from "./index";
import moo, { Rules } from "moo";
import { MooStates } from "./moo-like";

const rules: MooStates<{ stateName: string; tokenType: string }> = {
  main: {
    A: { match: /a/ },
    B: { match: /b/ },
  },
};

const baaLexer = mooBaa(rules);
const mooLexer = moo.states(rules as Record<string, Rules>);

describe("moo-baa-comparison", () => {
  bench("baa", () => {
    for (const ignoredToken of baaLexer.lex("ababa".repeat(1000))) {
        /* do nothing */
    }
  });
  bench("moo", () => {
      mooLexer.reset("ababa".repeat(1000))
      for (const ignoredToken of mooLexer) {
          /* do nothing */
      }
  });
});
