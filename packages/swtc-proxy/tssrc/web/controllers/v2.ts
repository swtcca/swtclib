import { APIError } from "../rest"
import { Wallet, state } from "../../store/index"

module.exports = {
  "GET /v2/wallet/new": async (ctx, next) => ctx.rest(Wallet.generate()),
  "GET /v2/accounts/:address/info": getAccountInfo,
  "GET /v2/accounts/:address/balances": getAccountBalances,
  "GET /v2/accounts/:source_address/payments": getAccountPayments,
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
  "POST /v2/blob": async (ctx, next) => {},
  "POST /v2/blob/multisign": async (ctx, next) => {}
}
async function getAccountInfo(ctx, next) {
  try {
    ctx.rest(await state.remote.value.requestAccountInfo({ account: ctx.params.address }).submitPromise())
  } catch (e) {
    throw new APIError("api:operation", e.toString())
  }
}
async function getAccountBalances(ctx, next) {
  try {
    const p_trust = state.remote.value.requestAccountRelations({ account: ctx.params.address, type: "trust" }).submitPromise()
    const p_info = state.remote.value.requestAccountInfo({ account: ctx.params.address }).submitPromise()
    const [trust, info] = await Promise.all([p_trust, p_info])
    ctx.rest(Object.assign(trust, info.account_data))
  } catch (e) {
    throw new APIError("api:operation", e.toString())
  }
}
async function getAccountPayments(ctx, next) {
  try {
    ctx.rest(await state.remote.value.requestAccountInfo({ account: ctx.params.address }).submitPromise())
  } catch (e) {
    throw new APIError("api:operation", e.toString())
  }
}
