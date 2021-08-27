export type Sequence = number[] | Buffer | Uint8Array
import { ZERO, CHAINS } from "./constants"

// update to include new doc in publish

export function funcGetChain(chain_or_token: string): any {
  const chains = CHAINS.filter(
    chain =>
      chain.code.toLowerCase() === chain_or_token.toLowerCase() ||
      chain.currency.toUpperCase() === chain_or_token.toUpperCase()
  )
  if (chains.length > 1) {
    console.log(`!!!!!!!!!!more than one chains found, use first!!!!!!!!!!!!!`)
  }
  return chains.length > 0 ? chains[0] : undefined
}

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

// from utils
export function funcHexToString(h) {
  const a = []
  let i = 0
  if (h.length % 2) {
    a.push(String.fromCharCode(parseInt(h.substring(0, 1), 16)))
    i = 1
  }
  for (; i < h.length; i += 2) {
    a.push(String.fromCharCode(parseInt(h.substring(i, i + 2), 16)))
  }
  return a.join("")
}

export function funcStringToHex(s) {
  let result = ""
  for (const e of s) {
    const b = e.charCodeAt(0)
    result += b < 16 ? "0" + b.toString(16) : b.toString(16)
  }
  return result
}

export function funcString2Hex(s) {
  let result = funcStringToHex(s)
  if (result.length < 64) {
    result += ZERO.substr(result.length)
  }
  return result
}

export function funcNumber2Hex(n) {
  n = n.toString(16)
  return ZERO.substr(0, 64 - n.length) + n
}

export function funcHex2Number(h) {
  return parseInt(h, 16)
}

export function funcIsEmpty(value) {
  const type = typeof value
  if ((value !== null && type === "object") || type === "function") {
    const properties: any = Object.keys(value)
    if (properties.length === 0 || properties.size === 0) {
      return true
    }
  }
  return !value
}

export function funcAssert(condition: any, msg = "Assertion failed") {
  if (!condition) {
    throw new Error(msg)
  }
}
