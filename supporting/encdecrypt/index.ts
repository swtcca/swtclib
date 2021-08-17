/// <reference path = "./types/index.ts" />

const crypto = require("crypto")
import { isEmptyObject } from "jcc_common"
const createKeccakHash = require("keccak")
const randombytes = require("randombytes")
const scrypt = require("scryptsy")
import { KEYSTORE_IS_INVALID, PASSWORD_IS_WRONG } from "./constant"

/**
 * decrypt wallet with password
 *
 * @param {string} password
 * @param {IKeystoreModel} encryptData
 * @returns {(string)} return secret if success, otherwise throws `keystore is invalid` if the keystore is invalid or
 * throws `password is wrong` if the password is wrong
 */
const decrypt = (password: string, encryptData: IKeystoreModel): string => {
  if (
    isEmptyObject(encryptData) ||
    isEmptyObject(encryptData.crypto) ||
    isEmptyObject(encryptData.crypto.kdfparams)
  ) {
    throw new Error(KEYSTORE_IS_INVALID)
  }
  const iv = Buffer.from(encryptData.crypto.iv, "hex")
  const kdfparams = encryptData.crypto.kdfparams
  const derivedKey = scrypt(
    Buffer.from(password),
    Buffer.from(kdfparams.salt, "hex"),
    kdfparams.n,
    kdfparams.r,
    kdfparams.p,
    kdfparams.dklen
  )
  const ciphertext = Buffer.from(encryptData.ciphertext, "hex")
  const mac = createKeccakHash("keccak256")
    .update(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
    .digest()
  if (mac.toString("hex") !== encryptData.mac) {
    throw new Error(PASSWORD_IS_WRONG)
  }
  const decipher = crypto.createDecipheriv(
    "aes-128-ctr",
    derivedKey.slice(0, 16),
    iv
  )
  const seed = Buffer.concat([decipher.update(ciphertext), decipher.final()])
  return seed.toString()
}

/**
 * encrypt data with password
 *
 * @param {string} password
 * @param {string} data
 * @param {IEncryptModel} [opts={}]
 * @returns {IKeystoreModel}
 */
const encrypt = (
  password: string,
  data: string,
  opts: IEncryptModel = {}
): IKeystoreModel => {
  const iv = opts.iv || randombytes(16).toString("hex")
  const kdfparams = {
    dklen: opts.dklen || 32,
    n: opts.n || 4096,
    p: opts.p || 1,
    r: opts.r || 8,
    salt: opts.salt || randombytes(32).toString("hex")
  }
  const derivedKey = scrypt(
    Buffer.from(password),
    Buffer.from(kdfparams.salt, "hex"),
    kdfparams.n,
    kdfparams.r,
    kdfparams.p,
    kdfparams.dklen
  )
  const cipher = crypto.createCipheriv(
    opts.cipher || "aes-128-ctr",
    derivedKey.slice(0, 16),
    Buffer.from(iv, "hex")
  )
  const ciphertext = Buffer.concat([
    cipher.update(Buffer.from(data)),
    cipher.final()
  ])
  const mac = createKeccakHash("keccak256")
    .update(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
    .digest()
  return {
    ciphertext: ciphertext.toString("hex"),
    crypto: {
      cipher: opts.cipher || "aes-128-ctr",
      iv,
      kdf: "scrypt",
      kdfparams
    },
    mac: mac.toString("hex")
  }
}

const encryptContact = (
  password: string,
  contacts: any,
  opts: IEncryptModel = {}
): IKeystoreModel => {
  return encrypt(password, JSON.stringify(contacts), opts)
}

const encryptWallet = (
  password: string,
  keypairs: IKeypairsModel,
  opts: IEncryptModel = {}
): IKeystoreModel => {
  const data = encrypt(password, keypairs.secret, opts)
  data.type = keypairs.type || "swt"
  data.address = keypairs.address
  data.default = typeof keypairs.default === "boolean" ? keypairs.default : true
  data.alias = keypairs.alias || ""
  return data
}

export { decrypt, encrypt, encryptContact, encryptWallet }
