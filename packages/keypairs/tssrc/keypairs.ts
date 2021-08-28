import brorand from "brorand"
import hashjs from "hash.js"
import { eddsa, ec } from "elliptic"
import { Signature, sm2 as Secp256k1Gm } from "@swtc/sm.js"
import BN from "bn.js"

import { Factory as AddressCodecFactory } from "@swtc/address-codec"
import {
  SM3,
  funcAssert as assert,
  funcHexToBytes as hexToBytes,
  funcBytesToHex as bytesToHex
} from "@swtc/common"
import { derivePrivateKey, accountPublicFromPublicGenerator } from "./secp256k1"
import {
  derivePrivateKey as derivePrivateKeyGm,
  accountPublicFromPublicGenerator as accountPublicFromPublicGeneratorGm
} from "./sm2p256v1"
import {
  computePublicKeyHash,
  computePublicKeyHashGm,
  seedFromPhrase,
  seedFromPhraseGm
} from "./utils"
import { IKeypair, IGenerateOptions, IAlgorithm } from "./types"

const Ed25519 = eddsa("ed25519")
const Secp256k1 = ec("secp256k1")
// const Secp256k1Gm = sm2

function hashOpen(message) {
  return hashjs.sha512().update(message).digest().slice(0, 32)
}
function hashGm(message) {
  return new SM3().update(message).digest().slice(0, 32)
}

