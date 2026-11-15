import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Remaining <img> tags render admin-uploaded images served by the API
      // and local blob: previews before upload; next/image can't optimise
      // those. Static assets use next/image.
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "backend/**", "deploy/**", "next-env.d.ts"]),
]);
