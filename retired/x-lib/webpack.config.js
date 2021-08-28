const path = require("path")

module.exports = {
  mode: "production",
  cache: false,
  entry: "./src/index.js",
  output: {
    library: "swtc_x_lib",
    path: path.resolve(__dirname, "dist"),
    filename: "swtc-x-lib.js"
  }
}
