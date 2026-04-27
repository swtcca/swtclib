const path = require("path")

module.exports = {
  mode: "production",
  cache: false,
  entry: "./src/index.js",
  output: {
    library: "swtc_transaction",
    path: path.resolve(__dirname, "dist"),
    filename: "swtc-transaction.js"
  },
  resolve: {
    fallback: {
      stream: false,
      crypto: false,
      url: false,
      util: false,
      events: false,
      string_decoder: false
    }
  }
}
