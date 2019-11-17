import { APIError } from "../rest"

module.exports = {
  "GET /api/block": async (ctx, next) => {
    ctx.rest({ info: "index not ready yet, use the search please" })
  },
  "GET /api/tx": async (ctx, next) => {
    ctx.rest({ info: "index not ready yet, use the search please" })
  },
  "GET /api/address": async (ctx, next) => {
    ctx.rest({ info: "index not ready yet, use the search please" })
  },
  "GET /api/address/:address": async (ctx, next) => {
    if (!ctx.params.address.startsWith("j")) {
      throw new APIError("invalid_data", "invalid address")
    } else {
      ctx.rest({ address: ctx.params.address })
    }
  }
}
