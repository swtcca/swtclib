import { EventEmitter } from "events"

// Define the global WebSocket class found on the native browser
declare class WebSocket {
  public onclose?: () => void
  public onopen?: () => void
  public onerror?: (error: any) => void
  public onmessage?: (message: any) => void
  public readyState: number
  constructor(url: string)
  public close()
  public send(message: string)
}

/**
 * Provides `EventEmitter` interface for native browser `WebSocket`,
 * same, as `ws` package provides.
 */
class WSWrapper extends EventEmitter {
  public static CONNECTING = 0
  public static OPEN = 1
  public static CLOSING = 2
  public static CLOSED = 3
  private _ws: WebSocket

  constructor(url, _protocols: any, _websocketOptions: any) {
    super()
    this.setMaxListeners(Infinity)

    this._ws = new WebSocket(url)

    this._ws.onclose = () => {
      this.emit("close")
    }

    this._ws.onopen = () => {
      this.emit("open")
    }

    this._ws.onerror = error => {
      this.emit("error", error)
    }

    this._ws.onmessage = message => {
      this.emit("message", message.data)
    }
  }

  public close() {
    if (this.readyState === 1) {
      this._ws.close()
    }
  }

  public send(message) {
    this._ws.send(message)
  }

  public get readyState() {
    return this._ws.readyState
  }
}

export = WSWrapper
