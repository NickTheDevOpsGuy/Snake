// eslint.config.js
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier"; // disables stylistic conflicts

export default [
  // 1️⃣ Ignore build and coverage output
  { ignores: ["dist", "coverage"] },

  // 2️⃣ Base configs
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs["recommended-latest"],
  reactRefresh.configs.vite,

  // 3️⃣ App source (TypeScript + React)
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: globals.browser,
    },
    plugins: { react },
    rules: {
      // Base React tweaks
      "react/react-in-jsx-scope": "off", // Not needed with React 17+
      "react/prop-types": "off",

      // React rules downgraded to warnings for DX
      ...(() => {
        const base = react?.configs?.recommended?.rules ?? {};
        return Object.fromEntries(
          Object.entries(base).map(([rule, val]) => [
            rule,
            val === "error" ? "warn" : val,
          ])
        );
      })(),

      // TypeScript + expression handling
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],
    },
    settings: { react: { version: "detect" } },
  },

  // 4️⃣ Tests (Vitest globals)
  {
    files: ["tests/**/*.{ts,tsx}", "**/*.test.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.vitest },
    },
    rules: {},
  },

  // 5️⃣ Configs + tooling (Node env)
  {
    files: [
      "*.config.{js,cjs,mjs,ts}",
      "vite.config.*",
      "vitest.config.*",
      "scripts/**",
    ],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
  },

  // 6️⃣ Prettier compatibility (keep LAST)
  eslintConfigPrettier,
];