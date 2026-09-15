import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // This codebase fetches Firestore data with plain useEffect + setState
      // in client components (no data-fetching library or Suspense/`use()`
      // integration yet) — the standard, safe pattern for "load on mount /
      // on param change". The newer react-hooks rule flags every instance
      // of that pattern as a potential cascading-render risk, which isn't
      // applicable here since each effect fetches once, not in a loop.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
