import { APIError } from "../rest"
import * as V1 from "../../functions/v1"

module.exports = {
  "GET /v1/wallet/new": V1.generateWallet,
  "GET /v1/accounts/:address/info": V1.getAccountInfo,
  "GET /v1/accounts/:address/authorizes": V1.getAccountAuthorizes,
  "GET /v1/accounts/:address/freezes": V1.getAccountFreezes,
  "GET /v1/accounts/:address/trusts": V1.getAccountTrusts,
  "GET /v1/accounts/:address/balances": V1.getAccountBalances,
  "GET /v1/accounts/:address/payments": V1.getAccountPayments,
  "GET /v1/accounts/:address/payments/:hash": V1.getAccountPayment,
  "GET /v1/accounts/:address/transactions": V1.getAccountTransactions,
  "GET /v1/accounts/:address/transactions/:hash": V1.getAccountTransaction,
  "GET /v1/accounts/:address/orders": V1.getAccountOrders,
  "GET /v1/accounts/:address/orders/:hash": V1.getAccountOrder,
  "POST /v1/accounts/:address/payments": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, use post v1/blob")
  },
  "POST /v1/accounts/:address/orders": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, use post v1/blob")
  },
  "DELETE /v1/accounts/:address/orders": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, disabled")
  },
  "GET /v1/order_book/:base/:counter": V1.getOrderBook,
  "GET /v1/order_book/bids/:base/:counter": V1.getOrderBookBids,
  "GET /v1/order_book/asks/:base/:counter": V1.getOrderBookAsks,
  "GET /v1/transactions/:hash": V1.getTransaction,
  "POST /v1/accounts/:address/contract/deploy": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, post v1/blob suggested")
  },
  "POST /v1/accounts/:address/contract/call": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, post v1/blob suggested")
  },
  "GET /v1/ledgers/closed": V1.getLedgerClosed,
  "GET /v1/ledgers/index/:index": V1.getLedgerIndex,
  "GET /v1/ledgers/hash/:hash": V1.getLedgerHash,
  "POST /v1/blob": V1.postBlob,
  "POST /v1/multisign": V1.postJsonMultisign
}
