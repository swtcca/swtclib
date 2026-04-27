// Mocha root hooks: fund address_ed before rpc sign tests if balance is low
const { Remote: LibRemote } = require("../../lib/cjs/index")
const DATA = require("../../.conf/config")

const MIN_SPENDABLE = 1100000 // 1.1 SWT in drops (test needs 1.01 SWT)
const BASE_RESERVE = 20000000
const RESERVE_PER_OWNER = 5000000

async function getSpendable(remote, account) {
  const info = await remote
    .requestAccountInfo({ account })
    .submitPromise()
  const data = info.account_data
  const balance = parseInt(data.Balance)
  const ownerCount = parseInt(data.OwnerCount) || 0
  const reserve = BASE_RESERVE + ownerCount * RESERVE_PER_OWNER
  return { spendable: balance - reserve, balance, ownerCount }
}

exports.mochaHooks = {
  async beforeAll() {
    const remote = new LibRemote({ server: DATA.JT_NODE, local_sign: true })
    await new Promise((resolve, reject) => {
      remote.connect(err => (err ? reject(err) : resolve()))
    })
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      const ed = await getSpendable(remote, DATA.address_ed)

      if (ed.spendable < MIN_SPENDABLE) {
        const funder = await getSpendable(remote, DATA.testAddress)
        const needed = MIN_SPENDABLE - ed.spendable + 20000 // add fee buffer
        const available = funder.spendable - 20000 // keep 0.02 SWT for funder's fee

        if (available >= needed) {
          const fundTx = remote.buildPaymentTx({
            from: DATA.testAddress,
            to: DATA.address_ed,
            amount: remote.makeAmount(needed / 1000000)
          })
          await fundTx.signPromise(DATA.testSecret)
          await fundTx.submitPromise()
          await new Promise(resolve => setTimeout(resolve, 5000))
        } else {
          console.warn(
            `rpc setup: testAddress only has ${available} drops available, need ${needed}`
          )
        }
      }

      // Remove any zero-balance, non-frozen trust lines to reduce reserve
      const edNow = await getSpendable(remote, DATA.address_ed)
      if (edNow.ownerCount > 0 && edNow.spendable > 20000) {
        try {
          const lines = await remote
            .requestAccountRelations({ account: DATA.address_ed, type: "trust" })
            .submitPromise()
          for (const line of lines.lines || []) {
            if (parseFloat(line.balance) === 0 && parseFloat(line.limit) > 0) {
              const removeTx = remote.buildRelationTx({
                type: "trust",
                account: DATA.address_ed,
                limit: { value: "0", currency: line.currency, issuer: line.account }
              })
              await removeTx.signPromise(DATA.secret_ed)
              await removeTx.submitPromise()
              await new Promise(resolve => setTimeout(resolve, 5000))
            }
          }
        } catch (_) { /* best-effort */ }
      }
    } catch (e) {
      console.warn("rpc setup:", e.message || JSON.stringify(e))
    } finally {
      remote.disconnect()
    }
  }
}
