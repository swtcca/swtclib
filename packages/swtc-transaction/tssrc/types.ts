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
  memo?: string
  secret?: string
  sequence?: string
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
  memo?: string
  secret?: string
  sequence?: string
}

export interface IOfferCancelTxOptions {
  sequence: number
  source?: string
  from?: string
  account?: string
  memo?: string
  secret?: string
}

export interface IContractInitTxOptions {
  amount: number
  account: string
  abi: any[]
  payload: string
  params?: string[] | null | undefined
  memo?: string
  secret?: string
  sequence?: string
}

export interface IContractInvokeTxOptions {
  amount: number
  account: string
  destination: string
  abi: any[]
  func: string
  memo?: string
  secret?: string
  sequence?: string
}

export interface IContractDeployTxOptions {
  amount: IAmount
  account: string
  payload: string
  params?: string[] | null | undefined
  memo?: string
  secret?: string
  sequence?: string
}

export interface IContractCallTxOptions {
  amount: IAmount
  account: string
  destination: string
  params?: string[] | null | undefined
  func?: string
  foo?: string
  memo?: string
  secret?: string
  sequence?: string
}
