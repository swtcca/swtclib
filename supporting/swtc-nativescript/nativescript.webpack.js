module.exports = (webpack) => {
  // same API as the user configs
  // for example make changes to the internal config with webpack-chain
  console.log(`!!!!!!!!!!!!!!!!!!!!! inside swtc/nativescript start`)
  webpack.chainWebpack(
    (config, env) => {
      // as an example - add a new rule for svg files
      config.resolve.alias
        .set("os$", "os-browserify")
        .set("path$", "path-browserify")
        .set("zlib$", "browserify-zlib")
        .set("stream$", "stream-browserify")
        .set("randombytes$", "nativescript-randombytes")
        .set("crypto$", "crypto-browserify")
        .set("https$", "https-browserify")
        .set("ws$", "nativescript-websockets")
        .set("brorand$", "@swtc/brorand")
      config.resolve.mainFields.clear().add("browser").add("module").add("main")
      config.node
        .set("global", false)
        .set("__dirname", false)
        .set("__filename", false)
      config.plugin("DefinePlugin").tap((args) => {
        delete args[0].process
        return args
      })
      console.log(`!!!!!!!!!!!!!!!!!!!!! inside swtc/nativescript end`)
    } /*, options */
  )
}
