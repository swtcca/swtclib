const chai = require("chai")
const expect = chai.expect
const OrderBook = require("../src/orderbook")
const Remote = require("../src/remote")
const config = require("./config")
const txData = require("./tx_data")
const sinon = require("sinon")
const utils = require("../src/utils")
let { JT_NODE } = config
let pair = "SWT:JJCC/jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"

describe("test orderbook", function() {
  describe("test constructor", function() {
    it("if the given token is empty", function() {
      let remote = new Remote({
        server: JT_NODE,
        local_sign: true
      })
      remote._token = null
      let orderBook = new OrderBook(remote)
      expect(orderBook._token).to.equal("swt")
    })
  })

  describe("test transaction event", function() {
    it("emit transactions with meta data", function() {
      let remote = new Remote({
        server: JT_NODE,
        local_sign: true
      })
      let orderBook = new OrderBook(remote)
      let spy = sinon.spy(utils, "affectedBooks")
      orderBook._remote.emit("transactions", txData.input26)
      expect(spy.calledOnce).to.equal(true)
      sinon.restore()
    })
    it("emit transactions without meta data", function() {
      let remote = new Remote({
        server: JT_NODE,
        local_sign: true
      })
      let orderBook = new OrderBook(remote)
      let spy = sinon.spy(utils, "affectedBooks")
      orderBook._remote.emit("transactions", txData.input24)
      expect(spy.calledOnce).to.equal(false)
      sinon.restore()
    })
  })

  describe("test newListener", function() {
    it("if the new event name is not removeListener and the account is valid", function() {
      let remote = new Remote({
        server: JT_NODE,
        local_sign: true
      })
      let orderBook = new OrderBook(remote)
      let callback = function() {}
      orderBook.on(pair, callback)
      orderBook.emit(pair, "test")
      expect(orderBook._books[pair]).to.deep.equal(callback)
    })

    it("if the new event name is not removeListener and the account is invalid", function() {
      let remote = new Remote({
        server: JT_NODE,
        local_sign: true
      })
      let orderBook = new OrderBook(remote)
      let callback = function() {}
      orderBook.on(pair.substring(1), callback)
      orderBook.emit(pair.substring(1), "test")
      expect(orderBook.pair).to.be.an("error")
      expect(orderBook._books).to.deep.equal({})
    })
  })

  describe("test removeListener", function() {
    it("if the account is valid", function() {
      let remote = new Remote({
        server: JT_NODE,
        local_sign: true
      })
      let orderBook = new OrderBook(remote)
      let callback = function() {}
      orderBook.on(pair, callback)
      orderBook.emit(pair, "test")
      expect(orderBook._books[pair]).to.deep.equal(callback)
      orderBook.removeListener(pair, callback)
      expect(orderBook._books).to.deep.equal({})
    })

    it("if the account is invalid", function() {
      let remote = new Remote({
        server: JT_NODE,
        local_sign: true
      })
      let orderBook = new OrderBook(remote)
      let callback = function() {}
      orderBook.on(pair.substring(1), callback)
      orderBook.emit(pair.substring(1), "test")
      expect(orderBook._books).to.deep.equal({})
      orderBook.removeListener(pair.substring(1), callback)
      expect(orderBook.pair).to.be.an("error")
      expect(orderBook._books).to.deep.equal({})
    })
  })
})
