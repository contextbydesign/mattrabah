import astro from "eslint-plugin-astro";
import tsParser from "@typescript-eslint/parser";

export default [
  ...astro.configs["flat/recommended"],
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
  },
  {
    ignores: ["dist/**", ".history/**"],
  },
];
