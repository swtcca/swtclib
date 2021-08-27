import hashjs from "hash.js"
import { SM3 } from "@swtc/common"

function computePublicKeyHash(publicKeyBytes: Buffer): number[] {
  const hash256 = hashjs.sha256().update(publicKeyBytes).digest()
  const hash160 = hashjs.ripemd160().update(hash256).digest()
  return hash160
}

function computePublicKeyHashGm(publicKeyBytes: Buffer): number[] {
  const hash256 = new SM3().update(publicKeyBytes).digest()
  const hash160 = hashjs.ripemd160().update(hash256).digest()
  return hash160
}

function seedFromPhrase(phrase) {
  return hashjs.sha512().update(phrase).digest().slice(0, 16)
}

function seedFromPhraseGm(phrase) {
  return new SM3().update(phrase).digest().slice(0, 16)
}
export {
  computePublicKeyHash,
  computePublicKeyHashGm,
  seedFromPhrase,
  seedFromPhraseGm
}
