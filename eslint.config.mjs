import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginJest from "eslint-plugin-jest";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    languageOptions: {
      globals: [globals.browser, pluginJest.environments.globals.globals],
    },
  },
  { plugins: pluginJest },
  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      "coverage",
      "docs",
      "tmp",
      "tsconfig.json",
    ],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
];
