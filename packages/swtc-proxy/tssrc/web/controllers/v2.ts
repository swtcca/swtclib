import { APIError } from "../rest"
import * as V2 from "../../functions/v1"

module.exports = {
  "GET /v1/wallet/new": V2.generateWallet,
  "GET /v1/accounts/:address/info": V2.getAccountInfo,
  "GET /v1/accounts/:address/authorizes": V2.getAccountAuthorizes,
  "GET /v1/accounts/:address/freezes": V2.getAccountFreezes,
  "GET /v1/accounts/:address/trusts": V2.getAccountTrusts,
  "GET /v1/accounts/:address/balances": V2.getAccountBalances,
  "GET /v1/accounts/:address/payments": V2.getAccountPayments,
  "GET /v1/accounts/:address/payments/:hash": V2.getAccountPayment,
  "GET /v1/accounts/:address/transactions": V2.getAccountTransactions,
  "GET /v1/accounts/:address/transactions/:hash": V2.getAccountTransaction,
  "GET /v1/accounts/:address/orders": V2.getAccountOrders,
  "GET /v1/accounts/:address/orders/:hash": V2.getAccountOrder,
  "POST /v1/accounts/:address/payments": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, use post v1/blob")
  },
  "POST /v1/accounts/:address/orders": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, use post v1/blob")
  },
  "DELETE /v1/accounts/:address/orders": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, disabled")
  },
  "GET /v1/order_book/:base/:counter": V2.getOrderBook,
  "GET /v1/order_book/bids/:base/:counter": V2.getOrderBookBids,
  "GET /v1/order_book/asks/:base/:counter": V2.getOrderBookAsks,
  "GET /v1/transactions/:hash": V2.getTransaction,
  "POST /v1/accounts/:address/contract/deploy": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, post v1/blob suggested")
  },
  "POST /v1/accounts/:address/contract/call": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, post v1/blob suggested")
  },
  "GET /v1/ledgers/closed": V2.getLedgerClosed,
  "GET /v1/ledgers/index/:index": V2.getLedgerIndex,
  "GET /v1/ledgers/hash/:hash": V2.getLedgerHash,
  "POST /v1/blob": V2.postBlob,
  "POST /v1/multisign": V2.postJsonMultisign
}
