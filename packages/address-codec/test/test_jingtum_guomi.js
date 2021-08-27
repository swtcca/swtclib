/* eslint-disable no-unused-expressions/no-unused-expressions */

"use strict"

const Buffer = require("buffer").Buffer
const api = require("../").addressCodecGm
const common = require("@swtc/common")

const VALID_SECRET = "snvdjvSszL1o1w76a7pXqt9AZQKk7"
const VALID_ADDRESS = "j3qedZEV7cKSqGnoE28Ue46LuUDogK2s7"

function toHex(bytes) {
  return Buffer.from(bytes).toString("hex").toUpperCase()
}

function toBytes(hex) {
  return Buffer.from(hex, "hex").toJSON().data
}

describe("jingtum_guomi", function () {
  function makeTest(type, base58, hex) {
    it("can translate between " + hex + " and " + base58, function () {
      const actual = api["encode" + type](toBytes(hex))
      expect(actual).toBe(base58)
    })
    it("can translate between " + base58 + " and " + hex, function () {
      const buf = api["decode" + type](base58)
      expect(toHex(buf)).toBe(hex)
    })
  }

  makeTest(
    "AccountID",
    common.funcGetChain("guomi").ACCOUNT_ZERO,
    common.ACCOUNT_ID_ZERO
  )

  makeTest(
    "AccountID",
    common.funcGetChain("guomi").ACCOUNT_ONE,
    common.ACCOUNT_ID_ONE
  )

  makeTest(
    "AccountID",
    "j4dsZadfBLTFcLyNWTqvAPrP8gaEBJNWtc",
    "ED2BBF5F80507853D1539F70D16557FB1AD0BE45"
  )

  describe("decodeSeeds", function () {
    it("can decode an Ed25519 seed", function () {
      const decoded = api.decodeSeed("sEdTe1wrzphkgMBigAF62XfQhWpRB7o")
      expect(toHex(decoded.bytes)).toBe("613FF901569334E46169A08634394D17")
      expect(decoded.type).toBe("ed25519")
    })

    it("can decode a sm2p256v1 seed", function () {
      const decoded = api.decodeSeed("shstwqJpVJbsqFA5uYJJw1YniXcDF")
      expect(toHex(decoded.bytes)).toBe("613FF901569334E46169A08634394D17")
      expect(decoded.type).toBe("sm2p256v1")
    })
  })
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

  it("isValidAddress - sm2p256v1 address valid", function () {
    expect(api.isValidAddress("jjjjjjjjjjjjjjjjjjjjwVBfmE")).toBeTruthy()
  })
  it("isValidAddress - ed25519 address valid", function () {
    expect(
      api.isValidAddress("j4dsZadfBLTFcLyNWTqvAPrP8gaEBJNWtc")
    ).toBeTruthy()
  })
  it("isValidAddress - invalid", function () {
    expect(api.isValidAddress("jU6K7V3Po4snVhBBaU29sesqs2qTQJWDw2")).toBeFalsy()
  })
  it("isValidAddress - empty", function () {
    expect(api.isValidAddress("")).toBeFalsy()
  })
  it("isValidAddress - from base-lib-guomi", function () {
    expect(api.isValidAddress(VALID_ADDRESS)).toBeTruthy()
  })
  test("can encode seeds - from base-lib-guomi", function () {
    const encoded = api.encodeSeed(
      Buffer.from("E7D23FD73AAF583F1A3404061E5BA077", "hex")
    )
    expect(encoded).toBe(VALID_SECRET)
    const encoded2 = api.encodeSeed(
      Buffer.from("E7D23FD73AAF583F1A3404061E5BA077", "hex"),
      "sm2p256v1"
    )
    expect(encoded2).toBe(VALID_SECRET)
    const encoded3 = api.encodeSeed(
      Buffer.from("E7D23FD73AAF583F1A3404061E5BA077", "hex"),
      "ed25519"
    )
    expect(encoded3).toBe("sEdVXcjq3sZ8yfDUDvjdJk8QgKZ1QoB")
  })
  test("can decode seeds - from base-lib-guomi", function () {
    const decoded = api.decodeSeed(VALID_SECRET)
    expect(toHex(decoded.bytes)).toBe("E7D23FD73AAF583F1A3404061E5BA077")
    expect(decoded.type).toBe("sm2p256v1")
  })
})
