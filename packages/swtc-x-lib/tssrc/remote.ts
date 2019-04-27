import { Account } from "./account"
import { EventEmitter } from "events"
import { Request } from "./request"
import { Server } from "./server"
import { OrderBook, Transaction } from "swtc-transaction"

import LRU from "lru-cache"
import isNumber from "lodash/isNumber"
import sha1 from "sha1"
import utils from "swtc-utils"

// var LEDGER_OPTIONS = ["closed", "header", "current"]
function getRelationType(type) {
  switch (type) {
    case "trust":
      return 0
    case "authorize":
      return 1
    case "freeze":
      return 3
  }
}

/**
 * main handler for backend system
 * one remote object one server, not many
 * options onfiguration Parameters:
 * {
 *   local_sign: false, // default sign tx in jingtumd
 *   server: 'wss://s.jingtum.com:5020', // only support one server
 * }
 * @param options
 * @constructor
 */
class Remote extends EventEmitter {
  public _local_sign
  public type
  public _url
  public _server
  public _status
  public _requests
  public _token
  public _cache
  public _paths
  constructor(options) {
    super()
    const _opts = options || {}
    this._local_sign = !!_opts.local_sign
    if (typeof _opts.server !== "string") {
      this.type = new TypeError("server config not supplied")
      return this
    }
    this._url = _opts.server
    this._server = new Server(this, this._url)
    this._status = {
      ledger_index: 0
    }
    this._requests = {}
    this._token = options.token || "swt"
    this._cache = LRU({
      max: 100,
      maxAge: 1000 * 60 * 5
    }) // 100 size, 5 min
    this._paths = LRU({
      max: 100,
      maxAge: 1000 * 60 * 5
    }) // 2100 size, 5 min

    this.on("newListener", type => {
      if (!this._server.isConnected()) return
      if (type === "removeListener") return
      if (type === "transactions") {
        this.subscribe("transactions").submit()
      }
      if (type === "ledger_closed") {
        this.subscribe("ledger").submit()
      }
    })
    this.on("removeListener", type => {
      if (!this._server.isConnected()) return
      if (type === "transactions") {
        this.unsubscribe("transactions").submit()
      }
      if (type === "ledger_closed") {
        this.unsubscribe("ledger").submit()
      }
    })
  }

  /**
   * connect first on every case
   * callback(error, result)
   * @param callback
   * @returns {*}
   */
  public connect(callback) {
    if (!this._server) return callback("server not ready")
    this._server.connect(callback)
  }

  public connectPromise() {
    return new Promise((resolve, reject) => {
      if (!this._server) return reject(new Error("server not ready"))
      this._server
        .connectPromise()
        .then(result => resolve(result))
        .catch(error => reject(error))
    })
  }

  /**
   * disconnect manual, no reconnect
   */
  public disconnect() {
    if (!this._server) return
    this._server.disconnect()
  }

  /**
   * check is remote is connected to jingtumd
   */
  public isConnected() {
    return this._server.isConnected()
  }

  /**
   * handle message from backend, and dispatch
   * @param data
   */
  public _handleMessage(e) {
    let data
    let try_again = false
    try {
      data = JSON.parse(e.data)
      if (typeof data !== "object") return
      switch (data.type) {
        case "ledgerClosed":
          this._handleLedgerClosed(data)
          break
        case "serverStatus":
          this._handleServerStatus(data)
          break
        case "response":
          this._handleResponse(data)
          break
        case "transaction":
          this._handleTransaction(data)
          break
        case "path_find":
          this._handlePathFind(data)
          break
      }
    } catch (error) {
      try_again = true
    }
    if (try_again) {
      try {
        data = JSON.parse(e)
        if (typeof data !== "object") return

        switch (data.type) {
          case "ledgerClosed":
            this._handleLedgerClosed(data)
            break
          case "serverStatus":
            this._handleServerStatus(data)
            break
          case "response":
            this._handleResponse(data)
            break
          case "transaction":
            this._handleTransaction(data)
            break
          case "path_find":
            this._handlePathFind(data)
            break
        }
      } catch (error) {
        try_again = false
      }
    }
  }

  /**
   * update server ledger status
   * TODO
   * supply data to outside include ledger, reserve and fee
   * @param data
   * @private
   */
  public _handleLedgerClosed(data) {
    if (data.ledger_index > this._status.ledger_index) {
      this._status.ledger_index = data.ledger_index
      this._status.ledger_time = data.ledger_time
      this._status.reserve_base = data.reserve_base
      this._status.reserve_inc = data.reserve_inc
      this._status.fee_base = data.fee_base
      this._status.fee_ref = data.fee_ref
      this.emit("ledger_closed", data)
    }
  }

