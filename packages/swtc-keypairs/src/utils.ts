import hashjs from "hash.js"

function computePublicKeyHash(publicKeyBytes: Buffer): number[] {
  const hash256 = hashjs
    .sha256()
    .update(publicKeyBytes)
    .digest()
  const hash160 = hashjs
    .ripemd160()
    .update(hash256)
    .digest()
  return hash160
}

function seedFromPhrase(phrase) {
  return hashjs
    .sha512()
    .update(phrase)
    .digest()
    .slice(0, 16)
}

export { computePublicKeyHash, seedFromPhrase }
