module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ["@vue/typescript", "@vue/prettier", "plugin:@typescript-eslint/recommended"],

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },

  parserOptions: {
    parser: "@typescript-eslint/parser"
  },

  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)"],
      env: {
        jest: true
      }
    }
  ]
};
