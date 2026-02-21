import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslint.configs.recommended,
  tseslint.configs.recommended,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "dist/**"]),
]);

export default eslintConfig;
