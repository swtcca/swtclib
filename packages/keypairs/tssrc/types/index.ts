import { IAlgorithm, IChainConfig } from "@swtc/address-codec"

export interface IGenerateOptions {
  entropy?: Uint8Array
  algorithm?: IAlgorithm
}

export interface IKeypair {
  privateKey: string
  publicKey: string
}

export { IAlgorithm, IChainConfig }
