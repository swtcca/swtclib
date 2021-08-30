import axios from "axios"
import { Factory as WalletFactory } from "@swtc/wallet"
import { Factory as TransactionFactory } from "@swtc/transaction"
import { IRemoteOptions } from "./types"
import { RpcError } from "./errors"
// import { IRemoteOptions, IParams } from "./types"
import {
  // IMarker,
  // IAmount,
  // ISwtcTxOptions,
  IChainConfig,
  ICurrency,
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
  IRpcAccountRelationOptions,
  IRpcAccountOffersOptions,
  IRpcAccountTxOptions,
  IRpcBookOffersOptions,
  IRpcSkywellPathFindOptions,
  IBrokerageTxOptions
} from "./types"

const intercept_response = response => {
  if (
    response &&
    response.data &&
    response.data.result &&
    response.data.result.status !== "success"
  ) {
    throw new RpcError(response.data.result)
  }
  return response
}

const Factory: any = (
  chain_or_wallet: () => {} | string | IChainConfig = WalletFactory("jingtum")
) => {
  let Wallet
  if (typeof chain_or_wallet === "function") {
    Wallet = chain_or_wallet
  } else {
    Wallet = WalletFactory(chain_or_wallet)
  }
  if (!Wallet.hasOwnProperty("KeyPair")) {
    throw Error("transaction needs a Wallet class")
  }
  const Transaction = TransactionFactory(Wallet)
  const utils = Transaction.utils
  const FREEZE = { reserved: 20.0, each_freezed: 5.0 }
  const intercept_request = config => {
    if (config.method !== "post") {
      throw new RpcError({
        error: "validationError",
        error_code: -8888,
        error_message: "only post requests allowed for rpc."
      })
    }
    if (config.data && typeof config.data === "object") {
      if (!config.data.hasOwnProperty("method")) {
        throw new RpcError({
          error: "validationError",
          error_code: -8888,
          error_message: "method required for rpc."
        })
      }
      if (config.data.hasOwnProperty("params")) {
        const params = config.data.params[0]
        if (
          params &&
          typeof params === "object" &&
          params.hasOwnProperty("account")
        ) {
          params.account = params.account.trim()
          if (!Wallet.isValidAddress(params.account.trim())) {
            throw new RpcError({
              error: "validationError",
              error_code: -8888,
              error_message: "invalid account specified"
            })
          }
        }
      }
    }
    return config
  }

  return class Remote {
    public static Wallet = Wallet
    public static Transaction: any = Transaction
    public static utils: any = utils
    public readonly _token: string = Wallet.config.currency
    public AbiCoder: any = null
    public Tum3: any = null
    private _server: string
    private _timeout: number = 50 * 1000
    private _issuer: string = Wallet.config.issuer
    private _backend: string = "rpc"
    private _axios: any
    private _solidity: boolean = false
    constructor(options: IRemoteOptions = {}) {
      this._server =
        options.server ||
        Wallet.config.XLIB.default_rpc ||
        "http://bcapps.ca:5050"
      // this._token = options.token || Wallet.token || "SWT"
      this._solidity = options.solidity ? true : false
      if (this._solidity) {
        try {
          this.AbiCoder = null
          this.Tum3 = null
          // this.AbiCoder = require("tum3-eth-abi").AbiCoder
          // this.Tum3 = require("swtc-tum3")
        } catch (error) {
          throw Error(
            "install tum3-eth-abi and swtc-tum3 to enable solidity support"
          )
        }
      }
      this._issuer = options.issuer || Wallet.config.issuer
      this._axios = axios.create({
        baseURL: this._server.replace(/\/$/, ""),
        timeout: this._timeout
      })
      this._axios.interceptors.request.use(intercept_request, error => {
        throw new RpcError(error)
      })
      this._axios.interceptors.response.use(intercept_response, error => {
        if (error.response) {
          throw new RpcError(error.response.data.result)
        }
        throw new RpcError(error)
      })
      options.hasOwnProperty("CURRENCIES") &&
        Object.assign(Wallet.config.CURRENCIES, options.CURRENCIES)
      options.hasOwnProperty("XLIB") &&
        Object.assign(Wallet.config.XLIB, options.XLIB)
    }

    // show instance basic configuration
    public config(options: IRemoteOptions = {}) {
      if ("server" in options) {
        this._server = options.server
        this._axios = axios.create({
          baseURL: this._server.replace(/\/$/, ""),
          timeout: this._timeout
        })
        this._axios.interceptors.request.use(intercept_request, error => {
          throw new RpcError(error)
        })
        this._axios.interceptors.response.use(intercept_response, error => {
          if (error.response) {
            throw new RpcError(error.response.data.result)
          }
          throw new RpcError(error)
        })
      }
      if ("issuer" in options && Wallet.isValidAddress(options.issuer)) {
        this._issuer = options.issuer
        Wallet.config.issuer = options.issuer
      }
      this._solidity = options.hasOwnProperty("solidity")
        ? options.solidity
        : this._solidity
      if (this._solidity) {
        try {
          this.AbiCoder = null
          this.Tum3 = null
        } catch (error) {
          throw Error(
            "install tum3-eth-abi and swtc-tum3 to enable solidity support"
          )
        }
      }
      options.hasOwnProperty("CURRENCIES") &&
        Object.assign(Wallet.config.CURRENCIES, options.CURRENCIES)
      options.hasOwnProperty("XLIB") &&
        Object.assign(Wallet.config.XLIB, options.XLIB)
      return {
        token: this._token,
        issuer: this._issuer,
        server: this._server,
        solidity: this._solidity,
        backend: this._backend,
        currencies: Wallet.config.CURRENCIES
      }
    }

    // rpc uses only POST method and always the same url
    public postRequest(data: object = {}, config: object = {}) {
      return this._axios
        .post("", data, config)
        .then(response => Promise.resolve(response.data.result))
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
    public buildBrokerageTx(options: IBrokerageTxOptions) {
      return Transaction.buildBrokerageTx(options, this)
    }
    public buildSignerListTx(options: ISignerListTxOptions) {
      return Transaction.buildSignerListTx(options, this)
    }
    public buildTx(tx_json: object) {
      // 通过tx_json创建Transaction对象
      return Transaction.buildTx(tx_json, this)
    }

    // makeCurrency and makeAmount
    public makeCurrency(currency = this._token, issuer = this._issuer) {
      return Wallet.makeCurrency(currency, issuer)
    }
    public makeAmount(
      value = 1,
      currency = this._token,
      issuer = this._issuer
    ) {
      return Wallet.makeAmount(value, currency, issuer)
    }

    public getAccountInfo(
      address: string,
      params: IRpcAccountInfoOptions = { account: "" }
    ): Promise<any> {
      return this.rpcAccountInfo({ ...params, account: address })
    }

    public getAccountOffers(
      address: string,
      params: IRpcAccountOffersOptions = { account: "" }
    ): Promise<any> {
      return this.rpcAccountOffers({ ...params, account: address })
    }

    public async getAccountSequence(
      address: string,
      params: IRpcAccountInfoOptions = { account: "" }
    ) {
      const data = await this.getAccountInfo(address, params)
      return data.account_data.Sequence
    }

    public getAccountTrusts(
      address: string,
      params: IRpcAccountLinesOptions = { account: "" }
    ) {
      return this.rpcAccountLines({ ...params, account: address })
    }

    public getAccountRelation(
      address: string,
      params: IRpcAccountRelationOptions = { account: "" }
    ) {
      return this.rpcAccountRelation({ ...params, account: address })
    }

    public getAccountObjects(
      address: string,
      params: IRpcAccountObjectsOptions = { account: "" }
    ) {
      return this.rpcAccountObjects({ ...params, account: address })
    }

    public getAccountSignerList(
      address: string,
      params: IRpcAccountObjectsOptions = { account: "" }
    ) {
      return this.getAccountObjects(address, { ...params, type: "SignerList" })
    }

    public getAccountTx(
      address: string,
      params: IRpcAccountTxOptions = { account: "" }
    ) {
      return this.rpcAccountTx({ ...params, account: address })
    }

    public getAccountCurrencies(
      address: string,
      params: IRpcAccountCurrenciesOptions = { account: "" }
    ) {
      return this.rpcAccountCurrencies({ ...params, account: address })
    }

    public getBrokerage(
      address: string,
      params: IRpcFeeInfoOptions = { account: "" }
    ) {
      return this.rpcFeeInfo({ ...params, account: address })
    }

    public getBookOffers(
      taker_gets: ICurrency,
      taker_pays: ICurrency,
      params: IRpcBookOffersOptions = { taker_gets: {}, taker_pays: {} }
    ) {
      return this.rpcBookOffers({ ...params, taker_gets, taker_pays })
    }

    public getSkywellPathFind(params: IRpcSkywellPathFindOptions) {
      return this.rpcSkywellPathFind(params)
    }

    public submit(
      tx_blob: string,
      params: IRpcSubmitOptions = { tx_blob: "" }
    ) {
      return this.rpcSubmit({ ...params, tx_blob })
    }

    public submitMultisigned(
      tx_json: object,
      params: IRpcSubmitMultisignedOptions = { tx_json: {} }
    ) {
      return this.rpcSubmitMultisigned({ ...params, tx_json })
    }

    public getVersion() {
      return this.rpcVersion()
    }

    public getRandom() {
      return this.rpcRandom()
    }

    public getServerInfo() {
      return this.rpcServerInfo()
    }

    public getServerState() {
      return this.rpcServerState()
    }

    public getLedgerClosed() {
      return this.rpcLedgerClosed()
    }

    public getLedgerCurrent() {
      return this.rpcLedgerCurrent()
    }

    public getBlacklistInfo(params: IRpcBlacklistInfoOptions = {}) {
      return this.rpcBlacklistInfo(params)
    }

    public getLedger(params: IRpcLedgerOptions = {}) {
      return this.rpcLedger(params)
    }

    public getLedgerEntry(params: IRpcLedgerEntryOptions = {}) {
      return this.rpcLedgerEntry(params)
    }

    public getLedgerData(params: IRpcLedgerDataOptions = {}) {
      return this.rpcLedgerData(params)
    }

    public getTxHistory(
      start: number = 0,
      params: IRpcTxHistoryOptions = { start: 0 }
    ) {
      return this.rpcTxHistory({ ...params, start })
    }

    public getTx(
      transaction: string,
      params: IRpcTxOptions = { transaction: "" }
    ) {
      return this.rpcTx({ ...params, transaction })
    }

    public getTxEntry(
      tx_hash: string,
      params: IRpcTxEntryOptions = { tx_hash: "" }
    ) {
      return this.rpcTxEntry({ ...params, tx_hash })
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
      return this.postRequest({
        method: "submit_multisigned",
        params: [params]
      })
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
      return this.postRequest({
        method: "account_currencies",
        params: [params]
      })
    }

    public rpcAccountLines(params: IRpcAccountLinesOptions) {
      return this.postRequest({ method: "account_lines", params: [params] })
    }

    public rpcAccountRelation(params: IRpcAccountRelationOptions) {
      return this.postRequest({ method: "account_relation", params: [params] })
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
    public async getAccountBalances(
      address: string,
      params: object = { account: "" }
    ) {
      if (!Wallet.isValidAddress(address.trim())) {
        throw new Error("invalid address")
      }
      const p_info = this.getAccountInfo(
        address,
        params as IRpcAccountInfoOptions
      )
      const p_trust = this.getAccountTrusts(
        address,
        params as IRpcAccountLinesOptions
      )
      const p_freeze = this.getAccountRelation(
        address,
        params as IRpcAccountRelationOptions
      )
      const p_offer = this.getAccountOffers(
        address,
        params as IRpcAccountOffersOptions
      )

      const data = await Promise.all([p_info, p_trust, p_freeze, p_offer])
      return this.processBalance({
        native: data[0],
        lines: data[1],
        lines2: data[2],
        orders: data[3]
      })
    }

    public rpcBookOffers(params: IRpcBookOffersOptions) {
      return this.postRequest({ method: "book_offers", params: [params] })
    }

    private rpcLedgerEntry(params: IRpcLedgerEntryOptions = {}) {
      return this.postRequest({ method: "ledger_entry", params: [params] })
    }

    private rpcSkywellPathFind(params: IRpcSkywellPathFindOptions) {
      // seems can easily crash rpc service
      return this.postRequest({ method: "skywell_path_find", params: [params] })
    }

    public rpcPeers() {
      return this.postRequest({ method: "peers", params: [] })
    }
    public processBalance(data: any, condition: any = {}) {
      const swt_value: any =
        Number(data.native.account_data.Balance) / 1000000.0
      const freeze0 =
        FREEZE.reserved +
        (data.lines.lines.length + data.orders.offers.length) *
          FREEZE.each_freezed
      const swt_data = {
        value: swt_value,
        currency: Wallet.token,
        issuer: "",
        freezed: freeze0
      }
      // swt遍历offers
      data.orders.offers.forEach(off => {
        const taker_gets = utils.parseAmount(off.taker_gets)
        if (
          taker_gets.currency === swt_data.currency &&
          taker_gets.issuer === swt_data.issuer
        ) {
          swt_data.freezed += parseFloat(taker_gets.value)
        }
      })
      const _data = []
      if (
        (!condition.currency && !condition.issuer) ||
        (condition.currency && condition.currency === this._token)
      ) {
        _data.push(swt_data)
      }
      for (const item of data.lines.lines) {
        if (condition.currency && condition.currency === this._token) {
          break
        }
        const tmpBal = {
          value: item.balance,
          currency: item.currency,
          issuer: item.account,
          freezed: 0
        }
        let freezed = 0
        data.orders.offers.forEach(off => {
          const taker_gets = utils.parseAmount(off.taker_gets)
          if (
            taker_gets.currency === tmpBal.currency &&
            taker_gets.issuer === tmpBal.issuer
          ) {
            freezed += parseFloat(taker_gets.value)
          }
        })
        for (const l of data.lines2.lines) {
          if (l.currency === tmpBal.currency && l.issuer === tmpBal.issuer) {
            freezed += parseFloat(l.limit)
          }
        }
        tmpBal.freezed = parseFloat(`${tmpBal.freezed}`) + freezed
        tmpBal.freezed = Number(tmpBal.freezed.toFixed(6))
        if (condition.currency && condition.currency !== tmpBal.currency) {
          continue
        }
        if (condition.issuer && condition.issuer !== tmpBal.issuer) {
          continue
        }
        _data.push(tmpBal)
      }

      const _ret = {
        balances: _data,
        sequence: data.native.account_data.Sequence
      }
      return _ret
    }
  }
}

export { Factory }
