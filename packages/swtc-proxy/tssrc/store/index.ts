import { Remote, Transaction, Wallet } from "swtc-lib"
import { utils } from "swtc-utils"
import { ref, computed, watch } from "@vue/runtime-core"
import CONFIG from "../../config"
import { APIError } from "../web/rest"
import chalk from "chalk"

const state = setup()
function setup() {
  const DEBUG = ref(true)
  const LIMIT = ref(20)
  const config = ref({})
  const server = computed(() => config.value.server || "")
  const remote = ref({})
  const wsConnected = ref(false)
  const interval_detect = ref(0)
  const interval_heal = ref(0)
  const ledger = ref({})
  const logs = ref([])
  const status = ref({})
  async function funcConfig(options: any = CONFIG) {
    console.log("... applying configuration")
    config.value = Object.assign({}, config.value, options)
    console.log(config.value)
  }
  watch(
    () => ledger.value,
    (value, old_value) => {
      const { ledger_index, ledger_time } = value
      console.log(
        chalk.bold.green(`${JSON.stringify({ ledger_index, ledger_time })}`)
      )
    },
    { lazy: true }
  )
  watch(
    () => logs.value,
    (value, old_value) => console.log(chalk.green(value[0])),
    { lazy: true }
  )
  watch(
    () => wsConnected.value,
    (value, old_value) => {
      console.log(chalk.green(value))
      if (!value) {
        console.log("starting heal of connection, to implement")
      }
    },
    { lazy: true }
  )
  watch(
    () => server.value,
    async (value, old_value) => {
      console.log("config change detected")
      remote.value = value ? new Remote({ server: value }) : new Remote()
      try {
        await remote.value.connectPromise()
        wsConnected.value = true
        remote.value.on("ledger_closed", data => {
          ledger.value = data
        })
        console.log("... remote connected")
      } catch (e) {
        console.log("... remote connection failure")
        console.error(e)
      }
    },
    { lazy: true }
  )

  // funcConfig(CONFIG)
  interval_detect.value = setInterval(() => {
    try {
      wsConnected.value = remote.value._server._connected
    } catch (e) {}
  }, 1000)
  interval_heal.value = setInterval(() => {
    if (!wsConnected.value) {
      console.log(
        chalk.red(`cron job to sync backend connection, to implement`)
      )
    }
  }, 10000)

  return {
    DEBUG,
    LIMIT,
    remote,
    config,
    server,
    ledger,
    logs,
    status,
    wsConnected,
    funcConfig
  }
}

export { state, Remote, Wallet, Transaction }

