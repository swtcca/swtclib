/**
 * Created by Administrator on 2016/11/21.
 */
import { EventEmitter } from "events"
import utils from "swtc-utils"

/**
 * account stub for subscribe accounts transaction event
 * can be used for many accounts
 * @param remote
 * @constructor
 */
class Account extends EventEmitter {
  protected _token
  private _accounts
  private _remote
  constructor(remote) {
    super()
    this.setMaxListeners(0)
    this._remote = remote
    this._accounts = {}
    this._token = remote._token || "swt"

    this.on("newListener", function(account, listener) {
      if (account === "removeListener") return
      if (!utils.isValidAddress(account, this._token)) {
        this.account = new Error("invalid account")
        return this
      }
      this._accounts[account] = listener
    })
    this.on("removeListener", function(account) {
      if (!utils.isValidAddress(account, this._token)) {
        this.account = new Error("invalid account")
        return this
      }
      delete this._accounts[account]
    })
    // subscribe all transactions, so just dispatch event by account
    this._remote.on("transactions", this.__infoAffectedAccounts.bind(this))
  }

  private __infoAffectedAccounts(data) {
    // dispatch
    const accounts = utils.affectedAccounts(data)
    for (const account of accounts) {
      const callback = this._accounts[accounts[account]]
      const _tx = utils.processTx(data, accounts[account], this._token)
      if (callback) {
        callback(_tx)
      }
    }
  }
}

export { Account }
