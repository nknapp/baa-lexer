module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  env: {
    es2022: true,
    "shared-node-browser": true,
  },
  rules: {
    "no-unused": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { varsIgnorePattern: "[iI]gnored", argsIgnorePattern: "[iI]gnored" },
    ],
    eqeqeq: ["error", "smart"],
    "no-console": ["error"],
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["src/*", "baa-lexer"],
            message: "Use relative import instead (except in test-related files",
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ["scripts/**/*"],
      rules: { "no-console": "off", "no-restricted-imports": "off" },
      env: { node: true },
    },
    {
      files: [
        "performance/**/*",
        "src/test-utils/*",
        "src/**/*.test.ts",
        "src/**/*.bench.ts",
      ],
      rules: { "no-restricted-imports": "off" },
      env: { node: true },
    },

    {
      files: ["*.cjs"],
      parserOptions: {
        sourceType: "script",
      },
      env: { commonjs: true },
    },
    {
      // Additional file types to be checked
      files: ["*.mjs", "*.d.ts"],
    },
  ],
};
