import { Factory } from "./remote"
import { Server } from "./server"
import { WalletGm } from "@swtc/wallet"
const RemoteGm = Factory(WalletGm)
const Remote = Factory()
const Wallet = Remote.Wallet
const Request = Remote.Request
const Account = Remote.Account
const Transaction = Remote.Transaction
const OrderBook = Remote.OrderBook
const RequestGm = RemoteGm.Request
const AccountGm = RemoteGm.Account
const TransactionGm = RemoteGm.Transaction
const OrderBookGm = RemoteGm.OrderBook

export {
  Server,
  Factory,
  Remote,
  Wallet,
  Request,
  Account,
  Transaction,
  OrderBook,
  WalletGm,
  RemoteGm,
  RequestGm,
  AccountGm,
  TransactionGm,
  OrderBookGm
}
