import axios from "axios"
import { Transaction } from "@swtc/transaction"
const Wallet = Transaction.Wallet
const utils = Transaction.utils
import { IRemoteOptions, IParams } from "./types"
import {
  // IMarker,
  // IAmount,
  // ISwtcTxOptions,
  IPaymentTxOptions,
  IOfferCreateTxOptions,
  IOfferCancelTxOptions,
  IContractInitTxOptions,
  IContractInvokeTxOptions,
  IContractDeployTxOptions,
  IContractCallTxOptions,
  ISignTxOptions,
  IAccountSetTxOptions,
  IRelationTxOptions,
  ISignerListTxOptions,
  ISignFirstTxOptions,
  ISignOtherTxOptions
  // IMultiSigningOptions
} from "./types"

class Remote {
  public static Wallet = Wallet
  public static Transaction: any = Transaction
  public static utils: any = utils
  public readonly AbiCoder: any = null
  public readonly Tum3: any = null
  private _server: string
  private _token: string
  private _issuer: string
  private _backend: string = "proxy"
  private _axios: any
  private _solidity: boolean = false
  constructor(options: IRemoteOptions = {}) {
    this._server =
      options.server || Wallet.config.apiserver || "https://api.jingtum.com"
    this._token = options.token || Wallet.token || "SWT"
    if (/api.jingtum.com/i.test(this._server)) {
      this._backend = "api"
    }
    this._solidity = options.solidity ? true : false
    if (this._solidity) {
      try {
        this.AbiCoder = require("tum3-eth-abi").AbiCoder
        this.Tum3 = require("swtc-tum3")
      } catch (error) {
        throw Error(
          "install tum3-eth-abi and swtc-tum3 to enable solidity support"
        )
      }
    }
    this._issuer =
      options.issuer ||
      Wallet.config.issuer ||
      "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
    this._axios = axios.create({
      baseURL: this._server.replace(/\/$/, "") + "/v2/"
    })
    this._axios.interceptors.response.use(
      response => {
        // Do something with response data for jingtum-api
        // if (response.data && response.data.success && response.data.success === false) {
        //   Promise.reject(`${response.data.message || response.data.result || "something wrong"}`)
        // }
        return response
      },
      error => {
        // Do something with response error
        if (error.response) {
          // has response, but return code >= 300
          return error.response
        } else if (error.request) {
          return Promise.reject("did not get response from api")
        }
        return Promise.reject(
          error.message ? error.message : "unknow error got"
        )
      }
    )
  }

  // show instance basic configuration
  public config(options: IRemoteOptions = {}) {
    if ("server" in options) {
      this._server = options.server
      this._axios = axios.create({ baseURL: this._server + "/v2/" })
    }
    if ("token" in options) {
      this._token = options.token
    }
    if ("issuer" in options) {
      this._issuer = options.issuer
    }
    if ("backend" in options) {
      this._backend = options.backend
    }
    return {
      server: this._server,
      token: this._token,
      solidity: this._solidity,
      issuer: this._issuer,
      backend: this._backend
    }
  }

  // wrap axios promise to resolve only interested response data instead
  public getRequest(url: string, config: object = {}) {
    return new Promise((resolve, reject) => {
      this._axios
        .get(url, config)
        .then(response => resolve(response.data))
        .catch(error => reject(error))
    })
  }

  // guard unsafe operation and wrap axios promise to resolve only interested response data instead
  public postRequest(
    url: string,
    data: object = {},
    config: object = {},
    safe = false
  ) {
    if (!safe) {
      return Promise.reject("unsafe operation disabled")
    }
    return new Promise((resolve, reject) => {
      this._axios
        .post(url, data, config)
        .then(response => resolve(response.data))
        .catch(error => reject(error))
    })
  }

  // guard unsafe operation and wrap axios promise to resolve only interested response data instead
  public deleteRequest(
    url: string,
    data: object = {},
    config: object = {},
    safe = false
  ) {
    if (!safe) {
      return Promise.reject("unsafe operation disabled")
    }
    return new Promise((resolve, reject) => {
      this._axios
        .delete(url, data, config)
        .then(response => resolve(response.data))
        .catch(error => reject(error))
    })
  }

  // submit locally signed transactions, this is the only permitted post and delete operation
  public postBlob(data: object = {}) {
    const url = `blob`
    return this.postRequest(url, data, {}, true)
  }

  public postMultisign(data: object = {}) {
    const url = `multisign`
    return this.postRequest(url, data, {}, true)
  }

