import { LexerTypings } from "baa-lexer";
import { StateProcessor, Match } from "../types";

export class DummyStateProcessor implements StateProcessor<LexerTypings> {
  name: string;

  constructor(name: string) {
    this.name = "compiled state " + name;
  }

  nextMatch(ignoredString: string, ignoredOffset: number): Match<LexerTypings> {
    return {
      rule: {
        type: "A",
        lineBreaks: false,
        match: "a",
      },
      offset: 0,
      text: "dummy",
    };
  }

  debug(): Record<string, unknown> {
    return { type: "dummyState" };
  }
}
