import { Remote } from "swtc-lib"
import { ref, computed, watch } from "@vue/runtime-core"
import CONFIG from "../../config"
import chalk from "chalk"

const state = setup()
function setup() {
  const remote = ref({})
  const backend = computed(() =>
    remote.value && remote.value.isConnected() ? "connected" : "disconnected"
  )
  const config = ref({})
  const server = computed(() => config.value.server || "")
  const ledger = ref({})
  const logs = ref([])
  const status = ref({})
  async function funcConfig(options: any = {}) {
    console.log("... applying configuration")
    console.log(options)
    config.value = Object.assign({}, config.value, options)
    console.log("... applyed configuration")
  }
  watch(
    ledger,
    () => {
      const { ledger_index, txn_count, ledger_time } = ledger.value
      console.log(
        chalk.bold.green(
          `${JSON.stringify({ ledger_index, ledger_time, txn_count })}`
        )
      )
    },
    { lazy: true }
  )
  watch(logs, () => console.log(chalk.green(logs.value[0])), { lazy: true })
  watch(
    server,
    async () => {
      console.log("config change detected")
      remote.value = server.value
        ? new Remote({ server: server.value })
        : new Remote()
      try {
        await remote.value.connectPromise()
        remote.value.on("ledger_closed", response => {
          ledger.value = response
        })
        console.log("... remote connected")
      } catch (e) {
        console.log("... remote connection failure")
        console.error(e)
      }
    },
    { lazy: true }
  )

  funcConfig(CONFIG)
  setInterval(() => {
    if (backend !== "connected") {
      console.log(chalk.red(`cron job to sync backend connection`))
    }
  }, 10000)

  return {
    remote,
    config,
    server,
    ledger,
    logs,
    status,
    funcConfig
  }
}

export { state }
