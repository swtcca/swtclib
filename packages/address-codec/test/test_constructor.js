/* eslint-disable no-unused-expressions/no-unused-expressions */

"use strict"

const api = require("../").Factory

describe("constructor", function() {
  it("constructor with incorrect param got error", function() {
    expect(() => api("someerrorchainortoken")).toThrow()
  })

  it("constructor with token or chain the same", function() {
    let by_chain = api("jingtum")
    let by_token = api("swt")
    expect(Object.keys(by_chain)).toEqual(Object.keys(by_token))
  })

  it("constructor with different token", function() {
    let bwt_chain = api("bwt")
    let swt_chain = api("swt")
    expect(Object.keys(bwt_chain)).toEqual(Object.keys(swt_chain))
  })

  it("constructor with different chain", function() {
    let bwt_chain = api("bizain")
    let swt_chain = api("jingtum")
    expect(Object.keys(bwt_chain)).toEqual(Object.keys(swt_chain))
  })
})
