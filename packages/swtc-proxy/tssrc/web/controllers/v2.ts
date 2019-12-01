import { APIError } from "../rest"
import * as V2 from "../../functions/v2"

module.exports = {
  "GET /v2/wallet/new": V2.generateWallet,
  "GET /v2/accounts/:address/info": V2.getAccountInfo,
  "GET /v2/accounts/:address/authorizes": V2.getAccountAuthorizes,
  "GET /v2/accounts/:address/freezes": V2.getAccountFreezes,
  "GET /v2/accounts/:address/trusts": V2.getAccountTrusts,
  "GET /v2/accounts/:address/balances": V2.getAccountBalances,
  "GET /v2/accounts/:address/payments": V2.getAccountPayments,
  "GET /v2/accounts/:address/payments/:hash": V2.getAccountPayment,
  "GET /v2/accounts/:address/transactions": V2.getAccountTransactions,
  "GET /v2/accounts/:address/transactions/:hash": V2.getAccountTransaction,
  "GET /v2/accounts/:address/orders": V2.getAccountOrders,
  "GET /v2/accounts/:address/orders/:hash": V2.getAccountOrder,
  "POST /v2/accounts/:address/payments": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, use post v2/blob")
  },
  "POST /v2/accounts/:address/orders": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, use post v2/blob")
  },
  "DELETE /v2/accounts/:address/orders": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, disabled")
  },
  "GET /v2/order_book/:base/:counter": V2.getOrderBook,
  "GET /v2/order_book/bids/:base/:counter": V2.getOrderBookBids,
  "GET /v2/order_book/asks/:base/:counter": V2.getOrderBookAsks,
  "GET /v2/transactions/:hash": V2.getTransaction,
  "POST /v2/accounts/:address/contract/deploy": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, post v2/blob suggested")
  },
  "POST /v2/accounts/:address/contract/call": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, post v2/blob suggested")
  },
  "GET /v2/ledgers/closed": V2.getLedgerClosed,
  "GET /v2/ledgers/index/:index": V2.getLedgerIndex,
  "GET /v2/ledgers/hash/:hash": V2.getLedgerHash,
  "POST /v2/blob": V2.postBlob,
  "POST /v2/multisign": V2.postJsonMultisign
}
