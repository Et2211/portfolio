import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";

// Formatting (quotes, semicolons, line length) is owned by Prettier —
// eslint-config-prettier is applied last and switches those rules off.
const sharedRules = {
  // Imports
  "sort-imports": [
    "error",
    {
      ignoreCase: false,
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
      allowSeparatedGroups: true,
    },
  ],
  "import/no-unresolved": "error",
  "import/no-named-as-default": "error",
  "import/order": [
    "error",
    {
      groups: [
        "builtin",
        "external",
        "internal",
        ["sibling", "parent"],
        "index",
        "unknown",
      ],
      "newlines-between": "always",
      alphabetize: { order: "asc", caseInsensitive: true },
    },
  ],
  "import/no-unassigned-import": [
    "error",
    { allow: ["**/*.css", "**/*.scss", "server-only"] },
  ],
  "import/prefer-default-export": "off",

  // General
  "no-underscore-dangle": "off",
  "no-console": "error",
  "id-length": ["error", { exceptions: ["e", "x", "y", "_"] }],
  "arrow-body-style": "off",
  "consistent-return": "off",
  "class-methods-use-this": "off",
  "dot-notation": "off",
  "require-await": "error",
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "next-env.d.ts",
    "**/node_modules/**",
    "**/.git/**",
    "**/types/generated/**",
    "**/.vercel/**",
  ]),

  {
    files: ["**/*.js", "**/*.mjs"],
    plugins: { import: importPlugin },
    rules: sharedRules,
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin,
      react,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: "./tsconfig.json" },
    },
    rules: {
      ...sharedRules,

      // The jsx-a11y plugin is registered by eslint-config-next, which only
      // enables a handful of its rules — turn on the full recommended set.
      ...jsxA11y.flatConfigs.recommended.rules,

      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],
      "@typescript-eslint/dot-notation": "off",

      "react/jsx-props-no-spreading": "off",
      "react/require-default-props": "off",
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // Async server components are declared as functions
  {
    files: [
      "app/**/page.tsx",
      "app/**/layout.tsx",
      "components/nav/Navbar.tsx",
    ],
    rules: { "react/function-component-definition": "off" },
  },

  prettierConfig,

  // eslint-config-prettier disables `curly`, but "all" never conflicts with
  // Prettier, so re-enable it after the Prettier config.
  { rules: { curly: ["error", "all"] } },
]);

export default eslintConfig;
