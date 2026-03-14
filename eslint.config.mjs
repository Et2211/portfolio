import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Global ignores
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

  // JavaScript rules
  {
    files: ["**/*.js", "**/*.mjs"],
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Import rules
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
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/no-unassigned-import": [
        "error",
        { allow: ["**/*.css", "**/*.scss"] },
      ],
      "import/prefer-default-export": "off",

      // Common rules
      quotes: ["error", "double", { avoidEscape: true }],
      "no-underscore-dangle": "off",
      "no-console": "error",
      "id-length": ["error", { exceptions: ["e"] }],
      "arrow-body-style": "off",
      "consistent-return": "off",
      "class-methods-use-this": "off",
      "dot-notation": "off",
      "require-await": "error",
      curly: ["error", "all"],
      "max-len": [
        "error",
        {
          code: 120,
          ignoreStrings: true,
          ignorePattern: "^.*https?.*$|^.*eslint-disable.*$",
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],
    },
  },

  // TypeScript rules
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin,
      react: react,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // TypeScript-specific rules
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],
      "@typescript-eslint/dot-notation": "off",
      "@typescript-eslint/quotes": ["error", "double", { avoidEscape: true }],

      // Import rules
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
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/no-unassigned-import": [
        "error",
        { allow: ["**/*.css", "**/*.scss"] },
      ],
      "import/prefer-default-export": "off",

      // React rules
      "react/jsx-props-no-spreading": "off",
      "react/require-default-props": "off",
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "react-hooks/exhaustive-deps": "off",

      // Common rules
      quotes: ["error", "double", { avoidEscape: true }],
      "no-underscore-dangle": "off",
      "no-console": "error",
      "id-length": ["error", { exceptions: ["e"] }],
      "arrow-body-style": "off",
      "consistent-return": "off",
      "class-methods-use-this": "off",
      "dot-notation": "off",
      "require-await": "error",
      curly: ["error", "all"],
      "max-len": [
        "error",
        {
          code: 120,
          ignoreStrings: true,
          ignorePattern: "^.*https?.*$|^.*eslint-disable.*$",
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],
    },
  },

  // Next.js page and layout files - they require async functions
  {
    files: ["app/**/page.tsx", "app/**/layout.tsx", "components/Navbar.tsx"],
    rules: {
      "react/function-component-definition": "off",
    },
  },

  // Prettier config to disable conflicting rules
  prettierConfig,
]);

export default eslintConfig;
