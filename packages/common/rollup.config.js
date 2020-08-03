import path from "path"
import ts from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser"

const resolve = (...p) => path.resolve(...p)

// ensure TS checks only once for each build
const name = "common"

export default [
  {
    input: resolve("tssrc", "index.ts"),
    plugins: [ts({ outDir: resolve("dist", "esm") })],
    output: [
      {
        dir: resolve("dist", "esm"),
        sourcemap: true,
        plugins: [terser()],
        format: "es"
      }
    ]
  },
  {
    input: resolve("tssrc", "index.ts"),
    plugins: [ts({ outDir: resolve("dist", "cjs") })],
    output: [
      {
        dir: resolve("dist", "cjs"),
        sourcemap: true,
        plugins: [terser()],
        format: "cjs"
      }
    ]
  },
  {
    input: resolve("tssrc", "index.ts"),
    plugins: [ts({ outDir: resolve("dist", "iife") })],
    output: [
      {
        dir: resolve("dist", "iife"),
        sourcemap: true,
        plugins: [terser()],
        name: "common",
        format: "iife"
      }
    ]
  }
]
