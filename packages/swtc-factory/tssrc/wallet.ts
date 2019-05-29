import SwtcChains from "swtc-chains"
import { KeyPairs } from "./keypairs"
const getChain = (chain_name = "jingtum") =>
  SwtcChains.filter(
    (chain) =>
      chain.code.toLowerCase() === chain_name.toLowerCase() ||
      chain.currency.toUpperCase() === chain_name.toUpperCase()
  )[0]

class Wallet {
  public static generate(token = "swt", options = {}) {
    const kp = new KeyPairs(token)
    const secret = kp.generateSeed(options)
    const keypair = kp.deriveKeyPair(secret)
    const address = kp.deriveAddress(keypair.publicKey)
    return {
      secret,
      address
    }
  }

  public static fromSecret(secret, token = "swt") {
    try {
      const kp = new KeyPairs(token)
      const keypair = kp.deriveKeyPair(secret)
      const address = kp.deriveAddress(keypair.publicKey)
      return {
        secret,
        address
      }
    } catch (err) {
      return null
    }
  }

  public static isValidAddress(address, token = "swt") {
    const kp = new KeyPairs(token)
    return kp.checkAddress(address)
  }

  public static isValidSecret(secret, token = "swt") {
    try {
      const kp = new KeyPairs(token)
      kp.deriveKeyPair(secret)
      return true
    } catch (err) {
      return false
    }
  }

  public static getCurrency(token = "swt") {
    const chain = getChain(token)
    return chain ? chain.currency : ""
  }
  public static getCurrencies(token = "swt") {
    const chain = getChain(token)
    return chain && chain.CURRENCIES ? chain.CURRENCIES : {}
  }
  public static getChain(token = "swt") {
    const chain = getChain(token)
    return chain ? chain.code : ""
  }
  public static getFee(token = "swt") {
    const chain = getChain(token)
    return chain && chain.fee ? chain.fee : 10000
  }
  public static getAccountZero(token = "swt") {
    const chain = getChain(token)
    return chain && chain.ACCOUNT_ZERO ? chain.ACCOUNT_ZERO : ""
  }
  public static getAccountOne(token = "swt") {
    const chain = getChain(token)
    return chain && chain.ACCOUNT_ONE ? chain.ACCOUNT_ONE : ""
  }
  public static getIssuer(token = "swt") {
    const chain = getChain(token)
    return chain && chain.issuer ? chain.issuer : ""
  }

  public static makeCurrency(
    currency = "swt",
    issuer = Wallet.getIssuer(),
    token = "swt"
  ) {
    const CURRENCIES = Wallet.getCurrencies(token)
    currency = currency.toUpperCase()
    currency = CURRENCIES.hasOwnProperty(currency)
      ? CURRENCIES[currency]
      : currency
    return currency === Wallet.getCurrency(token)
      ? { currency, issuer: "" }
      : { currency, issuer }
  }
  public static makeAmount(
    value = 1,
    currency: any = "swt",
    issuer = Wallet.getIssuer(),
    token: "swt"
  ) {
    return typeof currency === "object"
      ? Object.assign({}, currency, { value: Number(value) })
      : Object.assign({}, this.makeCurrency(currency, issuer, token), {
          value: Number(value)
        })
  }

  protected _kp
  protected _keypairs
  protected _secret
  constructor(secret, token = "swt") {
    try {
      this._kp = new KeyPairs(token)
      this._keypairs = this._kp.deriveKeyPair(secret)
      this._secret = secret
    } catch (err) {
      this._kp = null
      this._keypairs = null
      this._secret = null
    }
  }

  /**
   * get wallet address
   * @returns {*}
   */
  public address() {
    if (!this._keypairs) return null
    const address = this._kp.deriveAddress(this._keypairs.publicKey)
    return address
  }

  /**
   * get wallet secret
   * @returns {*}
   */
  public secret() {
    if (!this._keypairs) return null
    return this._secret
  }

  public toJson() {
    if (!this._keypairs) return null
    return {
      secret: this.secret(),
      address: this.address()
    }
  }

  /*
   * Get the public key from key pair
   * used for local signing operation.
   */
  public getPublicKey() {
    if (!this._keypairs) return null
    return this._keypairs.publicKey
  }

  /**
   * sign message with wallet privatekey
   * @param message
   * @returns {*}
   */
  public sign(message) {
    if (!message) return null
    if (!this._keypairs) return null
    const privateKey = this._keypairs.privateKey
    // Export DER encoded signature in Array
    return this._kp.keyPairs().signHash(message, privateKey)
  }

  /**
   * verify signature with wallet publickey
   * @param message
   * @param signature
   * @returns {*}
   */
  public verify(message, signature) {
    if (!this._keypairs) return null
    const publicKey = this.getPublicKey()
    return this._kp.keyPairs().verifyHash(message, signature, publicKey)
  }

  /**
   * sign message with wallet privatekey
   * Export DER encoded signature in Array
   * @param message
   * @returns {*}
   */
  public signTx(message) {
    if (!message) return null
    if (!this._keypairs) return null
    const privateKey = this._keypairs.privateKey
    // Export DER encoded signature in Array
    return this._kp.keyPairs().signTx(message, privateKey)
  }

  /**
   * verify signature with wallet publickey
   * @param message
   * @param signature
   * @returns {*}
   */
  public verifyTx(message, signature) {
    if (!this._keypairs) return null
    const publicKey = this.getPublicKey()
    return this._kp.keyPairs().verifyTx(message, signature, publicKey)
  }
}

export { Wallet }
