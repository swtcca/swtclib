import path from "path"
import ts from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser"

const resolve = (...p) => path.resolve(...p)

// ensure TS checks only once for each build
let hasTSChecked = false

export default {
  input: resolve("tssrc", "index.ts"),
  plugins: [ts()],
  output: [
    {
      file: resolve("dist", "index.esm.prod.js"),
      plugins: [terser()],
      format: "es"
    },
    {
      file: resolve("dist", "index.esm.js"),
      format: "es"
    },
    {
      file: resolve("dist", "index.cjs.prod.js"),
      plugins: [terser()],
      format: "cjs"
    },
    {
      file: resolve("dist", "index.cjs.js"),
      format: "cjs"
    }
  ]
}
