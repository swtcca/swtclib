// this is only for jcc compatibility use
import SWTC_CHAINS from "swtc-chains"
import SwtcKeypairs from "swtc-keypairs"

const KEYPAIRS = {}
SWTC_CHAINS.forEach((chain) => {
  KEYPAIRS[chain.code.toLowerCase()] = SwtcKeypairs(chain.code.toLowerCase())
  KEYPAIRS[chain.currency.toLowerCase()] = SwtcKeypairs(
    chain.currency.toLowerCase()
  )
})

class KeyPairs {
  public static KEYPAIRS = KEYPAIRS
  public readonly _token
  constructor(token = "swt") {
    this._token = token.toLowerCase()
    if (KEYPAIRS[this._token] === undefined) {
      throw new Error(`config of ${token.toLowerCase()} is empty`)
    }
  }

  /**
   * get corresponding Keypair for its _token
   */
  public keyPairs() {
    return KeyPairs.KEYPAIRS[this._token]
  }
  /**
   * generate random bytes and encode it to secret
   * @returns {string}
   */
  public generateSeed(options) {
    return this.keyPairs().generateSeed(options)
  }

  /**
   * derive keypair from secret
   * @param {string} secret
   * @returns {{privateKey: string, publicKey: *}}
   */
  public deriveKeyPair(secret) {
    return this.keyPairs().deriveKeyPair(secret)
  }

  /**
   * derive wallet address from publickey
   * @param {string} publicKey
   * @returns {string}
   */
  public deriveAddress(publicKey) {
    return this.keyPairs().deriveAddress(publicKey)
  }

  /**
   * check is address is valid
   * @param address
   * @returns {boolean}
   */
  public checkAddress(address) {
    return this.keyPairs().checkAddress(address)
  }

  /**
   * convert the given address to byte array
   * @param address
   * @returns byte array
   */
  public convertAddressToBytes(address) {
    if (this.checkAddress(address)) {
      return this.keyPairs().convertAddressToBytes(address)
    } else {
      throw new Error("convert address to bytes in error")
    }
  }

  /*
   * convert the byte array to wallet address
   */
  public convertBytesToAddress(bytes) {
    if (typeof bytes !== "object") {
      throw new Error("convert bytes to address in error")
    }
    return this.keyPairs().convertBytesToAddress(bytes)
  }
}

export { KeyPairs }
