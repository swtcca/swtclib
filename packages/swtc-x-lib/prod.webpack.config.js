const path = require("path")
const pkg = require("./package.json")

module.exports = {
  mode: "production",
  cache: false,
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    compress: true
  },
  entry: "./src/index.js",
  output: {
    library: "swtc_x_lib",
    path: path.resolve(__dirname, "dist"),
    filename: ["swtc-x-lib-", ".min.js"].join(pkg.version)
  }
}
