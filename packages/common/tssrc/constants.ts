export const CURRENCY_RE = /^([a-zA-Z0-9]{3,6}|[A-F0-9]{40})$/
export const HASH_RE = /^[A-F0-9]{64}$/
export const NODE_TYPES = ["CreatedNode", "ModifiedNode", "DeletedNode"]

export const ZERO =
  "0000000000000000000000000000000000000000000000000000000000000000"

export const ACCOUNT_ID_ZERO = ZERO.substr(0, 40)
export const ACCOUNT_ID_ONE = ZERO.substr(0, 39) + "1"

export const HASHPREFIX = {
  transactionID: 0x54584e00, // 事务哈希
  // transaction plus metadata
  transaction: 0x534e4400,
  // account state
  accountStateEntry: 0x4d4c4e00,
  // inner node in tree
  innerNode: 0x4d494e00,
  // ledger master data for signing
  ledgerHeader: 0x4c575200,
  // inner transaction to sign
  transactionSig: 0x53545800, // 单签
  // inner transaction to sign
  transactionMultiSig: 0x534d5400, // 多签
  // validation for signing
  validation: 0x56414c00,
  // proposal for signing
  proposal: 0x50525000,
  // payment channel claim
  paymentChannelClaim: 0x434c4d00
}

export const CHAINS = [
  {
    code: "bitcoin",
    currency: "BTC",
    simple: true,
    ACCOUNT_ALPHABET:
      "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
  },
  {
    code: "ripple",
    currency: "XRP",
    simple: true,
    ACCOUNT_ALPHABET:
      "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz"
  },
  {
    code: "stellar",
    currency: "XLM",
    simple: true,
    ACCOUNT_ALPHABET:
      "gsphnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCr65jkm8oFqi1tuvAxyz"
  },
  {
    code: "call",
    currency: "CALL",
    ACCOUNT_ALPHABET:
      "cpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2brdeCg65jkm8oFqi1tuvAxyz"
  },
  {
    code: "stream",
    currency: "STM",
    ACCOUNT_ALPHABET:
      "vpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1turAxyz"
  },
  {
    code: "jingtum",
    currency: "SWT",
    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    CURRENCIES: {
      CNT: "CNY",
      JCC: "JJCC",
      SLASH: "JSLASH",
      MOAC: "JMOAC",
      CALL: "JCALL",
      EKT: "JEKT",
      ETH: "JETH"
    },
    XLIB: {
      default_ws: "ws.bcapps.ca:5020",
      default_api: "api.bcapps.ca:5080",
      default_ws_failover: "ws-failover.bcapps.ca:5020",
      default_api_failover: "api-failover.bcapps.ca:5080"
    },
    ACCOUNT_ALPHABET:
      "jpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65rkm8oFqi1tuvAxyz",
    SEED_PREFIX: 33,
    ACCOUNT_PREFIX: 0,
    ACCOUNT_ZERO: "jjjjjjjjjjjjjjjjjjjjjhoLvTp",
    ACCOUNT_ONE: "jjjjjjjjjjjjjjjjjjjjBZbvri",
    fee: 10000
  },
  {
    code: "guomi",
    guomi: true,
    currency: "SWT",
    issuer: "jnACoGYBQEy2nmhFPfD19Fvxy8Ef7rgT51",
    CURRENCIES: {
      CNT: "CNY"
    },
    ACCOUNT_ALPHABET:
      "jpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65rkm8oFqi1tuvAxyz",
    SEED_PREFIX: 33,
    ACCOUNT_PREFIX: 0,
    ACCOUNT_ZERO: "jjjjjjjjjjjjjjjjjjjjjn1TT5q",
    ACCOUNT_ONE: "jjjjjjjjjjjjjjjjjjjjwVBfmE",
    fee: 10000
  },
  {
    code: "bizain",
    currency: "BWT",
    issuer: "bf42S78serP2BeSx7HGtwQR2QASYaHVqyb",
    XLIB: {
      default_ws: "ws-bwt.bcapps.ca:5020",
      default_api: "api-bwt.bcapps.ca:5080",
      default_ws_failover: "ws-bwt-failover.bcapps.ca:5020",
      default_api_failover: "api-bwt-failover.bcapps.ca:5080"
    },
    ACCOUNT_ALPHABET:
      "bpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2jcdeCg65rkm8oFqi1tuvAxyz",
    SEED_PREFIX: 33,
    ACCOUNT_PREFIX: 0,
    ACCOUNT_ZERO: "bbbbbbbbbbbbbbbbbbbbbhoLvTp",
    ACCOUNT_ONE: "bbbbbbbbbbbbbbbbbbbbBZjvri",
    fee: 10
  },
  {
    code: "bvcadt",
    currency: "BVC",
    ACCOUNT_ALPHABET:
      "bpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2rcdeCg65jkm8oFqi1tuvAxyz"
  },
  {
    code: "seaaps",
    currency: "SEAA",
    ACCOUNT_ALPHABET:
      "dpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcjeCg65rkm8oFqi1tuvAxyz",
    SEED_PREFIX: 33,
    ACCOUNT_PREFIX: 0,
    fee: 10000
  }
]
