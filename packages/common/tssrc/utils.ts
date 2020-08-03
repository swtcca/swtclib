import { CURRENCY_RE, HASH_RE, NODE_TYPES } from "./constants"
import { funcHexToString as hexToString } from "./functions"

export function formatArgs(args) {
  const newArgs = []
  if (args) {
    for (const arg of args) {
      newArgs.push(hexToString(arg.Arg.Parameter))
    }
  }
  return newArgs
}
/**
 * get meta node type
 * @param node
 * @returns {*}
 */
export function getTypeNode(node) {
  for (const type of NODE_TYPES) {
    if (node.hasOwnProperty(type)) {
      return node[type]
    }
  }
  return null
}

export function processAffectNode(an) {
  const result: any = {}
  NODE_TYPES.forEach(x => {
    if (an[x]) {
      result.diffType = x
    }
  })

  if (!result.diffType) return {}

  an = an[result.diffType]

  result.entryType = an.LedgerEntryType
  result.ledgerIndex = an.LedgerIndex

  result.fields = Object.assign(
    {},
    an.PreviousFields,
    an.NewFields,
    an.FinalFields
  )
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
export function affectedAccounts(tx) {
  const accounts = {}
  accounts[tx.transaction.Account] = 1

  if (tx.transaction.Destination) {
    accounts[tx.transaction.Destination] = 1
  }
  if (tx.transaction.LimitAmount) {
    accounts[tx.transaction.LimitAmount.issuer] = 1
  }
  const meta = tx.meta
  if (meta && meta.TransactionResult === "tesSUCCESS") {
    meta.AffectedNodes.forEach(n => {
      const node = processAffectNode(n)
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
export function getTypes(abi, foo) {
  try {
    const filtered = abi
      .filter(json => json.name === foo)
      .map(json => json.outputs.map(input => input.type))
      .map(types => types)
    return filtered ? filtered[0] : []
  } catch (error) {
    return []
  }
}

/**
 * hash check for currency
 * @param currency
 * @returns {boolean}
 */
export function isValidCurrency(currency) {
  if (!currency || typeof currency !== "string" || currency === "") {
    return false
  }
  return CURRENCY_RE.test(currency)
}

/**
 * hash check for tx and ledger hash
 * @param hash
 * @returns {boolean}
 */
export function isValidHash(hash) {
  if (!hash || typeof hash !== "string" || hash === "") {
    return false
  }
  return HASH_RE.test(hash)
}

/**
 * parse tx type to specific transaction type
 * @param tx
 * @param account
 * @returns {string}
 */
export function txnType(tx, account) {
  if (
    tx.Account === account ||
    tx.Target === account ||
    (tx.Destination && tx.Destination === account) ||
    (tx.LimitAmount && tx.LimitAmount.issuer === account) ||
    tx.BlackListAccountID === account
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
      case "SetBlackList": // 黑名单
      case "RemoveBlackList": // 解除黑名单
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
export function reverseAmount(amount, account) {
  return {
    value: String(-Number(amount.value)),
    currency: amount.currency,
    issuer: account
  }
}

export function isAmountZero(amount) {
  if (!amount) return false
  return Number(amount.value) < 1e-12
}
