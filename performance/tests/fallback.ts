import { PerformanceTest } from "../types";

export default {
  rules: {
    main: {
      A: {
        match: /a/,
      },
      FALLBACK: {
        fallback: true,
      },
      B: {
        match: /b/,
      },
    },
  },
  texts: ["abcdefghijklmnopqrstuvwxyz".repeat(1000)],
} satisfies PerformanceTest;
