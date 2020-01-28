import path from "path"
import ts from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser"

const resolve = (...p) => path.resolve(...p)

// ensure TS checks only once for each build
let hasTSChecked = false

export default {
  input: resolve("tssrc", "chains.ts"),
  plugins: [ts()],
  output: [
    {
      file: resolve("dist", "chains.esm.prod.js"),
      plugins: [terser()],
      format: "es"
    },
    {
      file: resolve("dist", "chains.esm.js"),
      format: "es"
    },
    {
      file: resolve("dist", "chains.cjs.prod.js"),
      plugins: [terser()],
      format: "cjs"
    },
    {
      file: resolve("dist", "chains.cjs.js"),
      format: "cjs"
    }
  ]
}
