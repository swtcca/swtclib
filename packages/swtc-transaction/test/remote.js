const util = require("util")
const Event = require("events").EventEmitter
const LRU = require("lru-cache")
const Request = require("./request")

function Remote(options) {
  Event.call(this)
  var self = this
  var _opts = options || {}
  self._local_sign = !!_opts.local_sign
  if (typeof _opts.server !== "string") {
    self.type = new TypeError("server config not supplied")
    return self
  }
  self._url = _opts.server
  //self._server = new Server(self, self._url)
  self._server = { url: self._url }
  self._status = {
    ledger_index: 0
  }
  self._requests = {}
  self._token = _opts.token || "swt"
  self._cache = LRU({
    max: 100,
    maxAge: 1000 * 60 * 5
  }) // 100 size, 5 min
  self._paths = LRU({
    max: 100,
    maxAge: 1000 * 60 * 5
  }) // 2100 size, 5 min
}
util.inherits(Remote, Event)

Remote.prototype._submit = function(command, data, filter, callback) {
  if (!callback || typeof callback !== "function") {
    callback = function() {}
  }
  var req_id = Math.floor(Math.random() * 100000)
  this._requests[req_id] = {
    command: command,
    data: data,
    filter: filter,
    callback: callback
  }
}

Remote.prototype.requestAccountInfo = function(options) {
  var request = new Request(this)

  if (options === null || typeof options !== "object") {
    request.message.type = new Error("invalid options type")
    return request
  }
  return request
}

exports.Remote = Remote
