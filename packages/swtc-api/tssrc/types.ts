export {
  IAmount,
  ISwtcTxOptions,
  IPaymentTxOptions,
  IOfferCreateTxOptions,
  IOfferCancelTxOptions,
  IContractInitTxOptions,
  IContractInvokeTxOptions,
  IContractDeployTxOptions,
  IContractCallTxOptions
} from "swtc-transaction"

export interface IRemoteOptions {
  server?: string
  issuer?: string
  token?: string
  solidity?: boolean
}
