/* eslint-disable no-unused-expressions/no-unused-expressions */

"use strict"

const Buffer = require("buffer").Buffer
const SM3 = require("../").SM3

const sm3_checksums = [
  ["abc", "66c7f0f462eeedd9d1f2d46bdc10e4e24167c4875cf2f7a2297da02b8f4ba8e0"],
  [
    "abcdefghABCDEFGH12345678",
    "d670c7f027fd5f9f0c163f4bfe98f9003fe597d3f52dbab0885ec2ca8dd23e9b"
  ],
  [
    "abcdefghABCDEFGH12345678abcdefghABCDEFGH12345678abcdefgh",
    "1cf3bafec325d7d9102cd67ba46b09195af4e613b6c2b898122363d810308b11"
  ],
  [
    "abcdefghABCDEFGH12345678abcdefghABCDEFGH12345678abcdefghABCD",
    "b8ac4203969bde27434ce667b0adbf3439ee97e416e73cb96f4431f478a531fe"
  ],
  [
    "abcdefghABCDEFGH12345678abcdefghABCDEFGH12345678abcdefghABCDEFGH",
    "5ef0cdbe0d54426eea7f5c8b44385bb1003548735feaa59137c3dfe608aa9567"
  ]
]

function toHex(bytes) {
  return Buffer.from(bytes).toString("hex").toUpperCase()
}

function toBytes(hex) {
  return Buffer.from(hex, "hex").toJSON().data
}

describe("jingtum_guomi", function () {
  function makeTest(msg, digest) {
    it("message " + msg + " should generate digest " + digest, function () {
      const actual = new SM3().update(msg).digest("hex")
      expect(actual).toBe(digest)
    })
  }

  sm3_checksums.forEach(pairs => {
    makeTest(pairs[0], pairs[1])
  })
})
