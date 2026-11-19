// @ts-check

import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
// import globals from "globals"

export default defineConfig(
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "prefer-const": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "vitest/no-focused-tests": "off"
    },
    ignores:["**/test/**", "**/*.test.js", "**/.spec.js", "**/*.test.ts", "test"],
    files: ["**/*.test.ts"]
    
    
  },
  globalIgnores([
    "!node_modules/",
    "node_modules/*",
    "!node_modules/mylibrary/",
    "test/**/*"
  ]),
  
);
/**
 *
# For a patch release (bug fixes)
npm version patch
git push origin master --tags

# For a minor release (new features)
npm version minor
git push origin master --tags

# For a major release (breaking changes)
npm version major
git push origin master --ta
 */
