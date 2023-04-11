import { MooStates } from "baa-lexer";

export interface TestTypes {
  stateName: string;
  tokenType: string;
}

export interface PerformanceTest {
  rules: MooStates<TestTypes>;
  texts: string[];
}
