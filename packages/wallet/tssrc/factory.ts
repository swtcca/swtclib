import { funcGetChain, ACCOUNT_ID_ZERO, ACCOUNT_ID_ONE } from "@swtc/common"
import { Factory as KeypairFactory } from "@swtc/keypairs"
import {
  IAlgorithm,
  IAmount,
  ICurrency,
  IGenerateOptions,
  IWallet,
  IChainConfig
} from "./types"

const Factory: any = (token_or_chain: string | IChainConfig = "jingtum") => {
  let config: IChainConfig
  const KeyPair = KeypairFactory(token_or_chain)
  const addressCodec = KeyPair.addressCodec
  const config_default = {
    code: "jingtum",
    fee: 10
    // issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
  }
  if (typeof token_or_chain === "string") {
    const active_chain = funcGetChain(token_or_chain)
    if (!active_chain) {
      throw new Error("the chain you specified is not registered")
    } else {
      config = active_chain as IChainConfig
    }
  } else {
    config = token_or_chain as IChainConfig
  }
  config.code = (config.code || config_default.code).toLowerCase()
  config.currency = KeyPair.token
  config.fee = config.fee || config_default.fee
  config.guomi = KeyPair.guomi
  config.ACCOUNT_ALPHABET = KeyPair.addressCodec.codec.alphabet
  config.ACCOUNT_ZERO = addressCodec.encodeAccountID(
    Buffer.from(Buffer.from(ACCOUNT_ID_ZERO, "hex").toJSON().data)
  )
  config.ACCOUNT_ONE = addressCodec.encodeAccountID(
    Buffer.from(Buffer.from(ACCOUNT_ID_ONE, "hex").toJSON().data)
  )
  config.ACCOUNT_GENESIS = KeyPair.deriveAddress(
    KeyPair.deriveKeypair(
      addressCodec.encodeSeed(
        Buffer.from(KeyPair.seedFromPhrase("masterpassphrase"))
      )
    ).publicKey
  )
  config.issuer = config.issuer || config.ACCOUNT_GENESIS
  config.CURRENCIES = config.CURRENCIES || {}
  config.XLIB = config.XLIB || {}

  return class Wallet {
    public static config = config
    public static token = config.currency
    public static chain = config.code
    public static KeyPair = KeyPair
    public static hash = KeyPair.hash
    public static guomi = config.guomi
    public static getCurrency(): string {
      return Wallet.config.currency || "SWT"
    }
    public static getCurrencies() {
      return Wallet.config.CURRENCIES || {}
    }
    public static getChain(): string {
      return Wallet.config.code || "jingtum"
    }
    public static getFee(): number {
      return Wallet.config.fee || 10
    }
    public static getAccountZero(): string {
      return Wallet.config.ACCOUNT_ZERO
    }
    public static getAccountOne(): string {
      return Wallet.config.ACCOUNT_ONE
    }
    public static getIssuer(): string {
      return Wallet.config.issuer || "shouldnotfalltothisdefault"
    }
    public static makeCurrency(
      currency = Wallet.getCurrency(),
      issuer = Wallet.getIssuer()
    ): ICurrency {
      const CURRENCIES = Wallet.getCurrencies()
      currency = currency.toUpperCase()
      currency = CURRENCIES.hasOwnProperty(currency)
        ? CURRENCIES[currency]
        : currency
      return currency === Wallet.getCurrency()
        ? { currency, issuer: "" }
        : { currency, issuer }
    }
    public static makeAmount(
      value = 1,
      currency = Wallet.getCurrency(),
      issuer = Wallet.getIssuer()
    ): IAmount {
      return typeof currency === "object"
        ? Object.assign({}, currency, { value: `${value}` })
        : Object.assign({}, this.makeCurrency(currency, issuer), {
            value: `${value}`
          })
    }
    public static generate(options: IGenerateOptions = {}): IWallet {
      const secret = KeyPair.generateSeed(options)
      const keypair = KeyPair.deriveKeyPair(secret)
      const address = KeyPair.deriveAddress(keypair.publicKey)
      return {
        secret,
        address
      }
    }
    public static fromPhrase(
      phrase: string,
      algorithm: IAlgorithm = Wallet.guomi ? "sm2p256v1" : "secp256k1"
    ): IWallet | null {
      return Wallet.fromSecret(
        addressCodec.encodeSeed(
          Buffer.from(KeyPair.seedFromPhrase(phrase)),
          algorithm
        ),
        algorithm
      )
    }
    public static fromSecret(
      secret_or_private_key: string,
      algorithm: IAlgorithm = Wallet.guomi ? "sm2p256v1" : "secp256k1"
    ): IWallet | null {
      try {
        let secret = secret_or_private_key
        const keypair = KeyPair.deriveKeyPair(secret_or_private_key, algorithm)
        const address = KeyPair.deriveAddress(keypair.publicKey)
        if (/^s/.test(secret_or_private_key)) {
          // secret starts with s
          secret = secret_or_private_key
        } else if (secret_or_private_key.length >= 64) {
          // private key for hdwallet
          secret = "privatekey"
        } else {
          throw new Error("use secret or private key to get wallet")
        }
        return {
          secret,
          address
        }
      } catch (err) {
        return null
      }
    }

    public static isValidAddress(address: string): boolean {
      return KeyPair.isValidAddress(address)
    }

    public static isValidSecret(secret: string): boolean {
      try {
        KeyPair.deriveKeyPair(secret)
      } catch (err) {
        return false
      }
      return true
    }

    public static checkTx(
      message: string,
      signature: string,
      publicKey: string
    ): boolean {
      return KeyPair.verifyTx(message, signature, publicKey)
      // return ec.verify(message, signature, hexToBytes(publicKey))
    }

    public _keypairs
    public _secret
    constructor(
      secret_or_private_key: string,
      algorithm: IAlgorithm = "secp256k1"
    ) {
      // extend for hdwallet, take secret or privatekey, plugs algorithm for raw privateKey
      try {
        this._keypairs = KeyPair.deriveKeyPair(secret_or_private_key, algorithm)
        if (typeof secret_or_private_key !== "string") {
          throw new Error("use secret or private key to instantiate wallet")
        } else if (/^s/.test(secret_or_private_key)) {
          // secret starts with s
          this._secret = secret_or_private_key
        } else if (secret_or_private_key.length >= 64) {
          // private key for hdwallet
          // this._secret = secret_or_private_key
          this._secret = "privatekey"
        } else {
          throw new Error("use secret or private key to instantiate wallet")
        }
      } catch (err) {
        this._keypairs = null
        this._secret = null
      }
    }

    /**
     * get wallet address
     * @returns {string | null}
     */
    public address(): string | null {
      if (!this._keypairs) return null
      const address = KeyPair.deriveAddress(this._keypairs.publicKey)
      return address
    }

    /**
     * get wallet secret
     * @returns {string | null}
     */
    public secret(): string | null {
      if (!this._keypairs) return null
      return this._secret
    }

    /*
     * Get the public key from key pair
     * used for local signing operation.
     */
    public isEd25519(): boolean {
      if (!this._keypairs) return false
      return this._keypairs.privateKey.slice(0, 2).toUpperCase() === "ED"
    }

    public toJson(): IWallet | null {
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
    public getPublicKey(): string | null {
      if (!this._keypairs) return null
      return this._keypairs.publicKey
    }

    /**
     * sign message with wallet privatekey
     * @param message
     * @returns {string | null}
     */
    public sign(message: string): string | null {
      if (!message) return null
      if (!this._keypairs) return null
      const privateKey = this._keypairs.privateKey
      // Export DER encoded signature in Array
      return KeyPair.sign(message, privateKey)
    }

    /**
     * verify signature with wallet publickey
     * @param message
     * @param signature
     * @returns {boolean}
     */
    public verify(message: string, signature: string): boolean {
      if (!this._keypairs) return false
      const publicKey = this.getPublicKey()
      return KeyPair.verify(message, signature, publicKey)
    }

    /**
     * sign message with wallet privatekey
     * Export DER encoded signature in Array
     * @param message
     * @returns {string | null}
     */
    public signTx(message: string): string | null {
      if (!message) return null
      if (!this._keypairs) return null
      const privateKey = this._keypairs.privateKey
      // Export DER encoded signature in Array
      return KeyPair.signTx(message, privateKey)
    }

    /**
     * verify signature with wallet publickey
     * @param message
     * @param signature
     * @returns {boolean}
     */
    public verifyTx(message: string, signature: string): boolean {
      if (!this._keypairs) return false
      const publicKey = this.getPublicKey()
      return KeyPair.verifyTx(message, signature, publicKey)
    }
  }
}

export { Factory }
