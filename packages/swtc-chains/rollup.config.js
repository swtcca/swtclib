import fs from "fs"
import path from "path"
import ts from "rollup-plugin-typescript2"
import { terser } from "rollup-plugin-terser"

const resolve = (...p) => path.resolve(...p)

// const knownExternals = fs.readdirSync(resolve(".."))
// ensure TS checks only once for each build
let hasTSChecked = false

export default {
  input: resolve("src", "chains.ts"),
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
