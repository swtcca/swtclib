import { APIError } from "../rest"
import * as store from "../../store/index"

module.exports = {
  "GET /v1/wallet/new": async ctx => ctx.rest(store.Wallet.generate()),
  "GET /v1/accounts/:address/info": store.getAccountInfo,
  "GET /v1/accounts/:address/authorizes": store.getAccountAuthorizes,
  "GET /v1/accounts/:address/freezes": store.getAccountFreezes,
  "GET /v1/accounts/:address/trusts": store.getAccountTrusts,
  "GET /v1/accounts/:address/balances": store.getAccountBalances,
  "GET /v1/accounts/:address/payments": store.getAccountPayments,
  "GET /v1/accounts/:address/payments/:hash": store.getAccountPayment,
  "GET /v1/accounts/:address/transactions": store.getAccountTransactions,
  "GET /v1/accounts/:address/transactions/:hash": store.getAccountTransaction,
  "GET /v1/accounts/:address/orders": store.getAccountOrders,
  "GET /v1/accounts/:address/orders/:hash": store.getAccountOrder,
  "POST /v1/accounts/:address/payments": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, use post v1/blob")
  },
  "POST /v1/accounts/:address/orders": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, use post v1/blob")
  },
  "DELETE /v1/accounts/:address/orders": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, disabled")
  },
  "GET /v1/order_book/:base/:counter": store.getOrderBook,
  "GET /v1/order_book/bids/:base/:counter": store.getOrderBookBids,
  "GET /v1/order_book/asks/:base/:counter": store.getOrderBookAsks,
  "GET /v1/transactions/:hash": store.getTransaction,
  "POST /v1/accounts/:address/contract/deploy": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, post v1/blob suggested")
  },
  "POST /v1/accounts/:address/contract/call": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, post v1/blob suggested")
  },
  "GET /v1/ledgers/closed": store.getLedgerClosed,
  "GET /v1/ledgers/index/:index": store.getLedgerIndex,
  "GET /v1/ledgers/hash/:hash": store.getLedgerHash,
  "POST /v1/blob": store.postBlob,
  "POST /v1/multisign": store.postJsonMultisign
}
