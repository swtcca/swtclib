import { IMarker as IObjMarker, ICurrency, IAmount } from "@swtc/transaction"
type IMarker = IObjMarker | string
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
  IMultiSigningOptions,
  IBrokerageTxOptions
} from "@swtc/transaction"

export interface IRemoteOptions {
  server?: string
  issuer?: string
  token?: string
  solidity?: boolean
  backend?: string
  local_sign?: boolean
  timeout?: number
}

export interface IParams {
  results_per_page?: number
  page?: number
  marker?: IMarker
  currency?: string
  issuer?: string
  ledger?: string
  ledger_min?: number
  ledger_max?: number
  ledger_index?: number
  ledger_hash?: string
  hash?: string
  index?: number
  forward?: boolean
  offset?: number
  limit?: number
}

export interface IRpcLedgerOptions {
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  expand?: boolean
  transactions?: boolean
  accounts?: boolean
  full?: boolean
  binray?: boolean
}

export interface IRpcLedgerDataOptions {
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  binary?: boolean
  limit?: number
  marker?: IMarker
}

export interface IRpcLedgerEntryOptions {
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  type?: string
  binary?: boolean
  [key: string]: any
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

export interface IRequestAccountTumsOptions {
  account: string
  ledger?: string
}

export interface IRequestAccountRelationsOptions {
  type: string
  account: string
  ledger?: string
  peer?: string
}

export interface IRequestAccountOffersOptions {
  type: string
  account: string
  ledger?: string
}

export interface IRequestAccountTxOptions {
  type: string
  account: string
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

export interface IRpcTxHistoryOptions {
  start: number
}

export interface IRpcTxOptions {
  transaction: string
  binray?: boolean
  min_ledger?: number
  max_ledger?: number
}

export interface IRpcTxEntryOptions {
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  tx_hash: string
}

export interface IRpcSubmitOptions {
  tx_blob: string
  fail_hard?: boolean
}

export interface IRpcSubmitMultisignedOptions {
  tx_json: object
  fail_hard?: boolean
}

export interface IRpcFeeInfoOptions {
  account: string
}

export interface IRpcBlacklistInfoOptions {
  account?: string
  marker?: IMarker
}

export interface IRpcAccountInfoOptions {
  account: string
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
}

export interface IRpcAccountObjectsOptions {
  account: string
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  type?: "offer" | "ticket" | "state" | "deposit_preauth" | "SignerList"
  limit?: number
  marker?: IMarker
}

export interface IRpcAccountCurrenciesOptions {
  account: string
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  strict?: boolean
}

export interface IRpcAccountLinesOptions {
  account: string
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  strict?: boolean
  peer?: string
  marker?: IMarker
}

export interface IRpcAccountRelationOptions {
  account: string
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  strict?: boolean
  peer?: string
  marker?: IMarker
}

export interface IRpcAccountOffersOptions {
  account: string
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  strict?: boolean
  limit?: number
  marker?: IMarker
}

export interface IRpcAccountTxOptions {
  account: string
  ledger_index_min?: number
  ledger_index_max?: number
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  binary?: boolean
  forward?: boolean
  limit?: number
  marker?: IMarker
}

export interface IRpcBookOffersOptions {
  taker_pays: object
  taker_gets: object
  // taker?: string
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  limit?: number
  // marker?: IMarker
}

export interface IRpcSkywellPathFindOptions {
  source_account: string
  destination_account: string
  destination_amount: string | object
  source_currencies: ICurrency[]
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  binary?: boolean
}