  /**
   * TODO
   * supply data to outside about server status
   * @param data
   * @private
   */
  public _handleServerStatus(data) {
    // TODO check data format
    this._updateServerStatus(data)
    this.emit("server_status", data)
  }

  /**
   * update remote state and server state
   * @param data
   * @private
   */
  public _updateServerStatus(data) {
    this._status.load_base = data.load_base
    this._status.load_factor = data.load_factor
    if (data.pubkey_node) {
      this._status.pubkey_node = data.pubkey_node
    }
    this._status.server_status = data.server_status
    const online = ~Server.onlineStates.indexOf(data.server_status)
    this._server._setState(online ? "online" : "offline")
  }

  /**
   * handle response by every websocket request
   * @param data
   * @private
   */
  public _handleResponse(data) {
    const req_id = data.id
    if (
      typeof req_id !== "number" ||
      req_id < 0 ||
      req_id > this._requests.length
    ) {
      return
    }
    const request = this._requests[req_id]
    // pass process it when null callback
    delete this._requests[req_id]
    delete data.id

    // check if data contain server info
    if (data.result && data.status === "success" && data.result.server_status) {
      this._updateServerStatus(data.result)
    }

    // return to callback
    if (data.status === "success") {
      const result = request.filter(data.result)
      if (request) {
        request.callback(null, result)
      }
    } else if (data.status === "error") {
      if (request) {
        request.callback(data.error_exception || data.error_message)
      }
    }
  }

  /**
   * handle transaction type response
   * TODO supply more friendly transaction data
   * @param data
   * @private
   */
  public _handleTransaction(data) {
    const tx = data.transaction.hash
    if (this._cache.get(tx)) return
    this._cache.set(tx, 1)
    this.emit("transactions", data)
  }

  /**
   * emit path find date to other
   * TODO supply more friendly data
   * @param data
   * @private
   */
  public _handlePathFind(data) {
    this.emit("path_find", data)
  }

  /**
   * request to server and backend
   * @param command
   * @param data
   * @param filter
   * @param callback
   * @private
   */
  public _submit(command, data, filter, callback: any) {
    const req_id = this._server.sendMessage(command, data)
    this._requests[req_id] = {
      command,
      data,
      filter,
      callback
    }
  }

  // ---------------------- info request --------------------
  /**
   * request server info
   * return version, ledger, state and node id
   * no option is required
   * @returns {Request}
   */
  public requestServerInfo() {
    return new Request(this, "server_info", data => {
      return {
        complete_ledgers: data.info.complete_ledgers,
        ledger: data.info.validated_ledger.hash,
        public_key: data.info.pubkey_node,
        state: data.info.server_state,
        peers: data.info.peers,
        version: "skywelld-" + data.info.build_version
      }
    })
  }

  /**
   * request peers info
   * return version, ledger, state and node id
   * no option is required
   * @returns {Request}
   */
  public requestPeers() {
    return new Request(this, "peers", data => {
      return data
    })
  }
  /**
   * request last closed ledger index and hash
   * @returns {Request}
   */
  public requestLedgerClosed() {
    return new Request(this, "ledger_closed", data => {
      return {
        // fee_base: data.fee_base,
        ledger_hash: data.ledger_hash,
        ledger_index: data.ledger_index
        // reserve_base: data.reserve_base,
        // reserve_inc: data.reserve_base,
        // txn_count: data.txn_count,
        // validated: data.validated_ledgers
      }
    })
  }

  /**
   * get one ledger info
   * options parameters : {
   *   ledger_index: Number,
   *   ledger_hash: hash, string
   * }
   * if no options, return last closed ledger
   * @param options
   * @returns {Request}
   */
  public requestLedger(options) {
    // if (typeof options !== 'object') {
    //     return new Error('invalid options type');
    // }
    const cmd = "ledger"
    let filter = true
    const request = new Request(this, cmd, data => {
      const ledger = data.ledger || data.closed.ledger
      if (!filter) {
        return ledger
      }
      return {
        accepted: ledger.accepted,
        ledger_hash: ledger.hash,
        ledger_index: ledger.ledger_index,
        parent_hash: ledger.parent_hash,
        close_time: ledger.close_time_human,
        total_coins: ledger.total_coins
      }
    })
    if (options === null || typeof options !== "object") {
      request.message.type = new Error("invalid options type")
      return request
    }
    if (Number(options.ledger_index)) {
      request.message.ledger_index = Number(options.ledger_index)
    }
    if (utils.isValidHash(options.ledger_hash)) {
      request.message.ledger_hash = options.ledger_hash
    }
    if ("full" in options && typeof options.full === "boolean") {
      request.message.full = options.full
      filter = false
    }
    if ("expand" in options && typeof options.expand === "boolean") {
      request.message.expand = options.expand
      filter = false
    }
    if (
      "transactions" in options &&
      typeof options.transactions === "boolean"
    ) {
      request.message.transactions = options.transactions
      filter = false
    }
    if ("accounts" in options && typeof options.accounts === "boolean") {
      request.message.accounts = options.accounts
      filter = false
    }

    return request
  }

