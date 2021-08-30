const expect = require("chai").expect
//import Remote from '../src/index'
const Remote = require("../").Factory({ guomi: true })
const DATA = require("../../.conf/config")
const remote = new Remote({ server: DATA.JT_NODE_GM_RPC })

let payid = "should be updated during payments query"
let txid = "should be updated during transactions query"
let ledger_index = 100
let ledger_hash = "should be updated during ledger query"

describe("remote methods", function () {
  describe("test makeCurrency", function () {
    it("default to SWT", function () {
      expect(remote.makeCurrency().currency).to.be.equal("SWT")
      expect(remote.makeCurrency().issuer).to.be.equal("")
    })
    it("vcc as param", function () {
      expect(remote.makeCurrency("vcc").currency).to.be.equal("VCC")
      expect(remote.makeCurrency("VCC").issuer).to.be.equal(remote._issuer)
    })
    it("vcc and issuer as param", function () {
      expect(remote.makeCurrency("vcc", DATA.issuer).currency).to.be.equal(
        "VCC"
      )
      remote.config({ issuer: DATA.issuerGm })
      expect(remote.makeCurrency("VCC").issuer).to.be.equal(DATA.issuerGm)
    })
  })
  describe("test makeAmount", function () {
    it("default to 1 SWT", function () {
      expect(remote.makeAmount().value).to.be.equal("1")
      expect(remote.makeAmount().currency).to.be.equal("SWT")
      expect(remote.makeAmount().issuer).to.be.equal("")
    })
    it("2 vcc as param", function () {
      expect(remote.makeAmount(2, "vcc").value).to.be.equal("2")
      expect(remote.makeAmount(2, "vcc").currency).to.be.equal("VCC")
      expect(remote.makeAmount(2, "VCC").issuer).to.be.equal(remote._issuer)
    })
    it("2 vcc issuer as param", function () {
      expect(remote.makeAmount(2, "vcc", DATA.issuer).value).to.be.equal("2")
      expect(remote.makeAmount(2, "vcc", DATA.issuer).currency).to.be.equal(
        "VCC"
      )
      let remote2 = new Remote({ server: DATA.server, issuer: DATA.issuer })
      expect(remote2.makeAmount(2, "VCC").issuer).to.be.equal(DATA.issuer)
    })
  })
  describe("ed25519 tx", function () {
    it("sign submit ed tx", async function () {
      const tx = remote.buildPaymentTx({
        from: DATA.testAddressGmEd,
        to: DATA.testAddressGm,
        amount: remote.makeAmount()
      })
      await tx.signPromise(DATA.testSecretGmEd)
      expect(tx.tx_json.Sequence).to.be.a("number")
      const response = await tx.submitPromise()
      expect(response.engine_result).to.be.equal("tesSUCCESS")
    })
  })
})
