const expect = require("chai").expect
//import Remote from '../src/index'
const Remote = require("../").Remote
const DATA = require("./config")
const remote = new Remote({ server: DATA.server })

let payid = "should be updated during payments query"
let txid = "should be updated during transactions query"
let ledger_index = 100
let ledger_hash = "should be updated during ledger query"

describe("Remote", function() {
  describe("constructor", function() {
    it("instantiate a default Remote successfully", function() {
      let remote = new Remote({})
      expect(remote._server).to.be.equal("https://api.jingtum.com")
      expect(remote._token).to.be.equal("SWT")
    })
    it("instantiate a testnet Remote successfully", function() {
      let remote = new Remote({ server: "https://tapi.jingtum.com" })
      expect(remote._server).to.be.equal("https://tapi.jingtum.com")
      expect(remote._token).to.be.equal("SWT")
    })
  })
  describe("local sign", function() {
    this.timeout(15000)
    it("post invalid blob", async function() {
      try {
        await remote.postBlob({ blob: "0123456789" })
        expect(10).to.equal(100)
      } catch (error) {
        expect(error).to.equal("Transaction length invalid")
      }
    })
    xit("post correct blob", async function() {
      try {
        let response = await remote.postBlob({ blob: "" })
      } catch (error) {
        expect(error).to.equal("Missing parameters")
      }
    })
  })
  describe("getLedger", function() {
    this.timeout(15000)
    it("get latest ledger without parameter", async function() {
      let data = await remote.getLedger()
      expect(data).to.have.property("success")
      expect(data.success).to.be.true
      expect(data).to.have.property("ledger_hash")
      expect(data).to.have.property("ledger_index")
      ledger_hash = data.ledger_hash
      ledger_index = data.ledger_index
    })
    it("get ledger with hash", async function() {
      let data = await remote.getLedger(ledger_hash)
      expect(data).to.have.property("success")
      expect(data.success).to.be.true
      expect(data).to.have.property("ledger_hash")
      expect(data.ledger_hash).to.equal(ledger_hash)
    })
    it("get ledger with index", async function() {
      let data = await remote.getLedger(ledger_index)
      expect(data).to.have.property("success")
      expect(data.success).to.be.true
      expect(data).to.have.property("ledger_index")
      expect(parseInt(data.ledger_index)).to.equal(ledger_index)
    })
  })
  describe("accountBalances", function() {
    this.timeout(15000)
    it("get account balances with incorrect address", async function() {
      try {
        await remote.getAccountBalances(DATA.address.slice(1))
      } catch (error) {
        expect(error).to.equal("invalid address provided")
      }
    })
    it("get account balances with correct address", async function() {
      let data = await remote.getAccountBalances(DATA.address)
      expect(data).to.have.property("success")
      expect(data.success).to.be.true
      expect(data).to.have.property("balances")
      expect(data.balances[0]).to.be.an("object")
    })
  })
  describe("accountPayments", function() {
    this.timeout(15000)
    it("get account payments with incorrect address", async function() {
      try {
        await remote.getAccountPayments(DATA.address.slice(1))
      } catch (error) {
        expect(error).to.equal("invalid address provided")
      }
    })
    it("get account payments with correct address", async function() {
      let data = await remote.getAccountPayments(DATA.address)
      expect(data).to.have.property("success")
      expect(data.success).to.be.true
      expect(data).to.have.property("payments")
      expect(data.payments[0]).to.be.an("object")
      payid = data.payments[0].hash
    })
    it("get account payment with correct hash", async function() {
      try {
        let data = await remote.getAccountPayment(DATA.address, payid)
        expect(data.hash).to.equal(payid)
      } catch (error) {
        expect(error).to.equal("should not throw")
      }
    })
    it("get account payment with incorrect hash", async function() {
      try {
        await remote.getAccountPayment(DATA.address, "wrongtxhash")
      } catch (error) {
        expect(error).to.equal("Invalid parameter: hash.")
      }
    })
    it("post account payments with correct address but no secret", async function() {
      try {
        await remote.postAccountPayments(DATA.address, {})
      } catch (error) {
        expect(error).to.equal("unsafe operation disabled")
      }
    })
    xit("post account payments with correct address and secret", async function() {
      try {
        let params = {
          secret: DATA.secret,
          client_id: `api${new Date().getTime()}`,
          payment: {
            source: DATA.address,
            destination: DATA.address2,
            amount: {
              value: "1",
              currency: "SWT",
              issuer: ""
            },
            memos: ["hello world", "hello payment"]
          }
        }
        let data = await remote.postAccountPayments(
          DATA.address,
          params,
          "POST"
        )
        expect(data).to.have.property("success")
        expect(data.success).to.be.true
        expect(data).to.have.property("result")
        expect(data.result).to.equal("tesSUCCESS")
      } catch (error) {
        console.log(error)
        expect(error).to.equal("should not throw")
      }
    })
  })
  describe("accountOrders", function() {
    this.timeout(15000)
    it("get account orders with incorrect address", async function() {
      try {
        await remote.getAccountOrders(DATA.address.slice(1))
      } catch (error) {
        expect(error).to.equal("invalid address provided")
      }
    })
    it("get account orders with correct address", async function() {
      let data = await remote.getAccountOrders(DATA.address)
      expect(data).to.have.property("success")
      expect(data.success).to.be.true
      expect(data).to.have.property("orders")
    })
    it("post account orders with correct address but no secret", async function() {
      try {
        await remote.postAccountOrders(DATA.address, {})
      } catch (error) {
        expect(error).to.equal("unsafe operation disabled")
      }
    })
    xit("post account orders with correct address and secret", async function() {
      try {
        let params = {
          secret: DATA.secret,
          order: {
            type: "sell",
            pair: `SWT/CNY:${DATA.issuer}`,
            amount: 1,
            price: 0.007
          }
        }
        let data = await remote.postAccountOrders(DATA.address, params, "POST")
        expect(data).to.have.property("success")
        expect(data.success).to.be.true
        expect(data).to.have.property("result")
        expect(data.result).to.equal("tesSUCCESS")
      } catch (error) {
        console.log(error)
        expect(error).to.equal("should not throw")
      }
    })
  })
  describe("orderBooks", function() {
    this.timeout(15000)
    it("get orderbooks with incorrect pairs", async function() {
      try {
        await remote.getOrderBooks("SWT", `CNT+${DATA.issuer}`)
      } catch (error) {
        expect(error).to.equal("invalid address provided")
      }
    })
    it("get orderBooks with correct pairs", async function() {
      let data = await remote.getOrderBooks("SWT", `CNY+${DATA.issuer}`)
      expect(data).to.have.property("success")
      expect(data.success).to.be.true
      expect(data).to.have.property("bids")
      expect(data).to.have.property("asks")
    })
    it("get orderBooks Asks with correct pairs", async function() {
      let data = await remote.getOrderBooksAsks("SWT", `CNY+${DATA.issuer}`)
      expect(data).to.have.property("success")
      expect(data.success).to.be.true
      expect(data).to.have.property("asks")
    })
    it("get orderBooks Bids with correct pairs", async function() {
      let data = await remote.getOrderBooksBids("SWT", `CNY+${DATA.issuer}`)
      expect(data).to.have.property("success")
      expect(data.success).to.be.true
      expect(data).to.have.property("bids")
    })
  })
  describe("Transactions", function() {
    this.timeout(15000)
    it("get account transactions with incorrect address", async function() {
      try {
        await remote.getAccountTransactions(DATA.address.slice(1))
      } catch (error) {
        expect(error).to.equal("invalid address provided")
      }
    })
    it("get account transactions with correct address", async function() {
      let data = await remote.getAccountTransactions(DATA.address)
      expect(data).to.have.property("success")
      expect(data.success).to.be.true
      expect(data).to.have.property("transactions")
      expect(data.transactions[0]).to.be.an("object")
      txid = data.transactions[0].hash
    })
    it("get account transaction with correct address", async function() {
      let data = await remote.getAccountTransaction(DATA.address, txid)
      expect(data).to.have.property("success")
      expect(data.success).to.be.true
      expect(data).to.have.property("transaction")
      expect(data.transaction.hash).to.equal(txid)
    })
    it("getAccountTransaction with incorrect hash", async function() {
      try {
        await remote.getAccountTransaction(DATA.address, "wrongtxhash")
      } catch (error) {
        expect(error).to.equal("Invalid parameter: hash.")
      }
    })
    it("get transaction", async function() {
      let data = await remote.getTransaction(txid)
      expect(data).to.have.property("success")
      expect(data.success).to.be.true
      expect(data).to.have.property("transaction")
      expect(data.transaction.hash).to.equal(txid)
    })
  })
  describe("accountContracts", function() {
    this.timeout(15000)
    it("post account contract deploy with incorrect address", async function() {
      try {
        await remote.postAccountContractDeploy(DATA.address.slice(1))
      } catch (error) {
        expect(error).to.equal("invalid address provided")
      }
    })
    it("post account contract deploy with correct address but no secret", async function() {
      try {
        await remote.postAccountContractDeploy(DATA.address, {})
      } catch (error) {
        expect(error).to.equal("unsafe operation disabled")
      }
    })
    xit("post account contract deploy with correct address and secret", async function() {
      try {
        let params = {
          secret: DATA.secret
        }
        let data = await remote.postAccountContractDeploy(
          DATA.address,
          params,
          "POST"
        )
        expect(data).to.have.property("success")
        expect(data.success).to.be.true
        expect(data).to.have.property("result")
        expect(data.result).to.equal("tesSUCCESS")
      } catch (error) {
        console.log(error)
        expect(error).to.equal("should not throw")
      }
    })
    it("post account contract call with incorrect address", async function() {
      try {
        await remote.postAccountContractCall(DATA.address.slice(1))
      } catch (error) {
        expect(error).to.equal("invalid address provided")
      }
    })
    it("post account contract call with correct address but no secret", async function() {
      try {
        await remote.postAccountContractCall(DATA.address, {})
      } catch (error) {
        expect(error).to.equal("unsafe operation disabled")
      }
    })
    xit("post account contract call with correct address and secret", async function() {
      try {
        let params = {
          secret: DATA.secret
        }
        let data = await remote.postAccountContractCall(
          DATA.address,
          params,
          "POST"
        )
        expect(data).to.have.property("success")
        expect(data.success).to.be.true
        expect(data).to.have.property("result")
        expect(data.result).to.equal("tesSUCCESS")
      } catch (error) {
        console.log(error)
        expect(error).to.equal("should not throw")
      }
    })
  })
  describe("parameters", function() {
    this.timeout(15000)
    it("CNY for getAccountBalances", async function() {
      try {
        data = await remote.getAccountBalances(DATA.address, {
          currency: "CNY"
        })
        expect(data).to.have.property("success")
        expect(data.success).to.be.true
        expect(data).to.have.property("balances")
        expect(data.balances[0]).to.be.an("object")
        expect(data.balances[0].currency).to.equal("CNY")
      } catch (error) {
        expect(error).to.equal("should not throw")
      }
    })
    it("results_per_page for getAccountTransactions", async function() {
      let data = await remote.getAccountTransactions(DATA.address, {
        results_per_page: 2
      })
      expect(data).to.have.property("success")
      expect(data.success).to.be.true
      expect(data).to.have.property("transactions")
      expect(data.transactions.length).to.equal(2)
    })
  })
})
