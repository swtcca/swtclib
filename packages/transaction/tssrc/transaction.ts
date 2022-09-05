// import axios from "axios"
import { Factory as SerializerFactory } from "@swtc/serializer"
import { Factory as UtilsFactory } from "@swtc/utils"
import { Factory as WalletFactory } from "@swtc/wallet"
import {
  HASHPREFIX,
  convertStringToHex,
  normalize_swt,
  normalize_memo
} from "@swtc/common"
import {
  // IMarker
  // ICurrency,
  // ISwtcTxOptions,
  IChainConfig,
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
  IAmount,
  ISignerListTxOptions,
  ISignFirstTxOptions,
  ISignOtherTxOptions,
  IMultiSigningOptions,
  IBrokerageTxOptions
} from "./types"

function Factory(
  chain_or_wallet: () => {} | string | IChainConfig = WalletFactory("jingtum")
) {
  let Wallet
  if (typeof chain_or_wallet === "function") {
    Wallet = chain_or_wallet
  } else {
    Wallet = WalletFactory(chain_or_wallet)
  }
  if (!Wallet.hasOwnProperty("KeyPair")) {
    throw Error("transaction needs a Wallet class")
  }
  const jser = SerializerFactory(Wallet)
  const tu = jser.TypeUtils
  const utils = UtilsFactory(Wallet)

  /**
   * Post request to server with account secret
   * @param remote
   * @class
   */
  return class Transaction {
    public static Wallet = Wallet
    public static Serializer = jser
    public static utils = utils
    public static set_clear_flags = {
      AccountSet: {
        asfRequireDest: 1,
        asfRequireAuth: 2,
        asfDisallowSWT: 3,
        asfDisableMaster: 4,
        asfNoFreeze: 6,
        asfGlobalFreeze: 7
      }
    }
    public static flags = {
      // Universal flags can apply to any transaction type
      Universal: {
        FullyCanonicalSig: 0x80000000
      },
      AccountSet: {
        RequireDestTag: 0x00010000,
        OptionalDestTag: 0x00020000,
        RequireAuth: 0x00040000,
        OptionalAuth: 0x00080000,
        DisallowSWT: 0x00100000,
        AllowSWT: 0x00200000
      },
      TrustSet: {
        SetAuth: 0x00010000,
        NoSkywell: 0x00020000,
        SetNoSkywell: 0x00020000,
        ClearNoSkywell: 0x00040000,
        SetFreeze: 0x00100000,
        ClearFreeze: 0x00200000
      },
      OfferCreate: {
        Passive: 0x00010000,
        ImmediateOrCancel: 0x00020000,
        FillOrKill: 0x00040000,
        Sell: 0x00080000
      },
      Payment: {
        NoSkywellDirect: 0x00010000,
        PartialPayment: 0x00020000,
        LimitQuality: 0x00040000
      },
      RelationSet: {
        Authorize: 0x00000001,
        Freeze: 0x00000011
      }
    }
    public static OfferTypes = ["Sell", "Buy"]
    public static RelationTypes = ["trust", "authorize", "freeze", "unfreeze"]
    public static AccountSetTypes = ["property", "delegate", "signer"]

    // start of static methods

    /*
     * static function build payment tx
     * @param options
     *    source|from|account source account, required
     *    destination|to destination account, required
     *    amount payment amount, required
     * @returns {Transaction}
     */
    public static buildPaymentTx(options: IPaymentTxOptions, remote: any = {}) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }
      const src = options.source || options.from || options.account
      const dst = options.destination || options.to
      const amount = options.amount
      if (!utils.isValidAddress(src)) {
        tx.tx_json.src = new Error("invalid source address")
        return tx
      }
      if (!utils.isValidAddress(dst)) {
        tx.tx_json.dst = new Error("invalid destination address")
        return tx
      }
      if (!utils.isValidAmount(amount)) {
        tx.tx_json.amount = new Error("invalid amount")
        return tx
      }

      tx.tx_json.TransactionType = "Payment"
      tx.tx_json.Account = src
      tx.tx_json.Amount = utils.ToAmount(amount)
      tx.tx_json.Destination = dst
      if ("memo" in options && options.memo) {
        tx.addMemo(options.memo)
      }
      if ("secret" in options && options.secret) {
        tx.setSecret(options.secret)
      }
      if ("invoice" in options && options.invoice) {
        tx.setInvoice(options.invoice)
      }
      if ("sequence" in options && options.sequence) {
        tx.setSequence(options.sequence)
      }
      return tx
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
    public static buildOfferCreateTx(
      options: IOfferCreateTxOptions,
      remote: any = {}
    ) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }

      const offer_type = options.type
      const src = options.source || options.from || options.account
      const taker_gets = options.taker_gets || options.pays
      const taker_pays = options.taker_pays || options.gets
      const platform = options.platform

      if (!utils.isValidAddress(src)) {
        tx.tx_json.src = new Error("invalid source address")
        return tx
      }
      if (
        typeof offer_type !== "string" ||
        !~Transaction.OfferTypes.indexOf(offer_type)
      ) {
        tx.tx_json.offer_type = new Error("invalid offer type")
        return tx
      }
      if (typeof taker_gets === "string" && !Number(taker_gets)) {
        tx.tx_json.taker_gets2 = new Error("invalid to pays amount")
        return tx
      }
      if (typeof taker_gets === "object" && !utils.isValidAmount(taker_gets)) {
        tx.tx_json.taker_gets2 = new Error("invalid to pays amount object")
        return tx
      }
      if (typeof taker_pays === "string" && !Number(taker_pays)) {
        tx.tx_json.taker_pays2 = new Error("invalid to gets amount")
        return tx
      }
      if (typeof taker_pays === "object" && !utils.isValidAmount(taker_pays)) {
        tx.tx_json.taker_pays2 = new Error("invalid to gets amount object")
        return tx
      }
      if (platform && !utils.isValidAddress(platform)) {
        // 正整数
        tx.tx_json.platform = new Error(
          "invalid platform, it must be a valid address."
        )
        return tx
      }

      tx.tx_json.TransactionType = "OfferCreate"
      if (offer_type === "Sell") tx.setFlags(offer_type)
      if (platform) tx.tx_json.Platform = platform
      tx.tx_json.Account = src
      tx.tx_json.TakerPays = utils.ToAmount(taker_pays)
      tx.tx_json.TakerGets = utils.ToAmount(taker_gets)

      if ("memo" in options && options.memo) {
        tx.addMemo(options.memo)
      }
      if ("secret" in options && options.secret) {
        tx.setSecret(options.secret)
      }
      if ("sequence" in options && options.sequence) {
        tx.setSequence(options.sequence)
      }
      return tx
    }

    /**
     * offer cancel
     * @param options
     *    source|from|account source account, required
     *    sequence, required
     * @returns {Transaction}
     */
    public static buildOfferCancelTx(
      options: IOfferCancelTxOptions,
      remote: any = {}
    ) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }

      const src = options.source || options.from || options.account
      const sequence = options.sequence

      if (!utils.isValidAddress(src)) {
        tx.tx_json.src = new Error("invalid source address")
        return tx
      }
      if (!Number(sequence)) {
        tx.tx_json.sequence = new Error("invalid sequence param")
        return tx
      }

      tx.tx_json.TransactionType = "OfferCancel"
      tx.tx_json.Account = src
      tx.tx_json.OfferSequence = Number(sequence)

      if ("memo" in options && options.memo) {
        tx.addMemo(options.memo)
      }
      if ("secret" in options && options.secret) {
        tx.setSecret(options.secret)
      }
      if ("sequence" in options && options.sequence) {
        // tx.setSequence(options.sequence)
        // sequence is parameter for OfferSequence
      }
      return tx
    }

    /**
     * contract
     * @param options
     *    account, required
     *    amount, required
     *    payload, required
     * @returns {Transaction}
     */
    public static initContractTx(
      options: IContractInitTxOptions,
      remote: any = {}
    ) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }
      if (remote._solidity) {
        let params = []
        const account = options.account
        const amount = options.amount
        const payload = options.payload
        if ("params" in options) {
          params = options.params
        }
        const abi = options.abi
        if (!utils.isValidAddress(account)) {
          tx.tx_json.account = new Error("invalid address")
          return tx
        }
        if (isNaN(amount)) {
          tx.tx_json.amount = new Error("invalid amount")
          return tx
        }
        if (typeof payload !== "string") {
          tx.tx_json.payload = new Error("invalid payload: type error.")
          return tx
        }
        if (!Array.isArray(params)) {
          tx.tx_json.params = new Error("invalid params: type error.")
          return tx
        }
        if (!abi) {
          tx.tx_json.abi = new Error("not found abi")
          return tx
        }
        if (!Array.isArray(abi)) {
          tx.tx_json.params = new Error("invalid abi: type error.")
          return tx
        }

        const tum3 = new remote.Tum3()
        tum3.mc.defaultAccount = account
        const MyContract = tum3.mc.contract(abi)
        const contractData = MyContract.new.getData.apply(
          null,
          params.concat({ data: payload })
        )

        tx.tx_json.TransactionType = "AlethContract"
        tx.tx_json.Account = account
        tx.tx_json.Amount = Number(amount) * 1000000
        tx.tx_json.Method = 0
        tx.tx_json.Payload = utils.stringToHex(contractData)
        return tx
      } else {
        throw new Error("initialize your remote for solidity first")
      }
    }
    public static invokeContractTx(
      options: IContractInvokeTxOptions,
      remote: any = {}
    ) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }
      if (remote._solidity) {
        const account = options.account
        const des = options.destination
        const func = options.func // 函数名及函数参数
        const abi = options.abi
        const amount = options.amount

        if (!utils.isValidAddress(account)) {
          tx.tx_json.account = new Error("invalid address")
          return tx
        }
        if (!utils.isValidAddress(des)) {
          tx.tx_json.des = new Error("invalid destination")
          return tx
        }
        if (
          typeof func !== "string" ||
          func.indexOf("(") < 0 ||
          func.indexOf(")") < 0
        ) {
          tx.tx_json.func = new Error("invalid func, func must be string")
          return tx
        }
        if (!abi) {
          tx.tx_json.abi = new Error("not found abi")
          return tx
        }
        if (!Array.isArray(abi)) {
          tx.tx_json.params = new Error("invalid abi: type error.")
          return tx
        }
        if (amount && isNaN(amount)) {
          tx.tx_json.amount = new Error(
            "invalid amount: amount must be a number."
          )
          return tx
        }
        // remote or tx ?
        // issue potential when remote.fuc changed
        // remote.fun = func.substring(0, func.indexOf("("))
        const fun = func.substring(0, func.indexOf("("))
        if (amount) {
          abi.forEach(a => {
            if (a.name === fun && !a.payable) {
              tx.tx_json.amount = new Error(
                "when payable is true, you can set the value of amount"
              )
              return tx
            }
          })
        }

        const tum3 = new remote.Tum3()
        tum3.mc.defaultAccount = account
        const MyContract = tum3.mc.contract(abi)
        tx.abi = abi
        const myContractInstance = MyContract.at(des) // initiate contract for an address
        let result: any = false
        if (fun in myContractInstance) {
          result = new Function(
            "contractInstance",
            `"use strict"; return contractInstance.${func}`
          )(myContractInstance) // call constant function
        } else {
          tx.tx_json.func = new Error(`function ${fun} no found in contract`)
          return tx
        }
        // try {
        //   result = eval("myContractInstance." + func) // call constant function
        // } catch (e) {
        //   tx.tx_json.func = e
        //   return tx
        // }

        if (!result) {
          tx.tx_json.des = new Error("invalid func, no result")
          return tx
        }
        tx.tx_json.TransactionType = "AlethContract"
        tx.tx_json.Account = account
        tx.tx_json.Method = 1
        tx.tx_json.Destination = des
        tx.tx_json.Amount = options.amount ? options.amount : 0
        tx.tx_json.Args = []
        tx.tx_json.Args.push({
          Arg: {
            Parameter: utils.stringToHex(result.substr(2, result.length)),
            ContractParamsType: 0
          }
        })
        return tx
      } else {
        throw new Error("initialize your remote for solidity first")
      }
    }

    public static deployContractTx(
      options: IContractDeployTxOptions,
      remote: any = {}
    ) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }
      const account = options.account
      const amount = options.amount
      const payload = options.payload
      const params = options.params
      if (!utils.isValidAddress(account)) {
        tx.tx_json.account = new Error("invalid address")
        return tx
      }
      if (isNaN(Number(amount))) {
        tx.tx_json.amount = new Error("invalid amount")
        return tx
      }
      if (typeof payload !== "string") {
        tx.tx_json.payload = new Error("invalid payload: type error.")
        return tx
      }
      if (params && !Array.isArray(params)) {
        tx.tx_json.params = new Error("invalid options type")
        return tx
      }

      tx.tx_json.TransactionType = "ConfigContract"
      tx.tx_json.Account = account
      tx.tx_json.Amount = Number(amount) * 1000000
      tx.tx_json.Method = 0
      tx.tx_json.Payload = payload
      tx.tx_json.Args = []
      for (const param of params) {
        const obj: any = {}
        obj.Arg = {
          Parameter: utils.stringToHex(param)
        }
        tx.tx_json.Args.push(obj)
      }
      if ("memo" in options && options.memo) {
        tx.addMemo(options.memo)
      }
      if ("secret" in options && options.secret) {
        tx.setSecret(options.secret)
      }
      if ("sequence" in options && options.sequence) {
        tx.setSequence(options.sequence)
      }
      return tx
    }

    /**
     * contract
     * @param options
     *    account, required
     *    des, required
     *    params, required
     * @returns {Transaction}
     */
    public static callContractTx(
      options: IContractCallTxOptions,
      remote: any = {}
    ) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }
      let params = []
      const account = options.account
      const des = options.destination
      if ("params" in options) {
        params = options.params || []
      }
      const func = options.func // 函数名
      if (!utils.isValidAddress(account)) {
        tx.tx_json.account = new Error("invalid address")
        return tx
      }
      if (!utils.isValidAddress(des)) {
        tx.tx_json.des = new Error("invalid destination")
        return tx
      }

      if (params && !Array.isArray(params)) {
        tx.tx_json.params = new Error("invalid options type")
        return tx
      }
      if (typeof func !== "string") {
        tx.tx_json.func = new Error("func must be string")
        return tx
      }

      tx.tx_json.TransactionType = "ConfigContract"
      tx.tx_json.Account = account
      tx.tx_json.Method = 1
      tx.tx_json.ContractMethod = utils.stringToHex(func)
      tx.tx_json.Destination = des
      tx.tx_json.Args = []
      for (const param of params) {
        if (typeof param !== "string") {
          tx.tx_json.params = new Error("params must be string")
          return tx
        }
        const obj: any = {}
        obj.Arg = {
          Parameter: utils.stringToHex(param)
        }
        tx.tx_json.Args.push(obj)
      }
      if ("memo" in options && options.memo) {
        tx.addMemo(options.memo)
      }
      if ("secret" in options && options.secret) {
        tx.setSecret(options.secret)
      }
      if ("sequence" in options && options.sequence) {
        tx.setSequence(options.sequence)
      }
      return tx
    }

    // signer set, seems discontinued
    public static buildSignTx(options: ISignTxOptions, remote: any = {}) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }

      tx.tx_json.TransactionType = "Signer"
      tx.tx_json.blob = options.blob

      return tx
    }

    /**
     * account information set
     * @param options
     *    type: Transaction.AccountSetTypes
     * @returns {Transaction}
     */
    public static buildAccountSetTx(
      options: IAccountSetTxOptions,
      remote: any = {}
    ) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }
      if (Transaction.AccountSetTypes.indexOf(options.type) === -1) {
        tx.tx_json.type = new Error("invalid account set type")
        return tx
      }
      switch (options.type) {
        case "property":
          return Transaction.__buildAccountSet(options, tx)
        case "delegate":
          return Transaction.__buildDelegateKeySet(options, tx)
        case "signer":
          return Transaction.__buildSignerSet(options, tx)
      }
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
    public static buildRelationTx(
      options: IRelationTxOptions,
      remote: any = {}
    ) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }
      if (!~Transaction.RelationTypes.indexOf(options.type)) {
        tx.tx_json.type = new Error("invalid relation type")
        return tx
      }
      switch (options.type) {
        case "trust":
          return Transaction.__buildTrustSet(options, tx)
        case "authorize":
        case "freeze":
        case "unfreeze":
          return Transaction.__buildRelationSet(options, tx)
      }
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
    public static buildBrokerageTx(
      options: IBrokerageTxOptions,
      remote: any = {}
    ) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }
      const account = options.account
      const feeAccount = options.feeAccount
      const mol =
        Number(options.mol) === 0 || Number(options.molecule) === 0
          ? 0
          : options.mol || options.molecule
      const den = options.den || options.denominator
      const amount = options.amount
      if (!utils.isValidAddress(account)) {
        tx.tx_json.src = new Error("invalid address")
        return tx
      }
      if (!/^\d+$/.test(`${mol}`)) {
        // (正整数 + 0)
        tx.tx_json.mol = new Error(
          "invalid mol, it is a positive integer or zero."
        )
        return tx
      }
      if (isNaN(Number(den))) {
        tx.tx_json.den = new Error("invalid den, it is a number")
        return tx
      }

      if (Number(mol) > Number(den)) {
        tx.tx_json.app = new Error(
          "invalid mol/den, molecule can not exceed denominator."
        )
        return tx
      }
      if (!utils.isValidAmount(amount)) {
        tx.tx_json.amount = new Error("invalid amount")
        return tx
      }
      tx.tx_json.TransactionType = "Brokerage"
      tx.tx_json.Account = account // 管理员账号
      tx.tx_json.OfferFeeRateNum = Number(mol) // 分子(正整数 + 0)
      tx.tx_json.OfferFeeRateDen = Number(den) // 分母(正整数)
      tx.tx_json.Amount = utils.ToAmount(amount) // 币种,这里amount字段中的value值只是占位，没有实际意义
      tx.tx_json.FeeAccountID = feeAccount // 收费账号

      if ("memo" in options && options.memo) {
        tx.addMemo(options.memo)
      }
      if ("secret" in options && options.secret) {
        tx.setSecret(options.secret)
      }
      if ("sequence" in options && options.sequence) {
        tx.setSequence(options.sequence)
      }
      return tx
    }

    /**
     * SignerList 多签名
     * @param options
     *    account, required
     *    threshold, required
     *    lists, required
     * @returns {Transaction}
     */
    public static buildSignerListTx(
      options: ISignerListTxOptions,
      remote: any = {}
    ) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }
      const account = options.account
      const threshold = Number(options.threshold) // 阈值
      const lists = options.lists // 签字人列表
      if (!utils.isValidAddress(account)) {
        tx.tx_json.src = new Error("invalid address")
        return tx
      }
      if (isNaN(threshold) || threshold < 0) {
        tx.tx_json.threshold = new Error(
          "invalid threshold, it must be a number and greater than zero"
        )
        return tx
      }
      if (lists && !Array.isArray(lists)) {
        tx.tx_json.lists = new Error(
          "invalid options type, it must be an array"
        )
        return tx
      }
      if (threshold === 0 && lists && lists.length >= 0) {
        tx.tx_json.lists = new Error(
          "please delete lists when threshold is zero"
        )
        return tx
      }
      let sum = 0
      if (threshold !== 0 && lists && lists.length > 0) {
        const newList = []
        for (const list of lists) {
          if (
            list.account &&
            utils.isValidAddress(list.account) &&
            list.weight &&
            !isNaN(list.weight) &&
            Number(list.weight) > 0
          ) {
            sum += Number(list.weight)
            newList.push({
              SignerEntry: {
                Account: list.account,
                SignerWeight: list.weight
              }
            })
          } else {
            tx.tx_json.lists = new Error("invalid lists")
            return tx
          }
        }
        tx.tx_json.SignerEntries = newList
      }
      if (sum < threshold) {
        tx.tx_json.threshold = new Error(
          "The total signer weight is less than threshold"
        )
        return tx
      }
      tx.tx_json.TransactionType = "SignerListSet"
      tx.tx_json.Account = account
      tx.tx_json.SignerQuorum = threshold
      return tx
    }

    public static buildSignFirstTx(options: ISignFirstTxOptions) {
      // 首签账号添加SigningPubKey字段
      const tx = options.tx
      delete options.tx
      tx.setCommand("sign_for")
      return tx.multiSigning(options)
    }

    public static buildSignOtherTx(
      options: ISignOtherTxOptions,
      remote: any = {}
    ) {
      // 其他账号签名只需把返回结果提交回去即可
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.options = new Error("invalid options type")
        return tx
      }
      tx.setCommand("sign_for")
      tx.tx_json = options.tx_json
      delete options.tx_json
      return tx.multiSigning(options)
    }

    public static buildMultisignedTx(tx_json, remote: any = {}) {
      //  创建多重签名
      const tx = new Transaction(remote)
      if (tx_json === null || typeof tx_json !== "object") {
        tx.tx_json.tx_json = new Error("invalid tx_json type")
        return tx
      }
      tx.setCommand("submit_multisigned")
      tx.tx_json = tx_json
      return tx
    }

    public static buildTx(tx_json, remote: any = {}) {
      // 通过tx_json创建Transaction对象
      const tx = new Transaction(remote)
      if (tx_json === null || typeof tx_json !== "object") {
        tx.tx_json.tx_json = new Error("invalid tx_json type")
        return tx
      }
      tx.tx_json = tx_json
      return tx
    }

    public static buildTokenIssueTx(options, remote: any = {}) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }
      const account = options.account
      const publisher = options.publisher
      const token = options.token
      const number = options.number
      if (!utils.isValidAddress(account)) {
        tx.tx_json.account = new Error("invalid account address")
        return tx
      }
      if (!utils.isValidAddress(publisher)) {
        tx.tx_json.publisher = new Error("invalid publisher address")
        return tx
      }
      if (isNaN(number) || Number(number) < 0) {
        tx.tx_json.number = new Error(
          "invalid number, it must be a number and greater than zero"
        )
        return tx
      }
      tx.tx_json.TransactionType = "TokenIssue"
      tx.tx_json.Account = account
      tx.tx_json.Issuer = publisher
      tx.tx_json.FundCode = convertStringToHex(token)
      tx.tx_json.TokenSize = Number(number)
      return tx
    }

    public static buildTransferTokenTx(options, remote: any = {}) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }
      const publisher = options.publisher
      const receiver = options.receiver
      const token = options.token
      const tokenId = options.tokenId
      const memos = options.memos || []
      if (!utils.isValidAddress(receiver)) {
        tx.tx_json.receiver = new Error("invalid receiver address")
        return tx
      }
      if (!utils.isValidAddress(publisher)) {
        tx.tx_json.publisher = new Error("invalid publisher address")
        return tx
      }
      tx.tx_json.TransactionType = "TransferToken"
      tx.tx_json.Account = publisher
      tx.tx_json.Destination = receiver
      if (token) {
        tx.tx_json.FundCode = convertStringToHex(token)
      }
      if (memos.length > 0) {
        if (typeof memos === "object") {
          // array
          for (const memo of memos) {
            if (typeof memo === "string") {
              tx.addMemo(memo)
            } else if ("MemoData" in memo && "MemoFormat" in memo) {
              tx.addMemo(memo.MemoData, memo.MemoFormat)
            }
          }
        } else if (typeof memos === "string") {
          // string
          tx.addMemo(memos)
        } else {
          tx.addMemo("specified memo incorrect")
        }
      }
      tx.tx_json.TokenID = tokenId // 64位，不足的补零吗？
      return tx
    }

    public static buildTokenDelTx(options, remote: any = {}) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }
      const publisher = options.publisher
      const tokenId = options.tokenId
      if (!utils.isValidAddress(publisher)) {
        tx.tx_json.publisher = new Error("invalid publisher address")
        return tx
      }
      tx.tx_json.TransactionType = "TokenDel"
      tx.tx_json.Account = publisher
      tx.tx_json.TokenID = tokenId
      return tx
    }

    public static buildIssueSetTx(options, remote: any = {}) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }
      const { managerAccount, amount } = options
      if (!utils.isValidAddress(managerAccount)) {
        tx.tx_json.src = new Error("invalid address")
        return tx
      }

      if (!utils.isValidAmount(amount)) {
        tx.tx_json.amount = new Error("invalid amount")
        return tx
      }

      tx.tx_json.TransactionType = "IssueSet"
      tx.tx_json.Account = managerAccount
      tx.tx_json.TotalAmount = utils.ToAmount(amount)
      tx.tx_json.Flags = 0
      if ("memo" in options && options.memo) {
        tx.addMemo(options.memo)
      }

      return tx
    }

    public static buildSetBlackListTx(options, remote: any = {}) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }
      const { managerAccount, blockAccount } = options
      if (!utils.isValidAddress(managerAccount)) {
        tx.tx_json.src = new Error("invalid manager address")
        return tx
      }

      if (!utils.isValidAddress(blockAccount)) {
        tx.tx_json.src = new Error("invalid block address")
        return tx
      }

      tx.tx_json.TransactionType = "SetBlackList"
      tx.tx_json.Account = managerAccount
      tx.tx_json.BlackListAccountID = blockAccount
      tx.tx_json.Flags = 0
      if ("memo" in options && options.memo) {
        tx.addMemo(options.memo)
      }

      return tx
    }

    public static buildManageIssuerTx(options, remote: any = {}) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }
      const { managerAccount, issuerAccount } = options
      if (!utils.isValidAddress(managerAccount)) {
        tx.tx_json.src = new Error("invalid manager address")
        return tx
      }

      if (!utils.isValidAddress(issuerAccount)) {
        tx.tx_json.src = new Error("invalid issuer address")
        return tx
      }

      tx.tx_json.TransactionType = "ManageIssuer"
      tx.tx_json.Account = managerAccount
      tx.tx_json.IssuerAccountID = issuerAccount
      tx.tx_json.Flags = 0
      if ("memo" in options && options.memo) {
        tx.addMemo(options.memo)
      }

      return tx
    }

    public static buildRemoveBlackListTx(options, remote: any = {}) {
      const tx = new Transaction(remote)
      if (options === null || typeof options !== "object") {
        tx.tx_json.obj = new Error("invalid options type")
        return tx
      }
      const { managerAccount, blockAccount } = options
      if (!utils.isValidAddress(managerAccount)) {
        tx.tx_json.src = new Error("invalid manager address")
        return tx
      }

      if (!utils.isValidAddress(blockAccount)) {
        tx.tx_json.src = new Error("invalid block address")
        return tx
      }

      tx.tx_json.TransactionType = "RemoveBlackList"
      tx.tx_json.Account = managerAccount
      tx.tx_json.BlackListAccountID = blockAccount
      tx.tx_json.Flags = 0
      if ("memo" in options && options.memo) {
        tx.addMemo(options.memo)
      }

      return tx
    }

    public static __buildTrustSet(options, tx) {
      const src = options.source || options.from || options.account
      const limit = options.limit
      const quality_out = options.quality_out
      const quality_in = options.quality_in

      if (!utils.isValidAddress(src)) {
        tx.tx_json.src = new Error("invalid source address")
        return tx
      }
      if (!utils.isValidAmount(limit)) {
        tx.tx_json.limit = new Error("invalid amount")
        return tx
      }

      tx.tx_json.TransactionType = "TrustSet"
      tx.tx_json.Account = src
      tx.tx_json.LimitAmount = limit
      if (quality_in) {
        tx.tx_json.QualityIn = quality_in
      }
      if (quality_out) {
        tx.tx_json.QualityOut = quality_out
      }
      if ("memo" in options && options.memo) {
        tx.addMemo(options.memo)
      }
      if ("secret" in options && options.secret) {
        tx.setSecret(options.secret)
      }
      if ("sequence" in options && options.sequence) {
        tx.setSequence(options.sequence)
      }
      return tx
    }

    public static __buildRelationSet(options, tx) {
      const src = options.source || options.from || options.account
      const des = options.target
      const limit = options.limit

      if (!utils.isValidAddress(src)) {
        tx.tx_json.src = new Error("invalid source address")
        return tx
      }
      if (!utils.isValidAddress(des)) {
        tx.tx_json.des = new Error("invalid target address")
        return tx
      }
      if (!utils.isValidAmount(limit)) {
        tx.tx_json.limit = new Error("invalid amount")
        return tx
      }

      tx.tx_json.TransactionType =
        options.type === "unfreeze" ? "RelationDel" : "RelationSet"
      tx.tx_json.Account = src
      tx.tx_json.Target = des
      tx.tx_json.RelationType = options.type === "authorize" ? 1 : 3
      tx.tx_json.LimitAmount = limit
      if ("memo" in options && options.memo) {
        tx.addMemo(options.memo)
      }
      if ("secret" in options && options.secret) {
        tx.setSecret(options.secret)
      }
      if ("sequence" in options && options.sequence) {
        tx.setSequence(options.sequence)
      }
      return tx
    }

    /**
     * account information set
     * @param options
     *    set_flag, flags to set
     *    clear_flag, flags to clear
     * @returns {Transaction}
     */
    public static __buildAccountSet(options, tx) {
      const src = options.source || options.from || options.account
      let set_flag = options.set_flag || options.set
      let clear_flag = options.clear_flag || options.clear
      if (!utils.isValidAddress(src)) {
        tx.tx_json.src = new Error("invalid source address")
        return tx
      }

      tx.tx_json.TransactionType = "AccountSet"
      tx.tx_json.Account = src

      const SetClearFlags = Transaction.set_clear_flags.AccountSet

      function prepareFlag(flag) {
        return typeof flag === "number"
          ? flag
          : SetClearFlags[flag] || SetClearFlags["asf" + flag]
      }

      if (set_flag) {
        set_flag = prepareFlag(set_flag)
        if (set_flag) {
          tx.tx_json.SetFlag = set_flag
        }
      }

      if (clear_flag) {
        clear_flag = prepareFlag(clear_flag)
        if (clear_flag) {
          tx.tx_json.ClearFlag = clear_flag
        }
      }

      if ("memo" in options && options.memo) {
        tx.addMemo(options.memo)
      }
      if ("secret" in options && options.secret) {
        tx.setSecret(options.secret)
      }
      if ("sequence" in options && options.sequence) {
        tx.setSequence(options.sequence)
      }
      return tx
    }

    /**
     * delegate key setting
     * @param options
     *    source|account|from, source account, required
     *    delegate_key, delegate account, required
     * @returns {Transaction}
     */
    public static __buildDelegateKeySet(options, tx) {
      const src = options.source || options.account || options.from
      const delegate_key = options.delegate_key

      if (!utils.isValidAddress(src)) {
        tx.tx_json.src = new Error("invalid source address")
        return tx
      }
      if (!utils.isValidAddress(delegate_key)) {
        tx.tx_json.delegate_key = new Error("invalid regular key address")
        return tx
      }

      tx.tx_json.TransactionType = "SetRegularKey"
      tx.tx_json.Account = src
      tx.tx_json.RegularKey = delegate_key

      if ("memo" in options && options.memo) {
        tx.addMemo(options.memo)
      }
      if ("secret" in options && options.secret) {
        tx.setSecret(options.secret)
      }
      if ("sequence" in options && options.sequence) {
        tx.setSequence(options.sequence)
      }
      return tx
    }

    public static __buildSignerSet(options: any, tx: any) {
      // TODO
      tx.tx_json.delegate_key =
        options.deletegate_key || new Error("not implemented yet")
      if ("memo" in options && options.memo) {
        tx.addMemo(options.memo)
      }
      if ("secret" in options && options.secret) {
        tx.setSecret(options.secret)
      }
      if ("sequence" in options && options.sequence) {
        tx.setSequence(options.sequence)
      }
      return tx
    }
    // end of static transaction builds

    public tx_json
    public readonly _token: string
    public _secret: string | undefined
    public abi: any[] | undefined
    public _remote: any
    public _filter
    public command: string
    public sign_account: string | undefined
    public sign_secret: string | undefined
    constructor(remote, filter = v => v) {
      this._remote = remote
      this._token = remote._token || Wallet.token
      this.tx_json = { Flags: 0, Fee: utils.getFee() }
      this._filter = filter
      this.command = "submit"
    }

    /**
     * parse json transaction as tx_json
     * @param val
     * @returns {Transaction}
     */
    public parseJson(val) {
      this.tx_json = val
      return this
    }

    /**
     * get transaction account
     * @returns {Transaction.tx_json.Account}
     */
    public getAccount() {
      return this.tx_json.Account
    }

    /**
     * get transaction type
     * @returns {exports.result.TransactionType|*|string}
     */
    public getTransactionType() {
      return this.tx_json.TransactionType
    }

    /**
     * set secret
     * @param secret
     */
    public setSecret(secret: string) {
      if (!Wallet.isValidSecret(secret)) {
        this.tx_json._secret = new Error("invalid secret")
        return
      }
      this._secret = secret
    }

    /**
     * set invoice
     * @param invoice
     */
    public setInvoice(invoice: string) {
      this.tx_json.InvoiceID = invoice
    }

    /**
     * set command
     * @param command
     */
    public setCommand(command: string) {
      this.command = command
    }

    /**
     * just only memo data
     * @param memo
     * EVERYTHING for MemoData so far, not format actually :((((
     */
    public addMemo(memo, format = "text") {
      const _memo: any = {}
      if (format === "text" || format === "TEXT") {
        if (typeof memo !== "string") {
          _memo.MemoData = memo
          _memo.MemoFormat = "json"
        } else {
          _memo.MemoData = memo
        }
      } else if (format === "json" || format === "JSON") {
        _memo.MemoData = memo
        _memo.MemoFormat = "json"
      } else if (format === "hex" || format === "HEX") {
        _memo.MemoData = memo
        _memo.MemoFormat = "hex"
      } else {
        throw new Error("only text/json/hex are supported memo format")
      }
      const Memos = (this.tx_json.Memos || []).concat({ Memo: _memo })
      const so = new jser([])
      tu.Array.serialize(so, Memos)
      if (so.to_hex().length > 2050) {
        this.tx_json.memo_len = new TypeError("memo is too long")
        return this
      }
      this.tx_json.Memos = Memos
    }

    public setFee(fee) {
      const _fee = parseInt(fee, 10)
      if (isNaN(_fee)) {
        this.tx_json.Fee = new TypeError("invalid fee")
        return this
      }
      if (fee < 10) {
        this.tx_json.Fee = new TypeError("fee is too low")
        return this
      }
      this.tx_json.Fee = _fee
    }

    /**
     * set source tag
     * source tag is a 32 bit integer or undefined
     * @param tag
     */
    /*
    setSourceTag function(tag) {
        if (typeof tag !== Number || !isFinite(tag)) {
            throw new Error('invalid tag type');
        }
        this.tx_json.SourceTag = tag;
    };

    setDestinationTag function(tag) {
        if (typeof tag !== Number || !isFinite(tag)) {
            throw new Error('invalid tag type');
        }
        this.tx_json.DestinationTag = tag;
    };
    */

    /**
     * set a path to payment
     * this path is repesented as a key, which is computed in path find
     * so if one path you computed self is not allowed
     * when path set, sendmax is also set.
     * @param path
     */
    public setPath(key: string) {
      // sha1 string
      if (typeof key !== "string" || key.length !== 40) {
        return new Error("invalid path key")
      }
      const item = this._remote._paths.get(key)
      if (!item) {
        return new Error("non exists path key")
      }
      if (item.path === "[]") {
        // 沒有支付路径，不需要传下面的参数
        return
      }
      const path = JSON.parse(item.path)
      this.tx_json.Paths = path
      const amount = utils.MaxAmount(item.choice)
      this.tx_json.SendMax = amount
    }

    /**
     * limit send max amount
     * @param amount
     */
    public setSendMax(amount: IAmount) {
      if (!utils.isValidAmount(amount)) {
        return new Error("invalid send max amount")
      }
      this.tx_json.SendMax = amount
    }

    /**
     * transfer rate
     * between 0 and 1, type is number
     * @param rate
     */
    public setTransferRate(rate) {
      if (typeof rate !== "number" || rate < 0 || rate > 1) {
        return new Error("invalid transfer rate")
      }
      this.tx_json.TransferRate = (rate + 1) * 1e9
    }

    /**
     * set transaction flags
     *
     */
    public setFlags(flags) {
      if (flags === void 0) return

      if (typeof flags === "number") {
        this.tx_json.Flags = flags
        return
      }
      const transaction_flags =
        Transaction.flags[this.getTransactionType()] || {}
      const flag_set = Array.isArray(flags) ? flags : [].concat(flags)
      for (const flag of flag_set) {
        if (transaction_flags.hasOwnProperty(flag)) {
          this.tx_json.Flags += transaction_flags[flag]
        }
      }
    }

    /* set sequence */
    public setSequence(sequence: string | number) {
      if (!/^\+?[1-9][0-9]*$/.test(String(sequence))) {
        // 正整数
        this.tx_json.Sequence = new TypeError("invalid sequence")
        return this
      }
      this.tx_json.Sequence = Number(sequence)
    }

    /*
     * options: {
     *   address: '',
     *   secret: ''
     * }
     */
    public multiSigning(options: IMultiSigningOptions) {
      this.tx_json.SigningPubKey = "" // 多签中该字段必须有且必须为空字符串
      if (!this.tx_json.Sequence) {
        this.tx_json.Sequence = new Error("please set sequence first")
        return this
      }
      normalize_memo(this.tx_json)
      normalize_swt(this.tx_json)
      // make tx_json.Amount.value string
      if (
        this.tx_json.hasOwnProperty("Amount") &&
        this.tx_json.Amount.hasOwnProperty("value")
      ) {
        this.tx_json.Amount.value = `${this.tx_json.Amount.value}`
      }

      // const tx_json_verify = JSON.parse(JSON.stringify(this.tx_json))
      const signers = this.tx_json.Signers || []
      if (signers.length > 0) {
        // 验签
        if (!verifyTx(this.tx_json)) {
          this.tx_json.verifyTx = new Error("verify failed")
          return this
        }
      }

      const Account = options.account || options.address
      const signer: any = { Account }
      const wt = new Wallet(options.secret)

      const tx_json = JSON.parse(JSON.stringify(this.tx_json))
      delete tx_json.Signers
      normalize_memo(tx_json, true)

      let blob = jser.from_json(tx_json)
      blob = jser.adr_json(blob, Account)

      let hash
      if (wt.isEd25519()) {
        hash = `${HASHPREFIX.transactionMultiSig
          .toString(16)
          .toUpperCase()}${blob.to_hex()}`
      } else {
        hash = blob.hash(HASHPREFIX.transactionMultiSig)
      }

      signer.SigningPubKey = wt.getPublicKey()
      signer.TxnSignature = wt.signTx(hash)

      this.tx_json.Signers = this.tx_json.Signers || []
      this.tx_json.Signers.push({
        Signer: signer
      })
      return this
    }

    public multiSigned() {
      // 多重签名完毕
      this.command = "submit_multisigned"
      normalize_swt(this.tx_json)
      const signers = this.tx_json.Signers || []
      if (signers.length > 0) {
        // 验签
        if (!verifyTx(this.tx_json)) {
          this.tx_json.verifyTx = new Error("verify failed")
          return this
        }
      }
      normalize_swt(this.tx_json, true)
      if (Number(signers.length * Wallet.getFee()) > Number(this.tx_json.Fee)) {
        // 验证燃料费是否够用
        this.tx_json.Fee = new Error("low fee")
      }
      return this
    }

    public sign(callback) {
      if (this.tx_json.Sequence) {
        signing(this, callback)
        // callback(null, signing(self));
      } else if ("requestAccountInfo" in this._remote) {
        const req = this._remote.requestAccountInfo({
          account: this.tx_json.Account,
          type: "trust"
        })
        req.submit((err, data) => {
          if (err) return callback(err)
          this.tx_json.Sequence = data.account_data.Sequence
          signing(this, callback)
          // callback(null, signing(self));
        })
      } else if ("getAccountInfo" in this._remote) {
        this._remote
          .getAccountInfo(this.tx_json.Account)
          .then(data => {
            this.tx_json.Sequence = data.account_data.Sequence
            signing(this, callback)
          })
          .catch(error => {
            throw error
          })
      } else if ("getAccountBalances" in this._remote) {
        this._remote
          .getAccountBalances(this.tx_json.Account)
          .then(data => {
            this.tx_json.Sequence = data.sequence
            signing(this, callback)
          })
          .catch(error => {
            throw error
          })
      } else if ("_axios" in this._remote) {
        this._remote._axios
          .get(`accounts/${this.tx_json.Account}/info`)
          .then(response => {
            this.tx_json.Sequence = response.data.account_data.Sequence
            signing(this, callback)
          })
          .catch(error => {
            throw error
          })
      } else {
        throw new Error("unable to fill in sequence")
      }
    }

    public async signPromise(
      secret = "",
      memo = "",
      sequence = 0
    ): Promise<any> {
      if (!this.tx_json) {
        return Promise.reject("a valid transaction is expected")
        // } else if (this.command !== "submit") {
        //   // 多重签名， 密钥泄漏
        //   return Promise.resolve(MULTISIGN)
      } else if ("blob" in this.tx_json) {
        return Promise.resolve(this.tx_json.blob)
      } else {
        for (const key in this.tx_json) {
          if (this.tx_json[key] instanceof Error) {
            return Promise.reject(this.tx_json[key].message)
          }
        }
        try {
          if (memo) {
            this.addMemo(memo)
          }
          if (sequence) {
            this.setSequence(sequence)
          }
        } catch (error) {
          return Promise.reject(error)
        }
        if (!this._secret) {
          if (!secret) {
            return Promise.reject("a valid secret is needed to sign with")
          } else {
            this._secret = secret
          }
        } // has _secret now
        if (!this.tx_json.Sequence) {
          try {
            await this._setSequencePromise()
            await this._signPromise()
            return Promise.resolve(this.tx_json.blob)
          } catch (error) {
            return Promise.reject(error)
          }
          // has tx_json.Sequence now
        } else {
          try {
            await this._signPromise()
            return Promise.resolve(this.tx_json.blob)
          } catch (error) {
            return Promise.reject(error)
          }
        }
      }
    }

    /**
     * submit request to server
     * @param callback
     */
    public submit(callback) {
      for (const key in this.tx_json) {
        if (this.tx_json[key] instanceof Error) {
          return callback(this.tx_json[key].message)
        }
      }

      let data: any = {}
      if (this.command === "submit_multisigned") {
        // 多重签名 =====密钥泄漏======
        data = { tx_json: this.tx_json }
        if (this.abi) {
          data.abi = this.abi
        }
        this._remote._submit(this.command, data, this._filter, callback)
      } else if ("blob" in this.tx_json) {
        // 直接将blob传给底层
        if (!this.abi) {
          data = {
            tx_blob: this.tx_json.blob
          }
        } else {
          data = {
            tx_blob: this.tx_json.blob,
            abi: this.abi
          }
        }
        if (this._remote.hasOwnProperty("_submit")) {
          // lib
          this._remote._submit(this.command, data, this._filter, callback)
        } else {
          // api/proxy/rpc
          throw new Error("please use .submitPromise() for non-ws library")
        }
      } else {
        // 签名之后传给底层
        this.sign((err, blob) => {
          if (err) {
            return callback("sign error: " + err)
          } else {
            if (!this.abi) {
              data = { tx_blob: blob }
            } else {
              data = { tx_blob: blob, abi: this.abi }
            }
            if (this._remote.hasOwnProperty("_submit")) {
              // lib
              this._remote._submit(this.command, data, this._filter, callback)
            } else {
              // api/proxy/rpc
              throw new Error("please use .submitPromise() for non-ws library")
            }
          }
        })
      }
    }

    public async submitPromise(
      secret = "",
      memo = "",
      sequence = 0
    ): Promise<any> {
      for (const key in this.tx_json) {
        if (this.tx_json[key] instanceof Error) {
          return Promise.reject(this.tx_json[key].message)
        }
      }
      let data: any = {}
      let blob = ""
      try {
        if (this.command === "submit_multisigned") {
          // 多重签名
          data = { tx_json: this.tx_json }
        } else {
          blob = await this.signPromise(secret, memo, sequence)
          data = { blob }
        }
        if (this.abi) {
          data.abi = this.abi
        }
        if ("_submit" in this._remote) {
          // lib remote
          if (blob) {
            delete data.blob
            data.tx_blob = blob
          }
          return new Promise((resolve, reject) => {
            const callback = (error, result) => {
              if (error) {
                reject(error)
              } else {
                resolve(result)
              }
            }
            this._remote._submit(this.command, data, this._filter, callback)
          })
        } else if ("rpcSubmit" in this._remote) {
          // rpc remote
          if (this.command === "submit_multisigned") {
            return this._remote.rpcSubmitMultisigned(data)
          } else if (blob) {
            delete data.blob
            data.tx_blob = blob
            return this._remote.rpcSubmit(data)
          } else {
            return Promise.reject("unable to handle for multisigned tx")
          }
        } else if ("txSubmitPromise" in this._remote) {
          // api remote
          return this._remote.txSubmitPromise(this)
        } else if ("_axios" in this._remote) {
          // api remote
          return this._remote._axios.post(`blob`, data)
        } else {
          return Promise.reject("unable to get sequence for signing")
          // use api.jingtum.com directly
          // return axios.post(`https://api.jingtum.com/v2/blob`, data)
        }
      } catch (error) {
        return Promise.reject(error)
      }
    }

    public async submitApi(secret = "", memo = "", sequence = 0) {
      return this.submitPromise(secret, memo, sequence)
    }

    // private and protected methods
    public async _signPromise(): Promise<any> {
      normalize_swt(this.tx_json)
      return new Promise((resolve, reject) => {
        try {
          const wt = new Wallet(this._secret)
          this.tx_json.SigningPubKey = wt.getPublicKey()
          const blob = jser.from_json(this.tx_json)
          let hash
          if (wt.isEd25519()) {
            hash = `${HASHPREFIX.transactionSig
              .toString(16)
              .toUpperCase()}${blob.to_hex()}`
          } else {
            hash = blob.hash(HASHPREFIX.transactionSig)
          }
          this.tx_json.TxnSignature = wt.signTx(hash)
          this.tx_json.blob = jser.from_json(this.tx_json).to_hex()
          resolve(this)
        } catch (error) {
          reject(error)
        }
      })
    }

    public async _setSequencePromise(): Promise<any> {
      let data: any
      let response: any
      try {
        if ("requestAccountInfo" in this._remote) {
          data = await this._remote
            .requestAccountInfo({
              account: this.tx_json.Account,
              type: "trust"
            })
            .submitPromise()
          this.tx_json.Sequence = data.account_data.Sequence
          return Promise.resolve(this)
        } else if ("rpcAccountInfo" in this._remote) {
          data = await this._remote.rpcAccountInfo({
            account: this.tx_json.Account
          })
          this.tx_json.Sequence = data.account_data.Sequence
          return Promise.resolve(this)
        } else if ("getAccountSequence" in this._remote) {
          data = await this._remote.getAccountSequence(this.tx_json.Account)
          this.tx_json.Sequence = data.sequence
          return Promise.resolve(this)
        } else if ("getAccountBalances" in this._remote) {
          data = await this._remote.getAccountBalances(this.tx_json.Account)
          this.tx_json.Sequence = data.sequence
          return Promise.resolve(this)
        } else if ("_axios" in this._remote) {
          response = await this._remote._axios.get(
            `accounts/${this.tx_json.Account}/info`
          )
          this.tx_json.Sequence = response.data.account_data.Sequence
          return Promise.resolve(this)
        } else {
          // use api.jingtum.com to get sequence, consider proxy or jcc rpc
          // response = await axios.get(
          //   `https://api.jingtum.com/v2/accounts/${this.tx_json.Account}/balances`
          // )
          // this.tx_json.Sequence = response.data.sequence
          // return Promise.resolve(this)
          return Promise.reject("unable to get sequence for sign")
        }
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }

  function signing(tx, callback) {
    try {
      normalize_swt(tx.tx_json)
      const wt = new Wallet(tx._secret)
      tx.tx_json.SigningPubKey = wt.getPublicKey()
      const blob = jser.from_json(tx.tx_json)
      let hash
      if (wt.isEd25519()) {
        hash = `${HASHPREFIX.transactionSig
          .toString(16)
          .toUpperCase()}${blob.to_hex()}`
      } else {
        hash = blob.hash(HASHPREFIX.transactionSig)
      }
      tx.tx_json.TxnSignature = wt.signTx(hash)
      tx.tx_json.blob = jser.from_json(tx.tx_json).to_hex()
      tx._local_sign = true
      callback(null, tx.tx_json.blob)
    } catch (e) {
      callback(e)
    }
  }

  function verifyTx(tx_json) {
    // 验签
    const tx_json_new = JSON.parse(JSON.stringify(tx_json))
    const signers = tx_json_new.Signers || []
    delete tx_json_new.Signers
    normalize_memo(tx_json_new, true)
    if (signers.length > 0) {
      for (const signer of signers) {
        const s = signer.Signer
        let message
        let blob = jser.from_json(tx_json_new)
        blob = jser.adr_json(blob, s.Account)
        if (s.SigningPubKey.slice(0, 2) === "ED") {
          // ed25519
          message = `${HASHPREFIX.transactionMultiSig
            .toString(16)
            .toUpperCase()}${blob.to_hex()}`
        } else {
          message = blob.hash(HASHPREFIX.transactionMultiSig)
        }
        if (
          // todo: check format of pubkey is needed
          !Wallet.checkTx(message, s.TxnSignature, s.SigningPubKey)
        ) {
          return false
        }
      }
    }
    return true
  }
}
export { Factory }
