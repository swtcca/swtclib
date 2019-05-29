# The SWTC API JavaScript Library

## [Offical Doc 官方](http://developer.jingtum.com/api2_doc.html)

## changelog

- added .txSignPromise() and .txSubmitPromise()

## Compare with swtc-lib

1. use rest **api** instead of web socket
2. masked unsafe operations (never send out **secret**)
3. work together with **swtc-transaction** for **local sign**
4. promise based **axios** operation
5. **typescript** friendly
   ![vsc](https://raw.githubusercontent.com/swtcca/swtc-api/master/images/omni-vsc.png)

## usages

![vim](https://raw.githubusercontent.com/swtcca/swtc-api/master/images/omni-vim.png)

### import

```javascript
const API = require("swtc-api")
const Remote = API.Remote
// or
import { Remote } from "swtc-api"
```

### transaction operations

```typescript
import DATA from "./config"
import { Remote } from "swtc-api"
const remote = new Remote({ server: DATA.server })
const sleep = time => new Promise(res => setTimeout(() => res(), time))

async function main() {
  let tx: any, result: any, sequence: number
  try {
    console.log(
      `// secure transactions working with swtc-api and swtc-transaction`
    )
    result = await remote.getAccountBalances(DATA.address, { currency: "SWT" })
    sequence = result.sequence
    console.log(result.balances)
    console.log(`// demo payment transactions`)
    tx = remote.buildPaymentTx({
      source: DATA.address,
      to: DATA.address2,
      amount: remote.makeAmount(0.1)
    })
    tx.setSequence(sequence)
    tx.setSecret(DATA.secret)
    tx.sign((error, blob) => {
      if (error) {
        throw error
      } else {
        console.log(`signed blob: ${blob}`)
        remote
          .postBlob({ blob })
          .then(console.log)
          .catch(console.log)
      }
    })
    await sleep(20000)
    result = await remote.getAccountBalances(DATA.address, { currency: "SWT" })
    console.log(result.balances)
    console.log(`\n// demo offer create transactions`)
    console.log(await remote.getAccountOrders(DATA.address))
    tx = remote.buildOfferCreateTx({
      type: "Sell",
      account: DATA.address,
      taker_gets: remote.makeAmount(1),
      taker_pays: remote.makeAmount(0.01, 'cny', DATA.issuer }
    })
    tx.setSecret(DATA.secret)
    tx.sign((error, blob) => {
      if (error) {
        throw error
      } else {
        console.log(`signed blob: ${blob}`)
        tx.submitApi()
          .then(console.log)
          .catch(console.log)
      }
    })
    await sleep(20000)
    result = await remote.getAccountOrders(DATA.address)
    let order: any = result.orders.sort((x, y) => y.sequence - x.sequence)[0]
    console.log(order)
    console.log(result.orders)
    console.log(`\n// demo offer cancel transactions`)
    tx = remote.buildOfferCancelTx({
      account: DATA.address,
      sequence: order.sequence
    })
    tx.setSecret(DATA.secret)
    tx.sign((error, blob) => {
      if (error) {
        throw error
      } else {
        console.log(`signed blob: ${blob}`)
        tx.submitApi()
          .then(console.log)
          .catch(console.log)
      }
    })
    await sleep(20000)
    result = await remote.getAccountOrders(DATA.address)
    console.log(result.orders)
    console.log(`\n// demo relation transactions`)
    console.log(
      await remote.getAccountBalances(DATA.address, { currency: "CNY" })
    )
    tx = remote.buildRelationTx({
      type: "freeze", // or authorize
      target: DATA.address2,
      account: DATA.address,
      limit: {
        value: Math.floor(Math.random() * 10),
        currency: "CNY",
        issuer: DATA.issuer
      }
    })
    // tx.setSequence(sequence)
    tx.setSecret(DATA.secret)
    tx.sign((error, blob) => {
      if (error) {
        throw error
      } else {
        console.log(`signed blob: ${blob}`)
        // remote.postBlob({blob}).then(console.log).catch(console.log)
        tx.submitApi()
          .then(console.log)
          .catch(console.log)
      }
    })
    await sleep(20000)
    console.log(
      await remote.getAccountBalances(DATA.address, { currency: "CNY" })
    )
  } catch (error) {
    console.log(error)
  }
}
main()
```

- output

```javascript
> ts-node src/index.ts

