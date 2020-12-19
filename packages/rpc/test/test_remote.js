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
  describe("rpcServerState", function() {
    this.timeout(15000)
    it("get server state", async function() {
      let data = await remote.rpcServerState()
      expect(data).to.have.property("status")
      expect(data).to.have.property("state")
      expect(data.state).to.have.property("server_state")
      expect(data.state).to.have.property("peers")
      expect(data.state).to.have.property("complete_ledgers")
      expect(data.state).to.have.property("validated_ledger")
      expect(data.state.validated_ledger).to.have.property("hash")
      expect(data.state.validated_ledger).to.have.property("seq")
      ledger_hash = data.state.validated_ledger.hash
      ledger_index = data.state.validated_ledger.seq
    })
  })
  describe("rpcLedger", function() {
    this.timeout(15000)
    it("get ledger closed", async function() {
      let data = await remote.rpcLedgerClosed()
      expect(data).to.have.property("status")
      expect(data).to.have.property("ledger_hash")
      expect(data).to.have.property("ledger_index")
    })
    it("get ledger current", async function() {
      let data = await remote.rpcLedgerCurrent()
      expect(data).to.have.property("status")
      expect(data).to.have.property("ledger_current_index")
    })
    it("get ledger without parameter", async function() {
      let data = await remote.rpcLedger()
      expect(data).to.have.property("status")
      expect(data).to.have.property("closed")
      expect(data).to.have.property("open")
      ledger_hash = data.closed.ledger.ledger_hash
      ledger_index = +data.closed.ledger.ledger_index
    })
    it("get ledger with hash", async function() {
      let data = await remote.rpcLedger({ledger_hash})
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data.ledger).to.have.property("ledger_index")
      expect(parseInt(data.ledger.ledger_index)).to.equal(ledger_index)
    })
    it("get ledger with index", async function() {
      let data = await remote.rpcLedger({ledger_index})
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data.ledger).to.have.property("ledger_hash")
      expect(data.ledger.ledger_hash).to.equal(ledger_hash)
    })
    it("get ledger data", async function() {
      let data = await remote.rpcLedgerData({limit: 3})
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("state")
      expect(data.state.length).to.be.equal(3)
    })
    it("get ledger entry", async function() {
      let data = await remote.rpcLedgerEntry({type: "account_root", account_root: DATA.address})
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("node")
      expect(data.node.Account).to.be.equal(DATA.address)
    })
  })
})
