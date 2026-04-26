const path = require("path")

module.exports = {
  mode: "production",
  cache: false,
  entry: "./src/index.js",
  output: {
    library: "swtc_rpc",
    path: path.resolve(__dirname, "dist"),
    filename: "swtc-rpc.js"
  },
  resolve: {
    fallback: {
      stream: false,
      crypto: false,
      url: false,
      http: false,
      https: false,
      string_decoder: false
    }
  }
}
