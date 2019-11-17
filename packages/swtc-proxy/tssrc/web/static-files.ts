import path from "path"
import mime from "mime"
import fs from "mz"

export function staticFiles(url, dir) {
  return async (ctx, next) => {
    const rpath = ctx.request.path
    if (rpath.startsWith(url)) {
      const fp = path.join(dir, rpath.substring(url.length))
      if (await fs.exists(fp)) {
        ctx.response.type = mime.getType(rpath) || "application/octet-stream"
        ctx.response.body = await fs.readFile(fp)
      } else {
        ctx.response.status = 404
      }
    } else {
      await next()
    }
  }
}
