export {
  IAlgorithm,
  IKeypair,
  IGenerateOptions,
  IWallet,
  IAmount,
  ICurrency,
  IXlib,
  ICurrencies,
  IChainConfig
} from "./types"

import { Factory } from "./factory"
const Wallet = Factory("jingtum")
const KeyPair = Wallet.KeyPair

export { Factory, KeyPair, Wallet }
