const expect = require("chai").expect
//import Remote from '../src/index'
const Remote = require("../").Remote
const DATA = require("../../.conf/config")
const remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5050" })

let payid = "should be updated during payments query"
let txid = "should be updated during transactions query"
let ledger_index = 100
let ledger_hash = "should be updated during ledger query"
txid = "B7C029F58D754C133D329243B21959E10DC5FC2E36DEC8DF4713086EBEA097A9"

describe("Remote", function () {
  describe("constructor", function () {
    it("instantiate a default Remote successfully", function () {
      let remote = new Remote({})
      expect(remote._server).to.be.equal("https://swtclib.ca:5050")
      expect(remote._token).to.be.equal("SWT")
    })
    it("instantiate a testnet Remote successfully", function () {
      let remote = new Remote({ server: "https://tapi.jingtum.com" })
      expect(remote._server).to.be.equal("https://tapi.jingtum.com")
      expect(remote._token).to.be.equal("SWT")
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
        account_root: DATA.address
      })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("node")
      expect(data.node.Account).to.be.equal(DATA.address)
    })
  })
  describe("rpcTx", function () {
    this.timeout(45000)
    it("get recent transactions", async function () {
      let data = await remote.rpcTxHistory()
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("txs")
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
        ledger_hash:
          "433D4046C84DE4E9619FF17F1BCF4C6D908DF08E5AE762D5170097E104405B70",
        tx_hash: txid
      })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("tx_json")
      expect(data.tx_json).to.have.property("hash")
      expect(data.tx_json.hash).to.be.equal(txid)
    })
    it("submit blob", async function () {
      let data = await remote.rpcSubmit({
        tx_blob:
          "12000022000000002400000EA4614000000002160EC068400000000000000A732103E466DB080F3863F354E9C1B1CA0927175B338C41789ACFC0EFAD50301524C23E7446304402200A1F6E65FD9D7076E4589C5BA13E2433B1C2CA9E7C0E42EFC7D57F22C74B1B780220355A2456589B79FD6D6185FD5A74BDE44CFB10E0F6711E4A3BF86FE531C72E6C81141C3D155BB13D3FE79CBF85E5C1DCB6B508079ABE83140ECD295EA24E99608A9B346838EB991BCF143E62F9EA7C06737472696E677D00E1F1"
      })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("engine_result")
      expect(data.engine_result).to.be.equal("tefPAST_SEQ")
      expect(data).to.have.property("tx_json")
      expect(data.tx_json.hash).to.be.equal(txid)
    })
    it("submit multisigned tx_json", async function () {
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
      let data = await remote.rpcAccountInfo({ account: DATA.address })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("account_data")
      expect(data.account_data).to.have.property("Balance")
      expect(data.account_data).to.have.property("Sequence")
    })
    it("get AccountObjects", async function () {
      let data = await remote.rpcAccountObjects({ account: DATA.address })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("account_objects")
      expect(data.account_objects).to.be.a("array")
    })
    it("get AccountCurrencies", async function () {
      let data = await remote.rpcAccountCurrencies({ account: DATA.address })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("receive_currencies")
      expect(data).to.have.property("send_currencies")
      expect(data.receive_currencies).to.be.a("array")
      expect(data.send_currencies).to.be.a("array")
    })
    it("get AccountLines", async function () {
      let data = await remote.rpcAccountLines({ account: DATA.address })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("lines")
      expect(data.lines).to.be.a("array")
    })
    it("get AccountOffers", async function () {
      let data = await remote.rpcAccountOffers({
        account: DATA.address,
        limit: 5
      })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("offers")
      expect(data.offers).to.be.a("array")
    })
    it("get AccountTx", async function () {
      let data = await remote.rpcAccountTx({ account: DATA.address, limit: 5 })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("transactions")
      expect(data.transactions).to.be.a("array")
    })
    it("get FeeInfo", async function () {
      let data = await remote.rpcFeeInfo({
        account: "jDXCeSHSpZ9LiX6ihckWaYDeDt5hFrdTto"
      })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("brokerages")
    })
    it("get BlacklistInfo with account", async function () {
      let data = await remote.rpcBlacklistInfo({ account: DATA.address })
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("blacklist")
      expect(data.blacklist).to.be.equal(false)
    })
    it("get BlacklistInfo list", async function () {
      let data = await remote.rpcBlacklistInfo()
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("marker")
      expect(data).to.have.property("state")
      expect(data.state.length).to.be.equal(256)
    })
  })
  describe("rpcBook", function () {
    this.timeout(45000)
    it("get book offers", async function () {
      let data = await remote.rpcBookOffers({
        taker_pays: remote.makeCurrency(),
        taker_gets: remote.makeCurrency("CNY"),
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
      let data = await remote.getAccountInfo(DATA.address)
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("account_data")
      expect(data.account_data).to.have.property("Sequence")
      expect(data.account_data).to.have.property("Balance")
      expect(data.account_data.Sequence).to.be.a("number")
    })
    it("get account sequence", async function () {
      let data = await remote.getAccountSequence(DATA.address)
      expect(data).to.be.a("number")
    })
    it("submit blob", async function () {
      let data = await remote.submit(
        "12000022000000002400000EA4614000000002160EC068400000000000000A732103E466DB080F3863F354E9C1B1CA0927175B338C41789ACFC0EFAD50301524C23E7446304402200A1F6E65FD9D7076E4589C5BA13E2433B1C2CA9E7C0E42EFC7D57F22C74B1B780220355A2456589B79FD6D6185FD5A74BDE44CFB10E0F6711E4A3BF86FE531C72E6C81141C3D155BB13D3FE79CBF85E5C1DCB6B508079ABE83140ECD295EA24E99608A9B346838EB991BCF143E62F9EA7C06737472696E677D00E1F1"
      )
      expect(data).to.have.property("status")
      expect(data.status).to.be.equal("success")
      expect(data).to.have.property("engine_result")
      expect(data.engine_result).to.be.equal("tefPAST_SEQ")
      expect(data).to.have.property("tx_json")
      expect(data.tx_json.hash).to.be.equal(txid)
    })
    it("submit multisigned tx_json", async function () {
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
