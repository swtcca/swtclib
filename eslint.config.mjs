import tseslint from "@typescript-eslint/eslint-plugin"
import tsparser from "@typescript-eslint/parser"

export default [
  {
    files: ["packages/*/tssrc/**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2019,
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint
    },
    rules: {
      // Converted from tslint:recommended + project overrides
      "@typescript-eslint/array-type": ["error", { default: "array" }],
      "arrow-parens": ["error", "as-needed"],
      "no-bitwise": "off",
      "no-console": "off",
      "no-empty": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "quotes": ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
      "semi": "off",
      "comma-dangle": "off",
      "curly": "off",
      "guard-for-in": "off",
      "@typescript-eslint/prefer-for-of": "off"
    }
  },
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/cjs/**", "**/esm/**", "**/src/**"]
  }
]
