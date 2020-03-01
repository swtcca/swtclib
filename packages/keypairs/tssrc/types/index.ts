export type IAlgorithm = "ed25519" | "ecdsa-secp256k1"

export interface IGenerateOptions {
  entropy?: Uint8Array
  algorithm?: IAlgorithm
}

export interface IKeypair {
  privateKey: string
  publicKey: string
}
