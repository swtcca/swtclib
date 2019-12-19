const koa = require("../src")

afterAll(() => {
  koa.state.funcCleanup()
  return Promise.resolve(true)
})

describe("Web Test", function() {
  test("has router", function() {
    expect(koa).toHaveProperty("router")
  })
  test("router() has router", function() {
    expect(koa.router()).toHaveProperty("router")
  })
  test("has web", function() {
    expect(koa).toHaveProperty("web")
  })
  test("has web.middleware", function() {
    expect(koa.web).toHaveProperty("middleware")
  })
  test("number of middlewares", function() {
    expect(koa.web.middleware.length).toBe(12)
  })
})
