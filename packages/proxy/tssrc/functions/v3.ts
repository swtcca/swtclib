import { utils } from "@swtc/utils"
import { state } from "../store/index"
import { APIError } from "../web/rest"

function currencyFlatten(options) {
  return Object.values(options)
    .filter(e => e)
    .join("+")
}
function currencyUnFlatten(currency) {
  const pairs = currency.split("+")
  return { currency: pairs[0], issuer: pairs[1] || "" }
}
function validateQueryParams(params) {
  const peer = params.peer
  const ledger = params.ledger
  const ledger_min = params.ledger_min
  const ledger_max = params.ledger_max
  const ledger_index = params.ledger_index
  const ledger_hash = params.ledger_hash
  const limit = params.limit
  const offset = params.offset
  const forward = params.forward
  const marker = params.marker
  if (!marker) {
  } else if (typeof marker === "string") {
  } else if (typeof marker !== "object") {
    throw new APIError("api:params", "wrong marker object")
  } else if (isNaN(Number(marker.ledger)) || isNaN(Number(marker.seq))) {
    throw new APIError("api:params", "wrong marker attribute number")
  } else {
  }
  if (typeof forward === "string") {
    params.forward = forward === "true" ? true : false
  }
  if (peer && !utils.isValidAddress(peer)) {
    throw new APIError("api:params", "wrong peer address")
  }
  if (limit) {
    if (isNaN(Number(limit))) {
      throw new APIError("api:params", "wrong limit quantity")
    } else {
      params.limit = Number(limit)
    }
  }
  if (offset) {
    if (isNaN(Number(offset))) {
      throw new APIError("api:params", "wrong offset number")
    } else {
      params.offset = Number(offset)
    }
  }
  if (
    ledger &&
    isNaN(Number(ledger)) &&
    !(ledger in ["closed", "validated", "current"])
  ) {
    throw new APIError("api:params", "wrong ledger specified")
  }
  if (ledger_min) {
    if (isNaN(Number(ledger_min))) {
      throw new APIError("api:params", "wrong ledger_min index")
    } else {
      params.ledger_min = Number(ledger_min)
    }
  }
  if (ledger_max) {
    if (isNaN(Number(ledger_max))) {
      throw new APIError("api:params", "wrong ledger_max index")
    } else {
      params.ledger_max = Number(ledger_max)
    }
  }
  if (ledger_index) {
    if (isNaN(Number(ledger_index))) {
      throw new APIError("api:params", "wrong ledger_index index")
    } else {
      params.ledger_index = Number(ledger_index)
    }
  }
  if (ledger_hash && !utils.isValidHash(ledger_hash)) {
    throw new APIError("api:params", "wrong ledger_hash specified")
  }
}
function validateCtxParams(params) {
  const account = params.account
  const hash = params.hash
  const index = params.index
  if (account && !utils.isValidAddress(account)) {
    throw new APIError("api:params", "wrong wallet address")
  }
  if (hash && !utils.isValidHash(hash)) {
    throw new APIError("api:params", "wrong hash string")
  }
  if (index && isNaN(Number(index))) {
    throw new APIError("api:params", "wrong index number")
  }
}
async function getServerInfo(ctx) {
  try {
    ctx.rest(await state.remote.value.requestServerInfo().submitPromise())
  } catch (e) {
    throw new APIError("api:getServerInfo", e.toString())
  }
}
async function getAccounts(ctx) {
  validateQueryParams(ctx.request.body)
  try {
    const data = await state.remote.value
      .requestAccounts(ctx.request.body)
      .submitPromise()
    ctx.rest(data)
  } catch (e) {
    throw new APIError("api:getAccounts", e.toString())
  }
}
async function getAccountInfo(ctx) {
  validateCtxParams(ctx.params)
  validateQueryParams(ctx.request.body)
  state.DEBUG.value &&
    console.log(Object.assign({}, ctx.params, ctx.request.body))
  try {
    const data = await state.remote.value
      .requestAccountInfo(Object.assign({}, ctx.params, ctx.request.body))
      .submitPromise()
    ctx.rest(data)
  } catch (e) {
    throw new APIError("api:getAccountInfo", e.toString())
  }
}
async function getAccountTums(ctx) {
  validateCtxParams(ctx.params)
  validateQueryParams(ctx.request.body)
  try {
    const data = await state.remote.value
      .requestAccountTums(Object.assign({}, ctx.params, ctx.request.body))
      .submitPromise()
    ctx.rest(data)
  } catch (e) {
    throw new APIError("api:getAccountTums", e.toString())
  }
}
async function getAccountRelations(ctx) {
  validateCtxParams(ctx.params)
  validateQueryParams(ctx.request.body)
  try {
    const data = await state.remote.value
      .requestAccountRelations(Object.assign({}, ctx.params, ctx.request.body))
      .submitPromise()
    ctx.rest(data)
  } catch (e) {
    throw new APIError("api:getAccountRelations", e.toString())
  }
}
async function getAccountBalances(ctx) {
  validateCtxParams(ctx.params)
  validateQueryParams(ctx.request.body)
  const condition = {
    currency: ctx.request.body.currency || "",
    issuer: ctx.request.body.issuer || ""
  }
  if (!condition.currency) {
    delete condition.currency
  }
  if (!condition.issuer) {
    delete condition.issuer
  }
  const p_info = state.remote.value
    .requestAccountInfo(Object.assign({}, ctx.params, ctx.request.body))
    .submitPromise()
  const p_trust = state.remote.value
    .requestAccountRelations(
      Object.assign({}, ctx.params, { type: "trust" }, ctx.request.body)
    )
    .submitPromise()
  const p_freeze = state.remote.value
    .requestAccountRelations(
      Object.assign({}, ctx.params, { type: "freeze" }, ctx.request.body)
    )
    .submitPromise()
  const p_offer = state.remote.value
    .requestAccountOffers(Object.assign({}, ctx.params, ctx.request.body))
    .submitPromise()
  const data = await Promise.all([p_info, p_trust, p_freeze, p_offer])
  ctx.rest(
    processBalance(
      { native: data[0], lines: data[1], lines2: data[2], orders: data[3] },
      condition
    )
  )
}
async function getAccountPayment(ctx) {
  validateCtxParams(ctx.params)
  validateQueryParams(ctx.request.body)
  const address = ctx.params.account
  try {
    const data = await state.remote.value.requestTx(ctx.params).submitPromise()
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
  } catch (e) {
    throw new APIError("api:getAccountPayment", e.toString())
  }
}
async function getAccountPayments(ctx) {
  validateCtxParams(ctx.params)
  validateQueryParams(ctx.request.body)
  try {
    const data = await state.remote.value
      .requestAccountTx(Object.assign({}, ctx.params, ctx.request.body))
      .submitPromise()
    const payments = data.transactions.filter(
      e => e.type && (e.type === "received" || e.type === "sent")
    )
    delete data.transactions
    data.payments = payments
    ctx.rest(data)
  } catch (e) {
    throw new APIError("api:getAccountPayments", e.toString())
  }
}
async function getAccountTransaction(ctx) {
  validateCtxParams(ctx.params)
  validateQueryParams(ctx.request.body)
  const address = ctx.params.account
  try {
    const data = await state.remote.value.requestTx(ctx.params).submitPromise()
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
  } catch (e) {
    throw new APIError("api:getAccountTransaction", e.toString())
  }
}
async function getAccountTransactions(ctx) {
  validateCtxParams(ctx.params)
  validateQueryParams(ctx.request.body)
  state.DEBUG.value &&
    console.log(Object.assign({}, ctx.params, ctx.request.body))
  try {
    const data = await state.remote.value
      .requestAccountTx(Object.assign({}, ctx.params, ctx.request.body))
      .submitPromise()
    ctx.rest(data)
  } catch (e) {
    throw new APIError("api:getAccountTransactions", e.toString())
  }
}