  /**
   * for tx command
   * @param options
   * options: {
   *   hash: tx hash, string
   * }
   * @returns {Request}
   */
  public requestTx(options) {
    const request = new Request(this, "tx")
    if (options === null || typeof options !== "object") {
      request.message.type = new Error("invalid options type")
      return request
    }

    const hash = options.hash
    if (!utils.isValidHash(hash)) {
      request.message.hash = new Error("invalid tx hash")
      return request
    }

    request.message.transaction = hash
    return request
  }

  /**
   * request account info, internal function
   * @param type
   * @param options
   * @returns {Request}
   * @private
   */
  public __requestAccount(type, options, request) {
    // var request = new Request(this, type, filter);
    request._command = type
    const account = options.account
    const ledger = options.ledger
    const peer = options.peer
    let limit = options.limit
    const marker = options.marker
    // if (marker && (Number(ledger) <= 0 || !utils.isValidHash(ledger))) {
    //     throw new Error('marker needs a ledger_index or ledger_hash');
    // }
    request.message.relation_type = getRelationType(options.type)
    if (account) {
      if (!utils.isValidAddress(account)) {
        request.message.account = new Error("invalid account")
        return request
      } else {
        request.message.account = account
      }
    }
    request.selectLedger(ledger)

    if (utils.isValidAddress(peer)) {
      request.message.peer = peer
    }
    if (Number(limit)) {
      limit = Number(limit)
      if (limit < 0) limit = 0
      if (limit > 1e9) limit = 1e9
      request.message.limit = limit
    }
    if (marker) {
      request.message.marker = marker
    }
    return request
  }

  /**
   * account info
   * @param options, options:
   *    account(required): the query account
   *    ledger(option): specify ledger, ledger can be:
   *    ledger_index=xxx, ledger_hash=xxx, or ledger=closed|current|validated
   * @returns {Request}
   */
  public requestAccountInfo(options) {
    const request = new Request(this)

    if (options === null || typeof options !== "object") {
      request.message.type = new Error("invalid options type")
      return request
    }
    return this.__requestAccount("account_info", options, request)
  }

  /**
   * account tums
   * return account supports currency, including
   *     send currency and receive currency
   * @param
   *    account(required): the query account
   *    ledger(option): specify ledger, ledger can be:
   *    ledger_index=xxx, ledger_hash=xxx, or ledger=closed|current|validated
   *    no limit
   * @returns {Request}
   */
  public requestAccountTums(options) {
    const request = new Request(this)

    if (options === null || typeof options !== "object") {
      request.message.type = new Error("invalid options type")
      return request
    }
    return this.__requestAccount("account_currencies", options, request)
  }

  /**
   * account relations
   * @param options
   *    type: relation type
   *    account(required): the query account
   *    ledger(option): specify ledger, ledger can be:
   *    ledger_index=xxx, ledger_hash=xxx, or ledger=closed|current|validated
   *    limit min is 200,
   *    marker for more relations
   * @returns {Request}
   */
  public requestAccountRelations(options) {
    const request = new Request(this)

    if (options === null || typeof options !== "object") {
      request.message.type = new Error("invalid options type")
      return request
    }
    if (!~Transaction.RelationTypes.indexOf(options.type)) {
      request.message.relation_type = new Error("invalid realtion type")
      return request
    }
    switch (options.type) {
      case "trust":
        return this.__requestAccount("account_lines", options, request)
      case "authorize":
      case "freeze":
        return this.__requestAccount("account_relation", options, request)
    }
    request.message.msg = new Error("relation should not go here")
    return request
  }

