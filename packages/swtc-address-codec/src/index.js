"use strict"

const createHash = require("create-hash")
const apiFactory = require("x-address-codec")
const SWTC_CHAINS = require("swtc-chains")

const NODE_PUBLIC = 28
const NODE_PRIVATE = 32
const ACCOUNT_ID = 0
const FAMILY_SEED = 33
const ED25519_SEED = [0x01, 0xe1, 0x4b]

function getAddressCodec(chain_or_token = "jingtum") {
  let chain,
    defaultAlphabet,
    alphabets = {},
    filtered_chains = []
  filtered_chains = SWTC_CHAINS.filter(
    chain =>
      chain.code.toLowerCase() === chain_or_token.toLowerCase() ||
      chain.currency.toUpperCase() === chain_or_token.toUpperCase()
  )
  if (filtered_chains.length !== 1) {
    // if it is not provided in SWTC_CHAINS
    throw new Error("the chain you specified is not available yet")
  } else {
    chain = filtered_chains[0]
    defaultAlphabet = chain.code
    if (!("simple" in chain)) {
      alphabets = { [chain.code]: chain.ACCOUNT_ALPHABET }
    }
    return apiFactory({
      sha256: function(bytes) {
        return createHash("sha256")
          .update(new Buffer.from(bytes))
          .digest()
      },
      alphabets,
      defaultAlphabet,
      codecMethods: {
        EdSeed: {
          expectedLength: 16,
          version: ED25519_SEED
        },
        Seed: {
          // TODO: Use a map, not a parallel array
          versionTypes: ["ed25519", "secp256k1"],
          versions: [ED25519_SEED, FAMILY_SEED],
          expectedLength: 16
        },
        AccountID: { version: ACCOUNT_ID, expectedLength: 20 },
        Address: { version: ACCOUNT_ID, expectedLength: 20 },
        NodePublic: { version: NODE_PUBLIC, expectedLength: 33 },
        NodePrivate: { version: NODE_PRIVATE, expectedLength: 32 },
        K256Seed: { version: FAMILY_SEED, expectedLength: 16 }
      }
    })
  }
}

module.exports = getAddressCodec
