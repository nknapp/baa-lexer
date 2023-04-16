import { defineConfig } from "vitest/config";
import * as path from "path";

export default defineConfig({
  build: {
    lib: {
      name: "index",
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es", "umd"],
    },
    minify: "esbuild",
    terserOptions: {
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
    },
  },
  resolve: {
    alias: {
      "baa-lexer": path.resolve(__dirname, "src/index.ts"),
    },
  },
  test: {},
});
