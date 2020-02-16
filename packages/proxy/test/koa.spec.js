import { web, router, state } from "../src"
const request = require("supertest")
const sleep = time => new Promise(res => setTimeout(() => res(), time || 1))
state.config.value.server = "ws://swtcproxy.swtclib.ca:5020"
const account = "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz"
const payment_hash =
  "C1E2FDDF3DF8F8B6AE5C58B65508C5CF02AB5FEEF0547FBBF253121C3703B76C"
const blob =
  "120000220000000024000000076140000000000F42406840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E157446304402204043EE905953B90C486DA74B795E505B383BFF6CBC3852D724E95F51581E8E7402205C4022C3B5404C23B8D1E85E7B56B1CE9A5E6B12A8C8D9FE9C2AAC2A5DA936F481141359AA928F4D98FDB3D93E8B690C80D37DED11C3831456FE5CE2D298C9493022FB43596A1B23AE3E3728"

let transaction

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
    await sleep(11000)
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
  test("accounts info", async function() {
    let result = await request(server)
      .get(`/v3/accounts/${account}/info`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result.ok).toBeTruthy()
    expect(result_json).toHaveProperty("account_data")
    expect(result_json.account_data.Account).toEqual(account)
  })
  test("accounts tums", async function() {
    let result = await request(server)
      .get(`/v3/accounts/${account}/tums`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result.ok).toBeTruthy()
    expect(result_json).toHaveProperty("receive_currencies")
    expect(result_json).toHaveProperty("send_currencies")
  })
  test("accounts balances", async function() {
    let result = await request(server)
      .get(`/v3/accounts/${account}/balances`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result.ok).toBeTruthy()
    expect(result_json).toHaveProperty("sequence")
    expect(result_json).toHaveProperty("balances")
  })
  test("account relations - trust", async function() {
    let result = await request(server)
      .get(`/v3/accounts/${account}/relations/trust`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result.ok).toBeTruthy()
    expect(result_json).toHaveProperty("lines")
  })
  test("account relations - authorize", async function() {
    let result = await request(server)
      .get(`/v3/accounts/${account}/relations/authorize`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result.ok).toBeTruthy()
    expect(result_json).toHaveProperty("lines")
  })
  test("account relations - freeze", async function() {
    let result = await request(server)
      .get(`/v3/accounts/${account}/relations/freeze`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result.ok).toBeTruthy()
    expect(result_json).toHaveProperty("lines")
  })
  test("account payments", async function() {
    let result = await request(server)
      .get(`/v3/accounts/${account}/payments?limit=4`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result.ok).toBeTruthy()
    expect(result_json).toHaveProperty("payments")
    expect(result_json.payments.length).toBeLessThanOrEqual(4)
  })
  test("account payment by hash", async function() {
    let result = await request(server)
      .get(`/v3/accounts/${account}/payments/${payment_hash}`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result.ok).toBeTruthy()
    expect(result_json).toHaveProperty("hash")
    expect(result_json.hash).toBe(payment_hash)
  })
  test("account transactions", async function() {
    let result = await request(server)
      .get(`/v3/accounts/${account}/transactions?limit=4`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result.ok).toBeTruthy()
    expect(result_json).toHaveProperty("transactions")
    expect(result_json.transactions.length).toBe(4)
  })
  test("account transaction by hash", async function() {
    let result = await request(server)
      .get(`/v3/accounts/${account}/transactions/${payment_hash}`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result.ok).toBeTruthy()
    expect(result_json).toHaveProperty("hash")
    expect(result_json.hash).toBe(payment_hash)
  })
  test("account orders", async function() {
    let result = await request(server)
      .get(`/v3/accounts/${account}/orders?limit=4`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result.ok).toBeTruthy()
    expect(result_json).toHaveProperty("offers")
    expect(result_json.offers.length).toBeLessThanOrEqual(4)
  })
  test("account transaction by hash", async function() {
    let result = await request(server)
      .get(`/v3/accounts/${account}/transactions/${payment_hash}`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(typeof result_json).toBe("object")
  })
  test("account multisign signerlist", async function() {
    let result = await request(server)
      .get(`/v3/accounts/${account}/signerlist`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result_json).toHaveProperty("account_objects")
  })
  test("query brokerage", async function() {
    let result = await request(server)
      .get(`/v3/brokers/${account}`)
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result_json).toHaveProperty("brokerages")
  })
  test("submit signed blob", async function() {
    let result = await request(server)
      .post(`/v3/blob`)
      .send({ blob })
      .expect("Content-Type", /application\/json/)
    let result_json = JSON.parse(result.text)
    expect(result_json).toHaveProperty("engine_result")
    expect(result_json).toHaveProperty("tx_blob")
    expect(result_json).toHaveProperty("tx_json")
  })
  test(`clear intervals`, async function() {
    state.funcCleanup()
    state.remote.value.disconnect()
    server.close()
    await sleep(4000)
    expect("cleared").toBe("cleared")
  })
})
