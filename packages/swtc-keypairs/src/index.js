"use strict" // eslint-disable-line strict

const assert = require("assert")
const brorand = require("brorand")
const hashjs = require("hash.js")
const elliptic = require("elliptic")
const Ed25519 = elliptic.eddsa("ed25519")
const Secp256k1 = elliptic.ec("secp256k1")
const derivePrivateKey = require("./secp256k1").derivePrivateKey
const accountPublicFromPublicGenerator = require("./secp256k1")
  .accountPublicFromPublicGenerator
const SWTC_CHAINS = require("swtc-chains")
const utils = require("./utils")
const hexToBytes = utils.hexToBytes
const bytesToHex = utils.bytesToHex

function hash(message) {
  return hashjs
    .sha512()
    .update(message)
    .digest()
    .slice(0, 32)
}

const secp256k1 = {
  deriveKeypair: function(entropy, options) {
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
  sign: function(message, privateKey) {
    return bytesToHex(
      Secp256k1.sign(hash(message), hexToBytes(privateKey), {
        canonical: true
      }).toDER()
    )
  },
  verify: function(message, signature, publicKey) {
    return Secp256k1.verify(hash(message), signature, hexToBytes(publicKey))
  },
  signHash: function(message, privateKey) {
    return bytesToHex(
      Secp256k1.sign(hash(message), hexToBytes(privateKey), {
        canonical: true
      }).toDER()
    )
  },
  verifyHash: function(message, signature, publicKey) {
    return Secp256k1.verify(hash(message), signature, hexToBytes(publicKey))
  },
  signTx: function(message, privateKey) {
    // message is bytes
    return bytesToHex(
      Secp256k1.sign(message, hexToBytes(privateKey), {
        canonical: true
      }).toDER()
    )
  },
  verifyTx: function(message, signature, publicKey) {
    // message is bytes
    return Secp256k1.verify(message, signature, hexToBytes(publicKey))
  }
}

const ed25519 = {
  deriveKeypair: function(entropy) {
    const prefix = "ED"
    const rawPrivateKey = hash(entropy)
    const privateKey = prefix + bytesToHex(rawPrivateKey)
    const publicKey =
      prefix + bytesToHex(Ed25519.keyFromSecret(rawPrivateKey).pubBytes())
    return { privateKey, publicKey }
  },
  sign: function(message, privateKey) {
    // caution: Ed25519.sign interprets all strings as hex, stripping
    // any non-hex characters without warning
    assert(Array.isArray(message), "message must be array of octets")
    return bytesToHex(
      Ed25519.sign(message, hexToBytes(privateKey).slice(1)).toBytes()
    )
  },
  verify: function(message, signature, publicKey) {
    return Ed25519.verify(
      message,
      hexToBytes(signature),
      hexToBytes(publicKey).slice(1)
    )
  },
  signHash: function(message, privateKey) {
    return bytesToHex(
      Ed25519.sign(hash(message), hexToBytes(privateKey).slice(1)).toBytes()
    )
  },
  verifyHash: function(message, signature, publicKey) {
    return Ed25519.verify(
      hash(message),
      hexToBytes(signature),
      hexToBytes(publicKey).slice(1)
    )
  },
  // add for jingtum, same as sign and verify
  signTx: function(message, privateKey) {
    // caution: Ed25519.sign interprets all strings as hex, stripping
    // any non-hex characters without warning
    assert(Array.isArray(message), "message must be array of octets")
    //message = bytesToHex(message)
    return bytesToHex(
      Ed25519.sign(message, hexToBytes(privateKey).slice(1)).toBytes()
    )
  },
  verifyTx: function(message, signature, publicKey) {
    //message = bytesToHex(message)
    return Ed25519.verify(
      message,
      hexToBytes(signature),
      hexToBytes(publicKey).slice(1)
    )
  }
  // add for jingtum, same as sign and verify
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

// add for jingtum
function signHash(message, privateKey) {
  const algorithm = getAlgorithmFromKey(privateKey)
  return select(algorithm).signHash(message, privateKey)
}

function verifyHash(message, signature, publicKey) {
  const algorithm = getAlgorithmFromKey(publicKey)
  return select(algorithm).verifyHash(message, signature, publicKey)
}
function signTx(messageBytes, privateKey) {
  const algorithm = getAlgorithmFromKey(privateKey)
  return select(algorithm).signTx(messageBytes, privateKey)
}

function verifyTx(messageBytes, signature, publicKey) {
  const algorithm = getAlgorithmFromKey(publicKey)
  return select(algorithm).verifyTx(messageBytes, signature, publicKey)
}
// add for jingtum

function deriveKeyPairWithKey(privateKey) {
  const publicKey = bytesToHex(
    Secp256k1.keyFromPrivate(privateKey)
      .getPublic()
      .encodeCompressed()
  )
  return { privateKey: privateKey, publicKey: publicKey }
}

function getKeyPair(chain_name = "jingtum") {
  let addressCodec = require("swtc-address-codec")(chain_name)

  function generateSeed(options = {}) {
    assert(
      !options.entropy || options.entropy.length >= 16,
      "entropy too short"
    )
    const entropy = options.entropy ? options.entropy.slice(0, 16) : brorand(16)
    const type = options.algorithm === "ed25519" ? "ed25519" : "secp256k1"
    return addressCodec.encodeSeed(entropy, type)
  }

  function deriveKeypair(seed, options) {
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

  function deriveAddressFromBytes(publicKeyBytes) {
    return addressCodec.encodeAccountID(
      utils.computePublicKeyHash(publicKeyBytes)
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

  function checkAddress(address) {
    return addressCodec.isValidAddress(address)
  }

  return {
    chain: SWTC_CHAINS.filter(
      chain =>
        chain.code.toLowerCase() === chain_name.toLowerCase() ||
        chain.currency.toUpperCase() === chain_name.toUpperCase()
    )[0].code,
    generateSeed,
    deriveKeypair,
    sign,
    verify,
    deriveAddress,
    // added for swtc-func for jingtum-base-lib
    //addressCodec,
    hash,
    signHash,
    verifyHash,
    signTx,
    verifyTx,
    deriveKeyPair: deriveKeypair,
    deriveKeyPairWithKey,
    checkAddress,
    convertAddressToBytes: addressCodec.decodeAddress,
    convertBytesToAddress: addressCodec.encodeAddress,
    __encode: addressCodec.encode,
    __decode: addressCodec.decode,
    // added for swtc-func for jingtum-base-lib
    deriveNodeAddress
  }
}

module.exports = getKeyPair
