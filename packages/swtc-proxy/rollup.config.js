export default [
  {
    input: "tssrc/index.ts",
    output: {
      file: "dist/index.esm.js",
      format: "esm"
    },
    external: ["swtc-lib"],
    plugins: []
  },
  {
    input: "tssrc/index.ts",
    output: {
      file: "dist/index.cjs.js",
      format: "cjs"
    },
    external: ["swtc-lib"],
    plugins: []
  }
]
