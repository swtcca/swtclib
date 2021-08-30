/* eslint-disable no-unused-expressions/no-unused-expressions */

"use strict"

const api = require("../").Factory
const api6 = api("guomi")
const api2 = api("bizain")
const api3 = api({})
const api4 = api({ guomi: true, currency: "mmm" })
const api5 = api({ guomi: true, currency: "WWW" })

describe("constructor", function () {
  it("constructor with incorrect param got error", function () {
    expect(() => api("someerrorchainortoken")).toThrow()
  })

  // it("constructor with token or chain the same", function() {
  //   let by_chain = api("jingtum")
  //   let by_token = api("swt")
  //   expect(Object.keys(by_chain)).toEqual(Object.keys(by_token))
  // })

  // it("constructor with different token", function() {
  //   let bwt_chain = api("bwt")
  //   let swt_chain = api("swt")
  //   expect(Object.keys(bwt_chain)).toEqual(Object.keys(swt_chain))
  // })

  it("constructor with different chain", function () {
    let bwt_chain = api("bizain")
    let swt_chain = api("jingtum")
    expect(Object.keys(bwt_chain)).toEqual(Object.keys(swt_chain))
  })
  test("addressCodec.guomi", function () {
    expect(api2.guomi).toBe(false)
    expect(api3.guomi).toBe(false)
    expect(api4.guomi).toBe(true)
    expect(api5.guomi).toBe(true)
    expect(api6.guomi).toBe(true)
  })
  test("addressCodec.token", function () {
    expect(api2.token).toBe("BWT")
    expect(api3.token).toBe("SWT")
    expect(api4.token).toBe("MMM")
    expect(api5.token).toBe("WWW")
    expect(api6.token).toBe("SWT")
  })
})