  public getLedger(param: string | number = "") {
    let url
    if (this._backend === "api") {
      url = `ledger`
      if (!param) {
        url = `${url}/index`
      } else if (typeof param === "number") {
        url = `${url}/index/${param}`
      } else if (typeof param === "string") {
        if (/^[0-9]{1,20}$/.test(param)) {
          url = `${url}/index/${param}`
        } else {
          url = `${url}/hash/${param}`
        }
      } else {
        url = `${url}/index`
      }
    } else {
      url = `ledgers`
      if (!param) {
        url = `${url}/closed`
      } else if (typeof param === "number") {
        url = `${url}/index/${param}`
      } else if (typeof param === "string") {
        if (/^[0-9]{1,20}$/.test(param)) {
          url = `${url}/index/${param}`
        } else {
          url = `${url}/hash/${param}`
        }
      } else {
        url = `${url}/index`
      }
    }
    return this.getRequest(url)
  }

  public getServerInfo(params: IParams = {}) {
    const url = `server/info`
    return this.getRequest(url, { params })
  }

  public async getAccountSequence(address: string) {
    address = address.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
    let url
    try {
      if (this._backend === "api") {
        url = `accounts/${address}/balances`
        const response: any = await this.getRequest(url, {
          params: { currency: "SWT" }
        })
        return Promise.resolve({ sequence: response.sequence })
      } else {
        url = `accounts/${address}/info`
        const response: any = await this.getRequest(url)
        return Promise.resolve({ sequence: response.account_data.Sequence })
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
  public getAccountInfo(address: string) {
    address = address.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
    const url = `accounts/${address}/info`
    return this.getRequest(url)
  }

  public getAccountSignerList(address: string, params: IParams = {}) {
    address = address.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
    const url = `accounts/${address}/signerlist`
    return this.getRequest(url, { params })
  }

  public getAccountBrokerage(address: string, params: IParams = {}) {
    address = address.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
    const url = `brokers/${address}`
    return this.getRequest(url, { params })
  }

  public getAccountBalances(address: string, params: IParams = {}) {
    address = address.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
    const url = `accounts/${address}/balances`
    return this.getRequest(url, { params })
  }

  public getAccountPayment(address: string, hash: string) {
    address = address.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
    const url = `accounts/${address}/payments/${hash}`
    return this.getRequest(url)
  }
  public getAccountPayments(address: string, params: IParams = {}) {
    address = address.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
    const url = `accounts/${address}/payments`
    return this.getRequest(url, { params })
  }
  public postAccountPayments(address: string, data: object = {}) {
    if (this._backend === "proxy") {
      return Promise.reject("no endpoint for proxy")
    }
    address = address.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
    const url = `accounts/${address}/payments`
    return this.postRequest(url, data)
  }
  public deleteAccountPayments(address: string, data: object = {}) {
    if (this._backend === "proxy") {
      return Promise.reject("no endpoint for proxy")
    }
    address = address.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
    const url = `accounts/${address}/payments`
    return this.deleteRequest(url, data)
  }

  public getAccountOrder(address: string, hash: string) {
    address = address.trim()
    hash = hash.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
    const url = `accounts/${address}/orders/${hash}`
    return this.getRequest(url)
  }
  public getAccountOrders(address: string, params: IParams = {}) {
    address = address.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
    const url = `accounts/${address}/orders`
    return this.getRequest(url, { params })
  }
  public postAccountOrders(address: string, data: object = {}) {
    if (this._backend === "proxy") {
      return Promise.reject("no endpoint for proxy")
    }
    address = address.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
    const url = `accounts/${address}/orders`
    return this.postRequest(url, data)
  }
  public deleteAccountOrders(address: string, data: object = {}) {
    if (this._backend === "proxy") {
      return Promise.reject("no endpoint for proxy")
    }
    address = address.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
    const url = `accounts/${address}/orders`
    return this.deleteRequest(url, data)
  }

  public getOrderBooks(base: string, counter: string, params: IParams = {}) {
    base = base.trim()
    counter = counter.trim()
    const url = `order_book/${base}/${counter}`
    return this.getRequest(url, { params })
  }
  public getOrderBooksBids(
    base: string,
    counter: string,
    params: IParams = {}
  ) {
    base = base.trim()
    counter = counter.trim()
    let url
    if (this._backend === "proxy") {
      url = `order_book/${base}/${counter}`
    } else {
      url = `order_book/bids/${base}/${counter}`
    }
    return this.getRequest(url, { params })
  }
  public getOrderBooksAsks(
    base: string,
    counter: string,
    params: IParams = {}
  ) {
    base = base.trim()
    counter = counter.trim()
    let url
    if (this._backend === "proxy") {
      url = `order_book/${counter}/${base}`
    } else {
      url = `order_book/asks/${base}/${counter}`
    }
    return this.getRequest(url, { params })
  }

  public getAccountTransactions(address: string, params: IParams = {}) {
    address = address.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
    const url = `/accounts/${address}/transactions`
    return this.getRequest(url, { params })
  }
  public getAccountTransaction(address: string, hash: string) {
    address = address.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
    let url = `/accounts/${address}/transactions`
    url = `${url}/${hash}`
    return this.getRequest(url)
  }
  public getTransaction(hash: string) {
    let url = `transactions`
    url = `${url}/${hash}`
    return this.getRequest(url)
  }

  public postAccountContractDeploy(address: string, data: object = {}) {
    address = address.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
    const url = `accounts/${address}/contract/deploy`
    return this.postRequest(url, data)
  }
  public postAccountContractCall(address: string, data: object = {}) {
    address = address.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
    const url = `accounts/${address}/contract/call`
    return this.postRequest(url, data)
  }

  // here we extend beyond api calls to interact with swtc-transactions
  // we try to use the same as that has been in swtc-lib
  public buildPaymentTx(options: IPaymentTxOptions) {
    return Transaction.buildPaymentTx(options, this)
  }
  public buildOfferCreateTx(options: IOfferCreateTxOptions) {
    return Transaction.buildOfferCreateTx(options, this)
  }
  public buildOfferCancelTx(options: IOfferCancelTxOptions) {
    return Transaction.buildOfferCancelTx(options, this)
  }
  public buildRelationTx(options: IRelationTxOptions) {
    return Transaction.buildRelationTx(options, this)
  }
  public buildAccountSetTx(options: IAccountSetTxOptions) {
    return Transaction.buildAccountSetTx(options, this)
  }
  public buildSignTx(options: ISignTxOptions) {
    return Transaction.buildSignTx(options, this)
  }
  public buildContractDeployTx(options: IContractDeployTxOptions) {
    return Transaction.deployContractTx(options, this)
  }
  public deployContractTx(options: IContractDeployTxOptions) {
    return Transaction.deployContractTx(options, this)
  }
  public buildContractCallTx(options: IContractCallTxOptions) {
    return Transaction.callContractTx(options, this)
  }
  public callContractTx(options: IContractCallTxOptions) {
    return Transaction.callContractTx(options, this)
  }
  public initContract(options: IContractInitTxOptions) {
    return Transaction.initContractTx(options, this)
  }
  public invokeContract(options: IContractInvokeTxOptions) {
    return Transaction.invokeContractTx(options, this)
  }
  public initContractTx(options: IContractInitTxOptions) {
    return Transaction.initContractTx(options, this)
  }
  public invokeContractTx(options: IContractInvokeTxOptions) {
    return Transaction.invokeContractTx(options, this)
  }
  public buildContractInitTx(options: IContractInitTxOptions) {
    return Transaction.initContractTx(options, this)
  }
  public buildContractInvokeTx(options: IContractInvokeTxOptions) {
    return Transaction.invokeContractTx(options, this)
  }
  public buildBrokerageTx(options) {
    return Transaction.buildBrokerageTx(options, this)
  }
  public buildSignerListTx(options: ISignerListTxOptions) {
    return Transaction.buildSignerListTx(options, this)
  }
  public buildSignFirstTx(options: ISignFirstTxOptions) {
    // 首签账号添加SigningPubKey字段
    // no this as remote ?
    return Transaction.buildSignFirstTx(options)
  }
  public buildSignOtherTx(options: ISignOtherTxOptions) {
    // 其他账号签名只需把返回结果提交回去即可
    return Transaction.buildSignOtherTx(options, this)
  }
  public buildMultisignedTx(tx_json) {
    // 提交多重签名
    return Transaction.buildMultisignedTx(tx_json, this)
  }
  public buildTx(tx_json) {
    // 通过tx_json创建Transaction对象
    return Transaction.buildTx(tx_json, this)
  }

  // makeCurrency and makeAmount
  public makeCurrency(currency = this._token, issuer = this._issuer) {
    return Wallet.makeCurrency(currency, issuer)
  }
  public makeAmount(value = 1, currency = this._token, issuer = this._issuer) {
    return Wallet.makeAmount(value, currency, issuer)
  }
}

export { Remote }
