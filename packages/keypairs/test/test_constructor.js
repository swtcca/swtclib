/* eslint-disable no-unused-expressions/no-unused-expressions */

"use strict"

const assert = require("assert")
const api = require("../").Factory
const api2 = api("bizain")
const api3 = api({})
const api4 = api({ guomi: true, currency: "mmm" })
const api5 = api({ guomi: true, currency: "WWW" })
const api6 = api("guomi")

describe("constructor", function () {
  it("constructor with incorrect param got error", function () {
    const excercise = () => api("someerrorchainortoken")
    assert.throws(excercise, Error)
  })

  // it("constructor with token or chain the same", function() {
  //   let by_chain = api()
  //   let by_token = api("swt")
  //   assert.equal(by_chain.chain, by_token.chain)
  // })

  // it("constructor with different token", function() {
  //   let bwt_chain = api("bwt")
  //   let swt_chain = api("swt")
  //   assert.notEqual(bwt_chain.chain, swt_chain.chain)
  // })

  it("constructor with different chain", function () {
    let bwt_chain = api("bizain")
    let swt_chain = api("jingtum")
    assert.notEqual(
      bwt_chain.addressCodec.codec.alphabet,
      swt_chain.addressCodec.codec.alphabet
    )
  })
  it("Keypair.guomi", function () {
    assert(api2.guomi === false)
    assert(api3.guomi === false)
    assert(api4.guomi === true)
    assert(api5.guomi === true)
    assert(api6.guomi === true)
  })
  it("Keypair.token", function () {
    assert(api2.token === "BWT")
    assert(api3.token === "SWT")
    assert(api4.token === "MMM")
    assert(api5.token === "WWW")
    assert(api6.token === "SWT")
  })
})
