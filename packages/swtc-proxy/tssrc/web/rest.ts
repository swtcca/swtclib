class APIError {
  public code
  public message
  constructor(code, message) {
    this.code = code || "internal:unknown_error"
    this.message = message || ""
  }
}

const restify = (pathPrefix = "/api/") => {
  return async (ctx, next) => {
    // if (ctx.request.path.startsWith(pathPrefix)) {
    // add ctx.rest anyway
    if (true) {
      if (
        !/json/i.test(ctx.request.headers.accept) &&
        /html/i.test(ctx.request.headers.accept)
      ) {
        ctx.rest = data => {
          // console.log(`Process API ${ctx.request.method} ${ctx.request.url}...`)
          // ctx.render('api.html', {data: data});
          ctx.response.type = "application/json"
          ctx.response.body = data
        }
      } else {
        ctx.rest = data => {
          ctx.response.type = "application/json"
          ctx.response.body = data
        }
      }
      try {
        await next()
      } catch (e) {
        // console.log("Process API error...")
        ctx.response.status = 400
        ctx.response.type = "application/json"
        ctx.response.body = {
          code: e.code || "internal:unknown_error",
          message: e.message || ""
        }
      }
    } else {
      await next()
    }
  }
}

export { APIError, restify }
