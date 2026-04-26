// Mocha root hooks: start proxy before all tests, stop after all tests
const PROXY = require("../../proxy/src/index")

let server

exports.mochaHooks = {
  async beforeAll() {
    await PROXY.state.funcConfig({ server: "ws://swtcproxy.bcapps.ca:5020" })
    await new Promise((resolve, reject) => {
      server = PROXY.web.listen(5080, err => {
        if (err) reject(err)
        else resolve()
      })
    })
    // poll until ws connection is established (or 10s timeout)
    const deadline = Date.now() + 10000
    while (!PROXY.state.wsConnected.value && Date.now() < deadline) {
      await new Promise(resolve => setTimeout(resolve, 300))
    }
    // poll until first ledger close is received (or 10s timeout)
    const ledgerDeadline = Date.now() + 10000
    while (!PROXY.state.ledger.value.ledger_index && Date.now() < ledgerDeadline) {
      await new Promise(resolve => setTimeout(resolve, 300))
    }
  },
  async afterAll() {
    PROXY.state.funcCleanup()
    if (server) await new Promise(resolve => server.close(resolve))
  }
}
