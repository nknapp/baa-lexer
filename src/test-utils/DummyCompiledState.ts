import { LexerTypings } from "baa-lexer";
import { CompiledState, Match } from "../internal-types";

export class DummyCompiledState implements CompiledState<LexerTypings> {
  name: string;

  constructor(name: string) {
    this.name = "compiled state " + name;
  }

  nextMatch(ignoredString: string, ignoredOffset: number): Match<LexerTypings> {
    return {
      rule: {
        type: "A",
        lineBreaks: false,
      },
      offset: 0,
      text: "dummy",
    };
  }
}
