import { Wallet } from "swtc-wallet"
import { Factory } from "./remote"

const Remote = Factory(Wallet)
const Transaction = Remote.Transaction
const OrderBook = Remote.OrderBook
const Account = Remote.Account
const Request = Remote.Request
const utils = Remote.utils

export { Remote, Wallet, Transaction, OrderBook, Account, Request, utils }
