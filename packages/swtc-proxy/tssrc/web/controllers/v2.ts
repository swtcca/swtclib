import { APIError } from "../rest"

module.exports = {
  "GET /v2/wallet/new": async (ctx, next) => {},
  "GET /v2/accounts/:address/info": async (ctx, next) => {},
  "GET /v2/accounts/:address/balances": async (ctx, next) => {},
  "GET /v2/accounts/:source_address/payments": async (ctx, next) => {},
  "GET /v2/accounts/:address/payments/:id": async (ctx, next) => {},
  "GET /v2/accounts/:address/transactions/:id": async (ctx, next) => {},
  "GET /v2/accounts/:address/transactions": async (ctx, next) => {},
  "POST /v2/accounts/:address/payments": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, post v2/blob suggested")
  },
  "GET /v2/accounts/:address/orders": async (ctx, next) => {},
  "GET /v2/accounts/:address/orders/:hash": async (ctx, next) => {},
  "POST /v2/accounts/:address/orders": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, post v2/blob suggested")
  },
  "DELETE /v2/accounts/:address/orders": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, post v2/blob suggested")
  },
  "GET /v2/order_book/:base/:counter": async (ctx, next) => {},
  "GET /v2/order_book/bids/:base/:counter": async (ctx, next) => {},
  "GET /v2/order_book/asks/:base/:counter": async (ctx, next) => {},
  "GET /v2/transactions/:id": async (ctx, next) => {},
  "POST /v2/accounts/:address/contract/deploy": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, post v2/blob suggested")
  },
  "POST /v2/accounts/:address/contract/call": async (ctx, next) => {
    throw new APIError("api:disable", "insecure, post v2/blob suggested")
  },
  "GET /v2/ledger/index": async (ctx, next) => {},
  "GET /v2/ledger/index/:index": async (ctx, next) => {},
  "GET /v2/ledger/hash/:hash": async (ctx, next) => {},
  "POST /v2/blob": async (ctx, next) => {}
}
