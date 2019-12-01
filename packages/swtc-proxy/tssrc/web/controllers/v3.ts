import * as V3 from "../../functions/v3"

module.exports = {
  "GET /v3/accounts": V3.getAccounts,
  "GET /v3/accounts/:account/info": V3.getAccountInfo,
  "GET /v3/accounts/:account/tums": V3.getAccountTums,
  "GET /v3/accounts/:account/authorizes": V3.getAccountAuthorizes,
  "GET /v3/accounts/:account/freezes": V3.getAccountFreezes,
  "GET /v3/accounts/:account/trusts": V3.getAccountTrusts,
  // "GET /v3/accounts/:account/balances": V3.getAccountBalances,
  "GET /v3/accounts/:account/payments": V3.getAccountPayments,
  "GET /v3/accounts/:account/payments/:hash": V3.getAccountPayment,
  "GET /v3/accounts/:account/transactions": V3.getAccountTransactions,
  "GET /v3/accounts/:account/transactions/:hash": V3.getAccountTransaction,
  "GET /v3/accounts/:account/orders": V3.getAccountOrders,
  "GET /v3/accounts/:account/orders/:hash": V3.getAccountOrder,
  "GET /v3/accounts/:account/signerlist": V3.getAccountSignerList,
  "GET /v3/brokers/:account": V3.getBrokerage,
  "GET /v3/order_book/:gets/:pays": V3.getOrderBook,
  "GET /v3/transactions/:hash": V3.getTransaction,
  "GET /v3/server/info": V3.getServerInfo,
  "GET /v3/ledgers/closed": V3.getLedgerClosed,
  "GET /v3/ledgers/index/:index": V3.getLedgerIndex,
  "GET /v3/ledgers/hash/:hash": V3.getLedgerHash,
  "POST /v3/blob": V3.postBlob,
  "POST /v3/multisign": V3.postJsonMultisign
}
