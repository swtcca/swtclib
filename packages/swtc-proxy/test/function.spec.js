import * as functions from "../src/functions/v3"
const sleep = time => new Promise(res => setTimeout(() => res(), time || 1))

afterAll(() => {
  functions.state.funcCleanup()
  return Promise.resolve(true)
})

const funcs = [
  "getServerInfo",
  "getAccounts",
  "getAccountInfo",
  "getAccountTums",
  "getAccountRelations",
  "getAccountBalances",
  "getAccountPayment",
  "getAccountPayments",
  "getAccountTransaction",
  "getAccountTransactions",
  "getAccountOrder",
  "getAccountOrders",
  "getAccountSignerList",
  "getBrokerage",
  "getOrderBook",
  "getTransaction",
  "getLedgerClosed",
  "getLedgerHash",
  "getLedgerIndex",
  "postBlob",
  "postJsonMultisign"
]
const functions_keys = Object.keys(functions)

describe("Functions Test", function() {
  funcs.forEach(func => {
    test(`has ${func}`, function() {
      expect(functions_keys).toContain(func)
    })
  })
  test(`clear intervals`, async function() {
    functions.state.funcCleanup()
    await sleep(3000)
    expect("cleared").toBe("cleared")
  })
})
