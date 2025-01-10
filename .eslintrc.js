module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module",
  },
  extends: [
    "next", // Next.js recommended rules
    "next/core-web-vitals", // Core Web Vitals for Next.js
    "eslint:recommended", // Basic ESLint rules
    "plugin:@typescript-eslint/recommended", // TypeScript recommended rules
    "plugin:prettier/recommended", // Prettier plugin for auto-formatting
  ],
  plugins: ["@typescript-eslint", "prettier", "@next/eslint-plugin-next"],
  rules: {
    // Max Line Length
    "@typescript-eslint/no-explicit-any": "warn",
    quotes: ["error", "double"],
    "max-len": [
      "error",
      {
        code: 100, // Change to your preferred max line length
        ignoreUrls: true, // Ignore URLs in the line length check
        ignoreComments: false, // Don’t ignore comments (optional)
      },
    ],

    // TypeScript rules
    "@typescript-eslint/explicit-function-return-type": ["error"], // Enforce return types
    // "@typescript-eslint/quotes": ["error", "double"], // Enforce double quotes

    // General rules
    "no-console": ["warn", { allow: ["error"] }],
    "no-debugger": "warn", // Warn on debugger statements
    "no-underscore-dangle": "off", // Allow underscores in variable names (optional)

    // Prettier rules
    "prettier/prettier": ["error", { endOfLine: "auto" }], // Prettier formatting
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts", ".tsx"],
      },
    },
  },
};
