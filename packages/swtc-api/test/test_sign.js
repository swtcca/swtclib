const expect = require("chai").expect
//import Remote from '../src/index'
const Remote = require("../").Remote
const DATA = require("./config")
const remote = new Remote({ server: DATA.server })

let payid = "should be updated during payments query"
let txid = "should be updated during transactions query"
let ledger_index = 100
let ledger_hash = "should be updated during ledger query"

describe("remote methods", function() {
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
      remote.config({ issuer: DATA.issuer })
      expect(remote.makeCurrency("VCC").issuer).to.be.equal(DATA.issuer)
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
      let remote2 = new Remote({ server: DATA.server, issuer: DATA.issuer })
      expect(remote2.makeAmount(2, "VCC").issuer).to.be.equal(DATA.issuer)
    })
  })
})

describe("Remote", function() {
  describe("Operating Transactions", function() {
    this.timeout(10000)
    it("remote.txSignPromise() throws error", async function() {
      let tx = remote.buildPaymentTx({
        source: DATA.address,
        to: DATA.address2,
        amount: {
          value: 1,
          currency: "SWT",
          issuer: ""
        }
      })
      try {
        await remote.txSignPromise(tx)
      } catch (error) {
        expect(error).to.equal("a valid secret is needed to sign with")
      }
    })
    it("remote.txSignPromise() with secret and memo", async function() {
      let tx = remote.buildPaymentTx({
        source: DATA.address,
        to: DATA.address2,
        amount: {
          value: 1,
          currency: "SWT",
          issuer: ""
        }
      })
      try {
        await remote.txSignPromise(tx, DATA.secret, "hello memo")
        expect(tx.tx_json).to.have.property("Memos")
        expect(tx.tx_json.Memos).to.be.a("array")
        expect(tx.tx_json.Memos[0].Memo.MemoData).to.equal("hello memo")
        expect(tx.tx_json).to.have.property("blob")
      } catch (error) {
        expect(error).to.equal("should not throw")
      }
    })
    it("remote.txSignPromise() with secret and sequence", async function() {
      let tx = remote.buildPaymentTx({
        source: DATA.address,
        to: DATA.address2,
        amount: {
          value: 1,
          currency: "SWT",
          issuer: ""
        }
      })
      try {
        await remote.txSignPromise(tx, DATA.secret, "", 102)
        expect(tx.tx_json).to.have.property("Sequence")
        expect(tx.tx_json.Sequence).to.equal(102)
        expect(tx.tx_json).to.have.property("blob")
      } catch (error) {
        expect(error).to.equal("should not throw")
      }
    })
    it("remote.txSignPromise() with secret", async function() {
      let tx = remote.buildPaymentTx({
        source: DATA.address,
        to: DATA.address2,
        amount: {
          value: 1,
          currency: "SWT",
          issuer: ""
        }
      })
      try {
        tx = await remote.txSignPromise(tx, DATA.secret)
        expect(tx.tx_json).to.have.property("Sequence")
        expect(tx.tx_json.Sequence).to.be.a("number")
        expect(tx.tx_json).to.have.property("blob")
      } catch (error) {
        expect(error).to.equal("should not throw")
      }
    })
    it("remote.txSignPromise() with txSetSecret", async function() {
      let tx = remote.buildPaymentTx({
        source: DATA.address,
        to: DATA.address2,
        amount: {
          value: 1,
          currency: "SWT",
          issuer: ""
        }
      })
      tx = remote.txSetSecret(tx, DATA.secret)
      try {
        await remote.txSignPromise(tx)
        expect(tx.tx_json).to.have.property("Sequence")
        expect(tx.tx_json.Sequence).to.be.a("number")
        expect(tx.tx_json).to.have.property("blob")
      } catch (error) {
        expect(error).to.equal("should not throw")
      }
    })
    it("remote.txSignPromise() with txSetSecret and txSetSequence", async function() {
      let tx = remote.buildPaymentTx({
        source: DATA.address,
        to: DATA.address2,
        amount: {
          value: 1,
          currency: "SWT",
          issuer: ""
        }
      })
      remote.txSetSecret(tx, DATA.secret)
      remote.txSetSequence(tx, 102)
      try {
        await remote.txSignPromise(tx)
        expect(tx.tx_json).to.have.property("Sequence")
        expect(tx.tx_json.Sequence).to.be.equal(102)
        expect(tx.tx_json).to.have.property("blob")
      } catch (error) {
        expect(error).to.equal("should not throw")
      }
    })
    it("remote.txSubmitPromise() with secret and memo", async function() {
      let tx = remote.buildPaymentTx({
        source: DATA.address,
        to: DATA.address2,
        amount: {
          value: 1,
          currency: "SWT",
          issuer: ""
        }
      })
      try {
        const result = await remote.txSubmitPromise(
          tx,
          DATA.secret,
          "with memo"
        )
        expect(tx.tx_json).to.have.property("Memos")
        expect(tx.tx_json.Memos).to.be.a("array")
        expect(tx.tx_json.Memos[0].Memo.MemoData).to.equal("with memo")
        expect(tx.tx_json).to.have.property("Sequence")
        expect(tx.tx_json.Sequence).to.be.a("number")
        expect(tx.tx_json).to.have.property("blob")
        expect(result).to.have.property("success")
        expect(result.success).to.be.true
        expect(result).to.have.property("engine_result")
        expect(result).to.have.property("tx_blob")
        expect(result.tx_blob).to.be.equal(tx.tx_json.blob)
      } catch (error) {
        expect(error).to.equal("should not throw")
      }
    })
    it("remote.txSubmitPromise() with secret and sequence", async function() {
      let tx = remote.buildPaymentTx({
        source: DATA.address,
        to: DATA.address2,
        amount: {
          value: 1,
          currency: "SWT",
          issuer: ""
        }
      })
      try {
        const result = await remote.txSubmitPromise(tx, DATA.secret, "", 10)
        expect(tx.tx_json).to.have.property("Sequence")
        expect(tx.tx_json.Sequence).to.be.a("number")
        expect(tx.tx_json).to.have.property("blob")
        expect(result).to.have.property("success")
        expect(result.success).to.be.true
        expect(result).to.have.property("engine_result")
        expect(result.engine_result).to.be.equal("tefPAST_SEQ")
        expect(result).to.have.property("tx_blob")
        expect(result.tx_blob).to.be.equal(tx.tx_json.blob)
      } catch (error) {
        expect(error).to.equal("should not throw")
      }
    })
    it("remote.txSubmitPromise() with secret", async function() {
      let tx = remote.buildPaymentTx({
        source: DATA.address,
        to: DATA.address2,
        amount: {
          value: 1,
          currency: "SWT",
          issuer: ""
        }
      })
      try {
        const result = await remote.txSubmitPromise(tx, DATA.secret)
        expect(tx.tx_json).to.have.property("Sequence")
        expect(tx.tx_json.Sequence).to.be.a("number")
        expect(tx.tx_json).to.have.property("blob")
        expect(result).to.have.property("success")
        expect(result.success).to.be.true
        expect(result).to.have.property("tx_blob")
        expect(result.tx_blob).to.be.equal(tx.tx_json.blob)
      } catch (error) {
        expect(error).to.equal("should not throw")
      }
    })
    it("remote.txSubmitPromise() with txSetSecret", async function() {
      let tx = remote.buildPaymentTx({
        source: DATA.address,
        to: DATA.address2,
        amount: {
          value: 1,
          currency: "SWT",
          issuer: ""
        }
      })
      tx = remote.txSetSecret(tx, DATA.secret)
      try {
        const result = await remote.txSubmitPromise(tx)
        expect(tx.tx_json).to.have.property("Sequence")
        expect(tx.tx_json.Sequence).to.be.a("number")
        expect(tx.tx_json).to.have.property("blob")
        expect(result).to.have.property("success")
        expect(result.success).to.be.true
        expect(result).to.have.property("tx_blob")
        expect(result.tx_blob).to.be.equal(tx.tx_json.blob)
      } catch (error) {
        expect(error).to.equal("should not throw")
      }
    })
  })
})
