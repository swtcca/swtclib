/**
 * Created by Administrator on 2016/11/21.
 */
var util = require("util")
var Event = require("events").EventEmitter
var utils = require("./utils")

/**
 * account stub for subscribe accounts transaction event
 * can be used for many accounts
 * @param remote
 * @constructor
 */
function Account(remote) {
  Event.call(this)

  var self = this
  self.setMaxListeners(0)
  self._remote = remote
  self._accounts = {}
  self._token = remote._token || "swt"

  self.on("newListener", function(account, listener) {
    if (account === "removeListener") return
    if (!utils.isValidAddress(account, self._token)) {
      self.account = new Error("invalid account")
      return self
    }
    self._accounts[account] = listener
  })
  self.on("removeListener", function(account) {
    if (!utils.isValidAddress(account, self._token)) {
      self.account = new Error("invalid account")
      return self
    }
    delete self._accounts[account]
  })
  // subscribe all transactions, so just dispatch event by account
  self._remote.on("transactions", self.__infoAffectedAccounts.bind(self))
}
util.inherits(Account, Event)

Account.prototype.__infoAffectedAccounts = function(data) {
  var self = this
  // dispatch
  var accounts = utils.affectedAccounts(data)

  for (var i in accounts) {
    var callback = self._accounts[accounts[i]]
    var _tx = utils.processTx(data, accounts[i], self._token)
    if (callback) callback(_tx)
  }
}

module.exports = Account