  /**
   * account offers
   * options parameters
   * @param options
   *    account(required): the query account
   *    ledger(option): specify ledger, ledger can be:
   *    ledger_index=xxx, ledger_hash=xxx, or ledger=closed|current|validated
   *    limit min is 200, marker
   * @returns {Request}
   */
  public requestAccountOffers(options) {
    const request = new Request(this)

    if (options === null || typeof options !== "object") {
      request.message.type = new Error("invalid options type")
      return request
    }
    return this.__requestAccount("account_offers", options, request)
  }

  /**
   * account tx
   * options parameters
   *    account(required): the query account
   *    ledger(option): specify ledger, ledger can be:
   *    ledger_index=xxx, ledger_hash=xxx, or ledger=closed|current|validated
   *    limit limit output tx record
   *    ledger_min default 0, ledger_max default -1
   *    marker: {ledger:xxx, seq: x}
   *    descending, if returns recently tx records
   * @returns {Request}
   */
  public requestAccountTx(options) {
    const request = new Request(this, "account_tx", data => {
      const results = []
      for (const data_transaction of data.transactions) {
        results.push(utils.processTx(data_transaction, options.account))
      }
      data.transactions = results
      return data
    })

    if (options === null || typeof options !== "object") {
      request.message.type = new Error("invalid options type")
      return request
    }
    if (!utils.isValidAddress(options.account)) {
      request.message.account = new Error("account parameter is invalid")
      return request
    }
    request.message.account = options.account

    if (options.ledger_min && Number(options.ledger_min)) {
      request.message.ledger_index_min = Number(options.ledger_min)
    } else {
      request.message.ledger_index_min = 0
    }
    if (options.ledger_max && Number(options.ledger_max)) {
      request.message.ledger_index_max = Number(options.ledger_max)
    } else {
      request.message.ledger_index_max = -1
    }
    if (options.limit && Number(options.limit)) {
      request.message.limit = Number(options.limit)
    }
    if (options.offset && Number(options.offset)) {
      request.message.offset = Number(options.offset)
    }
    if (
      typeof options.marker === "object" &&
      !Number.isNaN(Number(options.marker.ledger)) &&
      !Number.isNaN(Number(options.marker.seq))
    ) {
      request.message.marker = options.marker
    }
    if (options.forward && typeof options.forward === "boolean") {
      // true 正向；false反向
      request.message.forward = options.forward
    }
    return request
  }

  /**
   * request order book,
   * options {gets: {currency: , issuer: }, pays: {currency: ', issuer: '}}
   * for order pair AAA/BBB
   *    to get bids, gets=AAA, pays=BBB
   *    to get asks, gets=BBB, pays=AAA
   * for bids orders are ordered by price desc
   * for asks orders are ordered by price asc
   * TODO format data
   * @param options
   * @returns {Request}
   */
  public requestOrderBook(options) {
    const request = new Request(this, "book_offers")
    if (options === null || typeof options !== "object") {
      request.message.type = new Error("invalid options type")
      return request
    }
    const taker_gets = options.taker_gets || options.pays
    if (!utils.isValidAmount0(taker_gets)) {
      request.message.taker_gets = new Error("invalid taker gets amount")
      return request
    }
    const taker_pays = options.taker_pays || options.gets
    if (!utils.isValidAmount0(taker_pays)) {
      request.message.taker_pays = new Error("invalid taker pays amount")
      return request
    }
    if (isNumber(options.limit)) {
      options.limit = parseInt(options.limit, 10)
    }

    request.message.taker_gets = taker_gets
    request.message.taker_pays = taker_pays
    request.message.taker = options.taker ? options.taker : utils.ACCOUNT_ONE
    request.message.limit = options.limit
    return request
  }

