const mydir = process.cwd()

const fs = require("fs")
const path = require("path")

const webpack_config = path.join(mydir, "..", "..", "..", "webpack.config.js")
const cipher_base = path.join(mydir, "..", "..", "cipher-base", "index.js")

const wc = fs.readFileSync(webpack_config, "utf-8")
let wc_new = wc.replace(
  /            "fs": "empty",\n            "__dirname": false,/,
  '            "fs": "empty",\n            "process": "mock",\n            "__dirname": false,'
)
wc_new = wc_new.replace(
  /            alias,/,
  '            alias: Object.assign({}, alias, require("@swtc/nativescript").aliases),'
)
wc_new = wc_new.replace(
  /                "process": "global.process"/,
  '                // "process": "global.process"'
)
fs.writeFileSync(webpack_config, wc_new, "utf-8")

if (fs.existsSync(cipher_base)) {
  const content = fs.readFileSync(cipher_base, "utf-8")
  const content_new = content.replace(
    /require\('stream'\)/,
    "require('readable-stream')"
  )
  fs.writeFileSync(cipher_base, content_new, "utf-8")
} else {
  console.error("cipher-base does not exist yet")
  setTimeout(() => {
    const content = fs.readFileSync(cipher_base, "utf-8")
    const content_new = content.replace(
      /require\('stream'\)/,
      "require('readable-stream')"
    )
    fs.writeFileSync(cipher_base, content_new, "utf-8")
  }, 60 * 1000)
}
