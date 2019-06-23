export interface IMarker {
  ledger: string | number
  seq: string | number
}

export interface ICurrency {
  currency: string
  issuer: string
}

export interface IAmount {
  currency: string
  issuer: string
  value: number
}

export interface ISwtcTxOptions {
  memo?: string
  secret?: string
  sequence?: string | number
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
  sequence?: string | number
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
  platform?: any
  memo?: string
  secret?: string
  sequence?: string | number
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
  params?: string[]
  memo?: string
  secret?: string
  sequence?: string | number
}

export interface IContractInvokeTxOptions {
  amount: number
  account: string
  destination: string
  abi: any[]
  func: string
  memo?: string
  secret?: string
  sequence?: string | number
}

export interface IContractDeployTxOptions {
  amount: IAmount
  account: string
  payload: string
  params?: string[]
  memo?: string
  secret?: string
  sequence?: string | number
}

export interface IContractCallTxOptions {
  amount: IAmount
  account: string
  destination: string
  params?: string[]
  func?: string
  foo?: string
  memo?: string
  secret?: string
  sequence?: string | number
}

export interface ISignTxOptions {
  blob: string
}

export interface IAccountSetTxOptions {
  type: string
  source?: string
  from?: string
  account?: string
  set?: string | number
  set_flag?: string | number
  clear?: string | number
  clear_flag?: string | number
  delegate_key?: string
  memo?: string
  secret?: string
  sequence?: string | number
}

export interface IRelationTxOptions {
  type: string
  source?: string
  from?: string
  account?: string
  target: string
  limit: IAmount
  quality_out: any
  quality_in: any
  memo?: string
  secret?: string
  sequence?: string | number
}
