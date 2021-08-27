import { rotl32, sum32_3, sum32_4, toHex32, split32 } from "./utils"
import { BlockHash } from "./common"

function P0(X) {
  return X ^ rotl32(X, 9) ^ rotl32(X, 17)
}

// P1(X) = X xor (X <<< 15) xor (X <<< 23)
function P1(X) {
  return X ^ rotl32(X, 15) ^ rotl32(X, 23)
}

function FF(X, Y, Z, j) {
  return j >= 0 && j <= 15 ? X ^ Y ^ Z : (X & Y) | (X & Z) | (Y & Z)
}

function GG(X, Y, Z, j) {
  return j >= 0 && j <= 15 ? X ^ Y ^ Z : (X & Y) | (~X & Z)
}

function T(j) {
  return j >= 0 && j <= 15 ? 0x79cc4519 : 0x7a879d8a
}

export class SM3 extends BlockHash {
  public h: number[]
  public W: number[]
  public M: number[]
  constructor() {
    super(512, 256, 192, 64)
    this.h = [
      0x7380166f, 0x4914b2b9, 0x172442d7, 0xda8a0600, 0xa96f30bc, 0x163138aa,
      0xe38dee4d, 0xb0fb0e4e
    ]
    this.W = new Array(68)
    this.M = new Array(64)
  }
  public _update(msg, start) {
    var W = this.W
    var M = this.M

    for (let i = 0; i < 16; i++) W[i] = msg[start + i]

    // W[j] <- P1(W[j−16] xor W[j−9] xor (W[j−3] <<< 15)) xor (W[j−13] <<< 7) xor W[j−6]
    for (let i = 16; i < 68; i++)
      W[i] =
        P1(W[i - 16] ^ W[i - 9] ^ rotl32(W[i - 3], 15)) ^
        rotl32(W[i - 13], 7) ^
        W[i - 6]

    // W′[j] = W[j] xor W[j+4]
    for (let i = 0; i < 64; i++) M[i] = W[i] ^ W[i + 4]

    let a = this.h[0]
    let b = this.h[1]
    let c = this.h[2]
    let d = this.h[3]
    let e = this.h[4]
    let f = this.h[5]
    let g = this.h[6]
    let h = this.h[7]

    let SS1
    let SS2
    let TT1
    let TT2
    for (let j = 0; j < 64; j += 1) {
      SS1 = rotl32(sum32_3(rotl32(a, 12), e, rotl32(T(j), j)), 7)
      SS2 = SS1 ^ rotl32(a, 12)

      TT1 = sum32_4(FF(a, b, c, j), d, SS2, M[j])
      TT2 = sum32_4(GG(e, f, g, j), h, SS1, W[j])

      d = c
      c = rotl32(b, 9)
      b = a
      a = TT1
      h = g
      g = rotl32(f, 19)
      f = e
      e = P0(TT2)
    }

    this.h[0] = this.h[0] ^ a
    this.h[1] = this.h[1] ^ b
    this.h[2] = this.h[2] ^ c
    this.h[3] = this.h[3] ^ d
    this.h[4] = this.h[4] ^ e
    this.h[5] = this.h[5] ^ f
    this.h[6] = this.h[6] ^ g
    this.h[7] = this.h[7] ^ h
  }

  public _digest(enc) {
    this.h[0] = this.h[0] >>> 0
    this.h[1] = this.h[1] >>> 0
    this.h[2] = this.h[2] >>> 0
    this.h[3] = this.h[3] >>> 0
    this.h[4] = this.h[4] >>> 0
    this.h[5] = this.h[5] >>> 0
    this.h[6] = this.h[6] >>> 0
    this.h[7] = this.h[7] >>> 0

    if (enc === "hex") return toHex32(this.h, "big")
    else return split32(this.h, "big")
  }
}
