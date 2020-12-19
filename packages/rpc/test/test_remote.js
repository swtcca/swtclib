const expect = require("chai").expect
//import Remote from '../src/index'
const Remote = require("../").Remote
const DATA = require("../../.conf/config")
const remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5050" })

let payid = "should be updated during payments query"
let txid = "should be updated during transactions query"
let ledger_index = 100
let ledger_hash = "should be updated during ledger query"

describe("Remote", function() {
  describe("constructor", function() {
    it("instantiate a default Remote successfully", function() {
      let remote = new Remote({})
      expect(remote._server).to.be.equal("https://swtclib.ca:5050")
      expect(remote._token).to.be.equal("SWT")
    })
    it("instantiate a testnet Remote successfully", function() {
      let remote = new Remote({ server: "https://tapi.jingtum.com" })
      expect(remote._server).to.be.equal("https://tapi.jingtum.com")
      expect(remote._token).to.be.equal("SWT")
    })
  })
  describe("rpcServerInfo", function() {
    this.timeout(15000)
    it("get server information", async function() {
      let data = await remote.rpcServerInfo()
      expect(data).to.have.property("status")
      expect(data).to.have.property("info")
      expect(data.info).to.have.property("server_state")
      expect(data.info).to.have.property("peers")
      expect(data.info).to.have.property("complete_ledgers")
      expect(data.info).to.have.property("validated_ledger")
      expect(data.info.validated_ledger).to.have.property("hash")
      expect(data.info.validated_ledger).to.have.property("seq")
      ledger_hash = data.info.validated_ledger.hash
      ledger_index = data.info.validated_ledger.seq
    })
  })
  describe("rpcLedger", function() {
    this.timeout(15000)
    it("get ledger without parameter", async function() {
      let data = await remote.rpcLedger({})
      expect(data).to.have.property("status")
      expect(data).to.have.property("closed")
      expect(data).to.have.property("open")
      ledger_hash = data.closed.ledger_hash
      ledger_index = data.closed.ledger_index
    })
    it("get ledger with hash not supported", async function() {
      let data = await remote.rpcLedger({ledger_index: "2F911581F1BDF096BFBB17ED69EC6C3EA49C7FC34E3810A4BA134B70BEE4E30E"})
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("error")
      expect(data).to.have.property("error_message")
      expect(data.error_message).to.be.equal("ledgerIndexMalformed")
    })
    it("get ledger with index", async function() {
      let data = await remote.rpcLedger({ledger_index: 17849521})
      expect(data.ledger).to.have.property("ledger_index")
      expect(parseInt(data.ledger.ledger_index)).to.equal(17849521)
    })
  })
  describe("parameters", function() {
    this.timeout(15000)
    xit("currency for getAccountBalances", async function() {
      try {
        data = await remote.getAccountBalances(DATA.address, {
          currency: "JSLASH"
        })
        expect(data).to.have.property("balances")
        expect(data.balances[0]).to.be.an("object")
        expect(data.balances[0].currency).to.equal("JSLASH")
      } catch (error) {
        expect(error).to.equal("should not throw")
      }
    })
    xit("limits for getAccountTransactions", async function() {
      let data = await remote.getAccountTransactions(DATA.address, {
        limit: 4
      })
      expect(data).to.have.property("transactions")
      expect(data.transactions.length).to.equal(4)
    })
  })
})
