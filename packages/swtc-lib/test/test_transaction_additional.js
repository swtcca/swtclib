const chai = require("chai")
const expect = chai.expect
const Remote = require("../").Remote
const TX = Remote.Transaction
const config = require("../../.conf/config")
const DATA = require("../../.conf/config")
const sinon = require("sinon")
const utils = Remote.utils
const axios = require("axios")
const sleep = time => new Promise(res => setTimeout(() => res(), time))
let { WSS_NODE, JT_NODE, TEST_NODE } = config
let pair = "SWT:JJCC/jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
const remote = new Remote({
  server: TEST_NODE,
  local_sign: true,
  issuer: config.issuer
})

describe("test transaction additions", function() {
  describe("test build payment transaction", async function() {
    this.timeout(20000)
    let tx = remote.buildPaymentTx({
      source: DATA.address,
      to: DATA.address2,
      amount: remote.makeAmount(0.1),
      memo: "memo",
      secret: DATA.secret,
      sequence: "100"
    })
    it("has _token", function() {
      expect(tx._token.toLowerCase()).to.equal("swt")
    })
    it("has tx_json.Fee", function() {
      expect(tx.tx_json.Fee).to.equal(utils.getFee(tx._token))
    })
    it("setSecret", function() {
      tx.setSecret(DATA.secret)
      expect(tx._secret).to.equal(DATA.secret)
    })
    it("setSequence", function() {
      tx.setSequence(101)
      expect(tx.tx_json.Sequence).to.equal(101)
    })
    it("sign with sequence set", async function() {
      let blob = await tx.signPromise(DATA.secret)
      expect(tx.tx_json.blob).to.equal(blob)
    })
  })
  describe("test build offer create transaction", function() {
    this.timeout(30000)
    let tx = remote.buildOfferCreateTx({
      type: "Buy",
      account: DATA.address,
      taker_gets: remote.makeAmount(0.1),
      taker_pays: remote.makeAmount(0.007, "CNY")
    })
    it("setSecret", function() {
      tx.setSecret(DATA.secret)
      expect(tx._secret).to.equal(DATA.secret)
    })
    it("setSequence", function() {
      tx.setSequence(100)
      expect(tx.tx_json.Sequence).to.equal(100)
    })
    it("sign with sequence set", async function() {
      let blob = await tx.signPromise()
      expect(tx.tx_json.blob).to.equal(blob)
    })
  })
  describe("test build offer cancel transaction", function() {
    this.timeout(20000)
    let tx = remote.buildOfferCancelTx({ account: DATA.address, sequence: 100 })
    it("setSecret", function() {
      tx.setSecret(DATA.secret)
      expect(tx._secret).to.equal(DATA.secret)
    })
    it("setSequence", function() {
      tx.setSequence(100)
      expect(tx.tx_json.Sequence).to.equal(100)
    })
    it("sign with sequence set", async function() {
      let blob = await tx.signPromise()
      expect(tx.tx_json.blob).to.equal(blob)
    })
  })
  describe("test relation transaction", function() {
    this.timeout(20000)
    let tx = remote.buildRelationTx({
      target: DATA.address2,
      account: DATA.address,
      type: "authorize",
      limit: { value: 11, currency: "CNY", issuer: DATA.issuer }
    })
    it("setSecret", function() {
      tx.setSecret(DATA.secret)
      expect(tx._secret).to.equal(DATA.secret)
    })
    it("setSequence", function() {
      tx.setSequence(100)
      expect(tx.tx_json.Sequence).to.equal(100)
    })
    it("sign with sequence set", async function() {
      let blob = await tx.signPromise()
      expect(tx.tx_json.blob).to.equal(blob)
    })
  })
  describe("test .signPromise()", function() {
    this.timeout(20000)
    let tx = remote.buildPaymentTx({
      source: DATA.address,
      to: DATA.address2,
      amount: { value: 0.1, currency: "SWT", issuer: "" }
    })
    it("setSecret", function() {
      tx.setSecret(DATA.secret)
      expect(tx._secret).to.equal(DATA.secret)
    })
    it("setSequence", function() {
      tx.setSequence(100)
      expect(tx.tx_json.Sequence).to.equal(100)
    })
    it(".signPromise() with sequence set", async function() {
      let blob = await tx.signPromise()
      expect(tx.tx_json).to.have.property("blob")
      expect(tx.tx_json.blob).to.be.equal(blob)
    })
    it("signPromise() with secret and sequence param", async function() {
      let tx = remote.buildPaymentTx({
        source: DATA.address,
        to: DATA.address2,
        amount: { value: 0.1, currency: "SWT", issuer: "" }
      })
      let blob = await tx.signPromise(DATA.secret, "", 10)
      expect(tx.tx_json).to.have.property("Sequence")
      expect(tx.tx_json.Sequence).to.be.a("number")
      expect(tx.tx_json.Sequence).to.be.equal(10)
      expect(tx.tx_json).to.have.property("blob")
      expect(tx.tx_json.blob).to.be.equal(blob)
    })
  })
})
