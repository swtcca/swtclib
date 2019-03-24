"use strict"
var util = require("util")
var url = require("url")
var Event = require("events").EventEmitter
var WS = require("nativescript-websockets")
var extend = require("extend")

/**
 *
 * @param remote
 * @param opts
 * @constructor
 */
function Server(remote, opts) {
  Event.call(this)
  this.setMaxListeners(0)

  if (typeof opts === "string") {
    var parsed = url.parse(opts)
    var secure = parsed.protocol === "wss:"
    opts = {
      host: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : secure ? 443 : 80,
      secure: secure,
      path: parsed.path
    }
  }
  if (opts === null || typeof opts !== "object") {
    this.opts = new TypeError("server options not supplied")
    return this
  }
  if (!Server.domainRE.test(opts.host)) {
    this.opts_host = new TypeError("server host incorrect")
    return this
  }
  if (Number.isNaN(opts.port) || !Number.isFinite(opts.port)) {
    this.port = new TypeError("server port not a number")
    return this
  }
  if (opts.port < 1 || opts.port > 65535) {
    this.port = new TypeError("server port out of range")
    return this
  }
  if (typeof opts.secure !== "boolean") {
    opts.secure = false
  }
  this._opts = opts
  this._url =
    (this._opts.secure ? "wss://" : "ws://") +
    this._opts.host +
    ":" +
    this._opts.port +
    (this._opts.path ? this._opts.path : "")
  this._remote = remote

  this._ws = null
  this._connected = false
  this._opened = false
  this._state = "offline"
  this._id = 0
  this._timer = 0
}
util.inherits(Server, Event)

Server.domainRE = /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|[-_]){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|[-_]){0,61}[0-9A-Za-z])?)*\.?$/
Server.onlineStates = [
  "syncing",
  "tracking",
  "proposing",
  "validating",
  "full",
  "connected"
]

Server.prototype.connect = function(callback) {
  var self = this
  if (self._connected) return
  if (self._ws) self._ws.close()

  try {
    self._ws = new WS(self._url)
    self._ws.open()
  } catch (e) {
    return callback(e)
  }

  self._ws.on("open", function(socket) {
    self._opened = true
    var req = self._remote.subscribe(["ledger", "server", "transactions"])
    req.submit(callback)
  })
  self._ws.on("message", function(socket, data) {
    self._remote._handleMessage(data)
  })
  self._ws.on("close", function(socket, code, result) {
    self._handleClose()
  })
  self._ws.on("error", function(socket, err) {
    callback(err)
  })
}

/**
 * close manual, not close connection until new connection
 */
Server.prototype.disconnect = function() {
  this._ws.close()
  this._ws = null
  this._setState("offline")
}

Server.prototype.isConnected = function() {
  return this._connected
}

/**
 * handle close and error exception
 * and should re-connect server after 3 seconds
 * @private
 */
Server.prototype._handleClose = function() {
  var self = this
  if (self._state === "offline") return
  self._setState("offline")
  if (self._timer !== 0) return
  self._remote.emit("disconnect")
  self._timer = setInterval(function() {
    self.connect(function(err, ret) {
      if (!err) {
        clearInterval(self._timer)
        self._timer = 0
        self._remote.emit("reconnect")
      }
    })
  }, 3000)
}

Server.prototype._setState = function(state) {
  var self = this
  if (state === self._state) return

  self._state = state
  self._connected = state === "online"
  if (!self._connected) {
    self._opened = false
  }
}

/**
 * refuse to send msg if connection blows out
 * @param message
 */
Server.prototype.sendMessage = function(command, data) {
  var self = this
  if (!self._opened) return
  var req_id = self._id++

  var msg = extend(
    {
      id: req_id,
      command: command
    },
    data
  )
  self._ws.send(JSON.stringify(msg))
  return req_id
}

module.exports = Server
