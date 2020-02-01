// import fs from "fs"
import path from "path"
import { terser } from "rollup-plugin-terser"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"

const path_resolve = (...p) => path.resolve(...p)
const name = "lib"

// const knownExternals = fs.readdirSync(resolve(".."))
// ensure TS checks only once for each build
let hasTSChecked = false

export default [
  {
    input: path_resolve("src", "index.js"),
    external: [
      // "base-x",
      // "crypto",
      // "hash.js",
      // "axios.js",
      "bn.js",
      "brorand",
      "elliptic",
      "inherits",
      "@swtc/common",
      "@swtc/address-codec",
      "@swtc/keypairs",
      "@swtc/wallet",
      "@swtc/utils",
      "@swtc/serializer",
      "@swtc/transaction",
      "events",
      "url",
      "util",
      "http",
      "crypto",
      "stream",
      "https",
      "net",
      "tls",
      "zlib",
      "utf-8-validate",
      "bufferutil"
    ],
    // plugins: [ts(), json(), resolve({ preferBuiltins: true }), commonjs()],
    plugins: [json(), resolve({ preferBuiltins: true }), commonjs()],
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
    input: path_resolve("src", "index.js"),
    external: [
      // "base-x",
      // "crypto",
      // "hash.js",
      // "axios.js",
      "bn.js",
      "brorand",
      "elliptic",
      "inherits",
      "@swtc/common",
      "@swtc/address-codec",
      "@swtc/keypairs",
      "@swtc/wallet",
      "@swtc/utils",
      "@swtc/serializer",
      "@swtc/transaction",
      "events",
      "url",
      "util",
      "http",
      "crypto",
      "stream",
      "https",
      "net",
      "tls",
      "zlib",
      "utf-8-validate",
      "bufferutil"
    ],
    // plugins: [ts()],
    // plugins: [ts(), json(), resolve({ preferBuiltins: true }), commonjs()],
    plugins: [json(), resolve({ preferBuiltins: true }), commonjs()],
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
