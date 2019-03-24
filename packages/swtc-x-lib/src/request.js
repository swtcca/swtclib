"use strict"

var Event = require("events").EventEmitter
var util = require("util")
var utils = require("./utils")

/**
 * request server and account info without secret
 * @param remote
 * @param command
 * @constructor
 */
function Request(remote, command, filter) {
  Event.call(this)
  this._remote = remote
  this._command = command
  this._filter =
    filter ||
    function(v) {
      return v
    }
  // directly modify message is supported
  this.message = {}
}
util.inherits(Request, Event)

Request.prototype.submit = function(callback) {
  var self = this
  for (var key in self.message) {
    if (self.message[key] instanceof Error) {
      return callback(self.message[key].message)
    }
  }
  self._remote._submit(self._command, self.message, self._filter, callback)
}

Request.prototype.selectLedger = function(ledger) {
  if (typeof ledger === "string" && ~utils.LEDGER_STATES.indexOf(ledger)) {
    this.message.ledger_index = ledger
  } else if (Number(ledger)) {
    this.message.ledger_index = Number(ledger)
  } else if (/^[A-F0-9]+$/.test(ledger)) {
    this.message.ledger_hash = ledger
  } else {
    this.message.ledger_index = "validated"
  }
  return this
}

module.exports = Request
