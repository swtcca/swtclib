const chai = require("chai")
chai.use(require("chai-json-schema"))
const Remote = require("../").Factory({ guomi: true, fee: 10000 })
const schema = require("./schema")
const expect = chai.expect
const Request = Remote.Request
const config = require("../../.conf/config")
const sinon = require("sinon")
let {
  JT_NODE_GM,
  TEST_NODE_GM,
  testSecretGm,
  testAddressGm,
  testDestinationAddressGm,
  testCreateHash,
  addressGm,
  address2Gm,
  secretGm,
  server,
  issuer
} = config

describe("test async actions", function () {
  this.timeout(10000)
  describe("test .connectPromise() requestServerInfo", function () {
    it("should request server info successfully", async function () {
      let remote = new Remote({
        server: JT_NODE_GM
      })
      remote.connectPromise().then(r => {
        let req = remote.requestServerInfo()
        expect(req._command).to.equal("server_info")
        expect(remote.isConnected()).to.equal(true)
        req.submitPromise().then(result => {
          remote.disconnect()
          expect(result).to.be.jsonSchema(schema.SERVER_INFO_SCHEMA)
        })
      })
    })
  })

  describe("test submitPromise() requestLedgerClosed", function () {
    it("should request ledger closed successfully", async function () {
      let remote = new Remote({
        server: JT_NODE_GM
      })
      await remote.connectPromise()
      let req = remote.requestLedgerClosed()
      expect(req._command).to.equal("ledger_closed")
      let result = await req.submitPromise()
      expect(result).to.be.jsonSchema(schema.LEDGER_CLOSED_SCHEMA)
      remote.disconnect()
    })
  })

  describe("test requestAccountInfo", function () {
    it("should request account info successfully", async function () {
      let remote = new Remote({
        server: JT_NODE_GM
      })
      await remote.connectPromise()
      let req = remote.requestAccountInfo({
        account: testAddressGm,
        peer: testDestinationAddressGm,
        limit: -1,
        type: "trust"
      })
      expect(req._command).to.equal("account_info")
      expect(req.message).to.deep.equal({
        account: testAddressGm,
        peer: testDestinationAddressGm,
        limit: 0,
        relation_type: 0,
        ledger_index: "validated"
      })
      let result = await req.submitPromise()
      expect(result).to.be.jsonSchema(schema.ACCOUNT_INFO_SCHEMA)
      expect(result.account_data.Account).to.equal(testAddressGm)
      remote.disconnect()
    })
  })

  describe("test Tx actions", function () {
    it("should Tx signPromise() submitPromise()", async function () {
      let remote = new Remote({
        server: TEST_NODE_GM
      })
      await remote.connectPromise()
      let tx = remote.buildPaymentTx({
        account: addressGm,
        to: address2Gm,
        amount: {
          value: 1,
          currency: "SWT",
          issuer: ""
        }
      })
      expect(tx.tx_json).to.deep.equal({
        Flags: 0,
        Fee: 10000,
        TransactionType: "Payment",
        Account: addressGm,
        Amount: "1000000",
        Destination: address2Gm
      })
      let result = await tx.signPromise(testSecretGm)
      expect(result).to.be.an("string")
      expect(tx.tx_json.Sequence).to.be.a("number")
      result = await tx.submitPromise()
      remote.disconnect()
      expect(result).to.be.an("object")
    })
  })
})
