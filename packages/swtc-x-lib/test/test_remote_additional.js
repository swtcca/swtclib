const chai = require("chai")
const expect = chai.expect
const Remote = require("../").Remote
const config = require("./config")
const DATA = require("./config")
const sinon = require("sinon")
const utils = require("swtc-utils").utils
const sleep = time => new Promise(res => setTimeout(() => res(), time))
let { JT_NODE } = config
let pair = "SWT:JJCC/jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"

describe("test transaction additions", function() {
  const remote = new Remote({ server: DATA.TEST_NODE })
  describe("test build payment transaction", async function() {
    this.timeout(15000)
    it("sign without sequence", async function() {
      await remote.connectPromise()
      let tx = remote.buildPaymentTx({
        source: DATA.address,
        to: DATA.address2,
        amount: { value: 0.1, currency: "SWT", issuer: "" }
      })
      let blob = await tx.signPromise(DATA.secret)
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json.blob).to.equal(blob)
    })
    it("submit without sequence", async function() {
      let tx = remote.buildPaymentTx({
        source: DATA.address,
        to: DATA.address2,
        amount: { value: 0.1, currency: "SWT", issuer: "" }
      })
      await tx.submitPromise(DATA.secret)
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json.blob).to.be.a("string")
    })
  })
  describe("test build offer create transaction", async function() {
    this.timeout(15000)
    it("sign without sequence", async function() {
      let tx = remote.buildOfferCreateTx({
        type: "Buy",
        account: DATA.address,
        taker_gets: { value: 1, currency: "SWT", issuer: "" },
        taker_pays: { value: 0.007, currency: "CNY", issuer: DATA.issuer }
      })
      tx.setSecret(DATA.secret)
      await tx.signPromise(DATA.secret)
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json.blob).to.be.a("string")
    })
    it("submitPromise without sequence", async function() {
      let tx = remote.buildOfferCreateTx({
        type: "Buy",
        account: DATA.address,
        taker_gets: { value: 1, currency: "SWT", issuer: "" },
        taker_pays: { value: 0.007, currency: "CNY", issuer: DATA.issuer }
      })
      let result = await tx.submitPromise(DATA.secret)
      expect(result).to.be.an("object")
    })
  })
  describe("test build offer cancel transaction", async function() {
    this.timeout(15000)
    it("sign without sequence set", async function() {
      let tx = remote.buildOfferCancelTx({
        account: DATA.address,
        sequence: 100
      })
      let result = await tx.signPromise(DATA.secret)
      expect(result).to.be.an("string")
    })
    it("submit", async function() {
      let tx = remote.buildOfferCancelTx({
        account: DATA.address,
        sequence: 100
      })
      let result = await tx.submitPromise(DATA.secret)
      expect(result).to.be.an("object")
    })
  })
  describe("test relation transaction", function() {
    this.timeout(15000)
    it("sign without sequence", async function() {
      let tx = remote.buildRelationTx({
        target: DATA.address2,
        account: DATA.address,
        type: "freeze",
        limit: { value: 11, currency: "CNY", issuer: DATA.issuer }
      })
      let blob = await tx.signPromise(DATA.secret)
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json.blob).to.equal(blob)
    })
    it("submit", async function() {
      let tx = remote.buildRelationTx({
        target: DATA.address2,
        account: DATA.address,
        type: "freeze",
        limit: { value: 11, currency: "CNY", issuer: DATA.issuer }
      })
      let result = await tx.submitPromise(DATA.secret)
      // console.log(result.data)
      expect(result).to.be.an("object")
    })
  })
  describe("test .signPromise()", function() {
    this.timeout(15000)
    let tx = remote.buildPaymentTx({
      source: DATA.address,
      to: DATA.address2,
      amount: { value: 0.1, currency: "SWT", issuer: "" }
    })
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
    it("signPromise() with secret param", async function() {
      let tx = remote.buildPaymentTx(
        {
          source: DATA.address,
          to: DATA.address2,
          amount: { value: 0.1, currency: "SWT", issuer: "" }
        },
        remote
      )
      let blob = await tx.signPromise(DATA.secret)
      expect(tx.tx_json).to.have.property("Sequence")
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json).to.have.property("blob")
      expect(tx.tx_json.blob).to.be.equal(blob)
    })
    it("signPromise() without sequence", async function() {
      let tx = remote.buildPaymentTx({
        source: DATA.address,
        to: DATA.address2,
        amount: { value: 0.1, currency: "SWT", issuer: "" }
      })
      let blob = await tx.signPromise(DATA.secret)
      expect(tx.tx_json).to.have.property("Sequence")
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json).to.have.property("blob")
      expect(tx.tx_json.blob).to.be.equal(blob)
    })
  })
  describe("test .submitPromise()", function() {
    this.timeout(15000)
    it(".submitPromise()", async function() {
      let tx = remote.buildPaymentTx(
        {
          source: DATA.address,
          to: DATA.address2,
          amount: { value: 0.1, currency: "SWT", issuer: "" }
        },
        remote
      )
      await sleep(11000)
      let result = await tx.submitPromise(DATA.secret)
      expect(tx.tx_json).to.have.property("Sequence")
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json).to.have.property("blob")
      expect(result).to.have.property("engine_result")
      expect(result.engine_result).to.be.equal("tesSUCCESS")
      expect(result).to.have.property("tx_blob")
      expect(result).to.have.property("tx_json")
    })
    it(".submitPromise() with secret param", async function() {
      let tx = remote.buildPaymentTx({
        source: DATA.address,
        to: DATA.address2,
        amount: { value: 0.1, currency: "SWT", issuer: "" }
      })
      await sleep(13000)
      let result = await tx.submitPromise(DATA.secret)
      expect(tx.tx_json).to.have.property("Sequence")
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json).to.have.property("blob")
      expect(result.engine_result).to.be.equal("tesSUCCESS")
      expect(result).to.have.property("tx_blob")
      expect(tx.tx_json.blob).to.be.equal(result.tx_blob)
    })
    it(".submitPromise() with secret and memo param", async function() {
      let tx = remote.buildPaymentTx(
        {
          source: DATA.address,
          to: DATA.address2,
          amount: { value: 0.1, currency: "SWT", issuer: "" }
        },
        remote
      )
      await sleep(11000)
      let result = await tx.submitPromise(DATA.secret, "hello memo")
      expect(tx.tx_json).to.have.property("Memos")
      expect(tx.tx_json.Memos).to.be.a("array")
      expect(tx.tx_json).to.have.property("Sequence")
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json).to.have.property("blob")
      expect(result).to.have.property("engine_result")
      expect(result.engine_result).to.be.equal("tesSUCCESS")
      expect(result).to.have.property("tx_blob")
      expect(tx.tx_json.blob).to.be.equal(result.tx_blob)
    })
    it(".submitPromise() with secret and sequence param", async function() {
      let tx = remote.buildPaymentTx({
        source: DATA.address,
        to: DATA.address2,
        amount: { value: 0.1, currency: "SWT", issuer: "" }
      })
      let result = await tx.submitPromise(DATA.secret, "", 10)
      remote.disconnect()
      expect(tx.tx_json).to.have.property("Sequence")
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json.Sequence).to.be.equal(10)
      expect(tx.tx_json).to.have.property("blob")
      expect(result).to.have.property("engine_result")
      expect(result.engine_result).to.be.equal("tefPAST_SEQ")
      expect(result).to.have.property("tx_blob")
      expect(tx.tx_json.blob).to.be.equal(result.tx_blob)
    })
  })
})
