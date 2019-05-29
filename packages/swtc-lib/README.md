# The COMMUNITY SWTC JavaScript Library for DEVELOPERS

## show offs - one line receiple
1. 创建remote对象
>  `const remote = new (require('swtc-lib').Remote)({server: 'ws://ts5.jingtum.com:5020'})`
2. 连接服务器
>  `remote.connectPromise().then(console.log).catch(console.error)`
3. 获取帐本
>  `remote.requestLedgerClosed().submitPromise().then(console.log)`
4. 获取交易
>  `remote.requestTx({hash: 'hash'}).submitPromise().then(console.log)`
5. 获取帐号信息
>  `remote.requestAccountInfo({account: 'address'}).submitPromise().then(console.log)`
6. 获得账号可接收和发送的货币
>  `remote.requestAccountTums({account: 'address'}).submitPromise().then(console.log)`
7. 支付
>  `remote.buildPaymentTx({source: 'address1', to: 'address2', amount: {value: 1, currency: 'SWT', issuer: ''}}).submitPromise('secret', 'memo').then(console.log)`
8. 挂单
>  `remote.buildOfferCreateTx({type: 'Sell', account: 'address', taker_gets: {value: 1, currency: 'SWT', issuer: ''}, taker_pays: {value: 0.01, currency: 'CNY', issuer: 'issuer'}}).submitPromise('secret', 'memo').then(console.log).catch(console.error)`
9. 查询挂单
>  `remote.requestAccountOffers({account: DATA.address}).submitPromise().then(console.log)`
10. 撤单
>  `remote.buildOfferCancelTx({ account: 'address', sequence: offerSequence}).submitPromise('secret', 'memo').then(console.log)`
11. 获取信任
>  `remote.requestAccountRelations({type: 'trust', account: 'address'}).submitPromise().then(console.log)`
12. 获取授权
>  `remote.requestAccountRelations({type: 'authorize', account: 'address'}).submitPromise().then(console.log)`
13. 设置信任
>  `remote.buildRelationTx({type: 'trust', account: 'address', target; 'issuer', limit: {value: 10000, currency: 'CNY', issuer: 'issuer'}}).submitPromise('secret', 'memo').then(console.log)`
14. 设置授权
>  `remote.buildRelationTx({type: 'authorize', account: 'address', target; 'address2', limit: {value: 10000, currency: 'CNY', issuer: 'issuer'}}).submitPromise('secret', 'memo').then(console.log)`
15. 获得市场挂单列表
>  `remote.requestOrderBook({gets: {currency: 'SWT', issuer: ''}, pays: {currency: 'CNY', issuer: 'issuer'}}).submitPromise().then(console.log).catch(console.error)`

## Swtc-lib heavily based on jingtum-lib and jcc_jingtum_lib and ripple-\*-libs

> ### keep the **same interface** as jingtum-lib or jcc_jingtum_lib, passing all related tests
>
> ### modularized/decoupled for later enhancement
>
> ### native node.js supporting **all major LTS version** including Boron-6, Carbon-8 and Dubnium-10
>
> ### web applications with **zero** webpack support
>
> ### nativescript **mobile app** support (use swtc-lib@nativescript)
>
> ### native **Async Actions** support

## Getting `swtc-lib`

**Via npm for Node.js**

```bash
  $ npm install swtc-lib  // node.js and web app
  $ npm install swtc-lib@next  // try to keep up with jingtum-lib@2.0.0 which introduces more dependancies
  $ npm install swtc-lib@jcc   // if you need to use jcc interfaces, just note that Wallet is added to exports
  $ npm install swtc-lib@nativescript   // mobile nativescript app, simplified one line configuration
```

## Using `swtc-lib`

```javascript
const Wallet = require("swtc-lib").Wallet // cjs import
const Remote = require("swtc-lib").Remote // cjs import
```

or

```javascript
import { Wallet, Remote } from "swtc-lib" // esm import
```

## Involving `swtc-lib`

**Build from the source and test**

```bash
  $ git clone https://github.com/swtcca/swtc-lib.git
  $ cd swtc-lib; npm install
  $ npm run build or npm run build:production (optional for static browser)
  $ npm run test
```

---

# About Jingtum lib

Basic js lib to be used for interacting with jingtum blockchain network.

- Keep only one websocket connecttion to jingtum and handle exception
- Do transaction to jingtumd, and process response
- Subscribe events, include server, ledger, account and so on
- Get other information from jingtum

## Documents

- For more information see `docs.md`
- Developer resource http://developer.jingtum.com/
