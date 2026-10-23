/**
 * Object --> Turborepo ls command --> list WS folders
 * See docs: https://turborepo.dev/docs/reference/ls
 */

export const TURBO_LIST = "npx turbo ls --output=json";

export const ON_TEST = "viper-test";
export const ON_PROD = "prod";

export const PROMPT_MESSAGES = {
  INPUT_PKG: "Enter the package/s name (separated by spaces):",
  WORKSPACE_QUIZ: "Select the workspace to install the current package",
  DEV_QUIZ: "Only check ✅ the DEV-DEPENDENCIES",
  CONFIRM_QUIZ: "¿Want continue with the process?",
  INITIAL_SELECT: "Package Manager menu",
};

export const FLAG_OPTIONS = {
  PNPM: {
    DEV: "--save-dev",
    OPTIONAL: "--save-optional",
    EXACT: "--save-exact",
    PEER: "--save-peer",
    TYPES: "--save-types",
    TILDE: "--tilde",
    CATALOG: "--save-catalog",
    CONFIG: "--config",
    GLOBAL: "--global",
    REGISTRY: "--registry",
  },
  NPM: {
    DEV: "--save-dev",
    GLOBAL: "--global",
    PEER: "--save-peer",
    OPTIONAL: "--save-optional",
    EXACT: "--save-exact",
    NO_SAVE: "--no-save",
    BUNDLE: "--save-bundle",
    FORCE: "--force",
  },
  YARN: {
    DEV: "--dev",
    PEER: "--peer",
    OPTIONAL: "--optional",
    TILDE: "--tilde",
    CARET: "--caret",
    EXACT: "--exact",
    CACHED: "--cached",
    FIXED: "--fixed",
  },
};
