// import fs from "fs"
import path from "path"
import ts from "rollup-plugin-typescript2"
import { terser } from "rollup-plugin-terser"
// import resolve from '@rollup/plugin-node-resolve'
import commonjs from "@rollup/plugin-commonjs"

const path_resolve = (...p) => path.resolve(...p)
const name = "address-codec"

// const knownExternals = fs.readdirSync(resolve(".."))
// ensure TS checks only once for each build
let hasTSChecked = false

export default [
  {
    input: path_resolve("src", "address-codec.ts"),
    external: ["base-x", "crypto", "swtc-chains"],
    plugins: [ts(), commonjs()],
    output: [
      {
        file: path_resolve("dist", `${name}.esm.prod.js`),
        plugins: [terser()],
        format: "es"
      },
      {
        file: path_resolve("dist", `${name}.esm.js`),
        format: "es"
      }
    ]
  },
  {
    input: path_resolve("src", "address-codec.ts"),
    external: ["base-x", "crypto", "swtc-chains"],
    // plugins: [ts()],
    plugins: [ts(), commonjs()],
    output: [
      {
        file: path_resolve("dist", `${name}.cjs.prod.js`),
        plugins: [terser()],
        format: "cjs"
      },
      {
        file: path_resolve("dist", `${name}.cjs.js`),
        format: "cjs"
      }
    ]
  }
]
