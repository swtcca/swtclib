// import fs from "fs"
import path from "path"
import ts from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"

const path_resolve = (...p) => path.resolve(...p)
const name = "keypairs"

// const knownExternals = fs.readdirSync(resolve(".."))

export default [
  {
    input: path_resolve("tssrc", "index.ts"),
    external: [
      // "base-x",
      // "crypto",
      // "hash.js",
      "bn.js",
      "brorand",
      "elliptic",
      "inherits",
      "@swtc/common",
      "@swtc/address-codec"
    ],
    plugins: [
      ts({ outDir: path_resolve("dist", "esm") }),
      json(),
      resolve({ preferBuiltins: false }),
      commonjs()
    ],
    output: [
      {
        dir: path_resolve("dist", `esm`),
        sourcemap: true,
        plugins: [terser()],
        format: "es"
      }
    ]
  },
  {
    input: path_resolve("tssrc", "index.ts"),
    external: [
      // "base-x",
      // "crypto",
      // "hash.js",
      "bn.js",
      "brorand",
      "elliptic",
      "inherits",
      "@swtc/common",
      "@swtc/address-codec"
    ],
    plugins: [
      ts({ outDir: path_resolve("dist", "cjs") }),
      json(),
      resolve({ preferBuiltins: false }),
      commonjs()
    ],
    output: [
      {
        dir: path_resolve("dist", `cjs`),
        sourcemap: true,
        plugins: [terser()],
        format: "cjs"
      }
    ]
  }
]