// secure transactions working with swtc-api and swtc-transaction
[ { value: '11039.64', currency: 'SWT', issuer: '', freezed: '15' } ]
// demo payment transactions
signed blob: 120000220000000024000000616140000000000186A06840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E157447304502210098013A8A9C52E2E39CF1A13B3D733FD8A6EC857C108F209E99844E1DB668D549022029B8A9BD022B33B8FDD4C5A2A9C8A2793C414A5A7749CB7C159E4F254F37CCC981141359AA928F4D98FDB3D93E8B690C80D37DED11C38314054FADDC8595E2950FA43F673F65C2009F58C7F1
{ success: true,
  status_code: '0',
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '120000220000000024000000616140000000000186A06840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E157447304502210098013A8A9C52E2E39CF1A13B3D733FD8A6EC857C108F209E99844E1DB668D549022029B8A9BD022B33B8FDD4C5A2A9C8A2793C414A5A7749CB7C159E4F254F37CCC981141359AA928F4D98FDB3D93E8B690C80D37DED11C38314054FADDC8595E2950FA43F673F65C2009F58C7F1',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Amount: '100000',
     Destination: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
     Fee: '10000',
     Flags: 0,
     Sequence: 97,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TransactionType: 'Payment',
     TxnSignature:
      '304502210098013A8A9C52E2E39CF1A13B3D733FD8A6EC857C108F209E99844E1DB668D549022029B8A9BD022B33B8FDD4C5A2A9C8A2793C414A5A7749CB7C159E4F254F37CCC9',
     hash:
      '4456E2E4FD3924D13D0B7ACBD2CB348C93B6EE069ACD4C24CAAF3A0311DD88B0' } }
[ { value: '11039.53', currency: 'SWT', issuer: '', freezed: '15' } ]

// demo offer create transactions
{ success: true, status_code: '0', marker: '', orders: [] }
signed blob: 1200072200080000240000006264D45550F7DCA70000000000000000000000000000434E5900000000007478E561645059399B334448F7544F2EF308ED326540000000000F42406840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574463044022012602C2C15E49CC5935E88C4065360427980E6EF3A471556934C86C278F2A14702207739717F316C65FF0A48F8D8CB01266C26668ED334420F151891873130634C7D81141359AA928F4D98FDB3D93E8B690C80D37DED11C3
{ success: true,
  status_code: '0',
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '1200072200080000240000006264D45550F7DCA70000000000000000000000000000434E5900000000007478E561645059399B334448F7544F2EF308ED326540000000000F42406840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574463044022012602C2C15E49CC5935E88C4065360427980E6EF3A471556934C86C278F2A14702207739717F316C65FF0A48F8D8CB01266C26668ED334420F151891873130634C7D81141359AA928F4D98FDB3D93E8B690C80D37DED11C3',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Fee: '10000',
     Flags: 524288,
     Sequence: 98,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TakerGets: '1000000',
     TakerPays:
      { currency: 'CNY',
        issuer: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
        value: '0.6' },
     TransactionType: 'OfferCreate',
     TxnSignature:
      '3044022012602C2C15E49CC5935E88C4065360427980E6EF3A471556934C86C278F2A14702207739717F316C65FF0A48F8D8CB01266C26668ED334420F151891873130634C7D',
     hash:
      '61E2F30D475F451E77E1728112B9F0C813A1160186CA37C31DC8C58374315325' } }
{ type: 'sell',
  pair: 'SWT/CNY:jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
  amount: '1.000000',
  price: '0.6',
  sequence: 98 }
[ { type: 'sell',
    pair: 'SWT/CNY:jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
    amount: '1.000000',
    price: '0.6',
    sequence: 98 } ]

// demo offer cancel transactions
signed blob: 120008220000000024000000632019000000626840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15744730450221009F86EB30F803C627CCA238EDA88191852D6C72C751E395AFF4752D2C3CA9A6DF02203ADD4856D98BB494FD52EE5028CAA3E41B26E2DCC4EAB0D103BDC3BE54F3603381141359AA928F4D98FDB3D93E8B690C80D37DED11C3
{ success: true,
  status_code: '0',
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '120008220000000024000000632019000000626840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15744730450221009F86EB30F803C627CCA238EDA88191852D6C72C751E395AFF4752D2C3CA9A6DF02203ADD4856D98BB494FD52EE5028CAA3E41B26E2DCC4EAB0D103BDC3BE54F3603381141359AA928F4D98FDB3D93E8B690C80D37DED11C3',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Fee: '10000',
     Flags: 0,
     OfferSequence: 98,
     Sequence: 99,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TransactionType: 'OfferCancel',
     TxnSignature:
      '30450221009F86EB30F803C627CCA238EDA88191852D6C72C751E395AFF4752D2C3CA9A6DF02203ADD4856D98BB494FD52EE5028CAA3E41B26E2DCC4EAB0D103BDC3BE54F36033',
     hash:
      '9A07E602A75C99C6FABE59F48200622F5EEFDDDBF3E591A2DDBED807E848DE7E' } }
[]

