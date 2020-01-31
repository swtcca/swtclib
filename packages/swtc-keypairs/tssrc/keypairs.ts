import assert from "assert"
import brorand from "brorand"
import hashjs from "hash.js"
import { eddsa, ec } from "elliptic"

import { Factory as AddressCodecFactory } from "@swtc/address-codec"
import {
  funcHexToBytes as hexToBytes,
  funcBytesToHex as bytesToHex
} from "@swtc/common"
import { derivePrivateKey, accountPublicFromPublicGenerator } from "./secp256k1"
import { computePublicKeyHash } from "./utils"

const Ed25519 = eddsa("ed25519")
const Secp256k1 = ec("secp256k1")

function hash(message) {
  return hashjs
    .sha512()
    .update(message)
    .digest()
    .slice(0, 32)
}

const secp256k1 = {
  deriveKeypair: (entropy, options: any = {}) => {
    const prefix = "00"
    const privateKey =
      prefix +
      derivePrivateKey(entropy, options)
        .toString(16, 64)
        .toUpperCase()
    const publicKey = bytesToHex(
      Secp256k1.keyFromPrivate(privateKey.slice(2))
        .getPublic()
        .encodeCompressed()
    )
    return { privateKey, publicKey }
  },
  sign: (message, privateKey) => {
    return bytesToHex(
      Secp256k1.sign(hash(message), hexToBytes(privateKey), {
        canonical: true
      }).toDER()
    )
  },
  verify: (message, signature, publicKey) => {
    return Secp256k1.verify(hash(message), signature, hexToBytes(publicKey))
  },
  signTx: (message, privateKey) => {
    return bytesToHex(
      Secp256k1.sign(message, hexToBytes(privateKey), {
        canonical: true
      }).toDER()
    )
  },
  verifyTx: (message, signature, publicKey) => {
    return Secp256k1.verify(message, signature, hexToBytes(publicKey))
  }
}

const ed25519 = {
  deriveKeypair: entropy => {
    const prefix = "ED"
    const rawPrivateKey = hash(entropy)
    const privateKey = prefix + bytesToHex(rawPrivateKey)
    const publicKey =
      prefix + bytesToHex(Ed25519.keyFromSecret(rawPrivateKey).pubBytes())
    return { privateKey, publicKey }
  },
  sign: (message, privateKey) => {
    // caution: Ed25519.sign interprets all strings as hex, stripping
    // any non-hex characters without warning
    assert(Array.isArray(message), "message must be array of octets")
    return bytesToHex(
      Ed25519.sign(message, hexToBytes(privateKey).slice(1)).toBytes()
    )
  },
  verify: (message, signature, publicKey) => {
    return Ed25519.verify(
      message,
      hexToBytes(signature),
      hexToBytes(publicKey).slice(1)
    )
  },
  signTx: (message, privateKey) => {
    // caution: Ed25519.sign interprets all strings as hex, stripping
    // any non-hex characters without warning
    return Ed25519.sign(message, hexToBytes(privateKey).slice(1)).toHex()
  },
  verifyTx: (message, signature, publicKey) => {
    return Ed25519.verify(
      message,
      hexToBytes(signature),
      hexToBytes(publicKey).slice(1)
    )
  }
}

function select(algorithm) {
  const methods = { "ecdsa-secp256k1": secp256k1, ed25519 }
  return methods[algorithm]
}

function getAlgorithmFromKey(key) {
  const bytes = hexToBytes(key)
  return bytes.length === 33 && bytes[0] === 0xed
    ? "ed25519"
    : "ecdsa-secp256k1"
}

function sign(messageHex, privateKey) {
  const algorithm = getAlgorithmFromKey(privateKey)
  return select(algorithm).sign(hexToBytes(messageHex), privateKey)
}

function verify(messageHex, signature, publicKey) {
  const algorithm = getAlgorithmFromKey(publicKey)
  return select(algorithm).verify(hexToBytes(messageHex), signature, publicKey)
}

function signTx(messageHex, privateKey) {
  const algorithm = getAlgorithmFromKey(privateKey)
  return select(algorithm).signTx(messageHex, privateKey)
}

function verifyTx(messageHex, signature, publicKey) {
  const algorithm = getAlgorithmFromKey(publicKey)
  return select(algorithm).verifyTx(messageHex, signature, publicKey)
}

export function Factory(chain_or_token = "jingtum") {
  const addressCodec = AddressCodecFactory(chain_or_token)
  function generateSeed(
    options: {
      entropy?: Uint8Array
      // entropy?: any,
      algorithm?: "ed25519" | "secp256k1"
    } = {}
  ) {
    assert(
      !options.entropy || options.entropy.length >= 16,
      "entropy too short"
    )
    const entropy = options.entropy ? options.entropy.slice(0, 16) : brorand(16)
    const type = options.algorithm === "ed25519" ? "ed25519" : "secp256k1"
    return addressCodec.encodeSeed(entropy, type)
  }

  function deriveKeypair(seed, options: any = {}) {
    const decoded = addressCodec.decodeSeed(seed)
    const algorithm = decoded.type === "ed25519" ? "ed25519" : "ecdsa-secp256k1"
    const method = select(algorithm)
    const keypair = method.deriveKeypair(decoded.bytes, options)
    const messageToVerify = hash("This test message should verify.")
    const signature = method.sign(messageToVerify, keypair.privateKey)
    if (method.verify(messageToVerify, signature, keypair.publicKey) !== true) {
      throw new Error("derived keypair did not generate verifiable signature")
    }
    return keypair
  }

  function deriveAddressFromBytes(publicKeyBytes: Buffer) {
    return addressCodec.encodeAccountID(
      Buffer.from(computePublicKeyHash(publicKeyBytes))
    )
  }

  function deriveAddress(publicKey) {
    return deriveAddressFromBytes(hexToBytes(publicKey))
  }

  function deriveNodeAddress(publicKey) {
    const generatorBytes = addressCodec.decodeNodePublic(publicKey)
    const accountPublicBytes = accountPublicFromPublicGenerator(generatorBytes)
    return deriveAddressFromBytes(accountPublicBytes)
  }

  function convertAddressToBytes(address) {
    return addressCodec.decodeAddress(address).toJSON().data
  }

  function convertBytesToAddress(bytes) {
    return addressCodec.encodeAddress(bytes)
  }
  return {
    // secp256k1,
    // ed25519,
    // decodeSeed: addressCodec.decodeSeed
    // for swtc libs
    addressCodec,
    chain: addressCodec.chain,
    deriveKeyPair: deriveKeypair,
    hash,
    signTx,
    verifyTx,
    convertAddressToBytes,
    convertBytesToAddress,
    checkAddress: addressCodec.isValidAddress,
    isValidAddress: addressCodec.isValidAddress,
    // standards
    deriveKeypair,
    generateSeed,
    sign,
    verify,
    deriveAddress,
    deriveNodeAddress
  }
}
