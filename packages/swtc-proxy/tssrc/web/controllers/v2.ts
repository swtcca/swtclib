import { APIError } from "../rest"
import * as store from "../../store/index"

module.exports = {
  "GET /v2/wallet/new": async ctx => ctx.rest(store.Wallet.generate()),
  "GET /v2/accounts/:address/info": store.getAccountInfo,
  "GET /v2/accounts/:address/authorizes": store.getAccountAuthorizes,
  "GET /v2/accounts/:address/freezes": store.getAccountFreezes,
  "GET /v2/accounts/:address/trusts": store.getAccountTrusts,
  "GET /v2/accounts/:address/balances": store.getAccountBalances,
  "GET /v2/accounts/:address/payments": store.getAccountPayments,
  "GET /v2/accounts/:address/payments/:id": store.getAccountPayment,
  "GET /v2/accounts/:address/transactions": store.getAccountTransactions,
  "GET /v2/accounts/:address/transactions/:id": store.getAccountTransaction,
  "GET /v2/accounts/:address/orders": store.getAccountOrders,
  "GET /v2/accounts/:address/orders/:hash": store.getAccountOrder,
  "POST /v2/accounts/:address/payments": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, use post v2/blob")
  },
  "POST /v2/accounts/:address/orders": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, use post v2/blob")
  },
  "DELETE /v2/accounts/:address/orders": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, disabled")
  },
  "GET /v2/order_book/:base/:counter": store.getOrderBook,
  "GET /v2/order_book/bids/:base/:counter": store.getOrderBookAsks,
  "GET /v2/order_book/asks/:base/:counter": store.getOrderBookBids,
  "GET /v2/transactions/:id": async (ctx, next) => {},
  "POST /v2/accounts/:address/contract/deploy": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, post v2/blob suggested")
  },
  "POST /v2/accounts/:address/contract/call": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, post v2/blob suggested")
  },
  "GET /v2/ledger/index": async (ctx, next) => ctx.rest(store.ledger.value),
  "GET /v2/ledger/index/:index": async (ctx, next) => {},
  "GET /v2/ledger/hash/:hash": async (ctx, next) => {},
  "POST /v2/blob": async (ctx, next) => {},
  "POST /v2/blob/multisign": async (ctx, next) => {}
}
