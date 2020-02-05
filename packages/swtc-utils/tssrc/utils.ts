/**
 * typescriptize on  2020/01/20.
 */

import {
  LEDGER_FLAGS,
  LEDGER_STATES,
  FLAGS as Flags,
  getTypes,
  formatArgs,
  isValidCurrency,
  isValidHash,
  txnType,
  reverseAmount,
  isAmountZero,
  getTypeNode,
  processAffectNode,
  affectedAccounts,
  funcHexToString as hexToString,
  funcStringToHex as stringToHex,
  funcString2Hex as string2Hex,
  funcNumber2Hex as number2Hex,
  funcHex2Number as hex2Number,
  funcIsEmpty as isEmpty
} from "@swtc/common"
import { Factory as WalletFactory } from "@swtc/wallet"
const extend = Object.assign
import utf8 from "utf8"
import Bignumber from "bignumber.js"

const Factory = (Wallet = WalletFactory("jingtum")) => {
  if (!Wallet.hasOwnProperty("KeyPair")) {
    throw Error("utils needs a Wallet class")
  }

  const getCurrency = Wallet.getCurrency

  const getFee = Wallet.getFee

  const makeCurrency = Wallet.makeCurrency

  const makeAmount = Wallet.makeAmount

  /**
   * check {value: '', currency:'', issuer: ''}
   * @param amount
   * @returns {boolean}
   */
  const isValidAmount = amount => {
    if (amount === null || typeof amount !== "object") {
      return false
    }
    // check amount value
    if (
      (!amount.value && amount.value !== 0) ||
      Number.isNaN(Number(amount.value))
    ) {
      return false
    }
    // check amount currency
    if (!amount.currency || !isValidCurrency(amount.currency)) {
      return false
    }
    const currency = getCurrency()
    // native currency issuer is empty
    if (amount.currency === currency && amount.issuer !== "") {
      return false
    }
    // non native currency issuer is not allowed to be empty
    if (amount.currency !== currency && !Wallet.isValidAddress(amount.issuer)) {
      return false
    }
    return true
  }

  /**
   * check {currency: '', issuer: ''}
   * @param amount
   * @returns {boolean}
   */
  const isValidAmount0 = amount => {
    if (amount === null || typeof amount !== "object") {
      return false
    }
    // check amount currency
    if (!amount.currency || !isValidCurrency(amount.currency)) {
      return false
    }
    const currency = getCurrency()
    // native currency issuer is empty
    if (amount.currency === currency && amount.issuer !== "") {
      return false
    }
    // non native currency issuer is not allowed to be empty
    if (amount.currency !== currency && !Wallet.isValidAddress(amount.issuer)) {
      return false
    }
    return true
  }

  /**
   * parse amount and return uni format data
   *   {value: '', currency: '', issuer: ''}
   * @param amount
   * @returns {*}
   */
  const parseAmount = amount => {
    if (typeof amount === "string" && !Number.isNaN(Number(amount))) {
      const value = String(new Bignumber(amount).dividedBy(1000000.0))
      const currency = getCurrency()
      return { value, currency, issuer: "" }
    } else if (typeof amount === "object" && isValidAmount(amount)) {
      return amount
    } else {
      return null
    }
  }

  /**
   * get affect order book
   * @param tx
   * @returns {Array}
   */
  const affectedBooks = tx => {
    const data = tx.meta
    if (typeof data !== "object") return []
    if (!Array.isArray(data.AffectedNodes)) return []

    const currency = getCurrency()
    const books = {}
    for (const an of data.AffectedNodes) {
      const node = getTypeNode(an)
      if (!node || node.LedgerEntryType !== "Offer") {
        continue
      }
      const fields = extend(
        {},
        node.PreviousFields,
        node.NewFields,
        node.FinalFields
      )
      const gets = parseAmount(fields.TakerGets)
      const pays = parseAmount(fields.TakerPays)
      const getsKey =
        gets.currency === currency
          ? gets.currency
          : gets.currency + "/" + gets.issuer
      const paysKey =
        pays.currency === currency
          ? pays.currency
          : pays.currency + "/" + pays.issuer
      let key = getsKey + ":" + paysKey

      if (tx.transaction.Flags & LEDGER_FLAGS.offer.Sell) {
        // sell
        key = paysKey + ":" + getsKey
      } else {
        // buy
        key = getsKey + ":" + paysKey
      }
      books[key] = 1
    }
    return Object.keys(books)
  }

  const AmountNegate = amount => {
    if (!amount) return amount
    return {
      value: String(-new Bignumber(amount.value)),
      currency: amount.currency,
      issuer: amount.issuer
    }
  }

  const AmountAdd = (amount1, amount2) => {
    if (!amount1) return amount2
    if (!amount2) return amount1
    if (amount1 && amount2) {
      return {
        value: String(new Bignumber(amount1.value).plus(amount2.value)),
        currency: amount1.currency,
        issuer: amount1.issuer
      }
    }
    return null
  }

  const AmountSubtract = (amount1, amount2) => {
    return AmountAdd(amount1, AmountNegate(amount2))
  }

  const AmountRatio = (amount1, amount2) => {
    return String(new Bignumber(amount1.value).dividedBy(amount2.value))
  }

  const getPrice = (effect, funded) => {
    const g = effect.got ? effect.got : effect.pays
    const p = effect.paid ? effect.paid : effect.gets
    if (!funded) {
      return AmountRatio(g, p)
    } else {
      return AmountRatio(p, g)
    }
  }

  /**
   * process transaction in view of account
   * get basic transaction information,
   *   and transaction effects
   *
   * @param txn
   * @param account
   */
  const processTx = (txn, account) => {
    const tx = txn.tx || txn.transaction || txn
    const meta = txn.meta
    // basic information
    const result: any = {}
    result.date = (tx.date || tx.Timestamp) + 0x386d4380 // unix time
    result.hash = tx.hash
    result.type = txnType(tx, account)
    result.fee = String(Number(tx.Fee) / 1000000.0)
    // if(tx.TransactionType !== 'RelationSet')
    result.result = meta ? meta.TransactionResult : "failed"
    result.memos = []
    const l = []
    switch (result.type) {
      case "sent":
        result.counterparty = tx.Destination
        result.amount = parseAmount(tx.Amount)
        break
      case "received":
        result.counterparty = tx.Account
        result.amount = parseAmount(tx.Amount)
        break
      case "trusted":
        result.counterparty = tx.Account
        result.amount = reverseAmount(tx.LimitAmount, tx.Account)
        break
      case "trusting":
        result.counterparty = tx.LimitAmount.issuer
        result.amount = tx.LimitAmount
        break
      case "convert":
        result.spent = parseAmount(tx.SendMax)
        result.amount = parseAmount(tx.Amount)
        break
      case "offernew":
        result.offertype = tx.Flags & Flags.OfferCreate.Sell ? "sell" : "buy"
        result.gets = parseAmount(tx.TakerGets)
        result.pays = parseAmount(tx.TakerPays)
        result.seq = tx.Sequence
        break
      case "offercancel":
        result.offerseq = tx.Sequence
        break
      case "relationset":
        result.counterparty = account === tx.Target ? tx.Account : tx.Target
        result.relationtype = tx.RelationType === 3 ? "freeze" : "authorize"
        result.isactive = account === tx.Target ? false : true
        result.amount = parseAmount(tx.LimitAmount)
        break
      case "relationdel":
        result.counterparty = account === tx.Target ? tx.Account : tx.Target
        result.relationtype = tx.RelationType === 3 ? "unfreeze" : "unknown"
        result.isactive = account === tx.Target ? false : true
        result.amount = parseAmount(tx.LimitAmount)
        break
      case "configcontract":
        result.params = formatArgs(tx.Args)
        if (tx.Method === 0) {
          result.method = "deploy"
          result.payload = tx.Payload
        } else if (tx.Method === 1) {
          result.method = "call"
          result.destination = tx.Destination
        }
        break
      case "alethcontract":
        if (tx.Method === 0) {
          result.method = "deploy"
          result.seq = tx.Sequence
          result.payload = tx.Payload
        } else if (tx.Method === 1) {
          result.method = "call"
          result.seq = tx.Sequence
          result.destination = tx.Destination
          result.amount = Number(tx.Amount)
          const method = hexToString(tx.MethodSignature)
          result.func = method.substring(0, method.indexOf("(")) // 函数名
          result.func_parms = method
            .substring(method.indexOf("(") + 1, method.indexOf(")"))
            .split(",") // 函数参数
          if (result.func_parms.length === 1 && result.func_parms[0] === "") {
            // 没有参数，返回空数组
            result.func_parms = []
          }
        }
        break
      case "brokerage":
        result.feeAccount = tx.FeeAccountID
        result.mol = parseInt(tx.OfferFeeRateNum, 16)
        result.den = parseInt(tx.OfferFeeRateDen, 16)
        result.amount = parseAmount(tx.Amount)
        result.seq = tx.Sequence
        break
      case "signerlistset":
        tx.SignerEntries.forEach(s => {
          l.push({
            account: s.SignerEntry.Account,
            weight: s.SignerEntry.SignerWeight
          })
        })
        result.threshold = tx.SignerQuorum
        result.lists = l
        result.seq = tx.Sequence
        break
      default:
        // TODO parse other type
        break
    }
    if (tx.Signers) {
      // 添加签名列表
      result.signers = []
      tx.Signers.forEach(s => result.signers.push(s.Signer.Account))
    }
    // add memo
    if (Array.isArray(tx.Memos) && tx.Memos.length > 0) {
      for (const m of tx.Memos) {
        const memo = m.Memo
        for (const property in memo) {
          try {
            memo[property] = utf8.decode(hexToString(memo[property]))
          } catch (e) {
            // TODO to unify to utf8
            // memo[property] = memo[property];
          }
        }
        result.memos.push(memo)
      }
    }
    result.effects = []
    // no effect, return now
    if (!meta || meta.TransactionResult !== "tesSUCCESS") {
      return result
    }
    let cos = [] // cos.length求出几类货币撮合
    let getsValue = 0 // 实际对方获得的
    let paysValue = 0 // 实际对方支付的
    let totalRate = 0 // 一共收取的挂单手续费

    if (result.gets) {
      cos.push(result.gets.currency)
      cos.push(result.pays.currency)
    }
    result.balances = {} // 存放交易后余额
    result.balancesPrev = {} // 存放交易前余额

    // process effects
    meta.AffectedNodes.forEach(n => {
      const node = processAffectNode(n)
      const effect: any = {}
      /**
       * TODO now only get offer related effects, need to process other entry type
       */
      if (node && node.entryType === "Offer") {
        // for new and cancelled offers
        let fieldSet = node.fields
        const sell = node.fields.Flags & LEDGER_FLAGS.offer.Sell

        // current account offer
        if (node.fields.Account === account) {
          // 1. offer_partially_funded
          if (
            node.diffType === "ModifiedNode" ||
            (node.diffType === "DeletedNode" &&
              node.fieldsPrev.TakerGets &&
              !isAmountZero(parseAmount(node.fieldsFinal.TakerGets)))
          ) {
            effect.effect = "offer_partially_funded"
            effect.counterparty = {
              account: tx.Account,
              seq: tx.Sequence,
              hash: tx.hash
            }
            if (node.diffType !== "DeletedNode") {
              // TODO no need partially funded must remains offers
              effect.remaining = !isAmountZero(
                parseAmount(node.fields.TakerGets)
              )
            } else {
              effect.cancelled = true
            }
            effect.gets = parseAmount(fieldSet.TakerGets)
            effect.pays = parseAmount(fieldSet.TakerPays)
            effect.got = AmountSubtract(
              parseAmount(node.fieldsPrev.TakerPays),
              parseAmount(node.fields.TakerPays)
            )
            effect.paid = AmountSubtract(
              parseAmount(node.fieldsPrev.TakerGets),
              parseAmount(node.fields.TakerGets)
            )
            effect.type = sell ? "sold" : "bought"
            if (node.fields.OfferFeeRateNum) {
              effect.platform = node.fields.Platform
              effect.rate = new Bignumber(
                parseInt(node.fields.OfferFeeRateNum, 16)
              )
                .div(parseInt(node.fields.OfferFeeRateDen, 16))
                .toNumber()
            }
          } else {
            // offer_funded, offer_created or offer_cancelled offer effect
            effect.effect =
              node.diffType === "CreatedNode"
                ? "offer_created"
                : node.fieldsPrev.TakerPays
                ? "offer_funded"
                : "offer_cancelled"
            // 2. offer_funded
            if (effect.effect === "offer_funded") {
              fieldSet = node.fieldsPrev
              effect.counterparty = {
                account: tx.Account,
                seq: tx.Sequence,
                hash: tx.hash
              }
              effect.got = AmountSubtract(
                parseAmount(node.fieldsPrev.TakerPays),
                parseAmount(node.fields.TakerPays)
              )
              effect.paid = AmountSubtract(
                parseAmount(node.fieldsPrev.TakerGets),
                parseAmount(node.fields.TakerGets)
              )
              effect.type = sell ? "sold" : "bought"
              if (node.fields.OfferFeeRateNum) {
                effect.platform = node.fields.Platform
                effect.rate = new Bignumber(
                  parseInt(node.fields.OfferFeeRateNum, 16)
                )
                  .div(parseInt(node.fields.OfferFeeRateDen, 16))
                  .toNumber()
              }
            }
            // 3. offer_created
            if (effect.effect === "offer_created") {
              effect.gets = parseAmount(fieldSet.TakerGets)
              effect.pays = parseAmount(fieldSet.TakerPays)
              effect.type = sell ? "sell" : "buy"
              if (node.fields.OfferFeeRateNum) {
                effect.platform = fieldSet.Platform
                effect.rate = new Bignumber(
                  parseInt(node.fields.OfferFeeRateNum, 16)
                )
                  .div(parseInt(node.fields.OfferFeeRateDen, 16))
                  .toNumber()
              }
            }
            // 4. offer_cancelled
            if (effect.effect === "offer_cancelled") {
              effect.hash = node.fields.PreviousTxnID
              // collect data for cancel transaction type
              if (result.type === "offercancel") {
                result.gets = parseAmount(fieldSet.TakerGets)
                result.pays = parseAmount(fieldSet.TakerPays)
              }
              effect.gets = parseAmount(fieldSet.TakerGets)
              effect.pays = parseAmount(fieldSet.TakerPays)
              effect.type = sell ? "sell" : "buy"
              if (node.fields.OfferFeeRateNum) {
                effect.platform = fieldSet.Platform
                effect.rate = new Bignumber(
                  parseInt(node.fields.OfferFeeRateNum, 16)
                )
                  .div(parseInt(node.fields.OfferFeeRateDen, 16))
                  .toNumber()
              }
            }
          }
          effect.seq = node.fields.Sequence
        } else if (tx.Account === account && !isEmpty(node.fieldsPrev)) {
          // 5. offer_bought
          effect.effect = "offer_bought"
          effect.counterparty = {
            account: node.fields.Account,
            seq: node.fields.Sequence,
            hash: node.PreviousTxnID || node.fields.PreviousTxnID
          }
          effect.paid = AmountSubtract(
            parseAmount(node.fieldsPrev.TakerPays),
            parseAmount(node.fields.TakerPays)
          )
          effect.got = AmountSubtract(
            parseAmount(node.fieldsPrev.TakerGets),
            parseAmount(node.fields.TakerGets)
          )
          effect.type = sell ? "bought" : "sold"
        }
        // add price
        if ((effect.gets && effect.pays) || (effect.got && effect.paid)) {
          const created =
            effect.effect === "offer_created" && effect.type === "buy"
          const funded =
            effect.effect === "offer_funded" && effect.type === "bought"
          const cancelled =
            effect.effect === "offer_cancelled" && effect.type === "buy"
          const bought =
            effect.effect === "offer_bought" && effect.type === "bought"
          const partially_funded =
            effect.effect === "offer_partially_funded" &&
            effect.type === "bought"
          effect.price = getPrice(
            effect,
            created || funded || cancelled || bought || partially_funded
          )
        }
      }
      if (
        result.type === "offereffect" &&
        node &&
        node.entryType === "AccountRoot"
      ) {
        if (node.fields.RegularKey === account) {
          effect.effect = "set_regular_key"
          effect.type = "null"
          effect.account = node.fields.Account
          effect.regularkey = account
        }
      }
      if (node && node.entryType === "Brokerage") {
        result.platform = node.fields.Platform
        result.rate = new Bignumber(parseInt(node.fields.OfferFeeRateNum, 16))
          .div(parseInt(node.fields.OfferFeeRateDen, 16))
          .toNumber()
      }
      if (node && node.entryType === "SkywellState") {
        // 其他币种余额
        if (
          node.fields.HighLimit.issuer === account ||
          node.fields.LowLimit.issuer === account
        ) {
          result.balances[node.fields.Balance.currency] = Math.abs(
            node.fields.Balance.value
          )
          if (node.fieldsPrev.Balance) {
            result.balancesPrev[node.fieldsPrev.Balance.currency] = Math.abs(
              node.fieldsPrev.Balance.value
            )
          } else if (node.fieldsNew.Balance) {
            // 新增币种
            result.balancesPrev[node.fields.Balance.currency] = 0
          } else {
            delete result.balances[node.fields.Balance.currency]
          }
        }
      }
      if (node && node.entryType === "AccountRoot") {
        // 基础币种余额
        if (node.fields.Account === account) {
          result.balances[getCurrency()] = node.fields.Balance / 1000000
          if (node.fieldsPrev.Balance) {
            result.balancesPrev[getCurrency()] = Math.abs(
              node.fieldsPrev.Balance / 1000000
            )
          } else if (node.fieldsNew.Balance) {
            result.balancesPrev[getCurrency()] = 0
          } else {
            // 交易前后余额没有变化
            delete result.balances[getCurrency()]
          }
        }
      }
      // add effect
      if (!isEmpty(effect)) {
        if (
          node.diffType === "DeletedNode" &&
          effect.effect !== "offer_bought"
        ) {
          effect.deleted = true
        }
        result.effects.push(effect)
      }
      if (result.type === "offernew" && effect.got) {
        if (result.gets.currency === effect.paid.currency) {
          getsValue = new Bignumber(effect.paid.value)
            .plus(getsValue)
            .toNumber()
        }
        if (result.pays.currency === effect.got.currency) {
          paysValue = new Bignumber(effect.got.value).plus(paysValue).toNumber()
        }
        if (
          result.gets.currency !== effect.paid.currency ||
          result.pays.currency !== effect.got.currency
        ) {
          if (cos.indexOf(effect.got.currency) === -1)
            cos.push(effect.got.currency)
          if (cos.indexOf(effect.paid.currency) === -1)
            cos.push(effect.paid.currency)
        }
      }
    })

    /**
     * TODO check cross gateway when parse more effect, specially trust related effects, now ignore it
     *
     */
    for (const e of result.effects) {
      if (result.rate && e.effect === "offer_bought") {
        if (e.got && result.pays && e.got.currency === result.pays.currency)
          // 涉及多路径
          totalRate = new Bignumber(e.got.value)
            .multipliedBy(result.rate)
            .plus(totalRate)
            .toNumber()
        e.rate = result.rate
        e.got.value = e.got.value * (1 - e.rate)
        e.platform = result.platform
        e.got.value = new Bignumber(e.got.value)
          .multipliedBy(1 - e.rate)
          .toString()
      }
      if (
        e.rate &&
        (e.effect === "offer_funded" || e.effect === "offer_partially_funded")
      ) {
        // 不涉及多路径
        totalRate = new Bignumber(e.got.value)
          .multipliedBy(e.rate)
          .plus(totalRate)
          .toNumber()
        e.got.value = new Bignumber(e.got.value)
          .multipliedBy(1 - e.rate)
          .toString()
      }
    }
    delete result.rate
    delete result.platform
    if (getsValue) {
      result.dealGets = {
        value: getsValue + "",
        currency: result.gets.currency,
        issuer: result.gets.issuer || ""
      }
      result.dealPays = {
        value: paysValue + "",
        currency: result.pays.currency,
        issuer: result.pays.issuer || ""
      }
      result.totalRate = {
        value: totalRate + "",
        currency: result.pays.currency,
        issuer: result.pays.issuer || ""
      }
      result.dealPrice =
        result.offertype === "sell"
          ? new Bignumber(paysValue).div(getsValue).toString()
          : new Bignumber(getsValue).div(paysValue).toString()
      result.dealNum = cos.length
    }
    getsValue = null
    paysValue = null
    cos = null
    totalRate = null
    return result
  }

  const parseKey = key => {
    const parts = key.split(":")
    if (parts.length !== 2) return null
    const currency = getCurrency()

    const parsePart = part => {
      if (part === currency) {
        return {
          currency,
          issuer: ""
        }
      }
      const _parts = part.split("/")
      if (_parts.length !== 2) return null
      if (!isValidCurrency(_parts[0])) return null
      if (!Wallet.isValidAddress(_parts[1])) return null
      return {
        currency: _parts[0],
        issuer: _parts[1]
      }
    }

    const gets = parsePart(parts[0])
    const pays = parsePart(parts[1])
    if (!gets || !pays) return null
    return {
      gets,
      pays
    }
  }

  /**
   * return string if swt amount
   * @param amount
   * @returns {Amount}
   */
  const ToAmount = amount => {
    if (amount.value && Number(amount.value) > 100000000000) {
      return new Error("invalid amount: amount's maximum value is 100000000000")
    }
    const currency = getCurrency()
    if (amount.currency === currency) {
      // return String(parseInt((new BigNumber(amount.value)).mul(1000000.0)))
      return String(
        parseInt(
          new Bignumber(amount.value).multipliedBy(1000000.0).toString(),
          10
        )
      )
    }
    return amount
  }

  const MaxAmount = amount => {
    if (typeof amount === "string" && Number(amount)) {
      const _amount = parseInt(String(Number(amount) * 1.0001), 10)
      return String(_amount)
    }
    if (typeof amount === "object" && isValidAmount(amount)) {
      const _value = Number(amount.value) * 1.0001
      amount.value = String(_value)
      return amount
    }
    return new Error("invalid amount to max")
  }

  return {
    isValidAmount,
    isValidAmount0,
    parseAmount,
    isValidCurrency,
    isValidHash,
    isValidAddress: Wallet.isValidAddress,
    isValidSecret: Wallet.isValidSecret,
    affectedAccounts,
    affectedBooks,
    processTx,
    LEDGER_STATES,
    // for jcc
    // getChains,
    getCurrency,
    getFee,
    parseKey,
    // from remote
    ToAmount,
    // from transaction
    MaxAmount,
    hexToString,
    stringToHex,
    // from contract
    string2Hex,
    number2Hex,
    hex2Number,
    getTypes,
    // toolset
    makeCurrency,
    makeAmount
  }
}

const utils = Factory()
export { Factory, utils }
