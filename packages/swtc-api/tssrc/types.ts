import { IMarker } from "swtc-transaction"
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
  issuer?: string
  token?: string
  solidity?: boolean
  backend?: string
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
