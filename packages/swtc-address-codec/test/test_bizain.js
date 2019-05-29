/* eslint-disable no-unused-expressions/no-unused-expressions */

"use strict"

const Buffer = require("buffer").Buffer
const assert = require("assert")
const api = require("../")("bizain")

function toHex(bytes) {
  return Buffer.from(bytes)
    .toString("hex")
    .toUpperCase()
}

function toBytes(hex) {
  return Buffer.from(hex, "hex").toJSON().data
}

describe("bizain", function() {
  function makeTest(type, base58, hex) {
    it("can translate between " + hex + " and " + base58, function() {
      const actual = api["encode" + type](toBytes(hex))
      assert.equal(actual, base58)
    })
    it("can translate between " + base58 + " and " + hex, function() {
      const buf = api["decode" + type](base58)
      assert.equal(toHex(buf), hex)
    })
  }

  makeTest(
    "AccountID",
    "bMAy4Pu8CSf5apR44HbYyLFKeC9Dbau16Q",
    "E5C8083009E1C466A7484CF57497009AB5A31AED"
  )

  it("isValidAddress - secp256k1 address valid", function() {
    assert(api.isValidAddress("bMAy4Pu8CSf5apR44HbYyLFKeC9Dbau16Q"))
  })
  it("isValidAddress - invalid", function() {
    assert(!api.isValidAddress("bU6K7V3Po4snVhBBaU29sesqs2qTQJWDw2"))
  })
  it("isValidAddress - empty", function() {
    assert(!api.isValidAddress(""))
  })
})
