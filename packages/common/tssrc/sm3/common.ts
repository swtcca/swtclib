import { toArray, join32 } from "./utils"
import { funcAssert as assert } from "../functions"

export abstract class BlockHash {
  public pending: any = null
  public pendingTotal: number = 0
  public endian: string = "big"
  public blockSize: number
  public outSize: number
  public hmacStrength: number
  public padLength: number
  public _delta8: number
  public _delta32: number

  constructor(
    blockSize = 512,
    outSize = 256,
    hmacStrength = 192,
    padLength = 64
  ) {
    this.blockSize = blockSize
    this.outSize = outSize
    this.hmacStrength = hmacStrength
    this.padLength = padLength / 8

    this._delta8 = this.blockSize / 8
    this._delta32 = this.blockSize / 32
  }

  abstract _update(msg, i): void
  abstract _digest(enc: string): string | any[]
  public update(msg, enc = "") {
    // Convert message to array, pad it, and join into 32bit blocks
    msg = toArray(msg, enc)
    if (!this.pending) this.pending = msg
    else this.pending = this.pending.concat(msg)
    this.pendingTotal += msg.length

    // Enough data, try updating
    if (this.pending.length >= this._delta8) {
      msg = this.pending

      // Process pending data in blocks
      const r = msg.length % this._delta8
      this.pending = msg.slice(msg.length - r, msg.length)
      if (this.pending.length === 0) this.pending = null

      msg = join32(msg, 0, msg.length - r, this.endian)
      for (let i = 0; i < msg.length; i += this._delta32)
        // this._update(msg, i, i + this._delta32)
        this._update(msg, i)
    }

    return this
  }

  public digest(enc = "") {
    this.update(this.pad())
    assert(this.pending === null)

    return this._digest(enc)
  }

  private pad() {
    var len = this.pendingTotal
    var bytes = this._delta8
    var k = bytes - ((len + this.padLength) % bytes)
    var res = new Array(k + this.padLength)
    res[0] = 0x80
    for (var i = 1; i < k; i++) res[i] = 0

    // Append length
    len <<= 3
    if (this.endian === "big") {
      for (var t = 8; t < this.padLength; t++) res[i++] = 0

      res[i++] = 0
      res[i++] = 0
      res[i++] = 0
      res[i++] = 0
      res[i++] = (len >>> 24) & 0xff
      res[i++] = (len >>> 16) & 0xff
      res[i++] = (len >>> 8) & 0xff
      res[i++] = len & 0xff
    } else {
      res[i++] = len & 0xff
      res[i++] = (len >>> 8) & 0xff
      res[i++] = (len >>> 16) & 0xff
      res[i++] = (len >>> 24) & 0xff
      res[i++] = 0
      res[i++] = 0
      res[i++] = 0
      res[i++] = 0

      for (t = 8; t < this.padLength; t++) res[i++] = 0
    }

    return res
  }
}
