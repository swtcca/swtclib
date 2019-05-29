/* eslint-disable no-unused-expressions/no-unused-expressions */

"use strict"

const assert = require("assert")
const api = require("../")

describe("constructor", function() {
  it("constructor with incorrect param got error", function() {
    const excercise = () => api("someerrorchainortoken")
    assert.throws(excercise, Error)
  })

  it("constructor with token or chain the same", function() {
    let by_chain = api()
    let by_token = api("swt")
    assert.deepEqual(Object.keys(by_chain.codecs), Object.keys(by_token.codecs))
  })

  it("constructor with different token", function() {
    let bwt_chain = api("bwt")
    let swt_chain = api("swt")
    assert.notDeepEqual(
      Object.keys(bwt_chain.codecs),
      Object.keys(swt_chain.codecs)
    )
  })

  it("constructor with different chain", function() {
    let bwt_chain = api("bizain")
    let swt_chain = api("jingtum")
    assert.notDeepEqual(
      Object.keys(bwt_chain.codecs),
      Object.keys(swt_chain.codecs)
    )
  })
})
