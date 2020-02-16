import path from "path"
import ts from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser"

const resolve = (...p) => path.resolve(...p)

// ensure TS checks only once for each build
let hasTSChecked = false
const name = "common"

export default {
  input: resolve("tssrc", "index.ts"),
  plugins: [ts()],
  output: [
    {
      file: resolve("dist", `${name}.esm.prod.js`),
      plugins: [terser()],
      format: "es"
    },
    {
      file: resolve("dist", `${name}.esm.js`),
      format: "es"
    },
    {
      file: resolve("dist", "index.cjs.prod.js"),
      file: resolve("dist", `${name}.cjs.prod.js`),
      plugins: [terser()],
      format: "cjs"
    },
    {
      file: resolve("dist", `${name}.cjs.js`),
      format: "cjs"
    },
    {
      file: resolve("dist", `${name}.global.js`),
      name: "common",
      format: "iife"
    }
  ]
}
