export { IAlgorithm, IKeypair, IGenerateOptions } from "@swtc/keypairs"

export interface IWallet {
  secret: string | null
  address: string | null
}

export interface IAmount {
  currency: string
  value: string | number
  issuer: string
}

export interface ICurrency {
  currency: string
  issuer: string
}

export interface IXlib {
  [key: string]: string
}

export interface ICurrencies {
  [key: string]: string
}

export interface IChainConfig {
  code?: string
  currency?: string
  issuer?: string
  guomi?: boolean
  ACCOUNT_ALPHABET?: string
  fee?: number
  CURRENCIES?: ICurrencies
  XLIB?: IXlib
  [key: string]: any
}
