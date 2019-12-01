import { utils } from "swtc-utils"
import { state, Wallet } from "../store/index"
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
async function generateWallet(ctx) {
  ctx.rest(Wallet.generate())
}
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
  const p_info = state.remote.value
    .requestAccountInfo({ account: ctx.params.address })
    .submitPromise()
  const p_trust = state.remote.value
    .requestAccountRelations({ type: "trust", account: ctx.params.address })
    .submitPromise()
  const p_freeze = state.remote.value
    .requestAccountRelations({ type: "freeze", account: ctx.params.address })
    .submitPromise()
  const data = await Promise.all([p_info, p_trust, p_freeze])
  ctx.rest({ info: data[0], trusts: data[1], freezes: data[2] })
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
  const account = ctx.params.address
  const base = ctx.params.base
  const counter = ctx.params.counter
  const data = await state.remote.value
    .requestAccountOffers({
      account,
      base,
      counter,
      ledger: "closed",
      limit: state.LIMIT.value
    })
    .submitPromise()
  ctx.rest(data)
}

async function getOrderBook(ctx) {
  const gets = currencyUnFlatten(ctx.params.base)
  const pays = currencyUnFlatten(ctx.params.counter)
  const data = await state.remote.value
    .requestOrderBook({ gets, pays, limit: state.LIMIT.value })
    .submitPromise()
  ctx.rest(data)
  // const p_asks = state.remote.value
  //  .requestOrderBook({ gets: pays, pays: gets, limit: state.LIMIT.value })
  //  .submitPromise()
  // const data = await Promise.all([p_bids, p_asks])
  // ctx.rest({ bids: data[0], asks: data[1] })
}

async function getOrderBookBids(ctx) {
  const gets = currencyUnFlatten(ctx.params.base)
  const pays = currencyUnFlatten(ctx.params.counter)
  const data = await state.remote.value
    .requestOrderBook({ gets, pays, limit: state.LIMIT.value })
    .submitPromise()
  ctx.rest(data)
}

async function getOrderBookAsks(ctx) {
  const gets = currencyUnFlatten(ctx.params.base)
  const pays = currencyUnFlatten(ctx.params.counter)
  const data = await state.remote.value
    .requestOrderBook({ gets: pays, pays: gets, limit: state.LIMIT.value })
    .submitPromise()
  ctx.rest(data)
}

async function getTransaction(ctx) {
  const hash = ctx.params.hash
  const data = await state.remote.value.requestTx({ hash }).submitPromise()
  if (data.date) {
    ctx.rest(data)
  } else {
    // ?? what about relations ??
    throw new APIError(
      "api:param",
      `does not exist on server ${JSON.stringify(ctx.params)}`
    )
  }
}

async function getLedgerClosed(ctx) {
  const { ledger_hash, ledger_index } = state.ledger.value
  ctx.rest({ ledger_hash, ledger_index })
}

async function getLedgerHash(ctx) {
  const hash = ctx.params.hash
  const transactions = true
  const data = await state.remote.value
    .requestLedger({ hash, transactions })
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
}

async function getLedgerIndex(ctx) {
  const index = ctx.params.index
  const transactions = true
  const data = await state.remote.value
    .requestLedger({ index, transactions })
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
}

async function postBlob(ctx) {
  const data = ctx.request.body
  const tx = state.remote.value.buildSignTx(data)
  console.log(tx.tx_json)
  ctx.rest(await tx.submitPromise())
}
async function postJsonMultisign(ctx) {
  const data = ctx.request.body
  console.log(data)
  const tx = state.remote.value.buildMultisignedTx(data)
  tx.multiSigned()
  console.log(tx.tx_json)
  ctx.rest(await tx.submitPromise())
}
export {
  currencyFlatten,
  currencyUnFlatten,
  generateWallet,
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
  getOrderBookBids,
  getTransaction,
  getLedgerClosed,
  getLedgerHash,
  getLedgerIndex,
  postBlob,
  postJsonMultisign
}
