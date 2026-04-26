const path = require("path")

module.exports = {
  mode: "production",
  cache: { type: "filesystem" },
  entry: "./src/index.js",
  output: {
    library: "swtc_lib",
    path: path.resolve(__dirname, "dist"),
    filename: "swtc-lib.js"
  },
  resolve: {
    fallback: {
      stream: false,
      crypto: false,
      http: false,
      https: false,
      net: false,
      tls: false,
      zlib: false,
      url: false,
      util: false,
      events: false,
      string_decoder: false
    }
  }
}
