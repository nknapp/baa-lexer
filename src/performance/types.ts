import { MooStates } from "../moo-like";
import { LexerTypings } from "../types";

export interface PerformanceTest<
  T extends LexerTypings = { stateName: string; tokenType: string }
> {
  rules: MooStates<T>;
  texts: string[]
}
