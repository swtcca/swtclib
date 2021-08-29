const chai = require("chai")
chai.use(require("chai-json-schema"))
// const { WalletGm } = require("@swtc/wallet")
const WalletGm = require("@swtc/wallet").Factory({ guomi: true, fee: 10000 })
const Remote = require("../").Factory(WalletGm)
const schema = require("./schema")
const expect = chai.expect
const Request = Remote.Request
const config = require("../../.conf/config")
const sinon = require("sinon")
const OrderBook = Remote.OrderBook
let {
  WSS_NODE,
  JT_NODE,
  JT_NODE_GM,
  TEST_NODE_GM,
  testAddress,
  testAddressGm,
  testAddressGmEd,
  testPlatform
} = config
const TEST_NODE = TEST_NODE_GM
const testDestinationAddress = testAddressGmEd

const txid = "95AE80EA7BEB873559702DF0C051FF785BB0B8928F8302278D6BD0A7CDBDDC0C"
const testCreateHash = txid

describe("test remote GUOMI", function () {
  describe("test constructor", function () {
    xit("throw error if the arguments is undefined", function () {
      let remote = new Remote()
      expect(remote.type).to.be.an("error")
    })

    it("the default _token is swt", function () {
      let remote = new Remote({
        server: JT_NODE_GM
      })
      expect(remote._token.toLowerCase()).to.be.equal("swt")
    })

    it("if the server is ws", function () {
      let remote = new Remote({
        server: TEST_NODE
      })
      expect(remote._server._opts.secure).to.equal(false)
    })
  })

  describe("test _updateServerStatus", function () {
    it("the server is offline if the online states does not include the server status", function () {
      let remote = new Remote({
        server: JT_NODE_GM
      })
      remote._updateServerStatus({
        load_base: 256,
        load_factor: 256,
        server_status: "disconnect",
        pubkey_node: ""
      })
      expect(remote.isConnected()).to.equal(false)
    })

    it("connect in error if the _server is empty", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote._server = null
      remote.connect((err, result) => {
        expect(err).to.be.a("string")
        done()
      })
    })

    it("not call disconnet if the _server is empty", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote._server = null
      remote.disconnect()
      expect(true)
    })
  })

  describe("test requestServerInfo", function () {
    it("should request server info successfully", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM
      })
      remote.connect((err, result) => {
        if (err) {
          console.log(err)
          done()
        } else {
          let req = remote.requestServerInfo()
          expect(remote.isConnected()).to.equal(true)
          expect(req._command).to.equal("server_info")
          req.submit((error, result) => {
            if (error) {
              console.log(error)
              remote.disconnect()
              done()
            } else {
              expect(result).to.be.jsonSchema(schema.SERVER_INFO_SCHEMA)
              remote.disconnect()
              done()
            }
          })
        }
      })
    })
  })

  describe("test requestPeers", function () {
    it("should request peers successfully", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestPeers()
      expect(req._command).to.equal("peers")
    })
  })

  describe("test requestLedgerClosed", function () {
    it("should request ledger closed successfully", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote.connect((err, result) => {
        let req = remote.requestLedgerClosed()
        expect(req._command).to.equal("ledger_closed")
        req.submit((err, result) => {
          expect(result).to.be.jsonSchema(schema.LEDGER_CLOSED_SCHEMA)
          remote.disconnect()
          done()
        })
      })
    })
  })

  describe("test requestLedger", function () {
    it("should request ledger successfully if the option of full is true", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote.connect((err, result) => {
        let req = remote.requestLedger({
          full: true
        })
        expect(req._command).to.equal("ledger")
        expect(req.message).to.deep.equal({
          full: true
        })
        req.submit((err, result) => {
          expect(result).to.be.jsonSchema(schema.LEDGER_SCHEMA)
          remote.disconnect()
          done()
        })
      })
    })

    it("should request ledger successfully if the option of expand is true", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestLedger({
        expand: true
      })
      expect(req._command).to.equal("ledger")
      expect(req.message).to.deep.equal({
        expand: true
      })
    })

    it("should request ledger successfully if the option of transactions is true", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestLedger({
        transactions: true,
        ledger_hash:
          "9E0277C68A170EFE1F5B91A7D99645D56F8843D1CBB69149919B50506A258C61",
        ledger_index: "10817678"
      })
      expect(req._command).to.equal("ledger")
      expect(req.message).to.deep.equal({
        transactions: true,
        ledger_hash:
          "9E0277C68A170EFE1F5B91A7D99645D56F8843D1CBB69149919B50506A258C61",
        ledger_index: 10817678
      })
    })

    it("should request ledger successfully if the option of accounts is true", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestLedger({
        accounts: true
      })
      expect(req._command).to.equal("ledger")
      expect(req.message).to.deep.equal({
        accounts: true
      })
    })

    it("should request ledger successfully if the option is empty object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote.connect((err, result) => {
        let req = remote.requestLedger({})
        expect(req._command).to.equal("ledger")
        expect(req.message).to.deep.equal({})
        req.submit((err, result) => {
          expect(result).to.be.jsonSchema(schema.LEDGER_SCHEMA)
          remote.disconnect()
          done()
        })
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestLedger(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })
  })

  describe("test requestTx", function () {
    it("should request tx successfully", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote.connect((error, result) => {
        if (error) {
          console.log(error)
          expect(error).to.be.an("error")
          done()
        }
        let req = remote.requestTx({
          hash: txid
        })
        expect(req._command).to.equal("tx")
        expect(req.message).to.deep.equal({
          transaction: testCreateHash
        })
        req.submit((err, res) => {
          if (err) {
            console.log(err)
            remote.disconnect()
            done()
          } else {
            expect(res).to.be.jsonSchema(schema.TX_SCHEMA)
            remote.disconnect()
            done()
          }
        })
      })
    })

    it("should request tx in error", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote.connect((err, result) => {
        let req = remote.requestTx({
          hash: "20753B803666F729F99B3F2E90AD4E9731572D773B0E3E0DEB733197196F4EB5"
        })
        expect(req._command).to.equal("tx")
        req.submit((err, result) => {
          console.log("replied")
          console.log(err)
          expect(err).to.not.null
          expect(result).to.equal(undefined)
          console.log(result)
          remote.disconnect()
          done()
        })
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestTx()
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })

    it("throw error if the hash is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestTx({
        hash: "aaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid tx hash")
        done()
      })
    })
  })

  describe("test requestAccountInfo", function () {
    it("should request account info successfully", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote.connect((err, result) => {
        let req = remote.requestAccountInfo({
          account: testAddressGm,
          peer: testDestinationAddress,
          limit: -1,
          type: "trust"
        })
        expect(req._command).to.equal("account_info")
        expect(req.message).to.deep.equal({
          account: testAddressGm,
          peer: testDestinationAddress,
          limit: 0,
          relation_type: 0,
          ledger_index: "validated"
        })
        req.submit((err, result) => {
          expect(result).to.be.jsonSchema(schema.ACCOUNT_INFO_SCHEMA)
          expect(result.account_data.Account).to.equal(testAddressGm)
          remote.disconnect()
          done()
        })
      })
    })

    it("if the peer is valid, limit is less than 0 and marker is valid", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestAccountInfo({
        peer: testDestinationAddress,
        limit: -1,
        marker: 1,
        type: "authorize",
        ledger: "closed"
      })
      expect(req._command).to.equal("account_info")
      expect(req.message).to.deep.equal({
        peer: testDestinationAddress,
        limit: 0,
        marker: 1,
        relation_type: 1,
        ledger_index: "closed"
      })
    })

    it("if the limit is more than 1e9", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestAccountInfo({
        account: testAddressGm,
        limit: 2e9,
        type: "freeze",
        ledger: 111
      })
      expect(req._command).to.equal("account_info")
      expect(req.message).to.deep.equal({
        account: testAddressGm,
        limit: 1e9,
        relation_type: 3,
        ledger_index: 111
      })
    })

    it("if the ledger is hash code", function () {
      this.timeout(0)
      let remote = new Remote({
        server: TEST_NODE,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestAccountInfo({
        account: testAddressGm,
        limit: 2e9,
        type: "freeze",
        ledger: testCreateHash
      })
      expect(req._command).to.equal("account_info")
      expect(req.message).to.deep.equal({
        account: testAddressGm,
        limit: 1e9,
        relation_type: 3,
        ledger_hash: testCreateHash
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestAccountInfo(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })

    it("throw error if the address is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestAccountInfo({
        account: testAddressGm.substring(1)
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid account")
        done()
      })
    })
  })

  describe("test requestAccountTums", function () {
    it("should request account tums successfully", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote.connect((err, result) => {
        let req = remote.requestAccountTums({
          account: testAddressGm,
          type: "trust"
        })
        expect(req._command).to.equal("account_currencies")
        expect(req.message).to.deep.equal({
          account: testAddressGm,
          ledger_index: "validated",
          relation_type: 0
        })
        req.submit((err, result) => {
          expect(result).to.be.jsonSchema(schema.ACCOUNT_TUMS_SCHEMA)
          remote.disconnect()
          done()
        })
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestAccountTums(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })
  })

  describe("test requestAccountRelations", function () {
    it("should request account relations successfully if the type is trust", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote.connect((err, result) => {
        let req = remote.requestAccountRelations({
          account: testAddressGm,
          type: "trust"
        })
        expect(req._command).to.equal("account_lines")
        expect(req.message).to.deep.equal({
          account: testAddressGm,
          ledger_index: "validated",
          relation_type: 0
        })
        req.submit((err, result) => {
          expect(result).to.be.jsonSchema(schema.ACCOUNT_RELATIONS_SCHEMA)
          expect(result.account).to.equal(testAddressGm)
          remote.disconnect()
          done()
        })
      })
    })

    it("should request account relations successfully if the type is freeze", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestAccountRelations({
        account: testAddressGm,
        type: "freeze",
        ledger: "10000"
      })
      expect(req._command).to.equal("account_relation")
      expect(req.message).to.deep.equal({
        account: testAddressGm,
        ledger_index: 10000,
        relation_type: 3
      })
    })

    it("should request account relations successfully if the type is authorize", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestAccountRelations({
        account: testAddressGm,
        type: "authorize",
        ledger: "10000"
      })
      expect(req._command).to.equal("account_relation")
      expect(req.message).to.deep.equal({
        account: testAddressGm,
        ledger_index: 10000,
        relation_type: 1
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestAccountRelations(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })

    it("throw error if the type is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestAccountRelations({
        account: testAddressGm,
        type: "authorizes",
        ledger_index: "10000"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid realtion type")
        done()
      })
    })

    it("throw error if the type is unfreeze", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestAccountRelations({
        account: testAddressGm,
        type: "unfreeze",
        ledger_index: "10000"
      })
      req.submit((err, result) => {
        expect(err).to.equal("relation should not go here")
        done()
      })
    })
  })

  describe("test requestAccountOffers", function () {
    it("should request account offers successfully", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote.connect((err, result) => {
        let req = remote.requestAccountOffers({
          account: testAddressGm,
          type: "trust"
        })
        expect(req._command).to.equal("account_offers")
        expect(req.message).to.deep.equal({
          account: testAddressGm,
          relation_type: 0,
          ledger_index: "validated"
        })
        req.submit((err, result) => {
          expect(result).to.be.jsonSchema(schema.ACCOUNT_OFFERS_SCHEMA)
          expect(result.account).to.equal(testAddressGm)
          remote.disconnect()
          done()
        })
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestAccountOffers(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })
  })

  describe("test requestAccountTx", function () {
    it("should request account tx successfully with more options", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote.connect((err, result) => {
        let req = remote.requestAccountTx({
          account: testAddressGm
        })
        expect(req._command).to.equal("account_tx")
        expect(req.message).to.deep.equal({
          account: testAddressGm,
          ledger_index_min: 0,
          ledger_index_max: -1
        })
        req.submit((err, result) => {
          expect(result).to.be.jsonSchema(schema.ACCOUNT_TX_SCHEMA)
          remote.disconnect()
          done()
        })
      })
    })

    it("should request account tx successfully", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })

      let req = remote.requestAccountTx({
        account: testAddressGm,
        ledger_min: 1,
        ledger_max: 1000,
        limit: 10,
        offset: 10,
        forward: true,
        marker: {
          ledger: 0,
          seq: 0
        }
      })
      expect(req._command).to.equal("account_tx")
      expect(req.message).to.deep.equal({
        account: testAddressGm,
        ledger_index_min: 1,
        ledger_index_max: 1000,
        limit: 10,
        offset: 10,
        forward: true,
        marker: {
          ledger: 0,
          seq: 0
        }
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestAccountTx(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestAccountTx({
        accounts: "aaaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("account parameter is invalid")
        done()
      })
    })
  })

  describe("test requestOrderBook", function () {
    it("should request order book successfully", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM
      })
      remote.connect((error, result) => {
        if (error) {
          console.log(error)
          done()
        } else {
          let req = remote.requestOrderBook({
            pays: remote.makeCurrency("TEST"),
            gets: remote.makeCurrency(),
            taker: "jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W",
            limit: 10
          })
          expect(req._command).to.equal("book_offers")
          expect(req.message).to.deep.equal({
            taker_pays: remote.makeCurrency(),
            taker_gets: remote.makeCurrency("test"),
            taker: "jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W",
            limit: 10
          })
          req.submit((err, res) => {
            if (err) {
              console.log(err)
              remote.disconnect()
              done()
            } else {
              expect(res).to.be.jsonSchema(schema.ORDER_BOOK_SECHEMA)
              remote.disconnect()
              done()
            }
          })
        }
      })
    })

    it("should request order book successfully if the option of taker is empty", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestOrderBook({
        gets: {
          currency: "TEST",
          issuer: "jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W"
        },
        pays: {
          currency: "SWT",
          issuer: ""
        }
      })
      expect(req._command).to.equal("book_offers")
      expect(req.message).to.deep.equal({
        taker_gets: {
          currency: "SWT",
          issuer: ""
        },
        taker_pays: {
          currency: "TEST",
          issuer: "jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W"
        },
        taker: "jjjjjjjjjjjjjjjjjjjjwVBfmE",
        limit: 300
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestOrderBook(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })

    it("throw error if the gets is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestOrderBook({
        gets: {
          currency: "TEST",
          issuer: "jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W"
        },
        pays: null
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid taker gets amount")
        done()
      })
    })

    it("throw error if the pays is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestOrderBook({
        gets: null,
        pays: {
          currency: "SWT",
          issuer: ""
        }
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid taker pays amount")
        done()
      })
    })
  })

  describe("test requestBrokerage", function () {
    it("if the options is valid", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestBrokerage({
        account: testAddressGm
      })
      expect(req._command).to.equal("Fee_Info")
      expect(req.message).to.deep.equal({
        account: testAddressGm,
        ledger_index: "validated"
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestBrokerage(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })

    it("throw error if the account is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestBrokerage({
        account: "invalid platform address"
      })
      req.submit((err, result) => {
        expect(err).to.equal("account parameter is invalid")
        done()
      })
    })

    xit("throw error if the app is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestBrokerage({
        account: "jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W",
        app: "aa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid app, it is a positive integer.")
        done()
      })
    })

    xit("throw error if the currency is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestBrokerage({
        account: "jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W",
        app: 1,
        currency: "Sw"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid currency.")
        done()
      })
    })
  })

  describe("test requestPathFind", function () {
    it("should request path successfully", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote.connect((err, result) => {
        let req = remote.requestPathFind({
          account: testAddressGm,
          destination: testDestinationAddress,
          amount: {
            value: "0.001",
            currency: "SWT",
            issuer: ""
          }
        })
        expect(req._command).to.equal("path_find")
        expect(req.message).to.deep.equal({
          subcommand: "create",
          source_account: testAddressGm,
          destination_account: testDestinationAddress,
          destination_amount: "1000"
        })
        req.submit((err, result) => {
          expect(result).to.be.jsonSchema(schema.PATH_FIND_SCHEMA)
          remote.disconnect()
          done()
        })
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestPathFind(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })

    it("throw error if the account is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestPathFind({
        account: "aaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid source account")
        done()
      })
    })

    it("throw error if the destination is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestPathFind({
        account: testAddressGm,
        destination: "aaaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid destination account")
        done()
      })
    })

    it("throw error if the amount is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestPathFind({
        account: testAddressGm,
        destination: testDestinationAddress,
        amount: null
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid amount")
        done()
      })
    })

    it("throw error if the amount is more than 100000000000", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.requestPathFind({
        account: testAddressGm,
        destination: testDestinationAddress,
        amount: {
          value: "1000000000000",
          currency: "SWT",
          issuer: ""
        }
      })
      req.submit((err, result) => {
        expect(err).to.equal(
          "invalid amount: amount's maximum value is 100000000000"
        )
        done()
      })
    })
  })

  describe("test createAccountStub", function () {
    it("create account stub successfully", function () {
      let Account = Remote.Account
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let stub = remote.createAccountStub()
      expect(stub instanceof Account).to.equal(true)
    })
  })

  describe("test createOrderBookStub", function () {
    it("create order book stub successfully", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let stub = remote.createOrderBookStub()
      expect(stub instanceof OrderBook).to.equal(true)
    })
  })

  describe("test buildOfferCreateTx", function () {
    it("should buildOfferCreateTx successfully if the type is sell", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let options = {
        type: "Sell",
        account: testAddressGm,
        taker_gets: {
          value: "0.00001",
          currency: "TEST",
          issuer: "jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W"
        },
        taker_pays: {
          value: "1",
          currency: "SWT",
          issuer: ""
        }
      }
      let tx = remote.buildOfferCreateTx(options)
      expect(tx.tx_json).to.deep.equal({
        Flags: 524288,
        Fee: 10000,
        TransactionType: "OfferCreate",
        Account: testAddressGm,
        TakerPays: "1000000",
        TakerGets: {
          value: "0.00001",
          currency: "TEST",
          issuer: "jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W"
        }
      })
    })

    it("should buildOfferCreateTx successfully: case 2", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let options = {
        type: "Buy",
        account: testAddressGm,
        pays: {
          value: "0.00001",
          currency: "TEST",
          issuer: "jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W"
        },
        gets: {
          value: "1",
          currency: "SWT",
          issuer: ""
        },
        platform: testAddressGmEd
      }
      let tx = remote.buildOfferCreateTx(options)
      expect(tx.tx_json).to.deep.equal({
        Flags: 0,
        Fee: 10000,
        TransactionType: "OfferCreate",
        Account: testAddressGm,
        TakerPays: "1000000",
        TakerGets: {
          value: "0.00001",
          currency: "TEST",
          issuer: "jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W"
        },
        Platform: testAddressGmEd
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildOfferCreateTx(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })

    it("throw error if the account is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildOfferCreateTx({
        account: testAddressGm.substring(1)
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid source address")
        done()
      })
    })

    it("throw error if the type is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildOfferCreateTx({
        account: testAddressGm,
        type: "sell"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid offer type")
        done()
      })
    })

    it("throw error if the taker_gets is string but invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildOfferCreateTx({
        account: testAddressGm,
        type: "Sell",
        pays: "aaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid to pays amount")
        done()
      })
    })

    it("throw error if the taker_gets is object but invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildOfferCreateTx({
        account: testAddressGm,
        type: "Sell",
        pays: {}
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid to pays amount object")
        done()
      })
    })

    it("throw error if the taker_pays is string but invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildOfferCreateTx({
        account: testAddressGm,
        type: "Sell",
        pays: "1",
        gets: "sss"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid to gets amount")
        done()
      })
    })

    it("throw error if the taker_pays is object but invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildOfferCreateTx({
        account: testAddressGm,
        type: "Sell",
        pays: "1",
        gets: {}
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid to gets amount object")
        done()
      })
    })

    it("throw error if the platform is not valid address", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildOfferCreateTx({
        account: testAddressGm,
        type: "Sell",
        pays: {
          value: "0.00001",
          currency: "TEST",
          issuer: "jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W"
        },
        gets: {
          value: "1",
          currency: "SWT",
          issuer: ""
        },
        platform: 111
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid platform, it must be a valid address.")
        done()
      })
    })
  })

  describe("test buildPaymentTx", function () {
    it("should buildPaymentTx successfully", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let tx = remote.buildPaymentTx({
        account: testAddressGm,
        to: testDestinationAddress,
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
        Account: testAddressGm,
        Amount: "1000000",
        Destination: testDestinationAddress
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildPaymentTx(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })

    it("throw error if the account is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildPaymentTx({
        account: "aaaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid source address")
        done()
      })
    })

    it("throw error if the destination is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildPaymentTx({
        account: testAddressGm,
        destination: "aaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid destination address")
        done()
      })
    })

    it("throw error if the amount is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildPaymentTx({
        account: testAddressGm,
        destination: testDestinationAddress,
        amount: null
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid amount")
        done()
      })
    })
  })

  describe("test buildOfferCancelTx", function () {
    it("should buildOfferCancelTx successfully", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let tx = remote.buildOfferCancelTx({
        account: testAddressGm,
        sequence: 1
      })
      expect(tx.tx_json).to.deep.equal({
        Flags: 0,
        Fee: 10000,
        TransactionType: "OfferCancel",
        Account: testAddressGm,
        OfferSequence: 1
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildOfferCancelTx(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })

    it("throw error if the account is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildOfferCancelTx({
        account: "aaaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid source address")
        done()
      })
    })

    it("throw error if the sequence is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildOfferCancelTx({
        account: testAddressGm,
        sequence: "aaaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid sequence param")
        done()
      })
    })
  })

  describe("test deployContractTx", function () {
    it("should deployContractTx successfully", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let tx = remote.deployContractTx({
        account: testAddressGm,
        amount: "1",
        payload: "aaa",
        params: ["sss"]
      })
      expect(tx.tx_json).to.deep.equal({
        TransactionType: "ConfigContract",
        Fee: 10000,
        Flags: 0,
        Account: testAddressGm,
        Amount: 1000000,
        Method: 0,
        Args: [
          {
            Arg: {
              Parameter: "737373"
            }
          }
        ],
        Payload: "aaa"
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.deployContractTx(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })

    it("throw error if the account is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.deployContractTx({
        account: "aaaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid address")
        done()
      })
    })

    it("throw error if the amount is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.deployContractTx({
        account: testAddressGm,
        amount: "aaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid amount")
        done()
      })
    })

    it("throw error if the payload is not string", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.deployContractTx({
        account: testAddressGm,
        amount: 1,
        payload: null
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid payload: type error.")
        done()
      })
    })

    it("throw error if the params is not array", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.deployContractTx({
        account: testAddressGm,
        amount: 1,
        payload: "aaa",
        params: "aaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })
  })

  describe("test callContractTx", function () {
    it("should callContractTx successfully", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let tx = remote.callContractTx({
        account: testAddressGm,
        destination: testDestinationAddress,
        func: "test",
        params: ["sss"]
      })
      expect(tx.tx_json).to.deep.equal({
        Flags: 0,
        Fee: 10000,
        TransactionType: "ConfigContract",
        Account: testAddressGm,
        Method: 1,
        ContractMethod: "74657374",
        Destination: testDestinationAddress,
        Args: [
          {
            Arg: {
              Parameter: "737373"
            }
          }
        ]
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.callContractTx(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })

    it("throw error if the account is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.callContractTx({
        account: "aaaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid address")
        done()
      })
    })

    it("throw error if the destination is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.callContractTx({
        account: testAddressGm,
        destination: "aaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid destination")
        done()
      })
    })

    it("throw error if the params is not array", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.callContractTx({
        account: testAddressGm,
        destination: testDestinationAddress,
        params: "aaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })

    it("throw error if the item in params is not string", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.callContractTx({
        account: testAddressGm,
        destination: testDestinationAddress,
        func: "test",
        params: [null]
      })
      req.submit((err, result) => {
        expect(err).to.equal("params must be string")
        done()
      })
    })

    it("throw error if the func is not string", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.callContractTx({
        account: testAddressGm,
        destination: testDestinationAddress,
        params: ["aaa"],
        func: 111
      })
      req.submit((err, result) => {
        expect(err).to.equal("func must be string")
        done()
      })
    })
  })

  describe("test buildSignTx", function () {
    it("should buildSignTx successfully", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let tx = remote.buildSignTx({
        blob: "aaa"
      })
      expect(tx.tx_json).to.deep.equal({
        Flags: 0,
        Fee: 10000,
        TransactionType: "Signer",
        blob: "aaa"
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildSignTx(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })
  })

  describe("test buildBrokerageTx", function () {
    it("should buildBrokerageTx successfully", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let tx = remote.buildBrokerageTx({
        account: testAddressGm,
        molecule: 10,
        denominator: 20,
        feeAccount: testAddressGmEd,
        amount: {
          value: "1",
          currency: "SWT",
          issuer: ""
        }
      })
      expect(tx.tx_json).to.deep.equal({
        Flags: 0,
        Fee: 10000,
        TransactionType: "Brokerage",
        Account: testAddressGm,
        FeeAccountID: testAddressGmEd,
        OfferFeeRateNum: 10,
        OfferFeeRateDen: 20,
        Amount: "1000000"
      })
    })

    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildBrokerageTx(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })

    it("throw error if the account is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildBrokerageTx({
        account: "aaaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid address")
        done()
      })
    })

    it("throw error if the molecule is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildBrokerageTx({
        account: testAddressGm,
        molecule: "aa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid mol, it is a positive integer or zero.")
        done()
      })
    })

    it("throw error if the denominator is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildBrokerageTx({
        account: testAddressGm,
        feeAccount: testPlatform,
        molecule: 10,
        amount: {
          value: "1",
          currency: "SWT",
          issuer: ""
        },
        denominator: "bb"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid den, it is a number")
        done()
      })
    })

    xit("throw error if the app is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildBrokerageTx({
        account: testAddressGm,
        feeAccount: testPlatform,
        molecule: 10,
        denominator: 20,
        app: "aa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid den/app, it is a positive integer.")
        done()
      })
    })

    it("throw error if the molecule is more than denominator", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildBrokerageTx({
        account: testAddressGm,
        molecule: 10,
        denominator: 5,
        app: 1
      })
      req.submit((err, result) => {
        expect(err).to.equal(
          "invalid mol/den, molecule can not exceed denominator."
        )
        done()
      })
    })

    it("throw error if the amount is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildBrokerageTx({
        account: testAddressGm,
        molecule: 10,
        denominator: 20,
        app: 1,
        amount: null
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid amount")
        done()
      })
    })
  })

  describe("test buildAccountSetTx", function () {
    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildAccountSetTx(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })

    it("throw error if the type is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildAccountSetTx({
        type: "aaaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid account set type")
        done()
      })
    })

    it("throw error if the account is invalid when the type is property", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildAccountSetTx({
        type: "property",
        account: testAddressGm.substring(1)
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid source address")
        done()
      })
    })

    it("if the set and clear flag is string when the type is property", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildAccountSetTx({
        type: "property",
        account: testAddressGm,
        set: "asfRequireDest",
        clear: "GlobalFreeze"
      })
      expect(req.tx_json).to.deep.equal({
        Flags: 0,
        Fee: 10000,
        TransactionType: "AccountSet",
        Account: testAddressGm,
        SetFlag: 1,
        ClearFlag: 7
      })
    })

    it("if the set and clear flag is number  when the type is property", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildAccountSetTx({
        type: "property",
        account: testAddressGm,
        set: 1,
        clear: 7
      })
      expect(req.tx_json).to.deep.equal({
        Flags: 0,
        Fee: 10000,
        TransactionType: "AccountSet",
        Account: testAddressGm,
        SetFlag: 1,
        ClearFlag: 7
      })
    })

    it("if the set and clear flag is empty  when the type is property", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildAccountSetTx({
        type: "property",
        account: testAddressGm
      })
      expect(req.tx_json).to.deep.equal({
        Flags: 0,
        Fee: 10000,
        TransactionType: "AccountSet",
        Account: testAddressGm
      })
    })

    it("throw error if the account is invalid when the type is delegate", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildAccountSetTx({
        type: "delegate",
        account: testAddressGm.substring(1)
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid source address")
        done()
      })
    })

    it("throw error if the delegate_key is invalid when the type is delegate", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildAccountSetTx({
        type: "delegate",
        account: testAddressGm,
        delegate_key: testDestinationAddress.substring(1)
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid regular key address")
        done()
      })
    })

    it("if the options is valid when the type is delegate", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildAccountSetTx({
        type: "delegate",
        from: testAddressGm,
        delegate_key: testDestinationAddress
      })
      expect(req.tx_json).to.deep.equal({
        Flags: 0,
        Fee: 10000,
        TransactionType: "SetRegularKey",
        Account: testAddressGm,
        RegularKey: testDestinationAddress
      })
    })

    xit("return null when the type is signer", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildAccountSetTx({
        type: "signer"
      })
      expect(req).to.equal(null)
    })
  })

  describe("test buildRelationTx", function () {
    it("throw error if the options is not object", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildRelationTx(null)
      req.submit((err, result) => {
        expect(err).to.equal("invalid options type")
        done()
      })
    })

    it("throw error if the type is invalid", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildRelationTx({
        type: "aaaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid relation type")
        done()
      })
    })

    it("throw error if the account is invalid when the type is trust", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildRelationTx({
        type: "trust",
        account: "aaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid source address")
        done()
      })
    })

    it("throw error if the limit is invalid when the type is trust", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildRelationTx({
        type: "trust",
        account: testAddressGm,
        limit: null
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid amount")
        done()
      })
    })

    it("if the options is valid when the type is trust", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt",
        quality_in: 0.6,
        quality_out: 0.8
      })
      let req = remote.buildRelationTx({
        type: "trust",
        account: testAddressGm,
        limit: {
          value: "1",
          currency: "SWT",
          issuer: ""
        },
        quality_in: 0.6,
        quality_out: 0.8
      })
      expect(req.tx_json).to.deep.equal({
        Flags: 0,
        Fee: 10000,
        TransactionType: "TrustSet",
        Account: testAddressGm,
        LimitAmount: {
          value: "1",
          currency: "SWT",
          issuer: ""
        },
        QualityIn: 0.6,
        QualityOut: 0.8
      })
    })

    it("if the quality_in and quality_out is empty when the type is trust", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildRelationTx({
        type: "trust",
        account: testAddressGm,
        limit: {
          value: "1",
          currency: "SWT",
          issuer: ""
        }
      })
      expect(req.tx_json).to.deep.equal({
        Flags: 0,
        Fee: 10000,
        TransactionType: "TrustSet",
        Account: testAddressGm,
        LimitAmount: {
          value: "1",
          currency: "SWT",
          issuer: ""
        }
      })
    })

    it("throw error if the account is invalid when the type is authorize", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildRelationTx({
        type: "authorize",
        account: "aaaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid source address")
        done()
      })
    })

    it("throw error if the target is invalid when the type is authorize", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildRelationTx({
        type: "authorize",
        account: testAddressGm,
        target: "aaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid target address")
        done()
      })
    })

    it("throw error if the limit is invalid when the type is authorize", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildRelationTx({
        type: "authorize",
        account: testAddressGm,
        target: testDestinationAddress
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid amount")
        done()
      })
    })

    it("if the quality_in and quality_out is empty when the type is authorize", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildRelationTx({
        type: "authorize",
        account: testAddressGm,
        target: testDestinationAddress,
        limit: {
          value: "1",
          currency: "SWT",
          issuer: ""
        }
      })
      expect(req.tx_json).to.deep.equal({
        Flags: 0,
        Fee: 10000,
        TransactionType: "RelationSet",
        Account: testAddressGm,
        Target: testDestinationAddress,
        RelationType: 1,
        LimitAmount: {
          value: "1",
          currency: "SWT",
          issuer: ""
        }
      })
    })

    it("throw error if the account is invalid when the type is freeze", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildRelationTx({
        type: "freeze",
        account: "aaaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid source address")
        done()
      })
    })

    it("throw error if the target is invalid when the type is freeze", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildRelationTx({
        type: "freeze",
        account: testAddressGm,
        target: "aaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid target address")
        done()
      })
    })

    it("throw error if the limit is invalid when the type is freeze", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildRelationTx({
        type: "freeze",
        account: testAddressGm,
        target: testDestinationAddress
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid amount")
        done()
      })
    })

    it("if the quality_in and quality_out is empty when the type is freeze", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildRelationTx({
        type: "freeze",
        account: testAddressGm,
        target: testDestinationAddress,
        limit: {
          value: "1",
          currency: "SWT",
          issuer: ""
        }
      })
      expect(req.tx_json).to.deep.equal({
        Flags: 0,
        Fee: 10000,
        TransactionType: "RelationSet",
        Account: testAddressGm,
        Target: testDestinationAddress,
        RelationType: 3,
        LimitAmount: {
          value: "1",
          currency: "SWT",
          issuer: ""
        }
      })
    })

    it("throw error if the account is invalid when the type is unfreeze", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildRelationTx({
        type: "unfreeze",
        account: "aaaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid source address")
        done()
      })
    })

    it("throw error if the target is invalid when the type is unfreeze", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildRelationTx({
        type: "unfreeze",
        account: testAddressGm,
        target: "aaa"
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid target address")
        done()
      })
    })

    it("throw error if the limit is invalid when the type is unfreeze", function (done) {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildRelationTx({
        type: "unfreeze",
        account: testAddressGm,
        target: testDestinationAddress
      })
      req.submit((err, result) => {
        expect(err).to.equal("invalid amount")
        done()
      })
    })

    it("if the quality_in and quality_out is empty when the type is unfreeze", function () {
      this.timeout(0)
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.buildRelationTx({
        type: "unfreeze",
        account: testAddressGm,
        target: testDestinationAddress,
        limit: {
          value: "1",
          currency: "SWT",
          issuer: ""
        }
      })
      expect(req.tx_json).to.deep.equal({
        Flags: 0,
        Fee: 10000,
        TransactionType: "RelationDel",
        Account: testAddressGm,
        Target: testDestinationAddress,
        RelationType: 3,
        LimitAmount: {
          value: "1",
          currency: "SWT",
          issuer: ""
        }
      })
    })
  })

  describe("test subscribe", function () {
    it("if the streams is empty", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.subscribe()
      expect(req._command).to.equal("subscribe")
      expect(req.message).to.deep.equal({})
    })

    it("if the streams is not array", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.subscribe("transactions")
      expect(req._command).to.equal("subscribe")
      expect(req.message).to.deep.equal({
        streams: ["transactions"]
      })
    })

    it("if the streams is array", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.subscribe(["transactions", "ledger"])
      expect(req._command).to.equal("subscribe")
      expect(req.message).to.deep.equal({
        streams: ["transactions", "ledger"]
      })
    })
  })

  describe("test unsubscribe", function () {
    it("if the streams is empty", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.unsubscribe()
      expect(req._command).to.equal("unsubscribe")
      expect(req.message).to.deep.equal({})
    })

    it("if the streams is not array", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.unsubscribe("transactions")
      expect(req._command).to.equal("unsubscribe")
      expect(req.message).to.deep.equal({
        streams: ["transactions"]
      })
    })

    it("if the streams is array", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let req = remote.unsubscribe(["transactions", "ledger"])
      expect(req._command).to.equal("unsubscribe")
      expect(req.message).to.deep.equal({
        streams: ["transactions", "ledger"]
      })
    })
  })

  describe("test _handleMessage", function () {
    it("if the data is not object", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let s1 = sinon.spy(remote, "_handleLedgerClosed")
      let s2 = sinon.spy(remote, "_handleServerStatus")
      let s3 = sinon.spy(remote, "_handleResponse")
      let s4 = sinon.spy(remote, "_handleTransaction")
      let s5 = sinon.spy(remote, "_handlePathFind")
      remote._handleMessage("aaaa")
      expect(s1.called).to.equal(false)
      expect(s2.called).to.equal(false)
      expect(s3.called).to.equal(false)
      expect(s4.called).to.equal(false)
      expect(s5.called).to.equal(false)
    })

    it("if the type is ledgerClosed", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let s1 = sinon.spy(remote, "_handleLedgerClosed")
      let s2 = sinon.spy(remote, "_handleServerStatus")
      let s3 = sinon.spy(remote, "_handleResponse")
      let s4 = sinon.spy(remote, "_handleTransaction")
      let s5 = sinon.spy(remote, "_handlePathFind")
      remote._handleMessage({
        data: JSON.stringify({
          type: "ledgerClosed"
        })
      })
      expect(s1.calledOnce).to.equal(true)
      expect(s2.called).to.equal(false)
      expect(s3.called).to.equal(false)
      expect(s4.called).to.equal(false)
      expect(s5.called).to.equal(false)
    })

    it("if the type is serverStatus", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let s1 = sinon.spy(remote, "_handleLedgerClosed")
      let s2 = sinon.spy(remote, "_handleServerStatus")
      let s3 = sinon.spy(remote, "_handleResponse")
      let s4 = sinon.spy(remote, "_handleTransaction")
      let s5 = sinon.spy(remote, "_handlePathFind")
      remote._handleMessage({
        data: JSON.stringify({
          type: "serverStatus"
        })
      })
      expect(s1.called).to.equal(false)
      expect(s2.calledOnce).to.equal(true)
      expect(s3.called).to.equal(false)
      expect(s4.called).to.equal(false)
      expect(s5.called).to.equal(false)
    })

    it("if the type is response", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let s1 = sinon.spy(remote, "_handleLedgerClosed")
      let s2 = sinon.spy(remote, "_handleServerStatus")
      let s3 = sinon.spy(remote, "_handleResponse")
      let s4 = sinon.spy(remote, "_handleTransaction")
      let s5 = sinon.spy(remote, "_handlePathFind")
      remote._handleMessage({
        data: JSON.stringify({
          type: "response"
        })
      })
      expect(s1.called).to.equal(false)
      expect(s2.called).to.equal(false)
      expect(s3.calledOnce).to.equal(true)
      expect(s4.called).to.equal(false)
      expect(s5.called).to.equal(false)
    })

    it("if the type is transaction", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let s1 = sinon.spy(remote, "_handleLedgerClosed")
      let s2 = sinon.spy(remote, "_handleServerStatus")
      let s3 = sinon.spy(remote, "_handleResponse")
      let s4 = sinon.spy(remote, "_handleTransaction")
      let s5 = sinon.spy(remote, "_handlePathFind")
      remote._handleMessage({
        data: JSON.stringify({
          type: "transaction",
          transaction: {
            hash: "111"
          }
        })
      })
      expect(s1.called).to.equal(false)
      expect(s2.called).to.equal(false)
      expect(s3.called).to.equal(false)
      expect(s4.calledOnce).to.equal(true)
      expect(s5.called).to.equal(false)
    })

    it("if the type is path_find", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let s1 = sinon.spy(remote, "_handleLedgerClosed")
      let s2 = sinon.spy(remote, "_handleServerStatus")
      let s3 = sinon.spy(remote, "_handleResponse")
      let s4 = sinon.spy(remote, "_handleTransaction")
      let s5 = sinon.spy(remote, "_handlePathFind")
      remote._handleMessage({
        data: JSON.stringify({
          type: "path_find"
        })
      })
      expect(s1.called).to.equal(false)
      expect(s2.called).to.equal(false)
      expect(s3.called).to.equal(false)
      expect(s4.called).to.equal(false)
      expect(s5.calledOnce).to.equal(true)
    })
  })

  describe("test _handleTransaction", function () {
    it("if the ledger index of data is more than ledger index of _status", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let spy = sinon.spy(remote, "emit")
      let data = {
        ledger_index: 1,
        ledger_time: 0,
        reserve_base: 0,
        reserve_inc: "aaa",
        fee_base: 1,
        fee_ref: 2
      }
      remote._handleLedgerClosed(data)
      expect(remote._status).to.deep.equal(data)
      expect(spy.calledOnce).to.equal(true)
      expect(spy.args[0][0]).to.equal("ledger_closed")
      expect(spy.args[0][1]).to.deep.equal(data)
    })

    it("if the ledger index of data is not more than ledger index of _status", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let spy = sinon.spy(remote, "emit")
      let data = {
        ledger_index: 0,
        ledger_time: 0,
        reserve_base: 0,
        reserve_inc: "aaa",
        fee_base: 1,
        fee_ref: 2
      }
      remote._handleLedgerClosed(data)
      expect(remote._status).to.deep.equal({
        ledger_index: 0
      })
      expect(spy.calledOnce).to.equal(false)
    })
  })

  describe("test newListener", function () {
    it("if the type is removeListener", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote._server._connected = true
      let s1 = sinon.spy(remote, "subscribe")
      let s2 = sinon.spy(Request.prototype, "submit")
      let callback = function () {}
      remote.on("removeListener", callback)
      remote.emit("removeListener", callback)
      expect(s1.called).to.equal(false)
      expect(s2.called).to.equal(false)
      sinon.restore()
    })

    it("if the type is transactions", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote._server._connected = true
      let s1 = sinon.spy(remote, "subscribe")
      let s2 = sinon.spy(Request.prototype, "submit")
      let callback = function () {}
      remote.on("transactions", callback)
      remote.emit("transactions", callback)
      expect(s1.calledOnce).to.equal(true)
      expect(s1.args[0][0]).to.equal("transactions")
      expect(s2.calledOnce).to.equal(true)
      sinon.restore()
    })

    it("if the type is ledger_closed", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote._server._connected = true
      let s1 = sinon.spy(remote, "subscribe")
      let s2 = sinon.spy(Request.prototype, "submit")
      let callback = function () {}
      remote.on("ledger_closed", callback)
      remote.emit("ledger_closed", callback)
      expect(s1.calledOnce).to.equal(true)
      expect(s1.args[0][0]).to.equal("ledger")
      expect(s2.calledOnce).to.equal(true)
      sinon.restore()
    })

    it("if the type is others", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote._server._connected = true
      let s1 = sinon.spy(remote, "subscribe")
      let s2 = sinon.spy(Request.prototype, "submit")
      let callback = function () {}
      remote.on("test", callback)
      remote.emit("test", callback)
      expect(s1.called).to.equal(false)
      expect(s2.called).to.equal(false)
      sinon.restore()
    })
  })

  describe("test removeListener", function () {
    it("if it is not connected", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      let s1 = sinon.spy(remote, "unsubscribe")
      let s2 = sinon.spy(Request.prototype, "submit")
      let callback = function () {}
      remote.on("transactions", callback)
      remote.removeListener("transactions", callback)
      expect(s1.called).to.equal(false)
      expect(s2.called).to.equal(false)
      sinon.restore()
    })

    it("if the type is transactions", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote._server._connected = true
      let s1 = sinon.spy(remote, "unsubscribe")
      let s2 = sinon.spy(Request.prototype, "submit")
      let callback = function () {}
      remote.on("transactions", callback)
      remote.removeListener("transactions", callback)
      expect(s1.calledOnce).to.equal(true)
      expect(s1.args[0][0]).to.equal("transactions")
      expect(s2.calledTwice).to.equal(true)
      sinon.restore()
    })

    it("if the type is others", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote._server._connected = true
      let s1 = sinon.spy(remote, "unsubscribe")
      let s2 = sinon.spy(Request.prototype, "submit")
      let callback = function () {}
      remote.on("test", callback)
      remote.removeListener("test", callback)
      expect(s1.called).to.equal(false)
      expect(s2.called).to.equal(false)
      sinon.restore()
    })

    it("if the type is ledger_closed", function () {
      let remote = new Remote({
        server: JT_NODE_GM,
        local_sign: true,
        token: "swt"
      })
      remote._server._connected = true
      let s1 = sinon.spy(remote, "unsubscribe")
      let s2 = sinon.spy(Request.prototype, "submit")
      let callback = function () {}
      remote.on("ledger_closed", callback)
      remote.removeListener("ledger_closed", callback)
      expect(s1.calledOnce).to.equal(true)
      expect(s1.args[0][0]).to.equal("ledger")
      expect(s2.calledTwice).to.equal(true)
      sinon.restore()
    })
  })
})
