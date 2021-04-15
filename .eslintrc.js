module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "plugin:prettier/recommended",
    "eslint:recommended",
    "@vue/prettier"
  ],
  rules: {
    "no-console": 0,
    "no-debugger": 0,
    "no-unused-vars": 0,
    "prettier/prettier": 0,
  },
  parserOptions: {
    parser: "babel-eslint",
  },
};
