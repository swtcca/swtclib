/**
 * Created by Administrator on 2016/11/20.
 */
var extend = require("extend")
var WalletFactory = require("swtc-wallet").Factory
var _extend = require("lodash/extend")
var _ = require("lodash")
var utf8 = require("utf8")
const SWTCCHAINS = require("swtc-chains")
var Bignumber = require("bignumber.js")

function Factory(Wallet = WalletFactory()) {
  if (!Wallet.hasOwnProperty("KeyPair")) {
    throw Error("utils needs a Wallet class")
  }

  // from jcc
  var getChains = function(chain_or_token = "SWT") {
    return SWTCCHAINS.filter(
      chain =>
        chain.code.toLowerCase === chain_or_token.toLowerCase() ||
        chain.currency.toLowerCase() === chain_or_token.toLowerCase()
    )
  }

  var getCurrency = Wallet.getCurrency

  var getFee = Wallet.getFee

  var getAccountZero = Wallet.getAccountZero

  var getAccountOne = Wallet.getAccountOne

  var makeCurrency = Wallet.makeCurrency

  var makeAmount = Wallet.makeAmount

  // Flags for ledger entries
  var LEDGER_FLAGS = {
    // Account Root
    account_root: {
      PasswordSpent: 0x00010000, // True, if password set fee is spent.
      RequireDestTag: 0x00020000, // True, to require a DestinationTag for payments.
      RequireAuth: 0x00040000, // True, to require a authorization to hold IOUs.
      DisallowSWT: 0x00080000, // True, to disallow sending SWT.
      DisableMaster: 0x00100000 // True, force regular key.
    },

    // Offer
    offer: {
      Passive: 0x00010000,
      Sell: 0x00020000 // True, offer was placed as a sell.
    },

    // Skywell State
    state: {
      LowReserve: 0x00010000, // True, if entry counts toward reserve.
      HighReserve: 0x00020000,
      LowAuth: 0x00040000,
      HighAuth: 0x00080000,
      LowNoSkywell: 0x00100000,
      HighNoSkywell: 0x00200000
    }
  }

  var Flags = {
    OfferCreate: {
      Passive: 0x00010000,
      ImmediateOrCancel: 0x00020000,
      FillOrKill: 0x00040000,
      Sell: 0x00080000
    }
  }

  function hexToString(h) {
    var a = []
    var i = 0

    if (h.length % 2) {
      a.push(String.fromCharCode(parseInt(h.substring(0, 1), 16)))
      i = 1
    }

    for (; i < h.length; i += 2) {
      a.push(String.fromCharCode(parseInt(h.substring(i, i + 2), 16)))
    }

    return a.join("")
  }

  function stringToHex(s) {
    var result = ""
    for (var i = 0; i < s.length; i++) {
      var b = s.charCodeAt(i)
      result += b < 16 ? "0" + b.toString(16) : b.toString(16)
    }
    return result
  }

  function string2Hex(s) {
    var zero =
      "0000000000000000000000000000000000000000000000000000000000000000"
    var result = ""
    for (var i = 0; i < s.length; i++) {
      var b = s.charCodeAt(i)
      result += b < 16 ? "0" + b.toString(16) : b.toString(16)
    }
    if (result.length < 64) result += zero.substr(result.length)
    return result
  }
  function number2Hex(n) {
    n = n.toString(16)
    var zero =
      "0000000000000000000000000000000000000000000000000000000000000000"
    return zero.substr(0, 64 - n.length) + n
  }
  function hex2Number(h) {
    return parseInt(h, 16)
  }

  /**
   * check {value: '', currency:'', issuer: ''}
   * @param amount
   * @returns {boolean}
   */
  function isValidAmount(amount) {
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
    let currency = getCurrency()
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
  function isValidAmount0(amount) {
    if (amount === null || typeof amount !== "object") {
      return false
    }
    // check amount currency
    if (!amount.currency || !isValidCurrency(amount.currency)) {
      return false
    }
    let currency = getCurrency()
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
  function parseAmount(amount) {
    if (typeof amount === "string" && !Number.isNaN(Number(amount))) {
      var value = String(new Bignumber(amount).dividedBy(1000000.0))
      let currency = getCurrency()
      return { value: value, currency: currency, issuer: "" }
    } else if (typeof amount === "object" && isValidAmount(amount)) {
      return amount
    } else {
      return null
    }
  }

  var CURRENCY_RE = /^([a-zA-Z0-9]{3,6}|[A-F0-9]{40})$/
  function isValidCurrency(currency) {
    if (!currency || typeof currency !== "string" || currency === "") {
      return false
    }
    return CURRENCY_RE.test(currency)
  }

  var LEDGER_STATES = ["current", "closed", "validated"]

  var HASH__RE = /^[A-F0-9]{64}$/
  /**
   * hash check for tx and ledger hash
   * @param hash
   * @returns {boolean}
   */
  function isValidHash(hash) {
    if (!hash || typeof hash !== "string" || hash === "") {
      return false
    }
    return HASH__RE.test(hash)
  }

  /**
   * get meta node type
   * @param node
   * @returns {*}
   */
  function getTypeNode(node) {
    var NODE_TYPES = ["CreatedNode", "ModifiedNode", "DeletedNode"]
    for (var index in NODE_TYPES) {
      var type = NODE_TYPES[index]
      if (node.hasOwnProperty(type)) {
        return node[type]
      }
    }
    return null
  }

  function processAffectNode(an) {
    var result = {}

    ;["CreatedNode", "ModifiedNode", "DeletedNode"].forEach(function(x) {
      if (an[x]) result.diffType = x
    })

    if (!result.diffType) return {}

    an = an[result.diffType]

    result.entryType = an.LedgerEntryType
    result.ledgerIndex = an.LedgerIndex

    result.fields = _extend({}, an.PreviousFields, an.NewFields, an.FinalFields)
    result.fieldsPrev = an.PreviousFields || {}
    result.fieldsNew = an.NewFields || {}
    result.fieldsFinal = an.FinalFields || {}
    result.PreviousTxnID = an.PreviousTxnID

    return result
  }

  /**
   * get effect accounts
   * @param data
   * @returns {Array}
   */
  function affectedAccounts(tx) {
    var accounts = {}
    accounts[tx.transaction.Account] = 1

    if (tx.transaction.Destination) {
      accounts[tx.transaction.Destination] = 1
    }
    if (tx.transaction.LimitAmount) {
      accounts[tx.transaction.LimitAmount.issuer] = 1
    }
    var meta = tx.meta
    if (meta && meta.TransactionResult === "tesSUCCESS") {
      meta.AffectedNodes.forEach(function(n) {
        var node = processAffectNode(n)
        if (node.entryType === "AccountRoot" && node.fields.Account) {
          accounts[node.fields.Account] = 1
        }
        if (node.entryType === "SkywellState") {
          if (node.fields.HighLimit.issuer) {
            accounts[node.fields.HighLimit.issuer] = 1
          }
          if (node.fields.LowLimit.issuer) {
            accounts[node.fields.LowLimit.issuer] = 1
          }
        }
        if (node.entryType === "Offer" && node.fields.Account) {
          accounts[node.fields.Account] = 1
        }
      })
    }

    return Object.keys(accounts)
  }

  /**
   * get affect order book
   * @param tx
   * @returns {Array}
   */
  function affectedBooks(tx) {
    var data = tx.meta
    if (typeof data !== "object") return []
    if (!Array.isArray(data.AffectedNodes)) return []

    let currency = getCurrency()
    var books = {}
    for (var i = 0; i < data.AffectedNodes.length; ++i) {
      var node = getTypeNode(data.AffectedNodes[i])
      if (!node || node.LedgerEntryType !== "Offer") {
        continue
      }
      var fields = extend(
        {},
        node.PreviousFields,
        node.NewFields,
        node.FinalFields
      )
      var gets = parseAmount(fields.TakerGets)
      var pays = parseAmount(fields.TakerPays)
      var getsKey =
        gets.currency === currency
          ? gets.currency
          : gets.currency + "/" + gets.issuer
      var paysKey =
        pays.currency === currency
          ? pays.currency
          : pays.currency + "/" + pays.issuer
      var key = getsKey + ":" + paysKey

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

  /**
   * parse tx type to specific transaction type
   * @param tx
   * @param account
   * @returns {string}
   */
  function txnType(tx, account) {
    if (
      tx.Account === account ||
      tx.Target === account ||
      (tx.Destination && tx.Destination === account) ||
      (tx.LimitAmount && tx.LimitAmount.issuer === account)
    ) {
      switch (tx.TransactionType) {
        case "Payment": // 支付类
          return tx.Account === account
            ? tx.Destination === account
              ? "convert"
              : "sent"
            : "received"
        case "OfferCreate": // 创建挂单类
          return "offernew"
        case "OfferCancel": // 取消挂单类
          return "offercancel"
        case "TrustSet": // 设置信任线
          return tx.Account === account ? "trusting" : "trusted"
        case "RelationDel":
        case "AccountSet":
        case "SetRegularKey":
        case "RelationSet":
        case "SignSet":
        case "Operation":
        case "ConfigContract": // lua版本合约类
        case "AlethContract": // solidity版本合约类
        case "Brokerage": // 设置手续费类
        case "SignerListSet": // 签名列表类
          // TODO to sub-class tx type
          return tx.TransactionType.toLowerCase()
        default:
          // TODO CHECK
          return "unknown"
      }
    } else {
      return "offereffect"
    }
  }

  /**
   * get counterparty amount
   * @param amount
   * @param account
   * @returns {{value: string, currency: *, issuer: *}}
   */
  function reverseAmount(amount, account) {
    return {
      value: String(-Number(amount.value)),
      currency: amount.currency,
      issuer: account
    }
  }

  function isAmountZero(amount) {
    if (!amount) return false
    return Number(amount.value) < 1e-12
  }

  function AmountNegate(amount) {
    if (!amount) return amount
    return {
      value: String(-new Bignumber(amount.value)),
      currency: amount.currency,
      issuer: amount.issuer
    }
  }

  function AmountAdd(amount1, amount2) {
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

  function AmountSubtract(amount1, amount2) {
    return AmountAdd(amount1, AmountNegate(amount2))
  }

  function AmountRatio(amount1, amount2) {
    return String(new Bignumber(amount1.value).dividedBy(amount2.value))
  }

  function getPrice(effect, funded) {
    var g = effect.got ? effect.got : effect.pays
    var p = effect.paid ? effect.paid : effect.gets
    if (!funded) {
      return AmountRatio(g, p)
    } else {
      return AmountRatio(p, g)
    }
  }
  function formatArgs(args) {
    var newArgs = []
    if (args)
      for (var i = 0; i < args.length; i++) {
        newArgs.push(hexToString(args[i].Arg.Parameter))
      }
    return newArgs
  }
  /**
   * process transaction in view of account
   * get basic transaction information,
   *   and transaction effects
   *
   * @param txn
   * @param account
   */
  function processTx(txn, account) {
    var tx = txn.tx || txn.transaction || txn,
      meta = txn.meta
    // basic information
    var result = {}
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
          var method = hexToString(tx.MethodSignature)
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
        tx.SignerEntries.forEach(function(s) {
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
      tx.Signers.forEach(function(s) {
        result.signers.push(s.Signer.Account)
      })
    }
    // add memo
    if (Array.isArray(tx.Memos) && tx.Memos.length > 0) {
      for (var m = 0; m < tx.Memos.length; ++m) {
        var memo = tx.Memos[m].Memo
        for (var property in memo) {
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
    meta.AffectedNodes.forEach(function(n) {
      var node = processAffectNode(n)
      var effect = {}
      /**
       * TODO now only get offer related effects, need to process other entry type
       */
      if (node && node.entryType === "Offer") {
        // for new and cancelled offers
        var fieldSet = node.fields
        var sell = node.fields.Flags & LEDGER_FLAGS.offer.Sell

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
        }
        // 5. offer_bought
        else if (tx.Account === account && !_.isEmpty(node.fieldsPrev)) {
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
          var created =
            effect.effect === "offer_created" && effect.type === "buy"
          var funded =
            effect.effect === "offer_funded" && effect.type === "bought"
          var cancelled =
            effect.effect === "offer_cancelled" && effect.type === "buy"
          var bought =
            effect.effect === "offer_bought" && effect.type === "bought"
          var partially_funded =
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
      if (!_.isEmpty(effect)) {
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
    for (var i = 0; i < result.effects.length; i++) {
      var e = result.effects[i]
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

  function arraySet(count, value) {
    var a = new Array(count)

    for (var i = 0; i < count; i++) {
      a[i] = value
    }

    return a
  }

  var parseKey = function(key) {
    var parts = key.split(":")
    if (parts.length !== 2) return null
    var currency = getCurrency()

    function parsePart(part) {
      if (part === currency) {
        return {
          currency: currency,
          issuer: ""
        }
      }
      var _parts = part.split("/")
      if (_parts.length !== 2) return null
      if (!isValidCurrency(_parts[0])) return null
      if (!Wallet.isValidAddress(_parts[1], currency)) return null
      return {
        currency: _parts[0],
        issuer: _parts[1]
      }
    }

    var gets = parsePart(parts[0])
    var pays = parsePart(parts[1])
    if (!gets || !pays) return null
    return {
      gets: gets,
      pays: pays
    }
  }

  /**
   * return string if swt amount
   * @param amount
   * @returns {Amount}
   */
  function ToAmount(amount) {
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

  function MaxAmount(amount) {
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

  function getTypes(abi, foo) {
    try {
      let filtered = abi
        .filter(function(json) {
          return json.name === foo
        })
        .map(function(json) {
          return json.outputs.map(function(input) {
            return input.type
          })
        })
        .map(function(types) {
          return types
        })
      return filtered ? filtered[0] : []
    } catch (error) {
      return []
    }
  }

  return {
    hexToString,
    stringToHex,
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
    ACCOUNT_ZERO: Wallet.getAccountZero(),
    ACCOUNT_ONE: Wallet.getAccountOne(),
    arraySet,
    // for jcc
    getChains,
    getCurrency,
    getFee,
    getAccountZero,
    getAccountOne,
    parseKey,
    // from remote
    ToAmount,
    // from transaction
    MaxAmount,
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
module.exports = { Factory, utils: Factory() }