// demo relation transactions
{ success: true,
  status_code: '0',
  balances:
   [ { value: '99.973',
       currency: 'CNY',
       issuer: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
       freezed: '1.000000' } ],
  sequence: 100 }
signed blob: 12001522000000002400000064202300000003638000000000000000000000000000000000000000434E5900000000007478E561645059399B334448F7544F2EF308ED326840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100E3E6458CA2EE060EE67A6CAA205E9007CC2C8313E9717D2A855C6D99DAAF1419022049F7D40D9B9194E7313F9C4C72105058EDD5AD3D9481AF2E1E3F7222634D023381141359AA928F4D98FDB3D93E8B690C80D37DED11C38714054FADDC8595E2950FA43F673F65C2009F58C7F1
{ success: true,
  status_code: '0',
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '12001522000000002400000064202300000003638000000000000000000000000000000000000000434E5900000000007478E561645059399B334448F7544F2EF308ED326840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100E3E6458CA2EE060EE67A6CAA205E9007CC2C8313E9717D2A855C6D99DAAF1419022049F7D40D9B9194E7313F9C4C72105058EDD5AD3D9481AF2E1E3F7222634D023381141359AA928F4D98FDB3D93E8B690C80D37DED11C38714054FADDC8595E2950FA43F673F65C2009F58C7F1',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Fee: '10000',
     Flags: 0,
     LimitAmount:
      { currency: 'CNY',
        issuer: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
        value: '0' },
     RelationType: 3,
     Sequence: 100,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     Target: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
     TransactionType: 'RelationSet',
     TxnSignature:
      '3045022100E3E6458CA2EE060EE67A6CAA205E9007CC2C8313E9717D2A855C6D99DAAF1419022049F7D40D9B9194E7313F9C4C72105058EDD5AD3D9481AF2E1E3F7222634D0233',
     hash:
      '536ACC8E28607869BED026A6A76DF1A259352686BF0A03BE2665730E2FE17C67' } }
{ success: true,
  status_code: '0',
  balances:
   [ { value: '99.973',
       currency: 'CNY',
       issuer: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
       freezed: '0.000000' } ],
  sequence: 101 }
```

### function calls

```typescript
import DATA from "./config"
import { Remote } from "swtc-api"
const remote = new Remote({ server: DATA.server })

