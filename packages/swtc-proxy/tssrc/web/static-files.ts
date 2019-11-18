import path from "path"
import { Serve } from "static-koa-router"
import Router from "koa-router"

export function staticRouter(
  url = "/static",
  dir = path.resolve(process.cwd(), "static")
) {
  const router = Router({ prefix: url })
  Serve(dir, router)
  return router
}
