/* eslint-disable no-unused-expressions/no-unused-expressions */

"use strict"

const api = require("../").Factory("bitcoin")

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
    expect(api.isValidAddress("1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX")).toBe(true)
  })
  it("isValidAddress - invalid", function() {
    expect(api.isValidAddress("1U6K7V3Po4snVhBBaU29sesqs2qTQJWDw2")).toBe(false)
  })
  it("isValidAddress - empty", function() {
    expect(api.isValidAddress("")).toBe(false)
  })
})