async function main() {
  try {
    console.log(`// query balances and demo param`)
    let result: any = await remote.getAccountBalances(DATA.address)
    result.balances.forEach(balance =>
      console.log(`${balance.value.padEnd(16)}${balance.currency}`)
    )
    result = await remote.getAccountBalances(DATA.address, { currency: "CNY" })
    console.log(result)

    console.log(`\n// query transactions and demo paging`)
    for (let page = 1; page < 4; page++) {
      console.log(`page # ${page}`)
      result = await remote.getAccountTransactions(DATA.address, {
        results_per_page: 2,
        page
      })
      if ("marker" in result) {
        console.log(result.marker)
      }
      result.transactions.forEach(tx => console.log(tx.hash))
    }
    console.log(result)
    console.log(`\n// query payments history`)
    result = await remote.getAccountPayments(DATA.address, {
      results_per_page: 4
    })
    console.log(result)
    console.log(`\n// query active orders`)
    result = await remote.getAccountOrders(DATA.address, {
      results_per_page: 10
    })
    console.log(result)
    console.log(`\n// query ledger`)
    result = await remote.getLedger()
    const ledger_index = result.ledger_index
    const ledger_hash = result.ledger_hash
    console.log(result)
    result = await remote.getLedger(ledger_index)
    result = await remote.getLedger(parseInt(ledger_index))
    result = await remote.getLedger(ledger_hash)
    console.log(result)
    console.log(`\n// query orderbook`)
    result = await remote.getOrderBooks("SWT", `CNY+${DATA.issuer}`, {
      results_per_page: 4
    })
    result = await remote.getOrderBooksBids("SWT", `CNY+${DATA.issuer}`, {
      results_per_page: 4
    })
    result = await remote.getOrderBooksAsks("SWT", `CNY+${DATA.issuer}`, {
      results_per_page: 2
    })
    console.log(result)
    console.log(`\n// submit locally signed transactions`)
    result = await remote.postBlob({
      blob:
        "120000220000000024000002326140000000000186A0684000000000002710732102197F1426BCA2F59B6B910F0391E55888B4FE80AF962478493104A33274B1B03A74473045022100F0175B4AFF5B1E348FC46A8C0021FF22B16CF87113C0B6E042174374416B071102203CB8A47A82576B69DB50051DF943C87872BB8F065A2D12B01ACA03890FAC8E548114AF09183A11AA70DA06E115E03B0E5478232740B58314DA976A4DE4827163F062B09050832D8D78025D5A"
    })
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}
main()
```

### output

```javascript
> ts-node src/index.ts

// query balances and demo param
11039.64        SWT
99.973          CNY
{ success: true,
  status_code: '0',
  balances:
   [ { value: '99.973',
       currency: 'CNY',
       issuer: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
       freezed: '1.000000' } ],
  sequence: 97 }

// query transactions and demo paging
page # 1
{ ledger: 3012038, seq: 0 }
CA751123EF90EEE23E5BF36DB1ABB13221D6C906A188DF0F555C24DD684DB12C
9167A532DC192C611A65C8E547C26BF641CA9064EA41BDDDB9A8443F577146FA
page # 2
{ ledger: 3012034, seq: 0 }
86272B747430330ECD175F6701266EBDD7C50E3FFD19C7D45FCD170BE90625F5
4CD5B2B8A4D57EEA673E30280BDF8ED6B8DFCE8FF7C52B8CB69672C6AC5EDA66
page # 3
{ ledger: 3011884, seq: 0 }
ECB86F6887B14EDF5C9EEC247280BDE0E901BF59CF56CD007579A4F7E2AFF1FA
A32E97613AF5F54E84DC7BD457AE7FF37F8F1FC7B642B5457D3DE8B3665F9B66
{ success: true,
  status_code: '0',
  marker: { ledger: 3011884, seq: 0 },
  transactions:
   [ { date: 1555889170,
       hash:
        'ECB86F6887B14EDF5C9EEC247280BDE0E901BF59CF56CD007579A4F7E2AFF1FA',
       type: 'sent',
       fee: '0.01',
       result: 'tesSUCCESS',
       memos: [],
       counterparty: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
       amount: [Object],
       effects: [] },
     { date: 1555887700,
       hash:
        'A32E97613AF5F54E84DC7BD457AE7FF37F8F1FC7B642B5457D3DE8B3665F9B66',
       type: 'relationset',
       fee: '0.01',
       result: 'tesSUCCESS',
       memos: [],
       counterparty: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
       relationtype: 'freeze',
       isactive: true,
       amount: [Object],
       effects: [] } ] }

// query payments history
{ success: true,
  status_code: '0',
  marker: { ledger: 3012034, seq: 0 },
  payments:
   [ { date: 1555942830,
       hash:
        'CA751123EF90EEE23E5BF36DB1ABB13221D6C906A188DF0F555C24DD684DB12C',
       type: 'sent',
       fee: '0.01',
       result: 'tesSUCCESS',
       memos: [],
       counterparty: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
       amount: [Object],
       effects: [] } ] }

// query active orders
{ success: true, status_code: '0', marker: '', orders: [] }

// query ledger
{ success: true,
  status_code: '0',
  ledger_hash:
   '6D69CF241F487130690DF71588AA8E30EBEC0DAB4FA0224A5940D6278F4906C9',
  ledger_index: 3017885 }
{ success: true,
  status_code: '0',
  accepted: true,
  account_hash:
   '4994071C2F6DF493F46056F3DEC4A2AF32E43D8C36CD3B33D76B2EE355573810',
  close_time: 609262880,
  close_time_human: '2019-Apr-22 15:41:20',
  close_time_resolution: 10,
  closed: true,
  hash:
   '6D69CF241F487130690DF71588AA8E30EBEC0DAB4FA0224A5940D6278F4906C9',
  ledger_hash:
   '6D69CF241F487130690DF71588AA8E30EBEC0DAB4FA0224A5940D6278F4906C9',
  ledger_index: '3017885',
  parent_hash:
   'D354D0B2F3B29AD5DAD239ECAF5986E272A636E55BE9721F34873CC26D1406F2',
  seqNum: '3017885',
  totalCoins: '600000000000000000',
  total_coins: '600000000000000000',
  transaction_hash:
   '0000000000000000000000000000000000000000000000000000000000000000',
  transactions: [] }

// query orderbook
{ success: true,
  status_code: '0',
  pair: 'SWT/CNY+jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
  asks:
   [ { price: 0.007,
       order_maker: 'jH6L8EzkgwMKWRmLVC4oLchqft4oNqUUj',
       sequence: 4,
       passive: false,
       sell: true,
       funded: 3 },
     { price: 0.3,
       order_maker: 'jH6L8EzkgwMKWRmLVC4oLchqft4oNqUUj',
       sequence: 1,
       passive: false,
       sell: true,
       funded: 5 } ] }

// submit locally signed transactions
{ success: true,
  status_code: '0',
  engine_result: 'terNO_ACCOUNT',
  engine_result_code: -96,
  engine_result_message: 'The source account does not exist.',
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
      '48D94F52CD0D9FD60634DEB5886D27149551235BD6CDA1C752F817C3290C327B' } }
```
