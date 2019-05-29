# The COMMUNITY SWTC JavaScript Library for DEVELOPERS - Transaction

## swtc-transaction is seprated package from swtc-lib (jingtum-lib)

> ### keeps the **same interface** as original without **websocket** dependancy
>
> ### zero config **webpack** and **browerify**
>
> ### adds transaction builds and submit
>
> ### support multiple **Remote** including swtc-lib(websocket) and swtc-api(api)

## Changes

- add method signPromise() and submitPromise()
- typescript OrderBook
- typescript support
- add methods buildRelationTx()
- support null Remote, swtc-api Remote and swtc-lib Remote
- add method submitApi() to submit transactions to https://api.jingtum.com by default
- add methods buildPaymentTx(), buildOfferCreateTX(), buildOfferCancelTx()
- seperate package from swtc-lib

## Getting and Using `swtc-transaction`

**Via npm for Node.js**

```bash
  $ npm install swtc-transaction  // node.js and web app
```

```javascript
const Transaction = require("swtc-transaction").Transaction // cjs import
// or
import { Transaction } from "swtc-transaction" // esm import
```

## Using `swtc-transaction`

- `const tx = Transaction.buildPaymentTx(options)`
- `const tx = Transaction.buildPaymentTx(options, remote={})`
- `const tx = Transaction.buildPaymentTx(options, remote={_axios: axios.create({})})`
- `const tx = Transaction.buildOfferCreateTx(options, remote={})`
- `const tx = Transaction.buildOfferCancelTx(options, remote={})`
- local sign and submit

```javascript
tx.addMemo() // optional
tx.setSecret("s......................")
tx.setSequence(100) // optional, automatic during signing
tx.sign(callback) // async function
tx.submitApi() // returns promise
```

## example

```javascript
> tx = TX.buildPaymentTx({source: DATA.address, to: DATA.address2, amount: {value: 0.1, currency: 'SWT', issuer: ''}})
Transaction {
  domain:
   Domain {
     domain: null,
     _events:
      [Object: null prototype] {
        removeListener: [Function: updateExceptionCapture],
        newListener: [Function: updateExceptionCapture],
        error: [Function: debugDomainError] },
     _eventsCount: 3,
     _maxListeners: undefined,
     members: [] },
  _events: [Object: null prototype] {},
  _eventsCount: 0,
  _maxListeners: undefined,
  _remote: {},
  _token: 'swt',
  tx_json:
   { Flags: 0,
     Fee: 10000,
     TransactionType: 'Payment',
     Account: 'jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG',
     Amount: '100000',
     Destination: 'jLvo6LSKNEYJ4KDwDuM8LU5fuSsQkE4HVW' },
  _filter: [Function],
  _secret: undefined }
> tx.setSecret(DATA.secret)
undefined
> tx.sign(console.log)
undefined
> null '120000220000000024000002326140000000000186A0684000000000002710732102197F1426BCA2F59B6B910F0391E55888B4FE80AF962478493104A33274B1B03A74473045022100F0175B4AFF5B1E348FC46A8C0021FF22B16CF87113C0B6E042174374416B071102203CB8A47A82576B69DB50051DF943C87872BB8F065A2D12B01ACA03890FAC8E548114AF09183A11AA70DA06E115E03B0E5478232740B58314DA976A4DE4827163F062B09050832D8D78025D5A'

> tx.tx_json
{ Flags: 0,
  Fee: 0.01,
  TransactionType: 'Payment',
  Account: 'jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG',
  Amount: 0.1,
  Destination: 'jLvo6LSKNEYJ4KDwDuM8LU5fuSsQkE4HVW',
  Sequence: 562,
  SigningPubKey:
   '02197F1426BCA2F59B6B910F0391E55888B4FE80AF962478493104A33274B1B03A',
  TxnSignature:
   '3045022100F0175B4AFF5B1E348FC46A8C0021FF22B16CF87113C0B6E042174374416B071102203CB8A47A82576B69DB50051DF943C87872BB8F065A2D12B01ACA03890FAC8E54',
  blob:
   '120000220000000024000002326140000000000186A0684000000000002710732102197F1426BCA2F59B6B910F0391E55888B4FE80AF962478493104A33274B1B03A74473045022100F0175B4AFF5B1E348FC46A8C0021FF22B16CF87113C0B6E042174374416B071102203CB8A47A82576B69DB50051DF943C87872BB8F065A2D12B01ACA03890FAC8E548114AF09183A11AA70DA06E115E03B0E5478232740B58314DA976A4DE4827163F062B09050832D8D78025D5A' }
> tx.submitApi().then(console.log).catch(console.log)
Promise {}
> { status: 200,
  statusText: 'OK',
  data:
   { success: true,
     status_code: '0',
     engine_result: 'tesSUCCESS',
     engine_result_code: 0,
     engine_result_message:
      'The transaction was applied. Only final in a validated ledger.',
     tx_blob:
      '120000220000000024000002326140000000000186A0684000000000002710732102197F1426BCA2F59B6B910F0391E55888B4FE80AF962478493104A33274B1B03A74473045022100F0175B4AFF5B1E348FC46A8C0021FF22B16CF87113C0B6E042174374416B071102203CB8A47A82576B69DB50051DF943C87872BB8F065A2D12B01ACA03890FAC8E548114AF09183A11AA70DA06E115E03B0E5478232740B58314DA976A4DE4827163F062B09050832D8D78025D5A',
     tx_json:
      { Account: 'jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG',
        Amount: '100000',
        Destination: 'jLvo6LSKNEYJ4KDwDuM8LU5fuSsQkE4HVW',
        Fee: '10000',
        Flags: 0,
        Sequence: 562,
        SigningPubKey:
         '02197F1426BCA2F59B6B910F0391E55888B4FE80AF962478493104A33274B1B03A',
        TransactionType: 'Payment',
        TxnSignature:
         '3045022100F0175B4AFF5B1E348FC46A8C0021FF22B16CF87113C0B6E042174374416B071102203CB8A47A82576B69DB50051DF943C87872BB8F065A2D12B01ACA03890FAC8E54',
        hash:
         '48D94F52CD0D9FD60634DEB5886D27149551235BD6CDA1C752F817C3290C327B' } } }

>
```

## Involving `swtc-transaction`

**Build from the source and test**

```bash
  $ git clone https://github.com/swtcca/swtc-lib.git -b transaction swtc-transaction
  $ cd swtc-transaction; npm install
  $ npm run build or npm run build:production (optional for static browser)
  $ npm run test
```

---
