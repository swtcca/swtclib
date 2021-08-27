export interface IWallet {
  secret: string | null
  address: string | null
}

export interface IGenerateOptions {
  entropy?: Uint8Array
  algorithm?: IAlgorithm
}

export interface IAmount {
  currency: string
  value: number
  issuer: string
}

export interface ICurrency {
  currency: string
  issuer: string
}

export type IAlgorithm = "ed25519" | "secp256k1" | "sm2p256v1"
