"use strict" // eslint-disable-line strict

const Buffer = require("buffer").Buffer
const assert = require("assert")
const fixtures = require("./fixtures/api.json")
const api = require("..").Factory()
const addressCodec = api.addressCodec
const decodeSeed = addressCodec.decodeSeed
const entropy = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

describe("api-jingtum", () => {
  it("generateSeed - secp256k1", () => {
    expect(api.generateSeed({ entropy })).toBe(fixtures.secp256k1.seed)
  })

  xit("generateSeed - secp256k1, random", () => {
    const seed = api.generateSeed()
    expect(seed.charAt(0)).toBe("s")
    const { type, bytes } = decodeSeed(seed)
    expect(type).toBe("secp256k1")
    expect(bytes.length).toBe(16)
  })

  it("generateSeed - ed25519", () => {
    expect(api.generateSeed({ entropy, algorithm: "ed25519" })).toBe(
      fixtures.ed25519.seed
    )
  })

  xit("generateSeed - ed25519, random", () => {
    const seed = api.generateSeed({ algorithm: "ed25519" })
    expect(seed.slice(0, 3)).toBe("sEd")
    const { type, bytes } = decodeSeed(seed)
    expect(type).toBe("ed25519")
    expect(bytes.length).toBe(16)
  })

  it("deriveKeypair - secp256k1", () => {
    const keypair = api.deriveKeypair(fixtures.secp256k1.seed)
    expect(keypair).toEqual(fixtures.secp256k1.keypair)
  })

  it("deriveKeypair - ed25519", () => {
    const keypair = api.deriveKeypair(fixtures.ed25519.seed)
    expect(keypair).toEqual(fixtures.ed25519.keypair)
  })

  it("deriveAddress - secp256k1 public key", () => {
    const address = api.deriveAddress(fixtures.secp256k1.keypair.publicKey)
    expect(address).toBe(fixtures.secp256k1.address)
  })

  it("deriveAddress - ed25519 public key", () => {
    const address = api.deriveAddress(fixtures.ed25519.keypair.publicKey)
    expect(address).toBe(fixtures.ed25519.address)
  })

  it("sign - secp256k1", () => {
    const privateKey = fixtures.secp256k1.keypair.privateKey
    const message = fixtures.secp256k1.message
    const messageHex = Buffer.from(message, "utf8").toString("hex")
    const signature = api.sign(messageHex, privateKey)
    expect(signature).toBe(fixtures.secp256k1.signature)
  })

  it("verify - secp256k1", () => {
    const signature = fixtures.secp256k1.signature
    const publicKey = fixtures.secp256k1.keypair.publicKey
    const message = fixtures.secp256k1.message
    const messageHex = Buffer.from(message, "utf8").toString("hex")
    expect(api.verify(messageHex, signature, publicKey)).toBeTruthy()
  })

  xit("signTx - secp256k1", () => {
    const privateKey = fixtures.secp256k1.keypair.privateKey
    const message = fixtures.secp256k1.message
    const messageBytes = api.hash(message)
    const signature = api.signTx(messageBytes, privateKey)
    expect(signature).toBe(fixtures.secp256k1.signature)
  })

  xit("verifyTx - secp256k1", () => {
    const signature = fixtures.secp256k1.signature
    const publicKey = fixtures.secp256k1.keypair.publicKey
    const message = fixtures.secp256k1.message
    const messageBytes = api.hash(message)
    expect(api.verifyTx(messageBytes, signature, publicKey)).toBeTruthy()
  })

  it("sign - ed25519", () => {
    const privateKey = fixtures.ed25519.keypair.privateKey
    const message = fixtures.ed25519.message
    const messageHex = Buffer.from(message, "utf8").toString("hex")
    const signature = api.sign(messageHex, privateKey)
    expect(signature).toBe(fixtures.ed25519.signature)
  })

  it("verify - ed25519", () => {
    const signature = fixtures.ed25519.signature
    const publicKey = fixtures.ed25519.keypair.publicKey
    const message = fixtures.ed25519.message
    const messageHex = Buffer.from(message, "utf8").toString("hex")
    expect(api.verify(messageHex, signature, publicKey)).toBeTruthy()
  })

  xit("signTx - ed25519", () => {
    const privateKey = fixtures.ed25519.keypair.privateKey
    const message = fixtures.ed25519.message
    const messageBytes = Array.from(Buffer.from(message, "utf8"))
    const messageHex = Buffer.from(message, "utf8").toString("hex")
    const signature = api.signTx(messageBytes, privateKey)
    expect(signature).toBe(fixtures.ed25519.signature)
  })

  xit("verify - ed25519", () => {
    const signature = fixtures.ed25519.signature
    const publicKey = fixtures.ed25519.keypair.publicKey
    const message = fixtures.ed25519.message
    const messageBytes = Array.from(Buffer.from(message, "utf8"))
    const messageHex = Buffer.from(message, "utf8").toString("hex")
    expect(api.verifyTx(messageBytes, signature, publicKey)).toBeTruthy()
  })
  //  it('deriveNodeAddress', () => {
  //    const x = 'n9KHn8NfbBsZV5q8bLfS72XyGqwFt5mgoPbcTV4c6qKiuPTAtXYk'
  //    const y = 'rU7bM9ENDkybaxNrefAVjdLTyNLuue1KaJ'
  //    assert.strictEqual(api.deriveNodeAddress(x), y)
  //  })

  xit("Random Address", () => {
    const seed = api.generateSeed()
    const keypair = api.deriveKeypair(seed)
    const address = api.deriveAddress(keypair.publicKey)
    expect(address[0]).toBe("j")
  })
})
