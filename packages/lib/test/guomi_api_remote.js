const chai = require("chai")
const expect = chai.expect
const config = require("../../.conf/config")
const DATA = require("../../.conf/config")
const issuer = DATA.issuerGm
const Remote = require("../").Factory({ guomi: true, fee: 10000, issuer })
const sinon = require("sinon")
const utils = Remote.Transaction.utils
const sleep = time => new Promise(res => setTimeout(() => res(), time))
let { JT_NODE_GM } = config
let pair = `SWT:TEST/${issuer}`

describe("test remote methods", function () {
  const remote = new Remote({ server: DATA.TEST_NODE_GM })
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
      expect(remote.makeCurrency("VCC", DATA.issuer).issuer).to.be.equal(
        DATA.issuer
      )
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
      expect(remote.makeAmount(2, "VCC", DATA.issuer).issuer).to.be.equal(
        DATA.issuer
      )
    })
  })
})

describe("test transaction additions", function () {
  const remote = new Remote({ server: DATA.TEST_NODE_GM })
  describe("test build payment transaction", async function () {
    this.timeout(15000)
    it("sign without sequence", async function () {
      await remote.connectPromise()
      let tx = remote.buildPaymentTx({
        source: DATA.addressGm,
        to: DATA.address2Gm,
        amount: { value: 0.1, currency: "SWT", issuer: "" }
      })
      let blob = await tx.signPromise(DATA.secretGm)
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json.blob).to.equal(blob)
    })
    it("submit without sequence", async function () {
      let tx = remote.buildPaymentTx({
        source: DATA.addressGm,
        to: DATA.address2Gm,
        amount: { value: 0.1, currency: "SWT", issuer: "" }
      })
      await tx.submitPromise(DATA.secretGm)
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json.blob).to.be.a("string")
    })
  })
  describe("test build offer create transaction", async function () {
    this.timeout(15000)
    it("sign without sequence", async function () {
      let tx = remote.buildOfferCreateTx({
        type: "Buy",
        account: DATA.addressGm,
        taker_gets: { value: 1, currency: "TEST", issuer },
        taker_pays: { value: 0.007, currency: "SWT", issuer: "" }
      })
      tx.setSecret(DATA.secretGm)
      await tx.signPromise(DATA.secretGm)
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json.blob).to.be.a("string")
    })
    it("submitPromise without sequence", async function () {
      let tx = remote.buildOfferCreateTx({
        type: "Buy",
        account: DATA.addressGm,
        taker_gets: { value: 1, currency: "TEST", issuer },
        taker_pays: { value: 0.007, currency: "SWT", issuer: "" }
      })
      let result = await tx.submitPromise(DATA.secretGm)
      expect(result).to.be.an("object")
    })
  })
  describe("test build offer cancel transaction", async function () {
    this.timeout(15000)
    it("sign without sequence set", async function () {
      let tx = remote.buildOfferCancelTx({
        account: DATA.addressGm,
        sequence: 100
      })
      let result = await tx.signPromise(DATA.secretGm)
      expect(result).to.be.an("string")
    })
    it("submit", async function () {
      let tx = remote.buildOfferCancelTx({
        account: DATA.addressGm,
        sequence: 100
      })
      let result = await tx.submitPromise(DATA.secretGm)
      expect(result).to.be.an("object")
    })
  })
  describe("test relation transaction", function () {
    this.timeout(15000)
    it("sign without sequence", async function () {
      let tx = remote.buildRelationTx({
        target: DATA.address2Gm,
        account: DATA.addressGm,
        type: "freeze",
        limit: { value: 1, currency: "SWT", issuer: "" }
      })
      let blob = await tx.signPromise(DATA.secretGm)
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json.blob).to.equal(blob)
    })
    it("submit", async function () {
      let tx = remote.buildRelationTx({
        target: DATA.address2Gm,
        account: DATA.addressGm,
        type: "freeze",
        limit: { value: 1, currency: "SWT", issuer: "" }
      })
      let result = await tx.submitPromise(DATA.secretGm)
      // console.log(result.data)
      expect(result).to.be.an("object")
    })
  })
  describe("test .signPromise()", function () {
    this.timeout(15000)
    let tx = remote.buildPaymentTx({
      source: DATA.addressGm,
      to: DATA.address2Gm,
      amount: { value: 0.1, currency: "SWT", issuer: "" }
    })
    it(".signPromise() with sequence set", async function () {
      let blob = await tx.signPromise(DATA.secretGm)
      expect(tx.tx_json).to.have.property("blob")
      expect(tx.tx_json.blob).to.be.equal(blob)
    })
    it("signPromise() with secret and sequence param", async function () {
      let tx = remote.buildPaymentTx({
        source: DATA.addressGm,
        to: DATA.address2Gm,
        amount: { value: 0.1, currency: "SWT", issuer: "" }
      })
      let blob = await tx.signPromise(DATA.secretGm, "memo", 10)
      expect(tx.tx_json).to.have.property("Sequence")
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json.Sequence).to.be.equal(10)
      expect(tx.tx_json).to.have.property("blob")
      expect(tx.tx_json.blob).to.be.equal(blob)
    })
    it("signPromise() with secret param", async function () {
      let tx = remote.buildPaymentTx(
        {
          source: DATA.addressGm,
          to: DATA.address2Gm,
          amount: { value: 0.1, currency: "SWT", issuer: "" }
        },
        remote
      )
      let blob = await tx.signPromise(DATA.secretGm)
      expect(tx.tx_json).to.have.property("Sequence")
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json).to.have.property("blob")
      expect(tx.tx_json.blob).to.be.equal(blob)
    })
    it("signPromise() without sequence", async function () {
      let tx = remote.buildPaymentTx({
        source: DATA.addressGm,
        to: DATA.address2Gm,
        amount: { value: 0.1, currency: "SWT", issuer: "" }
      })
      let blob = await tx.signPromise(DATA.secretGm)
      expect(tx.tx_json).to.have.property("Sequence")
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json).to.have.property("blob")
      expect(tx.tx_json.blob).to.be.equal(blob)
    })
  })
  describe("test .submitPromise()", function () {
    this.timeout(20000)
    it(".submitPromise()", async function () {
      let tx = remote.buildPaymentTx(
        {
          source: DATA.addressGm,
          to: DATA.address2Gm,
          amount: { value: 0.1, currency: "SWT", issuer: "" }
        },
        remote
      )
      await sleep(15000)
      let result = await tx.submitPromise(DATA.secretGm)
      expect(tx.tx_json).to.have.property("Sequence")
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json).to.have.property("blob")
      expect(result).to.have.property("engine_result")
      expect(result.engine_result).to.be.oneOf(["tesSUCCESS", "telINSUF_FUND"])
      expect(result).to.have.property("tx_blob")
      expect(result).to.have.property("tx_json")
    })
    it(".submitPromise() with secret param", async function () {
      let tx = remote.buildPaymentTx({
        source: DATA.addressGm,
        to: DATA.address2Gm,
        amount: { value: 0.1, currency: "SWT", issuer: "" }
      })
      await sleep(15000)
      let result = await tx.submitPromise(DATA.secretGm)
      expect(tx.tx_json).to.have.property("Sequence")
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json).to.have.property("blob")
      expect(result.engine_result).to.be.oneOf(["tesSUCCESS", "telINSUF_FUND"])
      expect(result).to.have.property("tx_blob")
      expect(tx.tx_json.blob).to.be.equal(result.tx_blob)
    })
    it(".submitPromise() with secret and memo param", async function () {
      let tx = remote.buildPaymentTx(
        {
          source: DATA.addressGm,
          to: DATA.address2Gm,
          amount: { value: 0.1, currency: "SWT", issuer: "" }
        },
        remote
      )
      await sleep(15000)
      let result = await tx.submitPromise(DATA.secretGm, "hello memo")
      expect(tx.tx_json).to.have.property("Memos")
      expect(tx.tx_json.Memos).to.be.a("array")
      expect(tx.tx_json).to.have.property("Sequence")
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json).to.have.property("blob")
      expect(result).to.have.property("engine_result")
      expect(result.engine_result).to.be.oneOf(["tesSUCCESS", "telINSUF_FUND"])
      expect(result).to.have.property("tx_blob")
      expect(tx.tx_json.blob).to.be.equal(result.tx_blob)
    })
    it(".submitPromise() with secret and sequence param", async function () {
      let tx = remote.buildPaymentTx({
        source: DATA.addressGm,
        to: DATA.address2Gm,
        amount: { value: 0.1, currency: "SWT", issuer: "" }
      })
      let result = await tx.submitPromise(DATA.secretGm, "", 10)
      remote.disconnect()
      expect(tx.tx_json).to.have.property("Sequence")
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json.Sequence).to.be.equal(10)
      expect(tx.tx_json).to.have.property("blob")
      expect(result).to.have.property("engine_result")
      expect(result.engine_result).to.be.oneOf([
        "tesSUCCESS",
        "tefPAST_SEQ",
        "telINSUF_FUND"
      ])
      expect(result).to.have.property("tx_blob")
      expect(tx.tx_json.blob).to.be.equal(result.tx_blob)
    })
  })
})
