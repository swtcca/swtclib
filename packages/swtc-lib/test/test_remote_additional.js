const chai = require("chai")
const expect = chai.expect
const Remote = require("../").Remote
const config = require("../../.conf/config")
const DATA = require("../../.conf/config")
const sinon = require("sinon")
const utils = require("swtc-utils").utils
const sleep = time => new Promise(res => setTimeout(() => res(), time))
let { JT_NODE, WSS_NODE } = config
let pair = "SWT:JJCC/jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"

describe("test remote methods", function() {
  const remote = new Remote({ server: DATA.TEST_NODE })
  describe("test makeCurrency", function() {
    it("default to SWT", function() {
      expect(remote.makeCurrency().currency).to.be.equal("SWT")
      expect(remote.makeCurrency().issuer).to.be.equal("")
    })
    it("vcc as param", function() {
      expect(remote.makeCurrency("vcc").currency).to.be.equal("VCC")
      expect(remote.makeCurrency("VCC").issuer).to.be.equal(remote._issuer)
    })
    it("vcc and issuer as param", function() {
      expect(remote.makeCurrency("vcc", DATA.issuer).currency).to.be.equal(
        "VCC"
      )
      expect(remote.makeCurrency("VCC", DATA.issuer).issuer).to.be.equal(
        DATA.issuer
      )
    })
  })
  describe("test makeAmount", function() {
    it("default to 1 SWT", function() {
      expect(remote.makeAmount().value).to.be.equal(1)
      expect(remote.makeAmount().currency).to.be.equal("SWT")
      expect(remote.makeAmount().issuer).to.be.equal("")
    })
    it("2 vcc as param", function() {
      expect(remote.makeAmount(2, "vcc").value).to.be.equal(2)
      expect(remote.makeAmount(2, "vcc").currency).to.be.equal("VCC")
      expect(remote.makeAmount(2, "VCC").issuer).to.be.equal(remote._issuer)
    })
    it("2 vcc issuer as param", function() {
      expect(remote.makeAmount(2, "vcc", DATA.issuer).value).to.be.equal(2)
      expect(remote.makeAmount(2, "vcc", DATA.issuer).currency).to.be.equal(
        "VCC"
      )
      expect(remote.makeAmount(2, "VCC", DATA.issuer).issuer).to.be.equal(
        DATA.issuer
      )
    })
  })
})

describe("test transaction additions", function() {
  const remote = new Remote({ server: DATA.TEST_NODE })
  describe("test .signPromise()", function() {
    this.timeout(15000)
    let tx = remote.buildPaymentTx({
      source: DATA.address,
      to: DATA.address2,
      amount: { value: 0.1, currency: "SWT", issuer: "" }
    })
    tx.setSequence(10)
    it(".signPromise() with sequence set", async function() {
      let blob = await tx.signPromise(DATA.secret)
      expect(tx.tx_json).to.have.property("blob")
      expect(tx.tx_json.blob).to.be.equal(blob)
    })
    it("signPromise() with secret and sequence param", async function() {
      let tx = remote.buildPaymentTx({
        source: DATA.address,
        to: DATA.address2,
        amount: { value: 0.1, currency: "SWT", issuer: "" }
      })
      let blob = await tx.signPromise(DATA.secret, "memo", 10)
      expect(tx.tx_json).to.have.property("Sequence")
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json.Sequence).to.be.equal(10)
      expect(tx.tx_json).to.have.property("blob")
      expect(tx.tx_json.blob).to.be.equal(blob)
    })
  })
})
