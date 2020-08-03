/**
 * Codec class
 */

import baseCodec from "base-x"
// Pure JavaScript hash functions in the browser, native hash functions in Node.js
import createHash from "create-hash"
import {
  funcGetChain,
  funcSeqEqual as seqEqual,
  funcConcatArgs as concatArgs
} from "@swtc/common"

export class Codec {
  public sha256: (bytes: Uint8Array) => Buffer
  public alphabet: string
  public codec: any
  public base: number

  constructor(options: {
    sha256: (bytes: Uint8Array) => Buffer
    alphabet: string
  }) {
    this.sha256 = options.sha256
    this.alphabet = options.alphabet
    this.codec = baseCodec(this.alphabet)
    this.base = this.alphabet.length
  }

  /**
   * Encoder.
   *
   * @param bytes Buffer of data to encode.
   * @param opts Options object including the version bytes and the expected length of the data to encode.
   */
  public encode(
    bytes: Buffer,
    opts: {
      versions: number[]
      expectedLength: number
    }
  ): string {
    const versions = opts.versions
    return this.encodeVersioned(bytes, versions, opts.expectedLength)
  }

  public encodeVersioned(
    bytes: Buffer,
    versions: number[],
    expectedLength: number
  ): string {
    if (expectedLength && bytes.length !== expectedLength) {
      throw new Error(
        "unexpected_payload_length: bytes.length does not match expectedLength"
      )
    }
    return this.encodeChecked(Buffer.from(concatArgs(versions, bytes)))
  }

  public encodeChecked(buffer: Buffer): string {
    const check = this.sha256(this.sha256(buffer)).slice(0, 4)
    return this.encodeRaw(Buffer.from(concatArgs(buffer, check)))
  }

  public encodeRaw(bytes: Buffer): string {
    return this.codec.encode(bytes)
  }

  /**
   * Decoder.
   *
   * @param base58string Base58Check-encoded string to decode.
   * @param opts Options object including the version byte(s) and the expected length of the data after decoding.
   */
  public decode(
    base58string: string,
    opts: {
      versions: (number | number[])[]
      expectedLength?: number
      versionTypes?: ["ed25519", "secp256k1"]
    }
  ): {
    version: number[]
    bytes: Buffer
    type: string | null
  } {
    const versions = opts.versions
    const types = opts.versionTypes

    const withoutSum = this.decodeChecked(base58string)

    if (versions.length > 1 && !opts.expectedLength) {
      throw new Error(
        "expectedLength is required because there are >= 2 possible versions"
      )
    }
    const versionLengthGuess =
      typeof versions[0] === "number" ? 1 : (versions[0] as number[]).length
    const payloadLength =
      opts.expectedLength || withoutSum.length - versionLengthGuess
    const versionBytes = withoutSum.slice(0, -payloadLength)
    const payload = withoutSum.slice(-payloadLength)

    for (let i = 0; i < versions.length; i++) {
      const version: number[] = Array.isArray(versions[i])
        ? (versions[i] as number[])
        : [versions[i] as number]
      if (seqEqual(versionBytes, version)) {
        return {
          version,
          bytes: payload,
          type: types ? types[i] : null
        }
      }
    }

    throw new Error(
      "version_invalid: version bytes do not match any of the provided version(s)"
    )
  }

  public decodeChecked(base58string: string): Buffer {
    const buffer = this.decodeRaw(base58string)
    if (buffer.length < 5) {
      throw new Error("invalid_input_size: decoded data must have length >= 5")
    }
    if (!this.verifyCheckSum(buffer)) {
      throw new Error("checksum_invalid")
    }
    return buffer.slice(0, -4)
  }

  public decodeRaw(base58string: string): Buffer {
    return this.codec.decode(base58string)
  }

  public verifyCheckSum(bytes: Buffer): boolean {
    const computed = this.sha256(this.sha256(bytes.slice(0, -4))).slice(0, 4)
    const checksum = bytes.slice(-4)
    return seqEqual(computed, checksum)
  }
}

/**
 * SWTC codec
 */

