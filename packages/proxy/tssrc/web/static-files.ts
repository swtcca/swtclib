import path from "path"
import koaStatic from "koa-static"
import type { Middleware } from "koa"

export function staticRouter(
  url = "/static",
  dir = path.resolve(process.cwd(), "static")
): { routes(): Middleware } {
  const serve = koaStatic(dir)
  const middleware: Middleware = async (ctx, next) => {
    if (ctx.path.startsWith(url)) {
      const original = ctx.path
      ctx.path = ctx.path.slice(url.length) || "/"
      await serve(ctx, async () => {
        ctx.path = original
        await next()
      })
    } else {
      await next()
    }
  }
  return { routes: () => middleware }
}
