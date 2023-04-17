import { PerformanceTest } from "../types";

export default {
  rules: {
    main: {
      A: "a",
      FALLBACK: {fallback: true,},
      B: "b"
    },
  },
  texts: ["abcdefghijklmnopqrstuvwxyz".repeat(1000)],
} satisfies PerformanceTest;
