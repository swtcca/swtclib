/* eslint-disable no-unused-expressions/no-unused-expressions */

"use strict"

const api = require("../").Factory("ripple")

function toHex(bytes) {
  return Buffer.from(bytes)
    .toString("hex")
    .toUpperCase()
}

function toBytes(hex) {
  return new Buffer.from(hex, "hex").toJSON().data
}

describe("ripple", function() {
  function makeTest(type, base58, hex) {
    it("can translate between " + hex + " and " + base58, function() {
      const actual = api["encode" + type](toBytes(hex))
      expect(actual).toBe(base58)
    })
    it("can translate between " + base58 + " and " + hex, function() {
      const buf = api["decode" + type](base58)
      expect(toHex(buf)).toBe(hex)
    })
  }

  makeTest(
    "AccountID",
    "rJrRMgiRgrU6hDF4pgu5DXQdWyPbY35ErN",
    "BA8E78626EE42C41B46D46C3048DF3A1C3C87072"
  )

  makeTest(
    "NodePublic",
    "n9MXXueo837zYH36DvMc13BwHcqtfAWNJY5czWVbp7uYTj7x17TH",
    "0388E5BA87A000CB807240DF8C848EB0B5FFA5C8E5A521BC8E105C0F0A44217828"
  )

  it("can decode arbitray seeds", function() {
    const decoded = api.decodeSeed("sEdTM1uX8pu2do5XvTnutH6HsouMaM2")
    expect(toHex(decoded.bytes)).toBe("4C3A1D213FBDFB14C7C28D609469B341")
    expect(decoded.type).toBe("ed25519")

    const decoded2 = api.decodeSeed("sn259rEFXrQrWyx3Q7XneWcwV6dfL")
    expect(toHex(decoded2.bytes)).toBe("CF2DE378FBDD7E2EE87D486DFB5A7BFF")
    expect(decoded2.type).toBe("secp256k1")
  })

  it("can pass a type as second arg to encodeSeed", function() {
    const edSeed = "sEdTM1uX8pu2do5XvTnutH6HsouMaM2"
    const decoded = api.decodeSeed(edSeed)
    expect(toHex(decoded.bytes)).toBe("4C3A1D213FBDFB14C7C28D609469B341")
    expect(decoded.type).toBe("ed25519")
    expect(api.encodeSeed(decoded.bytes, decoded.type)).toBe(edSeed)
  })

  it("isValidAddress - secp256k1 address valid", function() {
    expect(
      api.isValidAddress("rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1")
    ).toBeTruthy()
  })
  it("isValidAddress - ed25519 address valid", function() {
    expect(
      api.isValidAddress("rLUEXYuLiQptky37CqLcm9USQpPiz5rkpD")
    ).toBeTruthy()
  })
  it("isValidAddress - invalid", function() {
    expect(api.isValidAddress("rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw2")).toBeFalsy()
  })
  it("isValidAddress - empty", function() {
    expect(api.isValidAddress("")).toBeFalsy()
  })
})
