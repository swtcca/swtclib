/* eslint-disable no-unused-expressions/no-unused-expressions */

"use strict"

const Buffer = require("buffer").Buffer
const api = require("../").Factory()

function toHex(bytes) {
  return Buffer.from(bytes)
    .toString("hex")
    .toUpperCase()
}

function toBytes(hex) {
  return Buffer.from(hex, "hex").toJSON().data
}

describe("jingtum", function() {
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
    "j4dsZadfBLTFcLyNWTqvAPrP8gaEBijqSo",
    "ED2BBF5F80507853D1539F70D16557FB1AD0BE45"
  )

  //  makeTest(
  //    'NodePublic',
  //    'n9MXXueo837zYH36DvMc13BwHcqtfAWNJY5czWVbp7uYTj7x17TH',
  //    '0388E5BA87A000CB807240DF8C848EB0B5FFA5C8E5A521BC8E105C0F0A44217828')

  //  makeTest('K256Seed', 'snQBUZHyK5dms7kRRntVjvpVVVfuq',
  //    'CF2DE378FBDD7E2EE87D486DFB5A7BFF')

  //  makeTest('EdSeed', 'sEdTM1uX8pu2do5XvTnutH6HsouMaM2',
  //    '4C3A1D213FBDFB14C7C28D609469B341')

  //  it('can decode arbitray seeds', function() {
  //    const decoded = api.decodeSeed('sEdTM1uX8pu2do5XvTnutH6HsouMaM2')
  //    assert.equal(toHex(decoded.bytes), '4C3A1D213FBDFB14C7C28D609469B341')
  //    assert.equal(decoded.type, 'ed25519')

  //    const decoded3 = api.decodeSeed('snQBUZHyK5dms7kRRntVjvpVVVfuq')
  //    assert.equal(toHex(decoded3.bytes), 'ED2BBF5F80507853D1539F70D16557FB1AD0BE45')
  //    assert.equal(decoded3.type, 'secp256k1')

  //  })

  //  it('can pass a type as second arg to encodeSeed', function() {
  //    const edSeed = 'sEdTM1uX8pu2do5XvTnutH6HsouMaM2'
  //    const decoded = api.decodeSeed(edSeed)
  //    assert.equal(toHex(decoded.bytes), '4C3A1D213FBDFB14C7C28D609469B341')
  //    assert.equal(decoded.type, 'ed25519')
  //    assert.equal(api.encodeSeed(decoded.bytes, decoded.type), edSeed)
  //  })

  it("isValidAddress - secp256k1 address valid", function() {
    expect(
      api.isValidAddress("jf1emKcuU2FjpivogkxSwLUvuSq9GU7sCm")
    ).toBeTruthy()
  })
  it("isValidAddress - ed25519 address valid", function() {
    expect(
      api.isValidAddress("j4dsZadfBLTFcLyNWTqvAPrP8gaEBijqSo")
    ).toBeTruthy()
  })
  it("isValidAddress - invalid", function() {
    expect(api.isValidAddress("jU6K7V3Po4snVhBBaU29sesqs2qTQJWDw2")).toBeFalsy()
  })
  it("isValidAddress - empty", function() {
    expect(api.isValidAddress("")).toBeFalsy()
  })
})
