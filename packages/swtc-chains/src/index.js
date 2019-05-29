"use strict"

const SWTC_CHAINS = [
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
    ACCOUNT_ALPHABET:
      "jpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65rkm8oFqi1tuvAxyz",
    SEED_PREFIX: 33,
    ACCOUNT_PREFIX: 0,
    ACCOUNT_ZERO: "jjjjjjjjjjjjjjjjjjjjjhoLvTp",
    ACCOUNT_ONE: "jjjjjjjjjjjjjjjjjjjjBZbvri",
    fee: 10000
  },
  {
    code: "bizain",
    currency: "BWT",
    issuer: "bf42S78serP2BeSx7HGtwQR2QASYaHVqyb",
    ACCOUNT_ALPHABET:
      "bpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2jcdeCg65rkm8oFqi1tuvAxyz",
    SEED_PREFIX: 33,
    ACCOUNT_PREFIX: 0,
    ACCOUNT_ZERO: "bbbbbbbbbbbbbbbbbbbbbhoLvTp",
    ACCOUNT_ONE: "bbbbbbbbbbbbbbbbbbbbBZjvri",
    fee: 10
  }
]

module.exports = SWTC_CHAINS
