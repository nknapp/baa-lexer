/// <reference types="vite/client" />
import { PerformanceTest } from "./types";
import {moo as mooBaa} from "../index";
import moo, {Rules} from "moo";
import {bench, describe} from "vitest";

const modules = import.meta.glob<{ default: PerformanceTest}>("./tests/*.ts", {
  eager: true,
});

const tests = Object.entries(modules).flatMap((entry) => {
    const test = entry[1].default;
    return test.texts.map((text, index) => ({
    name: entry[0],
    rules: test.rules,
    text,
    index,
  }));
});

describe.each(tests)("moo-baa test: $name ($i)", ({rules, text}) => {
    const baaLexer = mooBaa(rules);
    const mooLexer = moo.states(rules as Record<string, Rules>);

    bench("baa", () => {
        for (const ignoredToken of baaLexer.lex(text)) {
            /* do nothing */
        }
    });
    bench("moo", () => {
        mooLexer.reset(text)
        for (const ignoredToken of mooLexer) {
            /* do nothing */
        }
    });
});
