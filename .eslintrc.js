module.exports = {
  env: {
    node: true,
  },
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    '@typescript-eslint/no-empty-function': 0,
    "@typescript-eslint/no-explicit-any": 2,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    complexity: [2, 4],
    "max-statements": [2, 5],
    "max-depth": [2, 2],
  },
}
