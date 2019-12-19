const store = require("../src/store")

afterAll(() => {
  store.state.funcCleanup()
  return Promise.resolve(true)
})

store_keys = Object.keys(store.state)
states = [
  "DEBUG",
  "LIMIT",
  "remote",
  "config",
  "server",
  "ledger",
  "logs",
  "status",
  "wsConnected",
  "funcConfig",
  "funcLogIp",
  "funcCleanup",
  "rateMap",
  "RATE"
]

describe("Store Test", function() {
  states.forEach(state => {
    test(`has ${state}`, function() {
      expect(store_keys).toContain(state)
    })
  })
  test("get/set DEBUG", function() {
    store.state.DEBUG.value = true
    expect(store.state.DEBUG.value).toBeTruthy()
    store.state.DEBUG.value = false
    expect(store.state.DEBUG.value).toBeFalsy()
  })
  test("get/set RATE", function() {
    store.state.RATE.value = 10
    expect(store.state.RATE.value).toBe(10)
  })
  test("get/set LIMIT", function() {
    store.state.LIMIT.value = 10
    expect(store.state.LIMIT.value).toBe(10)
  })
  test("state.wsConnected", function() {
    expect(store.state.wsConnected.value).toBeFalsy()
  })
  test("computed state.server", async function() {
    expect(store.state.server.value).toBe("")
  })
  test("state.config", function() {
    expect(store.state.config.value).toEqual({})
  })
  test("state.status", function() {
    expect(store.state.status.value).toEqual({})
  })
  test("state.ledger", function() {
    expect(store.state.ledger.value).toEqual({})
  })
})