  /*
   * request brokerage,
   * @param options
   * @returns {Request}
   * */
  public requestBrokerage(options) {
    const request = new Request(this, "Fee_Info")
    if (options === null || typeof options !== "object") {
      request.message.type = new Error("invalid options type")
      return request
    }
    const issuer = options.issuer
    const app = options.app
    const currency = options.currency
    if (!utils.isValidAddress(issuer)) {
      request.message.account = new Error("issuer parameter is invalid")
      return request
    }
    if (!/^[0-9]*[1-9][0-9]*$/.test(app)) {
      // 正整数
      request.message.app = new Error("invalid app, it is a positive integer.")
      return request
    }
    if (!utils.isValidCurrency(currency)) {
      // 正整数
      request.message.currency = new Error("invalid currency.")
      return request
    }

    request.message.issuer = issuer
    request.message.AppType = app
    request.message.currency = currency
    request.message.ledger_index = "validated"
    return request
  }
  // ---------------------- path find request --------------------
  /**
   * @param options
   * {
   *   account: acccount|from|source, account to find path
   *   destination: destination|to|dst, destiantion account
   *   amount: the amount destination will received
   * }
   * @returns {Request}
   */
  public requestPathFind(options) {
    const request = new Request(this, "path_find", data => {
      const request2 = new Request(this, "path_find")
      request2.message.subcommand = "close"
      request2.submit()
      const _result = []
      for (const item of data.alternatives) {
        const key = sha1(JSON.stringify(item))
        this._paths.set(key, {
          path: JSON.stringify(item.paths_computed),
          choice: item.source_amount
        })
        _result.push({
          choice: utils.parseAmount(item.source_amount),
          key
        })
      }
      return _result
    })
    if (options === null || typeof options !== "object") {
      request.message.type = new Error("invalid options type")
      return request
    }

    const account = options.account
    const dest = options.destination
    const amount = options.amount

    if (!utils.isValidAddress(account)) {
      request.message.source_account = new Error("invalid source account")
      return request
    }
    if (!utils.isValidAddress(dest)) {
      request.message.destination_account = new Error(
        "invalid destination account"
      )
      return request
    }
    if (!utils.isValidAmount(amount)) {
      request.message.destination_amount = new Error("invalid amount")
      return request
    }

    request.message.subcommand = "create"
    request.message.source_account = account
    request.message.destination_account = dest
    request.message.destination_amount = utils.ToAmount(amount)
    return request
  }

  /**
   * payment
   * @param options
   *    source|from|account source account, required
   *    destination|to destination account, required
   *    amount payment amount, required
   * @returns {Transaction}
   */
  public buildPaymentTx(options) {
    return Transaction.buildPaymentTx(options, this)
  }

  /**
   * contract
   * @param options
   *    account, required
   *    amount, required
   *    payload, required
   * @returns {Transaction}
   */
  public deployContractTx(options) {
    return Transaction.deployContractTx(options, this)
  }

  /**
   * contract
   * @param options
   *    account, required
   *    des, required
   *    params, required
   * @returns {Transaction}
   */
  public callContractTx(options) {
    return Transaction.callContractTx(options, this)
  }

  public buildSignTx(options) {
    return Transaction.buildSignTx(options, this)
  }

  /**
   * Brokerage 设置挂单手续费
   * @param options
   *    account, required
   *    mol|molecule, required
   *    den|denominator, required
   *    app, required
   *    amount, required
   * @returns {Transaction}
   */
  public buildBrokerageTx(options) {
    return Transaction.buildBrokerageTx(options, this)
  }

  /**
   * add wallet relation set
   * @param options
   *    type: Transaction.RelationTypes
   *    source|from|account source account, required
   *    limit limt amount, required
   *    quality_out, optional
   *    quality_in, optional
   * @returns {Transaction}
   */
  public buildRelationTx(options) {
    return Transaction.buildRelationTx(options, this)
  }

  /**
   * account information set
   * @param options
   *    type: Transaction.AccountSetTypes
   * @returns {Transaction}
   */
  public buildAccountSetTx(options) {
    return Transaction.buildAccountSetTx(options, this)
  }

  /**
   * offer create
   * @param options
   *    type: 'Sell' or 'Buy'
   *    source|from|account maker account, required
   *    taker_gets|pays amount to take out, required
   *    taker_pays|gets amount to take in, required
   * @returns {Transaction}
   */
  public buildOfferCreateTx(options) {
    return Transaction.buildOfferCreateTx(options, this)
  }

  /**
   * offer cancel
   * @param options
   *    source|from|account source account, required
   *    sequence, required
   * @returns {Transaction}
   */
  public buildOfferCancelTx(options) {
    return Transaction.buildOfferCancelTx(options, this)
  }

  // ---------------------- subscribe --------------------
  /**
   * @param streams
   * @returns {Request}
   */
  public subscribe(streams) {
    const request = new Request(this, "subscribe")
    if (streams) {
      request.message.streams = Array.isArray(streams) ? streams : [streams]
    }
    return request
  }

  /**
   * @param streams
   * @returns {Request}
   */
  public unsubscribe(streams) {
    const request = new Request(this, "unsubscribe")
    if (streams) {
      request.message.streams = Array.isArray(streams) ? streams : [streams]
    }
    return request
  }

  /**
   * stub function for account event
   * @returns {Account}
   */
  public createAccountStub() {
    return new Account(this)
  }

  /** stub function for order book
   *
   * @returns {OrderBook}
   */
  public createOrderBookStub() {
    return new OrderBook(this)
  }
}

export { Remote }
