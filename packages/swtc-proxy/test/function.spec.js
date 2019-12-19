const functions = require("../src/functions/v3")

afterAll(() => {
  functions.state.funcCleanup()
  return Promise.resolve(true)
})

funcs = [
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
functions_keys = Object.keys(functions)

describe("Functions Test", function() {
  funcs.forEach(func => {
    test(`has ${func}`, function() {
      expect(functions_keys).toContain(func)
    })
  })
})
