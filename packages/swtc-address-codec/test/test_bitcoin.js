/* eslint-disable no-unused-expressions/no-unused-expressions */

"use strict"

const assert = require("assert")
const api = require("../")("bitcoin")

function toHex(bytes) {
  return Buffer.from(bytes)
    .toString("hex")
    .toUpperCase()
}

function toBytes(hex) {
  return new Buffer.from(hex, "hex").toJSON().data
}

describe("bitcoin", function() {
  it("isValidAddress - secp256k1 address valid", function() {
    assert(api.isValidAddress("1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX"))
  })
  it("isValidAddress - invalid", function() {
    assert(!api.isValidAddress("1U6K7V3Po4snVhBBaU29sesqs2qTQJWDw2"))
  })
  it("isValidAddress - empty", function() {
    assert(!api.isValidAddress(""))
  })
})
