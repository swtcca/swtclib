// import fs from "fs"
import path from "path"
import ts from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser"
// import resolve from '@rollup/plugin-node-resolve'
import commonjs from "@rollup/plugin-commonjs"

const resolve = (...p) => path.resolve(...p)
const name = "address-codec"

export default [
  {
    input: resolve("tssrc", "index.ts"),
    external: ["base-x", "crypto", "@swtc/common"],
    plugins: [ts({ outDir: resolve("dist/esm") }), commonjs()],
    output: [
      {
        dir: resolve("dist", `esm`),
        sourcemap: true,
        plugins: [terser()],
        format: "es"
      }
    ]
  },
  {
    input: resolve("tssrc", "index.ts"),
    external: ["base-x", "crypto", "@swtc/common"],
    plugins: [ts({ outDir: resolve("dist", "cjs") }), commonjs()],
    output: [
      {
        dir: resolve("dist", `cjs`),
        sourcemap: true,
        plugins: [terser()],
        format: "cjs"
      }
    ]
  }
]
