export type IAlgorithm = "ed25519" | "secp256k1" | "sm2p256v1"

export interface IGenerateOptions {
  entropy?: Uint8Array
  algorithm?: IAlgorithm
}

export interface IKeypair {
  privateKey: string
  publicKey: string
}
