"use strict"

try {
  // make sure global.process.env exists for certain lib
  global && global.process
    ? global.process.env
      ? "process.env exist"
      : (global.process.env = {})
    : (global.process = { env: {} })
} catch (error) {}

exports.aliases = {
  string_decoder$: "string_decoder/lib/string_decoder.js",
  ws$: "nativescript-websockets",
  brorand$: "swtc-nativescript-brorand",
  "create-hash$": "create-hash/browser",
  inherits$: "inherits/inherits_browser"
}
