const path = require("path")

module.exports = {
  mode: "production",
  cache: false,
  entry: "./src/index.js",
  output: {
    library: "swtc_lib",
    path: path.resolve(__dirname, "dist"),
    filename: "swtc-lib.js"
  }
}
