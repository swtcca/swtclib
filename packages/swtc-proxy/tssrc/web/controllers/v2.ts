import * as V2 from "../../functions/v3"

module.exports = {
  "GET /v2/accounts": V2.getAccounts,
  "GET /v2/accounts/:account/info": V2.getAccountInfo,
  "GET /v2/accounts/:account/tums": V2.getAccountTums,
  "GET /v2/accounts/:account/relations/:type": V2.getAccountRelations,
  "GET /v2/accounts/:account/balances": V2.getAccountBalances,
  "GET /v2/accounts/:account/payments": V2.getAccountPayments,
  "GET /v2/accounts/:account/payments/:hash": V2.getAccountPayment,
  "GET /v2/accounts/:account/transactions": V2.getAccountTransactions,
  "GET /v2/accounts/:account/transactions/:hash": V2.getAccountTransaction,
  "GET /v2/accounts/:account/orders": V2.getAccountOrders,
  "GET /v2/accounts/:account/orders/:hash": V2.getAccountOrder,
  "GET /v2/accounts/:account/signerlist": V2.getAccountSignerList,
  "GET /v2/brokers/:account": V2.getBrokerage,
  "GET /v2/order_book/:gets/:pays": V2.getOrderBook,
  "GET /v2/transactions/:hash": V2.getTransaction,
  "GET /v2/server/info": V2.getServerInfo,
  "GET /v2/ledgers/closed": V2.getLedgerClosed,
  "GET /v2/ledgers/index/:index": V2.getLedgerIndex,
  "GET /v2/ledgers/hash/:hash": V2.getLedgerHash,
  "POST /v2/blob": V2.postBlob,
  "POST /v2/multisign": V2.postJsonMultisign
}
