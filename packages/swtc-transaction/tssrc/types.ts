export interface IAmount {
  currency: string
  issuer: string
  value: number
}

export interface ISwtcTxOptions {
  memo?: string
  secret?: string
  sequence?: string
}

export interface IPaymentTxOptions {
  amount: IAmount
  source?: string
  from?: string
  account?: string
  destination?: string
  to?: string
}

export interface IOfferCreateTxOptions {
  type: string
  source?: string
  from?: string
  account?: string
  gets?: IAmount
  pays?: IAmount
  taker_gets?: IAmount
  taker_pays?: IAmount
  app?: any
}

export interface IOfferCancelTxOptions {
  sequence: number
  source?: string
  from?: string
  account?: string
}

export interface IContractInitTxOptions {
  amount: IAmount
  account: string
  abi: any[]
  payload: string
  params?: string[] | null | undefined
}

export interface IContractInvokeTxOptions {
  amount: IAmount
  account: string
  abi: any[]
  func: string
}

export interface IContractDeployTxOptions {
  amount: IAmount
  account: string
  payload: string
  params?: string[] | null | undefined
}

export interface IContractCallTxOptions {
  amount: IAmount
  account: string
  destination: string
  func?: string
  foo?: string
}
