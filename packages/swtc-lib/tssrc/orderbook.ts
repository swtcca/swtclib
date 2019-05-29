/**
 * Created by Administrator on 2016/11/22.
 */
import { EventEmitter } from "events"
import { utils } from "swtc-utils"

/**
 * order book stub for all order book
 * key: currency/issuer:currency/issuer
 *  if swt, currency/issuer=SWT
 *  TODO keep every order book up state, and return state when needed
 *  not need to query jingtumd again
 * @param remote
 * @constructor
 */
class OrderBook extends EventEmitter {
  public _books
  protected _token
  private _remote
  constructor(remote: any) {
    super()
    this._remote = remote
    this._books = {}
    this._token = remote._token || "swt"
    this.on("newListener", function(key, listener) {
      if (key === "removeListener") return
      const pair = utils.parseKey(key)
      if (!pair) {
        this.pair = new Error("invalid key")
        return this
      }
      this._books[key] = listener
    })
    this.on("removeListener", function(key) {
      const pair = utils.parseKey(key)
      if (!pair) {
        this.pair = new Error("invalid key")
        return this
      }
      delete this._books[key]
    })
    // same implement as account stub, subscribe all and dispatch
    this._remote.on("transactions", this.__updateBooks.bind(this))
  }

  private __updateBooks(data) {
    // dispatch
    if (data.meta) {
      const books = utils.affectedBooks(data)
      const _data = {
        tx: data.transaction,
        meta: data.meta,
        engine_result: data.engine_result,
        engine_result_code: data.engine_result_code,
        engine_result_message: data.engine_result_message,
        ledger_hash: data.ledger_hash,
        ledger_index: data.ledger_index,
        validated: data.validated
      }
      const _tx = utils.processTx(_data, data.transaction.Account)
      for (const book of books) {
        const callback = this._books[books[book]]
        if (callback) callback(_tx)
      }
    }
  }
}

export { OrderBook }
