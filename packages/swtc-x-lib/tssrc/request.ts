"use strict"

import { EventEmitter } from "events"
import { Factory as WalletFactory } from "swtc-wallet"
import { Factory as UtilsFactory } from "swtc-utils"

const Factory = (Wallet = WalletFactory("jingtum")) => {
  if (!Wallet.hasOwnProperty("KeyPair")) {
    throw Error("Account need a Wallet class")
  }
  const utils = UtilsFactory(Wallet)

  /**
   * request server and account info without secret
   * @param remote
   * @param command
   * @constructor
   */
  return class Request extends EventEmitter {
    public message
    public _remote
    public _command
    public _filter
    constructor(remote, command = null, filter = v => v) {
      super()
      this._remote = remote
      this._command = command
      this._filter = filter
      // directly modify message is supported
      this.message = {}
    }

    public async submitPromise() {
      return new Promise((resolve, reject) => {
        for (const key in this.message) {
          if (this.message[key] instanceof Error) {
            reject(this.message[key].message)
          }
        }
        this._remote._submit(
          this._command,
          this.message,
          this._filter,
          (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve(result)
            }
          }
        )
      })
    }

    public submit(callback = m => m) {
      for (const key in this.message) {
        if (this.message[key] instanceof Error) {
          return callback(this.message[key].message)
        }
      }
      this._remote._submit(this._command, this.message, this._filter, callback)
    }

    public selectLedger(ledger) {
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
  }
}

export { Factory }
