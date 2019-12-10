import { APIError, restify } from "./rest"
import Koa from "koa"
import bodyParser from "koa-bodyparser"
import Logger from "koa2-request-log"
import RobotsTxt from "koa-robots.txt"
import koaSimpleQs from "koa-simple-qs"
import { staticRouter } from "./static-files"
import { controller } from "./controller"
import { state } from "../store/index"
import swagger from "./swagger"

const web = new Koa()

// const logger = new Logger().generate() // default setting
const loggerWithOpts = new Logger().generate({
  logColor: "#000",
  stream: process.stdout, // log at console or you can write to a file
  logFmt: ":method :path :status",
  skip(req, res) {
    return res.status >= 400
  }
})
// web.use(logger)
web.use(loggerWithOpts)

// swagger document
web.use(swagger)

// static file support:
web.use(staticRouter().routes())
web.use(RobotsTxt([]))

// middleware for ip based rate limit
web.use(async (ctx, next) => {
  if (state.funcLogIp(ctx.request.ip) < state.RATE.value) {
    await next()
  } else {
    const e = new APIError(
      "api:ratelimit",
      `rate limit ${state.RATE.value} per 5 minutes, try later`
    )
    ctx.response.status = 400
    ctx.response.type = "application/json"
    ctx.response.body = { code: e.code, message: e.message }
  }
})
// middleware check backend store.remote.value.isConnected()
web.use(async (ctx, next) => {
  if (state.remote.value.isConnected()) {
    await next()
  } else {
    const e = new APIError("api:backend", "currenly diconnected, wait and try")
    ctx.response.status = 400
    ctx.response.type = "application/json"
    ctx.response.body = { code: e.code, message: e.message }
  }
})

// middleware use qs to parse query
web.use(koaSimpleQs({ depth: 1, parameterLimit: 10, allowDots: true }))

// parse request body:
web.use(bodyParser())

// bind .rest() for ctx:
web.use(restify())

// Debug settings store.DEBUG.value
web.use(async (ctx, next) => {
  if (state.DEBUG.value) {
    console.log(`debug: url = ${ctx.request.url}`)
  }
  await next()
})

// add controller middleware:
web.use(controller())

// return apiError if no endpoint found
web.use(async (ctx: any) => {
  const e = new APIError("api:endpoint", "api endpoint not found")
  ctx.response.status = 400
  ctx.response.type = "application/json"
  ctx.response.body = { code: e.code, message: e.message }
})

export { controller, web }
