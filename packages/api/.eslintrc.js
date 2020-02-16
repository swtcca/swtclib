// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  //extends: ["prettier"],
  extends: ["eslint:recommended"],
  rules: {
    "no-undef": 0
  }
}
