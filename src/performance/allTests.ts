import {PerformanceTest} from "./types";

const modules = import.meta.glob<{ default: PerformanceTest }>("./tests/*.ts", {
    eager: true,
});

export const allTests = Object.entries(modules).flatMap((entry) => {
    const test = entry[1].default;
    return test.texts.map((text, index) => ({
        name: entry[0],
        rules: test.rules,
        text,
        index,
    }));
}).filter(test => test.name.match(/abab|fallback/))
