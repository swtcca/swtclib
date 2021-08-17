const mydir = process.cwd()

const fs = require("fs")
const path = require("path")

const typescript_config = path.join(mydir, "..", "..", "..", "tsconfig.json")
const webpack_config = path.join(mydir, "..", "..", "..", "webpack.config.js")
const cipher_base = path.join(mydir, "..", "..", "cipher-base", "index.js")

try {
  const tc = require(typescript_config)
  tc.compilerOptions.allowSyntheticDefaultImports = true
  fs.writeFileSync(typescript_config, JSON.stringify(tc, "", 2), "utf-8")
} catch (e) {
  console.log(`no typescript config updates`)
}

if (fs.existsSync(webpack_config)) {
  const wc = fs.readFileSync(webpack_config, "utf-8")
  let wc_new = wc.replace(
    /(.*)return (webpack.resolveConfig.*)/,
    function (match, p1, p2, offset, string) {
      return `
${p1}const config = ${p2}
${p1}config.resolve.fallback = {
${p1}${p1}"fs": false,
${p1}${p1}"http": false
${p1}};
${p1}console.log(config.resolve);

${p1}return config;`
    }
  )
  wc_new = wc_new.replace(
    /            "fs": "empty",\n            "__dirname": false,/,
    '            "fs": "empty",\n            "process": "mock",\n            "__dirname": false,'
  )
  wc_new = wc_new.replace(
    /            alias,/,
    `            mainFields: ['browser', 'module', 'main'],\n            alias: Object.assign({}, alias, require("@swtc/nativescript").aliases),`
  )
  wc_new = wc_new.replace(
    /                "process": "global.process"/,
    '                // "process": "global.process"'
  )
  fs.writeFileSync(webpack_config, wc_new, "utf-8")
} else {
  console.log("!!! webpack not found")
}

if (fs.existsSync(cipher_base)) {
  const content = fs.readFileSync(cipher_base, "utf-8")
  const content_new = content.replace(
    /require\('stream'\)/,
    "require('readable-stream')"
  )
  fs.writeFileSync(cipher_base, content_new, "utf-8")
} else {
  console.error("cipher-base does not exist yet")
}
