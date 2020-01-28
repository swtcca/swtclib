import hashjs from "hash.js"
import BigNum from "bn.js"

export default class Sha512 {
  // TODO: type of `hash`?
  private hash: any

  constructor() {
    this.hash = hashjs.sha512()
  }
  public add(bytes) {
    this.hash.update(bytes)
    return this
  }
  public addU32(i) {
    return this.add([
      (i >>> 24) & 0xff,
      (i >>> 16) & 0xff,
      (i >>> 8) & 0xff,
      i & 0xff
    ])
  }
  public finish() {
    return this.hash.digest()
  }
  public first256() {
    return this.finish().slice(0, 32)
  }
  public first256BN() {
    return new BigNum(this.first256())
  }
}
