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
  IRelationTxOptions
} from "swtc-transaction"

export interface IRemoteOptions {
  server?: string
  issuer?: string
  token?: string
  solidity?: boolean
}

export interface IParams {
  results_per_page?: number
  page?: number
  marker?: IMarker
  currency?: string
  issuer?: string
}