async function getAccountOrder(ctx) {
  validateCtxParams(ctx.params)
  validateQueryParams(ctx.request.body)
  const address = ctx.params.account
  const hash = ctx.params.hash
  try {
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
  } catch (e) {
    throw new APIError("api:getAccountOrder", e.toString())
  }
}
async function getAccountOrders(ctx) {
  validateCtxParams(ctx.params)
  validateQueryParams(ctx.request.body)
  try {
    const data = await state.remote.value
      .requestAccountOffers(Object.assign({}, ctx.params, ctx.request.body))
      .submitPromise()
    ctx.rest(data)
  } catch (e) {
    throw new APIError("api:getAccountOrders", e.toString())
  }
}

async function getAccountSignerList(ctx) {
  validateCtxParams(ctx.params)
  try {
    const data = await state.remote.value
      .requestSignerList(ctx.params)
      .submitPromise()
    ctx.rest(data)
  } catch (e) {
    throw new APIError("api:getAccountSignerList", e.toString())
  }
}

async function getBrokerage(ctx) {
  validateCtxParams(ctx.params)
  try {
    const data = await state.remote.value
      .requestBrokerage(ctx.params)
      .submitPromise()
    ctx.rest(data)
  } catch (e) {
    throw new APIError("api:getBrokerage", e.toString())
  }
}
async function getOrderBook(ctx) {
  validateCtxParams(ctx.params)
  validateQueryParams(ctx.request.body)
  const gets = currencyUnFlatten(ctx.params.gets)
  const pays = currencyUnFlatten(ctx.params.pays)
  if (!utils.isValidAmount0(gets) || !utils.isValidAmount0(pays)) {
    throw new APIError("api:params", "wrong gets or pays")
  }
  // console.log(Object.assign({}, ctx.params, { gets, pays }, ctx.request.body))
  try {
    const data = await state.remote.value
      .requestOrderBook(
        Object.assign({}, ctx.params, { gets, pays }, ctx.request.body)
      )
      .submitPromise()
    ctx.rest(data)
  } catch (e) {
    throw new APIError("api:getOrderBook", e.toString())
  }
}

