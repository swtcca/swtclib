import { Remote } from "swtc-lib"
import { ref, computed, watch } from "@vue/runtime-core"
import CONFIG from "../../config"
import chalk from "chalk"

const state = setup()
function setup() {
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
    console.log(options)
    config.value = Object.assign({}, config.value, options)
    console.log("... applyed configuration")
  }
  watch(
    () => ledger.value,
    () => {
      console.log("triggered ledger update")
      const { ledger_index, ledger_time } = ledger.value
      console.log(
        chalk.bold.green(`${JSON.stringify({ ledger_index, ledger_time })}`)
      )
    },
    { lazy: true }
  )
  watch(
    () => logs.value,
    () => console.log(chalk.green(logs.value[0])),
    { lazy: true }
  )
  watch(
    () => wsConnected.value,
    (value, old_value) => {
      console.log(chalk.green(value))
      if (!value) {
        console.log("starting heal of connection")
      }
    },
    { lazy: true }
  )
  watch(
    () => server.value,
    async () => {
      console.log("config change detected")
      remote.value = server.value
        ? new Remote({ server: server.value })
        : new Remote()
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
    wsConnected,
    funcConfig
  }
}

export { state }
