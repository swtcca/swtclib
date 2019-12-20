import { web, router, state } from "../src"
const request = require("supertest")
const sleep = time => new Promise(res => setTimeout(() => res(), time || 1))
state.config.value.server = "ws://swtcproxy.swtclib.ca:5020"

let transaction

afterAll(() => {
  state.funcCleanup()
  return Promise.resolve(true)
})

describe("Web Test", function() {
  let server = web.listen(50080)
  test("router() has router", function() {
    expect(router()).toHaveProperty("router")
  })
  test("has middleware", function() {
    expect(web).toHaveProperty("middleware")
  })
  test("number of middlewares", function() {
    expect(web.middleware.length).toBe(12)
  })
  test("before backend", async function() {
    let result = await request(server)
      .get("/v3/server/info")
      .expect("Content-Type", /application\/json/)
    expect(result.ok).toBeFalsy()
    expect(JSON.parse(result.text)).toHaveProperty("code")
  })
  test("wait for backend", async function() {
    jest.setTimeout(15000)
    await sleep(4000)
    expect(state.remote.value.isConnected()).toBeTruthy()
  })
  test("incorrect route", async function() {
    let result = await request(server)
      .get("/v3/wrong/route")
      .expect("Content-Type", /application\/json/)
    expect(result.ok).toBeFalsy()
    expect(JSON.parse(result.text)).toHaveProperty("code")
  })
  test("server information", async function() {
    let result = await request(server)
      .get("/v3/server/info")
      .expect("Content-Type", /application\/json/)
    expect(result.ok).toBeTruthy()
    expect(JSON.parse(result.text)).toHaveProperty("complete_ledgers")
  })
  test("ledger closed", async function() {
    let result = await request(server)
      .get("/v3/ledgers/closed")
      .expect("Content-Type", /application\/json/)
    let { ledger_index, ledger_hash, ledger_time } = state.ledger.value
    expect(result.ok).toBeTruthy()
    expect(JSON.parse(result.text)).toEqual({
      ledger_index,
      ledger_hash,
      ledger_time
    })
  })
  test("ledger by index", async function() {
    let ledger_index = state.ledger.value.ledger_index
    let result = await request(server)
      .get(`/v3/ledgers/index/${ledger_index}`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result.ok).toBeTruthy()
    expect(result_json).toHaveProperty("ledger_index")
    expect(Number(result_json.ledger_index)).toBeGreaterThanOrEqual(
      Number(ledger_index)
    )
  })
  test("ledger by hash", async function() {
    let { ledger_index, ledger_hash } = state.ledger.value
    let result = await request(server)
      .get(`/v3/ledgers/hash/${ledger_hash}`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result.ok).toBeTruthy()
    expect(result_json).toHaveProperty("ledger_index")
    expect(Number(result_json.ledger_index)).toBeGreaterThanOrEqual(
      Number(ledger_index)
    )
  })
  test("orderbook list", async function() {
    let result = await request(server)
      .get(`/v3/order_book/SWT/CNY+jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or?limit=10`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result.ok).toBeTruthy()
    expect(result_json).toHaveProperty("offers")
    expect(result_json.offers.length).toBe(10)
  })
  test("accounts list", async function() {
    let result = await request(server)
      .get(`/v3/accounts`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result.ok).toBeTruthy()
    expect(result_json).toHaveProperty("info")
    expect(result_json.info.length).toBeGreaterThan(4)
  })
})