async function getAccountInfo(ctx) {
  const data = await state.remote.value
    .requestAccountInfo({ account: ctx.params.address })
    .submitPromise()
  ctx.rest(data)
}
async function getAccountTrusts(ctx) {
  const data = await state.remote.value
    .requestAccountRelations({ type: "trust", account: ctx.params.address })
    .submitPromise()
  ctx.rest(data)
}
async function getAccountAuthorizes(ctx) {
  const data = await state.remote.value
    .requestAccountRelations({ type: "authorize", account: ctx.params.address })
    .submitPromise()
  ctx.rest(data)
}
async function getAccountFreezes(ctx) {
  const data = await state.remote.value
    .requestAccountRelations({ type: "freeze", account: ctx.params.address })
    .submitPromise()
  ctx.rest(data)
}
async function getAccountBalances(ctx) {
  const p_trust = state.remote.value
    .requestAccountRelations({ account: ctx.params.address, type: "trust" })
    .submitPromise()
  const p_info = state.remote.value
    .requestAccountRelations({ type: "trust", account: ctx.params.address })
    .submitPromise()
  const data = await Promise.all([p_trust, p_info])
  ctx.rest(data)
}
async function getAccountPayment(ctx) {
  const address = ctx.params.address
  const data = await state.remote.value
    .requestTx({ hash: ctx.params.id })
    .submitPromise()
  if (
    data.TransactionType &&
    data.TransactionType === "Payment" &&
    ((data.Account && data.Account === address) ||
      (data.Destination && data.Destination === address))
  ) {
    ctx.rest(utils.processTx(data, address))
  } else {
    throw new APIError(
      "api:param",
      `does not exist on server ${JSON.stringify(ctx.params)}`
    )
  }
}
async function getAccountPayments(ctx) {
  const data = await state.remote.value
    .requestAccountTx({ account: ctx.params.address, limit: state.LIMIT.value })
    .submitPromise()
  const payments = data.transactions.filter(
    e => (e.type && e.type === "received") || e.type === "sent"
  )
  delete data.transactions
  data.payments = payments
  ctx.rest(data)
}
async function getAccountTransaction(ctx) {
  const address = ctx.params.address
  const data = await state.remote.value
    .requestTx({ hash: ctx.params.id })
    .submitPromise()
  if (
    (data.Account && data.Account === address) ||
    (data.Destination && data.Destination === address)
  ) {
    ctx.rest(utils.processTx(data, address))
  } else {
    if (
      data.meta &&
      data.meta.AffectedNodes &&
      data.meta.AffectedNodes.filter(
        e =>
          e.ModifiedNode &&
          e.ModifiedNode.FinalFields &&
          e.ModifiedNode.FinalFields.Account === ctx.params.address
      ).length === 1
    ) {
      // effects
      ctx.rest(utils.processTx(data, address))
    } else {
      // ?? what about relations ??
      throw new APIError(
        "api:param",
        `does not exist on server ${JSON.stringify(ctx.params)}`
      )
    }
  }
}
async function getAccountTransactions(ctx) {
  const data = await state.remote.value
    .requestAccountTx({ account: ctx.params.address, limit: state.LIMIT.value })
    .submitPromise()
  ctx.rest(data)
}

async function getAccountOrder(ctx) {
  const address = ctx.params.address
  const hash = ctx.params.hash
  const data = await state.remote.value.requestTx({ hash }).submitPromise()
  if (
    data.TransactionType &&
    data.TransactionType === "OfferCreate" &&
    data.Account &&
    data.Account === address
  ) {
    ctx.rest(utils.processTx(data, address))
  } else {
    throw new APIError(
      "api:param",
      `does not exist on server ${JSON.stringify(ctx.params)}`
    )
  }
}
async function getAccountOrders(ctx) {
  const base = ctx.params.base
  const counter = ctx.params.counter
  const data = await state.remote.value
    .requestAccountOffers({
      account,
      ledger: "closed",
      limit: state.LIMIT.value
    })
    .submitPromise()
  ctx.rest(data)
}

async function getOrderBook(ctx) {
  const gets = ctx.params.gets
  const pays = ctx.params.pays
  const data = await state.remote.value
    .requestOrderBook({ gets, pays, limit: state.LIMIT.value })
    .submitPromise()
  ctx.rest(data)
}

async function getOrderBookBids(ctx) {
  const account = ctx.params.address
  const data = await state.remote.value
    .requestAccountOffers({
      account,
      ledger: "closed",
      limit: state.LIMIT.value
    })
    .submitPromise()
  ctx.rest(data)
}

async function getOrderBookAsks(ctx) {
  const account = ctx.params.address
  const data = await state.remote.value
    .requestAccountOffers({
      account,
      ledger: "closed",
      limit: state.LIMIT.value
    })
    .submitPromise()
  ctx.rest(data)
}
export {
  getAccountInfo,
  getAccountAuthorizes,
  getAccountFreezes,
  getAccountTrusts,
  getAccountBalances,
  getAccountPayment,
  getAccountPayments,
  getAccountTransaction,
  getAccountTransactions,
  getAccountOrder,
  getAccountOrders,
  getOrderBook,
  getOrderBookAsks,
  getOrderBookBids
}