const NODE_PUBLIC = 28
const NODE_PRIVATE = 32
const ACCOUNT_ID = 0
const FAMILY_SEED = 0x21 // 33
const ED25519_SEED = [0x01, 0xe1, 0x4b] // [1, 225, 75]

export function Factory(chain_or_token = "jingtum") {
  let alphabet
  const active_chain = funcGetChain(chain_or_token)
  if (!active_chain) {
    // if it is not provided in SWTC_CHAINS
    throw new Error("the chain you specified is not available yet")
  } else {
    alphabet = active_chain.ACCOUNT_ALPHABET
  }
  const codecOptions = {
    sha256: (bytes: Uint8Array) =>
      createHash("sha256").update(Buffer.from(bytes)).digest(),
    alphabet
  }
  const codecWithAlphabet = new Codec(codecOptions)

  // entropy is a Buffer of size 16
  // type is 'ed25519' or 'secp256k1'
  const encodeSeed = (
    entropy: Buffer,
    type: "ed25519" | "secp256k1"
  ): string => {
    if (entropy.length !== 16) {
      throw new Error("entropy must have length 16")
    }
    const opts = {
      expectedLength: 16,
      // for secp256k1, use `FAMILY_SEED`
      versions: type === "ed25519" ? ED25519_SEED : [FAMILY_SEED]
    }
    // prefixes entropy with version bytes
    return codecWithAlphabet.encode(entropy, opts)
  }

  const decodeSeed = (
    seed: string,
    opts: {
      versionTypes: ["ed25519", "secp256k1"]
      versions: (number | number[])[]
      expectedLength: number
    } = {
      versionTypes: ["ed25519", "secp256k1"],
      versions: [ED25519_SEED, FAMILY_SEED],
      expectedLength: 16
    }
  ) => {
    return codecWithAlphabet.decode(seed, opts)
  }

  const isValidSeed = (seed: string): boolean => {
    try {
      decodeSeed(seed)
    } catch (e) {
      return false
    }
    return true
  }

  const encodeAccountID = (bytes: Buffer): string => {
    const opts = { versions: [ACCOUNT_ID], expectedLength: 20 }
    return codecWithAlphabet.encode(bytes, opts)
  }

  const decodeAccountID = (accountId: string): Buffer => {
    const opts = { versions: [ACCOUNT_ID], expectedLength: 20 }
    return codecWithAlphabet.decode(accountId, opts).bytes
  }

  const decodeNodePublic = (base58string: string): Buffer => {
    const opts = { versions: [NODE_PUBLIC], expectedLength: 33 }
    return codecWithAlphabet.decode(base58string, opts).bytes
  }

  const encodeNodePublic = (bytes: Buffer): string => {
    const opts = { versions: [NODE_PUBLIC], expectedLength: 33 }
    return codecWithAlphabet.encode(bytes, opts)
  }

  const decodeNodePrivate = (base58string: string): Buffer => {
    const opts = { versions: [NODE_PRIVATE], expectedLength: 32 }
    return codecWithAlphabet.decode(base58string, opts).bytes
  }

  const encodeNodePrivate = (bytes: Buffer): string => {
    const opts = { versions: [NODE_PRIVATE], expectedLength: 32 }
    return codecWithAlphabet.encode(bytes, opts)
  }
  const isValidClassicAddress = (address: string): boolean => {
    try {
      decodeAccountID(address)
    } catch (e) {
      return false
    }
    return true
  }

  return {
    chain: active_chain.code,
    codec: codecWithAlphabet,
    encode: codecWithAlphabet.encode,
    decode: codecWithAlphabet.decode,
    encodeSeed,
    decodeSeed,
    isValidSeed,
    encodeAccountID,
    decodeAccountID,
    encodeNodePublic,
    decodeNodePublic,
    encodeNodePrivate,
    decodeNodePrivate,
    isValidClassicAddress,
    isValidAddress: isValidClassicAddress,
    encodeAddress: encodeAccountID,
    decodeAddress: decodeAccountID
  }
}
