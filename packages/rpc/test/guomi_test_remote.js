const expect = require("chai").expect
//import Remote from '../src/index'
const Remote = require("../").Factory({ guomi: true })
const DATA = require("../../.conf/config")
const remote = new Remote({ server: DATA.JT_NODE_GM_RPC })

let payid = "should be updated during payments query"
let txid = "should be updated during transactions query"
let ledger_index = 19936373
let ledger_hash = "should be updated during ledger query"
let ledger_txid
txid = "B57BB8F69DABCAE934A38C067F38D060940A484F8D6DEE5C167653CB7208B07F"

describe("Remote GUOMI", function () {
  describe("constructor", function () {
    it("instantiate a default Remote successfully", function () {
      let remote = new Remote({})
      expect(remote._server).to.be.equal("http://bcapps.ca:5050")
      expect(remote._token).to.be.equal("SWT")
    })
    it("instantiate a testnet Remote successfully", function () {
      let remote = new Remote({ server: "https://tapi.jingtum.com" })
      expect(remote._server).to.be.equal("https://tapi.jingtum.com")
      expect(remote._token).to.be.equal("SWT")
    })
  })
  describe("error handling", function () {
    it("requests should use post method", async function () {
      try {
        await remote._axios.get("")
      } catch (error) {
        expect(error.error).to.be.equal("validationError")
      }
    })
    it("requests needs a method property", async function () {
      try {
        await remote._axios.post("", { key: "value" })
      } catch (error) {
        expect(error.error).to.be.equal("validationError")
      }
    })
    it("requests needs a valid method property", async function () {
      try {
        await remote._axios.post("", { method: "invalid_method" })
      } catch (error) {
        expect(error.error).to.be.equal("unknownCmd")
      }
    })
    it("requests requires valid account property if any", async function () {
      try {
        await remote.getAccountInfo("j_invalid_address")
      } catch (error) {
        expect(error.error).to.be.equal("validationError")
      }
    })
    it("axios response error", async function () {
      let remote = new Remote({})
      let output = remote.config({ server: "http://invalid.server" })
      try {
        await remote.rpcVersion()
      } catch (error) {
        expect(error.error).to.be.equal("axiosIssue")
        expect(error.error_message).to.be.equal(
          "getaddrinfo ENOTFOUND invalid.server"
        )
      }
    })
    it("rpc response error", async function () {
      try {
        await remote.rpcAccountInfo({
          account: Remote.Wallet.generate().address
        })
      } catch (error) {
        expect(error.error).to.be.equal("actNotFound")
        expect(error.error_message).to.be.equal("Account not found.")
      }
    })
  })
  describe("rpcVersion", function () {
    this.timeout(15000)
    it("get server information", async function () {
      let data = await remote.rpcVersion()
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("version")
    })
  })
  describe("rpcServer", function () {
    this.timeout(15000)
    it("get server information", async function () {
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
    it("get server state", async function () {
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
  describe("rpcLedger", function () {
    this.timeout(15000)
    it("get ledger closed", async function () {
      let data = await remote.rpcLedgerClosed()
      expect(data).to.have.property("status")
      expect(data).to.have.property("ledger_hash")
      expect(data).to.have.property("ledger_index")
    })
    it("get ledger current", async function () {
      let data = await remote.rpcLedgerCurrent()
      expect(data).to.have.property("status")
      expect(data).to.have.property("ledger_current_index")
    })
    it("get ledger without parameter", async function () {
      let data = await remote.rpcLedger()
      expect(data).to.have.property("status")
      expect(data).to.have.property("closed")
      expect(data).to.have.property("open")
      ledger_hash = data.closed.ledger.ledger_hash
      ledger_index = +data.closed.ledger.ledger_index
    })
    it("get ledger with hash", async function () {
      let data = await remote.rpcLedger({ ledger_hash })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data.ledger).to.have.property("ledger_index")
      expect(parseInt(data.ledger.ledger_index)).to.equal(ledger_index)
    })
    it("get ledger with index", async function () {
      let data = await remote.rpcLedger({ ledger_index })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data.ledger).to.have.property("ledger_hash")
      expect(data.ledger.ledger_hash).to.equal(ledger_hash)
    })
    it("get ledger data", async function () {
      let data = await remote.rpcLedgerData({ limit: 3 })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("state")
      expect(data.state.length).to.be.equal(3)
    })
    it("get ledger entry", async function () {
      let data = await remote.rpcLedgerEntry({
        type: "account_root",
        account_root: DATA.addressGm
      })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("node")
      expect(data.node.Account).to.be.equal(DATA.addressGm)
    })
  })
  describe("rpcTx", function () {
    this.timeout(45000)
    it("get recent transactions", async function () {
      let data = await remote.rpcTxHistory()
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("txs")
      txid = data.txs[0].hash
      console.log(txid)
      ledger_txid = data.txs[0].ledger_index
    })
    it("get transaction", async function () {
      let data = await remote.rpcTx({ transaction: txid })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("hash")
      expect(data).to.have.property("ledger_index")
      expect(data).to.have.property("TransactionType")
    })
    it("get tx_entry from latest ledger should throw", async function () {
      try {
        await remote.rpcTxEntry({ tx_hash: txid })
        expect().to.be.equal("should throw since it is not in latest ledger")
      } catch (error) {
        expect(error.status).to.be.equal("error")
      }
    })
    it("get tx_entry from specific ledger", async function () {
      let data = await remote.rpcTxEntry({
        ledger_index: ledger_txid,
        tx_hash: txid
      })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("tx_json")
      expect(data.tx_json).to.have.property("hash")
      expect(data.tx_json.hash).to.be.equal(txid)
    })
    it("submit blob", async function () {
      let txEntry = await remote.getTx(txid, { binary: true })
      let data = await remote.rpcSubmit({
        tx_blob: txEntry.tx
      })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("engine_result")
      expect(data.engine_result).to.be.equal("tefPAST_SEQ")
      expect(data).to.have.property("tx_json")
      // expect(data.tx_json.hash).to.be.equal(txid)
    })
    xit("submit multisigned tx_json", async function () {
      let data = await remote.rpcSubmitMultisigned({
        tx_json: DATA.MULTISIGN_JSON
      })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("engine_result")
      expect(data.engine_result).to.be.equal("terPRE_SEQ")
      expect(data).to.have.property("tx_blob")
      expect(data).to.have.property("tx_json")
      expect(data.tx_json.SigningPubKey).to.be.equal("")
    })
  })
  describe("rpcAccount", function () {
    this.timeout(15000)
    it("get AccountInfo", async function () {
      let data = await remote.rpcAccountInfo({ account: DATA.addressGm })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("account_data")
      expect(data.account_data).to.have.property("Balance")
      expect(data.account_data).to.have.property("Sequence")
    })
    it("get AccountObjects", async function () {
      let data = await remote.rpcAccountObjects({ account: DATA.addressGm })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("account_objects")
      expect(data.account_objects).to.be.a("array")
    })
    it("get AccountCurrencies", async function () {
      let data = await remote.rpcAccountCurrencies({ account: DATA.addressGm })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("receive_currencies")
      expect(data).to.have.property("send_currencies")
      expect(data.receive_currencies).to.be.a("array")
      expect(data.send_currencies).to.be.a("array")
    })
    it("get AccountLines", async function () {
      let data = await remote.rpcAccountLines({ account: DATA.addressGm })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("lines")
      expect(data.lines).to.be.a("array")
    })
    it("get AccountRelataion", async function () {
      let data = await remote.rpcAccountRelation({ account: DATA.addressGm })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("lines")
      expect(data.lines).to.be.a("array")
    })
    it("get AccountOffers", async function () {
      let data = await remote.rpcAccountOffers({
        account: DATA.addressGm,
        limit: 5
      })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("offers")
      expect(data.offers).to.be.a("array")
    })
    it("get AccountTx", async function () {
      let data = await remote.rpcAccountTx({
        account: DATA.addressGm,
        limit: 5
      })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("transactions")
      expect(data.transactions).to.be.a("array")
    })
    xit("get FeeInfo", async function () {
      let data = await remote.rpcFeeInfo({
        account: "jDXCeSHSpZ9LiX6ihckWaYDeDt5hFrdTto"
      })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("brokerages")
    })
    it("get BlacklistInfo with account", async function () {
      let data = await remote.rpcBlacklistInfo({ account: DATA.addressGm })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("blacklist")
      expect(data.blacklist).to.be.equal(false)
    })
    it("get BlacklistInfo list", async function () {
      let data = await remote.rpcBlacklistInfo()
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      // expect(data).to.have.property("marker")
      expect(data).to.have.property("state")
      expect(data.state).to.be.a("array")
    })
  })
  describe("rpcBook", function () {
    this.timeout(45000)
    it("get book offers", async function () {
      let data = await remote.rpcBookOffers({
        taker_pays: remote.makeCurrency(),
        taker_gets: remote.makeCurrency("test"),
        limit: 2
      })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("offers")
      expect(data.offers).to.be.a("array")
    })
    xit("get path find unstable", async function () {
      this.timeout(45000)
      let data = await remote.rpcSkywellPathFind({
        destination_account: "jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG",
        source_account: "jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG",
        destination_amount: remote.makeAmount(1, "cny"),
        source_currencies: [
          remote.makeCurrency("vcc"),
          remote.makeCurrency("jcc")
        ]
      })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("alternatives")
      expect(data.alternatives).to.be.a("array")
    })
  })
  describe("derived methods", function () {
    this.timeout(45000)
    it("get account info", async function () {
      let data = await remote.getAccountInfo(DATA.addressGm)
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("account_data")
      expect(data.account_data).to.have.property("Sequence")
      expect(data.account_data).to.have.property("Balance")
      expect(data.account_data.Sequence).to.be.a("number")
    })
    it("get account sequence", async function () {
      let data = await remote.getAccountSequence(DATA.addressGm)
      expect(data).to.be.a("number")
    })
    it("submit blob", async function () {
      let txEntry = await remote.getTx(txid, { binary: true })
      let data = await remote.submit(txEntry.tx)
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("engine_result")
      expect(data.engine_result).to.be.equal("tefPAST_SEQ")
      expect(data).to.have.property("tx_json")
      expect(data.tx_json.hash).to.be.equal(txid)
    })
    xit("submit multisigned tx_json", async function () {
      let data = await remote.submitMultisigned(DATA.MULTISIGN_JSON)
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("engine_result")
      expect(data.engine_result).to.be.equal("terPRE_SEQ")
      expect(data).to.have.property("tx_blob")
      expect(data).to.have.property("tx_json")
      expect(data.tx_json.SigningPubKey).to.be.equal("")
    })
  })
})
