import { MooStates } from "../moo-like";

export interface TestTypes {
  stateName: string;
  tokenType: string;
}

export interface PerformanceTest {
  rules: MooStates<TestTypes>;
  texts: string[]
}
