import koaSwagger from "koa2-swagger-ui"

export default koaSwagger({
  routePrefix: "/swagger", // host at /swagger instead of default /docs
  swaggerOptions: {
    url: "http://petstore.swagger.io/v2/swagger.json" // example path to json
  }
})
