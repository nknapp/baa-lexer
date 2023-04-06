import { PerformanceTest } from "../types";

export default {
  rules: {
    main: {
      A: {
        match: /a/,
      },
      B: {
        match: /b/,
      },
    },
  },
  texts: [
      "abaabbaabaabbbaab".repeat(100000)
  ],
} satisfies PerformanceTest;
