import { APIError, restify } from "./rest"
import Koa from "koa"
import bodyParser from "koa-bodyparser"
// const bodyParser = bodyParser_
import { controller } from "./controller"
import Logger from "koa2-request-log"
import RobotsTxt from "koa-robots.txt"
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
}) // log with some options
// web.use(logger)
web.use(loggerWithOpts)

// swagger document
web.use(swagger)

// static file support:
import { staticRouter } from "./static-files"
web.use(staticRouter().routes())
web.use(RobotsTxt([]))

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

// parse request body:
web.use(bodyParser())

// bind .rest() for ctx:
web.use(restify())

// Debug settings store.DEBUG.value
web.use(async (ctx, next) => {
  if (state.DEBUG.value) {
    console.log(ctx.params)
  }
  await next()
})

// add controller middleware:
web.use(controller())

export { controller, web }
