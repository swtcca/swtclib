/**
 * Created by Administrator on 2016/11/22.
 */
var util = require("util")
var Event = require("events").EventEmitter
var utils = require("./utils")
const currency = require("./config").currency

function parseKey(key) {
  var parts = key.split(":")
  if (parts.length !== 2) return null

  function parsePart(part) {
    if (part === currency) return { currency: currency, issuer: "" }
    var _parts = part.split("/")
    if (_parts.length !== 2) return null
    if (!utils.isValidCurrency(_parts[0])) return null
    if (!utils.isValidAddress(_parts[1])) return null
    return { currency: _parts[0], issuer: _parts[1] }
  }

  var gets = parsePart(parts[0])
  var pays = parsePart(parts[1])
  if (!gets || !pays) return null
  return { gets: gets, pays: pays }
}

/**
 * order book stub for all order book
 * key: currency/issuer:currency/issuer
 *  if swt, currency/issuer=SWT
 *  TODO keep every order book up state, and return state when needed
 *  not need to query jingtumd again
 * @param remote
 * @constructor
 */
function OrderBook(remote) {
  Event.call(this)

  var self = this
  self._remote = remote
  self._books = {}
  self._token = remote._token || "swt"

  self.on("newListener", function(key, listener) {
    if (key === "removeListener") return
    var pair = parseKey(key)
    if (!pair) {
      self.pair = new Error("invalid key")
      return self
    }
    self._books[key] = listener
  })
  self.on("removeListener", function(key) {
    var pair = parseKey(key)
    if (!pair) {
      self.pair = new Error("invalid key")
      return self
    }
    delete self._books[key]
  })
  // same implement as account stub, subscribe all and dispatch
  self._remote.on("transactions", self.__updateBooks.bind(self))
}

OrderBook.prototype.__updateBooks = function(data) {
  var self = this
  // dispatch
  if (data.meta) {
    var books = utils.affectedBooks(data)
    var _data = {
      tx: data.transaction,
      meta: data.meta,
      engine_result: data.engine_result,
      engine_result_code: data.engine_result_code,
      engine_result_message: data.engine_result_message,
      ledger_hash: data.ledger_hash,
      ledger_index: data.ledger_index,
      validated: data.validated
    }
    var _tx = utils.processTx(_data, data.transaction.Account)
    for (var i in books) {
      var callback = self._books[books[i]]
      if (callback) callback(_tx)
    }
  }
}

util.inherits(OrderBook, Event)

module.exports = OrderBook
