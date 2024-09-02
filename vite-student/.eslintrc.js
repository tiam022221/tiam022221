module.exports = {
  root: true,
  ...require("./.eslintrc-auto-import.json"),
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    parser: {
      js: "espree",
      ts: "@typescript-eslint/parser",
      tsx: "@typescript-eslint/parser",
      "<template>": "@typescript-eslint/parser"
    },
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "standard",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    indent: "off",
    "no-undef": "off",
    "@typescript-eslint/array-type": ["warn"],
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/no-namespace": "off",
    "vue/multi-word-component-names": "off",
    "vue/component-definition-name-casing": ["warn", "kebab-case"],
    "vue/max-attributes-per-line": [
      "warn",
      { singleline: { max: 3 } }
    ],
    "vue/v-slot-style": [
      "warn",
      {
        atComponent: "shorthand",
        default: "shorthand",
        named: "shorthand"
      }
    ],
    "vue/singleline-html-element-content-newline": [
      "warn",
      {
        ignoreWhenNoAttributes: true,
        ignoreWhenEmpty: true
      }
    ],
    quotes: ["warn", "double"]
  }
}
