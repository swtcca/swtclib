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
  randombytes$: "nativescript-randombytes",
  ws$: "nativescript-websockets",
  brorand$: "@swtc/brorand",
  // string_decoder$: "string_decoder/lib/string_decoder.js",
  // "create-hash$": "create-hash/browser",
  // "create-hmac$": "create-hmac/browser",
  // "create-ecdh$": "create-ecdh/browser",
  // inherits$: "inherits/inherits_browser",
  // keccak$: "keccak-pure-js",
  // eccrypto$: "eccrypto-js"
}

// secp256k1 v4 is required for ethereumjs-*
