import { APIError } from "../rest"

module.exports = {
  "GET /v1/ledgers": async (ctx, next) => {
    ctx.rest({ ledger_hash: "abc", ledger_index: 100 })
  },
  "GET /v1/ledger/index/:index": async (ctx, next) => {
    ctx.rest({ ledger_hash: "abc", ledger_index: 100 })
  },
  "GET /v1/ledger/hash/:hash": async (ctx, next) => {
    ctx.rest({ ledger_hash: "abc", ledger_index: 100 })
  },
  "GET /v1/accounts/:address/info": async (ctx, next) => {
    ctx.rest({ address: ctx.params.address, info: "info" })
  },
  "GET /v1/accounts/:address/payments": async (ctx, next) => {
    ctx.rest({ address: ctx.params.address, payments: "payments" })
  },
  "GET /v1/accounts/:address/error": async (ctx, next) => {
    throw new APIError("abc", "100")
  }
}
