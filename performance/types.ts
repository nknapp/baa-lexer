import { LexerTypings, MooStates } from "baa-lexer";

export interface PerformanceTest {
  rules: MooStates<LexerTypings>;
  texts: string[];
}
