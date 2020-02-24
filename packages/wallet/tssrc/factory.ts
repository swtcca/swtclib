import { funcGetChain } from "@swtc/common"
import { Factory as KeypairFactory } from "@swtc/keypairs"
import {
  IAlgorithm,
  IAmount,
  ICurrency,
  IGenerateOptions,
  IWallet
} from "./types"

const Factory = (token_or_chain = "jingtum") => {
  const chain = funcGetChain(token_or_chain)
  if (!chain) {
    throw Error("token or chain not supported")
  }

  const KeyPair = KeypairFactory(chain.code)

  return class Wallet {
    public static token = chain.currency.toUpperCase()
    public static chain = chain.code.toLowerCase()
    public static KeyPair = KeyPair
    public static config = chain
    public static getCurrency(): string {
      return Wallet.token || "SWT"
    }
    public static getCurrencies() {
      return Wallet.config.CURRENCIES || {}
    }
    public static getChain(): string {
      return Wallet.chain || "jingtum"
    }
    public static getFee(): number {
      return Wallet.config.fee || 10000
    }
    public static getAccountZero(): string {
      return Wallet.config.ACCOUNT_ZERO || "jjjjjjjjjjjjjjjjjjjjjhoLvTp"
    }
    public static getAccountOne(): string {
      return Wallet.config.ACCOUNT_ONE || "jjjjjjjjjjjjjjjjjjjjBZbvri"
    }
    public static getIssuer(): string {
      return Wallet.config.issuer || "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
    }
    public static makeCurrency(
      currency = Wallet.token,
      issuer = Wallet.getIssuer()
    ): ICurrency {
      const CURRENCIES = Wallet.getCurrencies()
      currency = currency.toUpperCase()
      currency = CURRENCIES.hasOwnProperty(currency)
        ? CURRENCIES[currency]
        : currency
      return currency === Wallet.token
        ? { currency, issuer: "" }
        : { currency, issuer }
    }
    public static makeAmount(
      value = 1,
      currency = Wallet.token,
      issuer = Wallet.getIssuer()
    ): IAmount {
      return typeof currency === "object"
        ? Object.assign({}, currency, { value: Number(value) })
        : Object.assign({}, this.makeCurrency(currency, issuer), {
            value: Number(value)
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

    public static fromSecret(
      secret_or_private_key: string,
      algorithm: IAlgorithm = "ecdsa-secp256k1"
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
      algorithm: IAlgorithm = "ecdsa-secp256k1"
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
