import * as rest from "./rest"
import Koa from "koa"
import bodyParser from "koa-bodyparser"
// const bodyParser = bodyParser_
import { controller } from "./controller"
import Logger from "koa2-request-log"

const web = new Koa()

const logger = new Logger().generate() // default setting
const loggerWithOpts = new Logger().generate({
  logColor: "#000",
  stream: process.stdout, // log at console or you can write to a file
  logFmt: ":method :path :status",
  skip(req, res) {
    return res.status >= 400
  }
}) // log with some options
web.use(logger)
web.use(loggerWithOpts)

// static file support:
import { staticFiles } from "./static-files"
import path from "path"
web.use(staticFiles("/static/", path.join(__dirname, "static")))

web.use(async (ctx, next) => {
  if (ctx.request.path === "/robots.txt") {
    ctx.response.redirect("/static/robots.txt")
  } else {
    await next()
  }
})
// parse request body:
web.use(bodyParser())

// bind .rest() for ctx:
web.use(rest.restify())

// add controller middleware:
web.use(controller())

export { web }
