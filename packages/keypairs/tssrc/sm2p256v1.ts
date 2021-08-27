import { sm2 as sm2p256v1 } from "@swtc/sm.js"
import { SM3 } from "@swtc/common"
import BN from "bn.js"

// TODO: type of `discrim`?
function deriveScalar(bytes, discrim?: any) {
  const order = sm2p256v1.curve.n
  for (let i = 0; i <= 0xffffffff; i++) {
    // We hash the bytes to find a 256 bit number, looping until we are sure it
    // is less than the order of the curve.
    const hasher = discrim !== undefined ? Buffer.alloc(41) : Buffer.alloc(20)
    hasher.fill(Buffer.from(bytes), 0, bytes.length)
    // If the optional discriminator index was passed in, update the hash.
    if (discrim !== undefined) {
      hasher.writeUIntBE(discrim, bytes.length, 4)
      hasher.writeUIntBE(i, bytes.length + 4, 4)
    }
    hasher.writeUIntBE(i, bytes.length, 4)
    const hasher2 = new SM3().update(hasher).digest("hex") // (V)
    const key = new BN(hasher2, "hex")
    if (key.cmpn(0) > 0 && key.cmp(order) < 0) {
      return key
    }
  }
  throw new Error("impossible unicorn ;)")
}

/**
 * @param {Array} seed - bytes
 * @param {Object} [opts] - object
 * @param {Number} [opts.accountIndex=0] - the account number to generate
 * @param {Boolean} [opts.validator=false] - generate root key-pair,
 *                                              as used by validators.
 * @return {bn.js} - 256 bit scalar value
 *
 */
export function derivePrivateKey(
  seed,
  opts: {
    validator?: boolean
    accountIndex?: number
  } = {}
) {
  const root = opts.validator
  const order = sm2p256v1.curve.n

  // This private generator represents the `root` private key, and is what's
  // used by validators for signing when a keypair is generated from a seed.
  const privateGen = deriveScalar(seed)
  if (root) {
    // As returned by validation_create for a given seed
    return privateGen
  }
  const publicGen = sm2p256v1.curve.g.mul(privateGen)
  // A seed can generate many keypairs as a function of the seed and a uint32.
  // Almost everyone just uses the first account, `0`.
  const accountIndex = opts.accountIndex || 0
  return deriveScalar(publicGen.encodeCompressed(), accountIndex)
    .add(privateGen)
    .mod(order)
}

export function accountPublicFromPublicGenerator(publicGenBytes) {
  const rootPubPoint = sm2p256v1.curve.decodePoint(publicGenBytes)
  const scalar = deriveScalar(publicGenBytes, 0)
  const point = sm2p256v1.curve.g.mul(scalar)
  const offset = rootPubPoint.add(point)
  return offset.encodeCompressed()
}
