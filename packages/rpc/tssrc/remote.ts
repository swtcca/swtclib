import axios from "axios"
import { Transaction } from "@swtc/transaction"
const Wallet = Transaction.Wallet
const utils = Transaction.utils
import { IRemoteOptions } from "./types"
// import { IRemoteOptions, IParams } from "./types"
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
  ISignOtherTxOptions,
  // IMultiSigningOptions
  IRpcLedgerOptions,
  IRpcLedgerDataOptions,
  IRpcLedgerEntryOptions,
  IRpcTxHistoryOptions,
  IRpcTxOptions,
  IRpcTxEntryOptions,
  IRpcSubmitOptions,
  IRpcSubmitMultisignedOptions,
  IRpcFeeInfoOptions,
  IRpcBlacklistInfoOptions,
  IRpcAccountInfoOptions,
  IRpcAccountObjectsOptions,
  IRpcAccountCurrenciesOptions,
  IRpcAccountLinesOptions,
  IRpcAccountOffersOptions,
  IRpcAccountTxOptions,
  IRpcBookOffersOptions,
  IRpcSkywellPathFindOptions
} from "./types"

class Remote {
  public static Wallet = Wallet
  public static Transaction: any = Transaction
  public static utils: any = utils
  public readonly AbiCoder: any = null
  public readonly Tum3: any = null
  private _server: string
  private _timeout: number = 30 * 1000
  private _token: string
  private _issuer: string
  private _backend: string = "rpc"
  private _axios: any
  private _solidity: boolean = false
  constructor(options: IRemoteOptions = {}) {
    this._server =
      options.server || Wallet.config.rpcserver || "https://swtclib.ca:5050"
    this._token = options.token || Wallet.token || "SWT"
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
      baseURL: this._server.replace(/\/$/, ""),
      timeout: this._timeout
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
        // console.log("!!!!!!!!!!!!!!!!!!axios error happen!!!!!!!!!!!!!!!")
        // console.log(error.toJSON())
        // Do something with response error
        if (error.response) {
          // has response, but return code >= 300
          return Promise.reject(error.response)
        } else if (error.request) {
          console.log(error.toJSON())
          console.log(error.request)
          return Promise.reject("Error: did not get response from rpc")
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
      this._axios = axios.create({
        baseURL: this._server.replace(/\/$/, ""),
        timeout: this._timeout
      })
    }
    if ("token" in options) {
      this._token = options.token
    }
    if ("issuer" in options) {
      this._issuer = options.issuer
    }
    return {
      server: this._server,
      token: this._token,
      solidity: this._solidity,
      issuer: this._issuer,
      backend: this._backend
    }
  }

  // rpc uses only POST method and always the same url
  public postRequest(data: object = {}, config: object = {}) {
    return new Promise((resolve, reject) => {
      this._axios
        .post("", data, config)
        .then(response => resolve(response.data.result))
        .catch(error => reject(error))
    })
  }

  public async getAccountSequence(address: string) {
    address = address.trim()
    if (!Wallet.isValidAddress(address)) {
      return Promise.reject("invalid address provided")
    }
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

  public rpcVersion() {
    return this.postRequest({ method: "version", params: [] })
  }

  public rpcRandom() {
    return this.postRequest({ method: "random", params: [] })
  }

  public rpcServerInfo() {
    return this.postRequest({ method: "server_info", params: [] })
  }

  public rpcServerState() {
    return this.postRequest({ method: "server_state", params: [] })
  }

  public rpcLedgerClosed() {
    return this.postRequest({ method: "ledger_closed", params: [] })
  }

  public rpcLedgerCurrent() {
    return this.postRequest({ method: "ledger_current", params: [] })
  }

  public rpcLedger(params: IRpcLedgerOptions = {}) {
    return this.postRequest({ method: "ledger", params: [params] })
  }

  public rpcLedgerData(params: IRpcLedgerDataOptions = {}) {
    return this.postRequest({ method: "ledger_data", params: [params] })
  }

  public rpcLedgerEntry(params: IRpcLedgerEntryOptions = {}) {
    return this.postRequest({ method: "ledger_entry", params: [params] })
  }

  public rpcTxHistory(params: IRpcTxHistoryOptions = { start: 0 }) {
    return this.postRequest({ method: "tx_history", params: [params] })
  }

  public rpcTx(params: IRpcTxOptions) {
    return this.postRequest({ method: "tx", params: [params] })
  }

  public rpcTxEntry(params: IRpcTxEntryOptions) {
    return this.postRequest({ method: "transaction_entry", params: [params] })
  }

  public rpcSubmit(params: IRpcSubmitOptions) {
    return this.postRequest({ method: "submit", params: [params] })
  }

  public rpcSubmitMultisigned(params: IRpcSubmitMultisignedOptions) {
    return this.postRequest({ method: "submit_multisigned", params: [params] })
  }

  public rpcFeeInfo(params: IRpcFeeInfoOptions) {
    return this.postRequest({ method: "Fee_Info", params: [params] })
  }

  public rpcBlacklistInfo(params: IRpcBlacklistInfoOptions = {}) {
    return this.postRequest({ method: "blacklist_info", params: [params] })
  }

  public rpcAccountInfo(params: IRpcAccountInfoOptions) {
    return this.postRequest({ method: "account_info", params: [params] })
  }

  public rpcAccountObjects(params: IRpcAccountObjectsOptions) {
    return this.postRequest({ method: "account_objects", params: [params] })
  }

  public rpcAccountCurrencies(params: IRpcAccountCurrenciesOptions) {
    return this.postRequest({ method: "account_currencies", params: [params] })
  }

  public rpcAccountLines(params: IRpcAccountLinesOptions) {
    return this.postRequest({ method: "account_lines", params: [params] })
  }

  public rpcAccountOffers(params: IRpcAccountOffersOptions) {
    return this.postRequest({ method: "account_offers", params: [params] })
  }

  public rpcAccountTx(params: IRpcAccountTxOptions) {
    return this.postRequest({
      method: "account_tx",
      params: [{ ledger_index_min: -1, ...params }]
    })
  }

  public rpcBookOffers(params: IRpcBookOffersOptions) {
    return this.postRequest({ method: "book_offers", params: [params] })
  }

  public rpcSkywellPathFind(params: IRpcSkywellPathFindOptions) {
    return this.postRequest({ method: "skywell_path_find", params: [params] })
  }
}

export { Remote }
