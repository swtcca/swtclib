import { EventEmitter } from "events"
import extend from "extend"
import url from "url"
import WS from "ws"

/**
 *
 * @param remote
 * @param opts
 * @constructor
 */
class Server extends EventEmitter {
  public static domainRE = /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|[-_]){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|[-_]){0,61}[0-9A-Za-z])?)*\.?$/
  public static onlineStates = [
    "syncing",
    "tracking",
    "proposing",
    "validating",
    "full",
    "connected"
  ]

  public opts: any
  public opts_host: any
  public port: any
  public _opts
  public _url
  public _remote
  public _ws
  public _connected
  public _opened
  public _state
  public _id
  public _timer
  constructor(remote, opts) {
    super()
    this.setMaxListeners(0)

    if (typeof opts === "string") {
      const parsed = url.parse(opts)
      const secure = parsed.protocol === "wss:"
      opts = {
        host: parsed.hostname,
        port: parsed.port ? Number(parsed.port) : secure ? 443 : 80,
        secure,
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

  public connect(callback) {
    if (this._connected) return
    if (this._ws) this._ws.close()

    try {
      this._ws = new WS(this._url)
    } catch (e) {
      return callback(e)
    }

    this._ws.on("open", () => {
      this._opened = true
      const req = this._remote.subscribe(["ledger", "server", "transactions"])
      req.submit(callback)
    })
    this._ws.on("message", data => {
      this._remote._handleMessage(data)
    })
    this._ws.on("close", () => {
      this._handleClose()
    })
    this._ws.on("error", err => callback(err))
  }

  public async connectPromise() {
    return new Promise((resolve, reject) => {
      if (this._connected) {
        resolve(`this._server is connected already`)
      }
      if (this._ws) this._ws.close()

      try {
        this._ws = new WS(this._url)
      } catch (e) {
        reject(e)
      }

      this._ws.on("open", () => {
        this._opened = true
        const req = this._remote.subscribe(["ledger", "server", "transactions"])
        req
          .submitPromise()
          .then(result => resolve(result))
          .catch(error => reject(error))
      })
      this._ws.on("message", data => {
        this._remote._handleMessage(data)
      })
      this._ws.on("close", () => {
        this._handleClose()
      })
      this._ws.on("error", err => reject(err))
    })
  }
  /**
   * close manual, not close connection until new connection
   */
  public disconnect() {
    this._ws.close()
    this._ws = null
    this._setState("offline")
  }

  public isConnected() {
    return this._connected
  }

  /**
   * handle close and error exception
   * and should re-connect server after 3 seconds
   */
  public _handleClose() {
    if (this._state === "offline") return
    this._setState("offline")
    if (this._timer !== 0) return
    this._remote.emit("disconnect")
    this._timer = setInterval(() => {
      this.connect((err, ret) => {
        if (err) {
          ret === 0
        } else {
          clearInterval(this._timer)
          this._timer = 0
          this._remote.emit("reconnect")
        }
      })
    }, 3000)
  }

  /**
   * refuse to send msg if connection blows out
   * @param message
   */
  public sendMessage(command, data) {
    if (!this._opened) return
    const req_id = this._id++

    const msg = extend(
      {
        id: req_id,
        command
      },
      data
    )
    this._ws.send(JSON.stringify(msg))
    return req_id
  }

  public _setState(state) {
    if (state === this._state) return

    this._state = state
    this._connected = state === "online"
    if (!this._connected) {
      this._opened = false
    }
  }
}

export { Server }
