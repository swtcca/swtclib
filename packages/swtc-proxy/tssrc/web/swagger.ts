import koaSwagger from "koa2-swagger-ui"

export default koaSwagger({
  routePrefix: "/swagger", // host at /swagger instead of default /docs
  swaggerOptions: {
    url: "/static/swagger.json" // example path to json
  }
})
