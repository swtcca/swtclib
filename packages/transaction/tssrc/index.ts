"use strict"

import { Factory } from "./transaction"
import { WalletGm } from "@swtc/wallet"
const Transaction = Factory()
const TransactionGm = Factory(WalletGm)

export { Factory, Transaction, TransactionGm }
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
} from "./types"
