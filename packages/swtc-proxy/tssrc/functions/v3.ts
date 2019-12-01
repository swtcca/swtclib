import { utils } from "swtc-utils"
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
async function getAccountInfo(ctx) {
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
  try {
    const data = await state.remote.value
      .requestAccountTums(Object.assign({}, ctx.params, ctx.request.body))
      .submitPromise()
    ctx.rest(data)
  } catch (e) {
    throw new APIError("api:getAccountTums", e.toString())
  }
}
async function getAccountTrusts(ctx) {
  try {
    const data = await state.remote.value
      .requestAccountRelations(
        Object.assign({}, ctx.params, { type: "trust" }, ctx.request.body)
      )
      .submitPromise()
    ctx.rest(data)
  } catch (e) {
    throw new APIError("api:getAccountTrusts", e.toString())
  }
}
async function getAccountAuthorizes(ctx) {
  try {
    const data = await state.remote.value
      .requestAccountRelations(
        Object.assign({}, ctx.params, { type: "authorize" }, ctx.request.body)
      )
      .submitPromise()
    ctx.rest(data)
  } catch (e) {
    throw new APIError("api:getAccountAuthorizes", e.toString())
  }
}
async function getAccountFreezes(ctx) {
  try {
    const data = await state.remote.value
      .requestAccountRelations(
        Object.assign({}, ctx.params, { type: "freeze" }, ctx.request.body)
      )
      .submitPromise()
    ctx.rest(data)
  } catch (e) {
    throw new APIError("api:getAccountFreezes", e.toString())
  }
}
async function getAccountBalances(ctx) {
  const p_info = state.remote.value
    .requestAccountInfo(ctx.params)
    .submitPromise()
  const p_trust = state.remote.value
    .requestAccountRelations(Object.assign({}, ctx.params, { type: "trust" }))
    .submitPromise()
  const p_freeze = state.remote.value
    .requestAccountRelations(Object.assign({}, ctx.params, { type: "freeze" }))
    .submitPromise()
  const data = await Promise.all([p_info, p_trust, p_freeze])
  ctx.rest({ info: data[0], trusts: data[1], freezes: data[2] })
}
async function getAccountPayment(ctx) {
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
  try {
    const data = await state.remote.value
      .requestAccountOffers(Object.assign({}, ctx.params, ctx.request.body))
      .submitPromise()
    ctx.rest(data)
  } catch (e) {
    throw new APIError("api:getAccountOrders", e.toString())
  }
}

async function getOrderBook(ctx) {
  const gets = currencyUnFlatten(ctx.params.gets)
  const pays = currencyUnFlatten(ctx.params.pays)
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
  const { ledger_hash, ledger_index } = state.ledger.value
  ctx.rest({ ledger_hash, ledger_index })
}

async function getLedgerHash(ctx) {
  try {
    const data = await state.remote.value
      .requestLedger(Object.assign({ transactions: true }, ctx.params))
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
  try {
    const data = await state.remote.value
      .requestLedger(Object.assign({ transactions: true }, ctx.params))
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
  console.log(ctx.request.body)
  const data = ctx.request.body
  try {
    const tx = state.remote.value.buildSignTx(data)
    console.log(tx.tx_json)
    ctx.rest(await tx.submitPromise())
  } catch (e) {
    throw new APIError("api:postBlob", e.toString())
  }
}
async function postJsonMultisign(ctx) {
  console.log(`body: ${ctx.request.body}`)
  const data = ctx.request.body
  console.log(data)
  try {
    const tx = state.remote.value.buildMultisignedTx(data)
    tx.multiSigned()
    console.log(tx.tx_json)
    ctx.rest(await tx.submitPromise())
  } catch (e) {
    throw new APIError("api:postMultisign", e.toString())
  }
}
export {
  currencyFlatten,
  currencyUnFlatten,
  getAccountInfo,
  getAccountTums,
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
  getTransaction,
  getLedgerClosed,
  getLedgerHash,
  getLedgerIndex,
  postBlob,
  postJsonMultisign
}
