export type Sequence = number[] | Buffer | Uint8Array

export function funcGetChain(chain_or_token: string): any {
  const chains = CHAINS.filter(
    chain =>
      chain.code.toLowerCase() === chain_or_token.toLowerCase() ||
      chain.currency.toUpperCase() === chain_or_token.toUpperCase()
  )
  return chains.length === 1 ? chains[0] : undefined
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
      default_ws: "ws.swtclib.ca:5020",
      default_api: "api.swtclib.ca:5080",
      default_ws_failover: "ws-failover.swtclib.ca:5020",
      default_api_failover: "api-failover.swtclib.ca:5080"
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
    XLIB: {
      default_ws: "ws-bwt.swtclib.ca:5020",
      default_api: "api-bwt.swtclib.ca:5080",
      default_ws_failover: "ws-bwt-failover.swtclib.ca:5020",
      default_api_failover: "api-bwt-failover.swtclib.ca:5080"
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
  }
]

/**
 * Check whether two sequences (e.g. arrays of numbers) are equal.
 *
 * @param arr1 One of the arrays to compare.
 * @param arr2 The other array to compare.
 */
export function funcSeqEqual(arr1: Sequence, arr2: Sequence): boolean {
  if (arr1.length !== arr2.length) {
    return false
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}

/**
 * Check whether a value is a sequence (e.g. array of numbers).
 *
 * @param val The value to check.
 */
function isSequence(val: Sequence | number): val is Sequence {
  return (val as Sequence).length !== undefined
}

/**
 * Concatenate all `arguments` into a single array. Each argument can be either
 * a single element or a sequence, which has a `length` property and supports
 * element retrieval via sequence[ix].
 *
 * > concatArgs(1, [2, 3], Buffer.from([4,5]), new Uint8Array([6, 7]));
 *  [1,2,3,4,5,6,7]
 *
 * @returns {number[]} Array of concatenated arguments
 */
export function funcConcatArgs(...args: (number | Sequence)[]): number[] {
  const ret: number[] = []

  args.forEach(arg => {
    if (isSequence(arg)) {
      for (const e of arg) {
        ret.push(e)
      }
    } else {
      ret.push(arg)
    }
  })
  return ret
}

// Convert a hex string to a byte array
export function funcHexToBytes(hex): any {
  const bytes = []
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16))
  }
  return bytes
}

// Convert a byte array to a hex string
export function funcBytesToHex(bytes): string {
  const hex = []
  for (const byte of bytes) {
    const current = byte < 0 ? byte + 256 : byte
    hex.push((current >>> 4).toString(16))
    hex.push((current & 0xf).toString(16))
  }
  return hex.join("").toUpperCase()
}
