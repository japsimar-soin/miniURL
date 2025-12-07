// import js from '@eslint/js';
// import tseslint from 'typescript-eslint';
// import { defineConfig } from 'eslint/config';

// export default defineConfig([
//   {
//     files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
//     plugins: { js },
//     extends: ['js/recommended'],
//     languageOptions: { globals: {
//       window: "readonly",
//       document: "readonly",
//     } },
//   },
//   tseslint.configs.recommended,
// ]);
// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["src/client/**/*.{js,ts}"],
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
    env: {
      browser: true,
      es2021: true,
    },
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["src/**/*.ts"],
    ignores: ["src/client/**/*"],
    env: {
      node: true,
      es2021: true,
    },
    ...tseslint.configs.recommended,
  },
]);
