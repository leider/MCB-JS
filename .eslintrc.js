module.exports = {
  root: true,

  env: {
    node: true,
  },
  extends: ["plugin:vue/recommended", "@vue/typescript", "@vue/prettier"],

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
  },

  parserOptions: {
    parser: "@typescript-eslint/parser",
  },

  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)"],
      env: {
        jest: true,
      },
    },
  ],
};
