import { IMarker, IAmount } from "swtc-transaction"
export {
  IMarker,
  ICurrency,
  IAmount,
  ISwtcTxOptions,
  IPaymentTxOptions,
  IOfferCreateTxOptions,
  IOfferCancelTxOptions,
  IContractInitTxOptions,
  IContractInvokeTxOptions,
  IContractDeployTxOptions,
  IContractCallTxOptions,
  ISignTxOptions,
  IAccountSetTxOptions,
  IRelationTxOptions,
  ISignerListTxOptions,
  ISignFirstTxOptions,
  ISignOtherTxOptions,
  IMultiSigningOptions
} from "swtc-transaction"

export interface IRemoteOptions {
  server?: string
  server_failover?: string
  issuer?: string
  token?: string
  solidity?: boolean
  local_sign?: boolean
  timeout?: number
  failover?: boolean
}

export interface IRequestLedgerOptions {
  ledger_index?: string | number
  ledger_hash?: string
  full?: boolean
  expand?: boolean
  transactions?: boolean
  accounts?: boolean
}

export interface IRequestAccountOptions {
  account: string
  type?: string
  ledger?: string
  ledger_index: string | number
  ledger_hash: string
  marker?: IMarker
  peer?: any
  limit?: string | number
}

export interface IRequestAccountsOptions {
  ledger_index?: string | number
  ledger_hash?: string
  ledger?: string
  marker?: IMarker
}

export interface IRequestTxOptions {
  hash: string
}

export interface IRequestAccountInfoOptions {
  account: string
  ledger?: string
  ledger_index?: string | number
  ledger_hash?: string
}

export interface IRequestAccountTumsOptions {
  account: string
  ledger?: string
  ledger_index?: string | number
  ledger_hash?: string
}

export interface IRequestAccountRelationsOptions {
  type: string
  account: string
  ledger?: string
  ledger_index?: string | number
  ledger_hash?: string
  limit?: string | number
  marker?: IMarker
}

export interface IRequestAccountOffersOptions {
  type: string
  account: string
  ledger?: string
  ledger_index?: string | number
  ledger_hash?: string
  limit?: string | number
  marker?: IMarker
}

export interface IRequestAccountTxOptions {
  type: string
  account: string
  ledger?: string
  ledger_index?: string | number
  ledger_hash?: string
  ledger_min?: number
  ledger_max?: number
  limit?: string | number
  marker?: IMarker
  offset?: string | number
  forward?: boolean
}

export interface IRequestOrderBookOptions {
  taker?: string
  taker_gets?: IAmount
  taker_pays?: IAmount
  gets?: IAmount
  pays?: IAmount
  limit?: string | number
  marker?: IMarker
}

export interface IRequestSignerListOptions {
  account: string
}

export interface IRequestBrokerageOptions {
  account: string
}
