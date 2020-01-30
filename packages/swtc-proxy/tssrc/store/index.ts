import { Remote, Transaction, Wallet } from "swtc-lib"
import { ref, computed, watch } from "@vue/runtime-core"
import CONFIG from "../../config"
import chalk from "chalk"

const state = setup()
function setup() {
  const DEBUG = ref(false)
  const LIMIT = ref(20)
  const config: any = ref({})
  const server = computed(() => config.value.server || "")
  const remote: any = ref({})
  const wsConnected = ref(false)
  const interval_detect: any = ref(0)
  const interval_heal: any = ref(0)
  const ledger: any = ref({})
  const logs = ref([])
  const status: any = ref({})
  const rateMap = new Map() // regular map for performance
  const RATE = ref(1000)
  const interval_rate: any = ref(0)

  remote.value = new Remote()
  function funcCleanup() {
    interval_detect.value && clearInterval(interval_detect.value)
    interval_heal.value && clearInterval(interval_heal.value)
    interval_rate.value && clearInterval(interval_rate.value)
  }
  async function funcConfig(options: any = CONFIG) {
    console.log("... applying configuration")
    config.value = Object.assign({}, config.value, options)
    DEBUG.value = config.value.debug
    if (config.value.rate) {
      RATE.value = config.value.rate
    }
    console.log(config.value)
  }
  function funcLogIp(ipaddress: string) {
    if (!rateMap.has(ipaddress)) {
      rateMap.set(ipaddress, [new Date().getTime()])
    } else {
      rateMap.set(
        ipaddress,
        rateMap
          .get(ipaddress)
          .filter(e => e > new Date().getTime() - 5 * 60 * 1000)
      )
      rateMap.get(ipaddress).push(new Date().getTime())
    }
    return rateMap.get(ipaddress).length
  }
  watch(
    () => ledger.value,
    (value, old_value) => {
      const { ledger_index, ledger_time } = value
      DEBUG.value &&
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
        console.log("starting heal of connection, as scheduled")
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
        console.log(
          chalk.red(`... remote connection failed to ${server.value}`)
        )
        // console.error(e)
      }
    },
    { lazy: true }
  )

  // funcConfig(CONFIG)
  interval_rate.value = setInterval(() => {
    try {
      for (const [ipaddress, counts] of rateMap) {
        const valids = counts.filter(
          e => e > new Date().getTime() - 5 * 60 * 1000
        )
        if (valids.length) {
          rateMap.set(ipaddress, valids)
        } else {
          rateMap.delete(ipaddress)
          if (DEBUG.value) console.log(chalk.red(`rate cleaned ${ipaddress}`))
        }
      }
      if (DEBUG.value) {
        console.log(chalk.red(`rate routine, ${rateMap.size} ips`))
      }
    } catch (e) {}
  }, 53000)
  interval_detect.value = setInterval(() => {
    try {
      wsConnected.value = remote.value._server._connected
      if (
        ledger.value &&
        new Date().getTime() / 1000 -
          946684800 -
          Number(ledger.value.ledger_time) >
          30
      ) {
        // did not get ledgers for up to 30 seconds
        console.log(chalk.red(`did not get new ledgers for 30 seconds`))
        console.log(chalk.red(`check the upstream: ${server.value}`))
        wsConnected.value = false
      }
    } catch (e) {}
  }, 10000)
  interval_heal.value = setInterval(async () => {
    if (!wsConnected.value) {
      console.log(
        chalk.red(`cron job to monitor backend connection, once a minute`)
      )
      try {
        await remote.value.connectPromise()
        wsConnected.value = true
      } catch (error) {
        console.log(
          chalk.red(`unable to connect ${server.value}, try another one?`)
        )
      }
    }
  }, 60000)

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
    funcConfig,
    funcLogIp,
    funcCleanup,
    rateMap,
    RATE
  }
}

export { state, Remote, Wallet, Transaction }