async function getTransaction(ctx) {
  validateCtxParams(ctx.params)
  validateQueryParams(ctx.request.body)
  try {
    const data = await state.remote.value.requestTx(ctx.params).submitPromise()
    if (data.date) {
      ctx.rest(data)
    } else {
      // ?? what about relations ??
      throw new APIError(
        "api:param",
        `does not exist on server ${JSON.stringify(ctx.params)}`
      )
    }
  } catch (e) {
    throw new APIError("api:getTransaction", e.toString())
  }
}

async function getLedgerClosed(ctx) {
  const { ledger_hash, ledger_index, ledger_time } = state.ledger.value
  ctx.rest({ ledger_hash, ledger_index, ledger_time })
}

async function getLedgerHash(ctx) {
  validateCtxParams(ctx.params)
  validateQueryParams(ctx.request.body)
  try {
    const data = await state.remote.value
      .requestLedger(
        Object.assign({ transactions: true }, { ledger_hash: ctx.params.hash })
      )
      .submitPromise()
    if (data.ledger_index) {
      ctx.rest(data)
    } else {
      // ?? what about relations ??
      throw new APIError(
        "api:param",
        `does not exist on server ${JSON.stringify(ctx.params)}`
      )
    }
  } catch (e) {
    throw new APIError("api:getLedgerHash", e.toString())
  }
}

async function getLedgerIndex(ctx) {
  validateCtxParams(ctx.params)
  validateQueryParams(ctx.request.body)
  try {
    const data = await state.remote.value
      .requestLedger(
        Object.assign(
          { transactions: true },
          { ledger_index: ctx.params.index }
        )
      )
      .submitPromise()
    if (data.ledger_index) {
      ctx.rest(data)
    } else {
      // ?? what about relations ??
      throw new APIError(
        "api:param",
        `does not exist on server ${JSON.stringify(ctx.params)}`
      )
    }
  } catch (e) {
    throw new APIError("api:getLedgerIndex", e.toString())
  }
}

async function postBlob(ctx) {
  const data = ctx.request.body
  try {
    const tx = state.remote.value.buildSignTx(data)
    ctx.rest(await tx.submitPromise())
  } catch (e) {
    throw new APIError("api:postBlob", e.toString())
  }
}
async function postJsonMultisign(ctx) {
  const data = ctx.request.body
  try {
    const tx = state.remote.value.buildMultisignedTx(data)
    tx.multiSigned()
    ctx.rest(await tx.submitPromise())
  } catch (e) {
    throw new APIError("api:postMultisign", e.toString())
  }
}
export const FREEZE = { reserved: 20.0, each_freezed: 5.0 }
function processBalance(data: any, condition: any = {}) {
  const swt_value: any = Number(data.native.account_data.Balance) / 1000000.0
  const freeze0 =
    FREEZE.reserved +
    (data.lines.lines.length + data.orders.offers.length) * FREEZE.each_freezed
  const swt_data = {
    value: swt_value,
    currency: "SWT",
    issuer: "",
    freezed: freeze0
  }
  const _data = []
  if (
    (!condition.currency && !condition.issuer) ||
    (condition.currency && condition.currency === "SWT")
  ) {
    _data.push(swt_data)
  }
  for (const item of data.lines.lines) {
    if (condition.currency && condition.currency === "SWT") {
      break
    }
    const tmpBal = {
      value: item.balance,
      currency: item.currency,
      issuer: item.account,
      freezed: 0
    }
    let freezed = 0
    data.orders.offers.forEach(off => {
      const taker_gets = utils.parseAmount(off.taker_gets)
      if (
        taker_gets.currency === swt_data.currency &&
        taker_gets.issuer === swt_data.issuer
      ) {
        // swt遍历一次
        swt_data.freezed =
          parseFloat(`${swt_data.freezed}`) + parseFloat(taker_gets.value)
      } else if (
        taker_gets.currency === tmpBal.currency &&
        taker_gets.issuer === tmpBal.issuer
      ) {
        freezed += parseFloat(taker_gets.value)
      }
    })
    for (const l of data.lines2.lines) {
      if (l.currency === tmpBal.currency && l.issuer === tmpBal.issuer) {
        freezed += parseFloat(l.limit)
      }
    }
    tmpBal.freezed = parseFloat(`${tmpBal.freezed}`) + freezed
    tmpBal.freezed = Number(tmpBal.freezed.toFixed(6))
    if (condition.currency && condition.currency !== tmpBal.currency) {
      continue
    }
    if (condition.issuer && condition.issuer !== tmpBal.issuer) {
      continue
    }
    _data.push(tmpBal)
  }

  const _ret = {
    balances: _data,
    sequence: data.native.account_data.Sequence
  }
  return _ret
}

export {
  getServerInfo,
  getAccounts,
  currencyFlatten,
  currencyUnFlatten,
  getAccountInfo,
  getAccountTums,
  getAccountRelations,
  getAccountBalances,
  getAccountPayment,
  getAccountPayments,
  getAccountTransaction,
  getAccountTransactions,
  getAccountOrder,
  getAccountOrders,
  getAccountSignerList,
  getOrderBook,
  getTransaction,
  getLedgerClosed,
  getLedgerHash,
  getLedgerIndex,
  getBrokerage,
  postBlob,
  postJsonMultisign,
  processBalance,
  state
}
