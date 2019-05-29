const path = require('path')
const pkg = require('./package.json')

module.exports = {
	mode: "production",
	cache: false,
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		compress: true,
	},
	entry: "./index.js",
	output: {
		library: "swtc_wallet",
		path: path.resolve(__dirname, "dist"),
		filename: ["swtc-wallet-", ".min.js"].join(pkg.version)
	},
}