export function Factory(chain_or_token = "jingtum") {
  const addressCodec = AddressCodecFactory(chain_or_token)
  const guomi = addressCodec.guomi
  const hash = guomi ? hashGm : hashOpen
  const secp256k1 = {
    deriveKeypair: (entropy, options: any = {}): IKeypair => {
      const prefix = "00"
      const privateKey =
        prefix +
        derivePrivateKey(entropy, options).toString(16, 64).toUpperCase()
      const publicKey = bytesToHex(
        Secp256k1.keyFromPrivate(privateKey.slice(2))
          .getPublic()
          .encodeCompressed()
      )
      return { privateKey, publicKey }
    },
    deriveKeypairWithPrivateKey: (rawPrivateKey: string): IKeypair => {
      const prefix = "00"
      const privateKey = prefix + rawPrivateKey.toUpperCase()
      const publicKey = bytesToHex(
        Secp256k1.keyFromPrivate(privateKey.slice(2))
          .getPublic()
          .encodeCompressed()
      )
      return { privateKey, publicKey }
    },
    sign: (message, privateKey): string => {
      return bytesToHex(
        Secp256k1.sign(hash(message), hexToBytes(privateKey), {
          canonical: true
        }).toDER()
      )
    },
    verify: (message, signature, publicKey): boolean => {
      return Secp256k1.verify(hash(message), signature, hexToBytes(publicKey))
    },
    signTx: (message, privateKey): string => {
      return bytesToHex(
        Secp256k1.sign(message, hexToBytes(privateKey), {
          canonical: true
        }).toDER()
      )
    },
    verifyTx: (message, signature, publicKey): boolean => {
      return Secp256k1.verify(message, signature, hexToBytes(publicKey))
    }
  }

  const sm2p256v1 = {
    deriveKeypair: (entropy, options: any = {}): IKeypair => {
      const prefix = "00"
      const pri = derivePrivateKeyGm(entropy, options)
      const privateKey = prefix + pri.toString(16, 64).toUpperCase()
      const publicKey = bytesToHex(
        Secp256k1Gm.SM2KeyPair(null, pri).pub.encodeCompressed()
      )
      return { privateKey, publicKey }
    },
    deriveKeypairWithPrivateKey: (rawPrivateKey: string): IKeypair => {
      const prefix = "00"
      const pri = new BN(rawPrivateKey, "hex")
      const privateKey = prefix + rawPrivateKey.toUpperCase()
      const publicKey = bytesToHex(
        Secp256k1Gm.SM2KeyPair(null, pri).pub.encodeCompressed()
      )
      return { privateKey, publicKey }
    },
    sign: (message, privateKey): string => {
      const keypair = Secp256k1Gm.SM2KeyPair(null, new BN(privateKey, "hex"))
      return bytesToHex(new Signature(keypair.sign(hash(message))).toDER())
    },
    verify: (message, signature, publicKey): boolean => {
      const keypair = Secp256k1Gm.SM2KeyPair(publicKey)
      const sig = new Signature(signature, "hex")
      return keypair.verify(hash(message), sig.r, sig.s)
    },
    signTx: (message, privateKey): string => {
      const keypair = Secp256k1Gm.SM2KeyPair(null, new BN(privateKey, "hex"))
      return bytesToHex(new Signature(keypair.sign(message)).toDER())
    },
    verifyTx: (message, signature, publicKey): boolean => {
      const keypair = Secp256k1Gm.SM2KeyPair(publicKey)
      const sig = new Signature(signature, "hex")
      return keypair.verify(message, sig.r, sig.s)
    }
  }

  const ed25519 = {
    deriveKeypair: (entropy): IKeypair => {
      const prefix = "ED"
      const rawPrivateKey = hash(entropy)
      const privateKey = prefix + bytesToHex(rawPrivateKey)
      const publicKey =
        prefix + bytesToHex(Ed25519.keyFromSecret(rawPrivateKey).pubBytes())
      return { privateKey, publicKey }
    },
    deriveKeypairWithPrivateKey: (rawPrivateKey): IKeypair => {
      const prefix = "ED"
      const privateKey = prefix + rawPrivateKey.toUpperCase()
      const publicKey =
        prefix +
        bytesToHex(Ed25519.keyFromSecret(hexToBytes(rawPrivateKey)).pubBytes())
      return { privateKey, publicKey }
    },
    sign: (message, privateKey): string => {
      // caution: Ed25519.sign interprets all strings as hex, stripping
      // any non-hex characters without warning
      assert(Array.isArray(message), "message must be array of octets")
      return bytesToHex(
        Ed25519.sign(message, hexToBytes(privateKey).slice(1)).toBytes()
      )
    },
    verify: (message, signature, publicKey): boolean => {
      return Ed25519.verify(
        message,
        hexToBytes(signature),
        hexToBytes(publicKey).slice(1)
      )
    },
    signTx: (message, privateKey): string => {
      // caution: Ed25519.sign interprets all strings as hex, stripping
      // any non-hex characters without warning
      return Ed25519.sign(message, hexToBytes(privateKey).slice(1)).toHex()
    },
    verifyTx: (message, signature, publicKey): boolean => {
      return Ed25519.verify(
        message,
        hexToBytes(signature),
        hexToBytes(publicKey).slice(1)
      )
    }
  }
  const ed25519guomi = {
    deriveKeypair: (entropy): IKeypair => {
      const prefix = "ED"
      const rawPrivateKey = hash(entropy)
      const privateKey = prefix + bytesToHex(rawPrivateKey)
      const publicKey =
        prefix + bytesToHex(Ed25519.keyFromSecret(rawPrivateKey).pubBytes())
      return { privateKey, publicKey }
    },
    deriveKeypairWithPrivateKey: (rawPrivateKey): IKeypair => {
      const prefix = "ED"
      const privateKey = prefix + rawPrivateKey.toUpperCase()
      const publicKey =
        prefix +
        bytesToHex(Ed25519.keyFromSecret(hexToBytes(rawPrivateKey)).pubBytes())
      return { privateKey, publicKey }
    },
    sign: (message, privateKey): string => {
      // caution: Ed25519.sign interprets all strings as hex, stripping
      // any non-hex characters without warning
      assert(Array.isArray(message), "message must be array of octets")
      return bytesToHex(
        Ed25519.sign(message, hexToBytes(privateKey).slice(1)).toBytes()
      )
    },
    verify: (message, signature, publicKey): boolean => {
      return Ed25519.verify(
        message,
        hexToBytes(signature),
        hexToBytes(publicKey).slice(1)
      )
    },
    signTx: (message, privateKey): string => {
      // caution: Ed25519.sign interprets all strings as hex, stripping
      // any non-hex characters without warning
      return Ed25519.sign(message, hexToBytes(privateKey).slice(1)).toHex()
    },
    verifyTx: (message, signature, publicKey): boolean => {
      return Ed25519.verify(
        message,
        hexToBytes(signature),
        hexToBytes(publicKey).slice(1)
      )
    }
  }

  function generateSeed(options: IGenerateOptions = {}): string {
    assert(
      !options.entropy || options.entropy.length >= 16,
      "entropy too short"
    )
    const entropy = options.entropy ? options.entropy.slice(0, 16) : brorand(16)
    const type =
      options.algorithm === "ed25519"
        ? "ed25519"
        : guomi
        ? "sm2p256v1"
        : "secp256k1"
    return addressCodec.encodeSeed(entropy, type)
  }

  function select(algorithm) {
    const methods = {
      secp256k1,
      sm2p256v1,
      ed25519,
      ed25519guomi
    }
    // return guomi ? methods[`${algorithm}guomi`] : methods[algorithm]
    return algorithm === "ed25519"
      ? guomi
        ? methods.ed25519guomi
        : methods.ed25519
      : methods[algorithm]
  }

  function getAlgorithmFromKey(key): IAlgorithm {
    const bytes = hexToBytes(key)
    return bytes.length === 33 && bytes[0] === 0xed
      ? "ed25519"
      : guomi
      ? "sm2p256v1"
      : "secp256k1"
  }

  function sign(messageHex, privateKey): string {
    const algorithm = getAlgorithmFromKey(privateKey)
    return select(algorithm).sign(hexToBytes(messageHex), privateKey)
  }
  function verify(messageHex, signature, publicKey): boolean {
    const algorithm = getAlgorithmFromKey(publicKey)
    return select(algorithm).verify(
      hexToBytes(messageHex),
      signature,
      publicKey
    )
  }
  function signTx(messageHex, privateKey): string {
    const algorithm = getAlgorithmFromKey(privateKey)
    return select(algorithm).signTx(messageHex, privateKey)
  }
  function verifyTx(messageHex, signature, publicKey): boolean {
    const algorithm = getAlgorithmFromKey(publicKey)
    return select(algorithm).verifyTx(messageHex, signature, publicKey)
  }

  function deriveKeypair(
    secret_or_private_key: string,
    algorithm: IAlgorithm = guomi ? "sm2p256v1" : "secp256k1"
  ): IKeypair {
    const secret = secret_or_private_key
    let private_key = secret_or_private_key
    let keypair: any
    let method: any
    if (typeof secret_or_private_key !== "string") {
      // use privateKey to generate keypairs, using algorithm
      throw new Error("deriving keypair requires secret or private key")
    } else if (/^s/.test(secret_or_private_key)) {
      // use secret to derive, secret has algorithm information already
      const decoded = addressCodec.decodeSeed(secret)
      algorithm =
        decoded.type === "ed25519"
          ? "ed25519"
          : guomi
          ? "sm2p256v1"
          : "secp256k1"
      method = select(algorithm)
      keypair = method.deriveKeypair(decoded.bytes)
    } else {
      // use private key to derive, could be raw privateKey or prefixed privateKey
      if (secret_or_private_key.length === 64) {
        // raw private key, has no information on algorithm
        algorithm =
          algorithm === "ed25519"
            ? "ed25519"
            : guomi
            ? "sm2p256v1"
            : "secp256k1"
      } else if (secret_or_private_key.length === 66) {
        // prefixed private key, has information on algorithm
        if (secret_or_private_key.slice(0, 2) === "00") {
          algorithm = guomi ? "sm2p256v1" : "secp256k1"
        } else if (secret_or_private_key.slice(0, 2).toUpperCase() === "ED") {
          algorithm = "ed25519"
        } else {
          throw new Error(
            "deriving keypair requires correct prefixed private key"
          )
        }
        private_key = secret_or_private_key.slice(2)
      } else {
        throw new Error("deriving keypair requires valid private key")
      }
      method = select(algorithm)
      keypair = method.deriveKeypairWithPrivateKey(private_key)
    }
    const messageToVerify = hash("This test message should verify.")
    const signature = method.sign(messageToVerify, keypair.privateKey)
    if (method.verify(messageToVerify, signature, keypair.publicKey) !== true) {
      throw new Error("derived keypair did not generate verifiable signature")
    }
    return keypair
  }

  function deriveAddressFromBytes(publicKeyBytes: Buffer): string {
    return addressCodec.encodeAccountID(
      Buffer.from(
        guomi
          ? computePublicKeyHashGm(publicKeyBytes)
          : computePublicKeyHash(publicKeyBytes)
      )
    )
  }

  function deriveAddress(publicKey): string {
    return deriveAddressFromBytes(hexToBytes(publicKey))
  }

  function deriveNodeAddress(publicKey): string {
    const generatorBytes = addressCodec.decodeNodePublic(publicKey)
    const accountPublicBytes = guomi
      ? accountPublicFromPublicGeneratorGm(generatorBytes)
      : accountPublicFromPublicGenerator(generatorBytes)
    return deriveAddressFromBytes(accountPublicBytes)
  }

  function convertAddressToBytes(address): number[] {
    return addressCodec.decodeAddress(address).toJSON().data
  }

  function convertBytesToAddress(bytes): string {
    return addressCodec.encodeAddress(bytes)
  }
  return {
    // secp256k1,
    // secp256k1guomi,
    // ed25519,
    // decodeSeed: addressCodec.decodeSeed
    guomi,
    // for swtc libs
    addressCodec,
    chain: addressCodec.chain,
    deriveKeyPair: deriveKeypair,
    hash,
    seedFromPhrase: guomi ? seedFromPhraseGm : seedFromPhrase,
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
