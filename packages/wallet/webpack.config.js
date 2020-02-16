const path = require("path")

module.exports = {
  mode: "production",
  cache: false,
  entry: "./src/index.js",
  output: {
    library: "swtc_wallet",
    path: path.resolve(__dirname, "dist"),
    filename: "swtc-wallet.js"
  }
}
