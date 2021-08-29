import { Factory } from "./remote"
import { Server } from "./server"
const Remote = Factory()
const Wallet = Remote.Wallet
const Request = Remote.Request
const Account = Remote.Account
const Transaction = Remote.Transaction
const OrderBook = Remote.OrderBook

export {
  Server,
  Factory,
  Remote,
  Wallet,
  Request,
  Account,
  Transaction,
  OrderBook
}
