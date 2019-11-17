import * as rest from "./rest"
import Koa from "koa"
import bodyParser from "koa-bodyparser"
// const bodyParser = bodyParser_
import { controller } from "./controller"

const web = new Koa()

web.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
  await next()
})

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
