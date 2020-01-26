"use strict"

if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/address-codec.cjs.prod.js")
} else {
  module.exports = require("./dist/address-codec.cjs.js")
}
