import { defineConfig } from "vitest/config";
import * as path from "path";

export default defineConfig({
  build: {
    lib: {
      name: "index",
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es", "umd"],
    },
  },
  test: {},
});
