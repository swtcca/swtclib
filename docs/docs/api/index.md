# SWTC-API

[[toc]]

## 0 后端支持

##### [swtc-proxy 文档](../swtcproxy/)

##### [jingtum-api 官方文档](http://developer.jingtum.com/api2_doc.html)

##### @swtc/proxy 说明

> ##### 对 jingtum-api 作出包装， 消除不安全操作 并且提供类似@swtc/lib 的接口支持 jingtum-api 缺失的操作
>
> ##### 强制本地签名
>
> ##### 合约测试只能在特定节点运行, solidity 支持到 0.5.4, 需要安装 swtc-tum3 / tum3-eth-abi, 没有达到可用阶段
>
> ##### 同时支持`jingtum-api` 和 `swtc-proxy`
>
> ##### 多重签名测试链上没有支持
>
> ##### 目前文档输出为 `swtc-proxy`, [老版本](https://github.com/swtcca/swtcdoc/blob/api4jingtum/docs/api/README.md)以`jingtum-api`输出为例
>
> ##### 操作以`swtc-proxy`支持为主， 部分功能在`jingtum-api`不支持

### 后端选择/准备

##### swtc-proxy, 推荐

> ##### 公链 http://swtcproxy.swtclib.ca:5080
>
> ##### 测试 http://swtcproxy.swtclib.ca:5081

##### jingtum-api, 本身允许不安全操作，注意

> ##### 公链 https://api.jingtum.com
>
> ##### 测试链 https://tapi.jingtum.com

## 1 安装

1. 安装库

```bash
npm install --save @swtc/api
```

## 2 项目说明

> ##### swtc-api 库操作`jingtum-api`提供的 restapi, 但是实现了本地签名， 避免密钥传输到网络上
>
> ##### swtc-api 库操作`swtc-proxy`提供的 restapi
>
> ##### swtc-api 提供比`jingtum-api` 和 `swtc-proxy` 更多的操作, 有完整的接口

## 3 创建钱包

> ##### 首先引入 swtc-api 库的 Wallet 对象，然后使用以下两种方法创建钱包
>
> ##### 方法 1: Wallet.generate()
>
> ##### 方法 2: Wallet.fromSecret(secret);

##### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |

```javascript
//创建Wallet对象
var japi = require("@swtc/api")
var Wallet = japi.Remote.Wallet
//方式一
var w1 = Wallet.generate()

console.log(w1)
//方式二
var w2 = Wallet.fromSecret("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
console.log(w2)
```

##### 返回的结果信息:

| 参数    | 类型   |         说明 |
| ------- | ------ | -----------: |
| secret  | String | 井通钱包私钥 |
| address | String | 井通钱包地址 |

##### 输出

```javascript
> Wallet.generate()
{ secret: 'ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C',
  address: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz' }
```

## 4 REMOTE 类

##### Remote 是跟 jingtum-api 的 restapi 交互的类，它包装所有 jingtum-api 提供的方法, 还提供额外的类似@swtc/lib 的接口

- Remote(options)
- getAccountSequence()
- getServerInfo() `proxy`
- getAccountInfo(address) `proxy`
- getAccountSignerList(address) `proxy`
- getAccountRelations(address)
- getAccountBalances(address)
- getAccountPayment(address, hash)
- getAccountPayments(address)
- getAccountOrder(address, hash)
- getAccountOrders(address)
- getAccountTransaction(address, hash)
- getAccountTransactions(address)
- getTransaction(hash)
- getLedger()
- getLedger(hash_or_index)
- getOrderBooks(base, counter)
- getOrderBooksBids(base, counter)
- getOrderBooksAsks(base, counter)
- buildPaymentTx(options)
- buildRelationTx(options)
- buildAccountSetTx(options)
- buildOfferCreateTx(options)
- buildOfferCancelTx(options)
- buildContractDeployTx(options)
- buildContractCallTx(options)

##### swtc-api REMOTE 独享

- buildContractInitTx(options)
- buildContractInvokeTx(options)
- makeCurrency()
- makeAmount()
- buildSignFirstTx()
- buildSignOtherTx()
- buildMultisignedTx()
- buildSignerListTx(options)
- tx.signPromise()
- tx.submitPromise()
- tx.multiSigning()
- tx.multiSigned()

### 4.1 创建 Remote 对象

##### 方法:new Remote(options);

##### 参数:

| 参数     | 类型    |                   说明 |
| -------- | ------- | ---------------------: |
| server   | String  | 井通 rest api 服务地址 |
| issuer   | String  |               默认银关 |
| solidity | Boolean |     启用 solidity 支持 |

##### 例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote_proxy = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
```

### 4.2 获得账号余额

##### 方法:remote.getAccountBalances(address);

##### 参数:

| 参数    | 类型   |         说明 |
| ------- | ------ | -----------: |
| address | String | 井通钱包地址 |

##### [可选参数:](#optionalParameters)

| 参数     | 类型   |                       说明 |
| -------- | ------ | -------------------------: |
| currency | String |     指定返回对应货币的余额 |
| issuer   | String | 指定返回对应银关发行的货币 |

##### 返回: Promise - json

##### 例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
remote
  .getAccountBalances("jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz")
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
> {
  balances: [
    { value: 25.98, currency: 'SWT', issuer: '', freezed: 25 },
    {
      value: '87',
      currency: 'JSLASH',
      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      freezed: 0
    }
  ],
  sequence: 3
}
```

##### 返回结果说明

| 参数                       | 类型    |                               说明 |
| -------------------------- | ------- | ---------------------------------: |
| balances                   | Array   |                           余额数组 |
| &nbsp;&nbsp;&nbsp;value    | String  |                               余额 |
| &nbsp;&nbsp;&nbsp;currency | String  | 货币名称，三个字母或 20 字节的货币 |
| &nbsp;&nbsp;&nbsp;issuer   | String  |                         货币发行方 |
| &nbsp;&nbsp;&nbsp;freezed  | String  |                         冻结的金额 |
| sequence                   | Integer |     当前交易序列号（用于本地签名） |

### 4.3 获得账号支付信息

##### 方法:remote.getAccountPayment(address, hash);

##### 参数:

| 参数    | 类型   |             说明 |
| ------- | ------ | ---------------: |
| address | String | 支付用户钱包地址 |
| hash    | String |  支付交易的 hash |

##### 返回: Promise - json

##### 例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
remote
  .getAccountPayment(
    "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
    "84CCE378A2882D417AC311CA027FC1EAD21E5486B7C7E6FBFE71187FF28E0F65"
  )
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
> {
  date: 1576697180,
  hash: '84CCE378A2882D417AC311CA027FC1EAD21E5486B7C7E6FBFE71187FF28E0F65',
  type: 'sent',
  fee: '0.01',
  result: 'tesSUCCESS',
  memos: [ { MemoData: 'test payment' } ],
  counterparty: 'j3vyFAMQW2Ls48eoFCTsMXFq2KNWVUskSx',
  amount: {
    currency: 'JSLASH',
    issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
    value: '1'
  },
  effects: [],
  balances: { JSLASH: 85, SWT: 30.96 },
  balancesPrev: { JSLASH: 86, SWT: 30.97 }
}
```

##### 返回结果说明

| 参数         | 类型    |                              说明 |
| ------------ | ------- | --------------------------------: |
| date         | Integer |           支付时间，UNIXTIME 时间 |
| hash         | String  |                         支付 hash |
| type         | String  |        支付类型，sent 或 received |
| fee          | String  |                          支付费用 |
| result       | String  |                  支付的服务器结果 |
| memos        | Array   |           支付的备注，String 数组 |
| counterparty | String  |                          交易对家 |
| amount       | Object  |                          交易金额 |
| effects      | Array   | [支付的效果](#transactionEffects) |

### 4.4 获得账号支付记录

##### 方法:remote.getAccountPayments(address);

##### 参数:

| 参数    | 类型   |             说明 |
| ------- | ------ | ---------------: |
| address | String | 支付用户钱包地址 |

##### 返回: Promise - json

##### 例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
remote
  .getAccountPayments("jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz")
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
> {
  account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  ledger_index_max: 14685226,
  ledger_index_min: 14335743,
  payments: [
    {
      date: 1576697180,
      hash: '84CCE378A2882D417AC311CA027FC1EAD21E5486B7C7E6FBFE71187FF28E0F65',
      type: 'sent',
      fee: '0.01',
      result: 'tesSUCCESS',
      memos: [Array],
      counterparty: 'j3vyFAMQW2Ls48eoFCTsMXFq2KNWVUskSx',
      amount: [Object],
      effects: [],
      balances: [Object],
      balancesPrev: [Object]
    },
    {
      date: 1576696930,
      hash: 'F42226C6A483D14ED14D34945E366917EE508CC04BE00CFF50E200440E6B0AD9',
      type: 'sent',
      fee: '0.01',
      result: 'tesSUCCESS',
      memos: [],
      counterparty: 'j3vyFAMQW2Ls48eoFCTsMXFq2KNWVUskSx',
      amount: [Object],
      effects: [],
      balances: [Object],
      balancesPrev: [Object]
    }
  ]
}
```

##### 返回结果说明

| 参数     | 类型  |                         说明 |
| -------- | ----- | ---------------------------: |
| payments | Array | 支付历史, 同交易记录中的信息 |

### 4.5 获得账号挂单信息

##### 方法:remote.getAccountOrder(address, hash);

##### 参数:

| 参数    | 类型   |            说明 |
| ------- | ------ | --------------: |
| address | String |  挂单方钱包地址 |
| hash    | String | 挂单交易的 hash |

##### 返回: Promise - json

##### 例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
remote
  .getAccountOrder(
    "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
    "8D6DC86FF64DFE83AFB9B5B0E43B7BCA05B9FAB88C5F73D540814FE1DE195CAA"
  )
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
> {
  date: 1576697880,
  hash: '8D6DC86FF64DFE83AFB9B5B0E43B7BCA05B9FAB88C5F73D540814FE1DE195CAA',
  type: 'offernew',
  fee: '0.01',
  result: 'tesSUCCESS',
  memos: [ { MemoData: 'memo offer create' } ],
  offertype: 'sell',
  gets: {
    currency: 'JSLASH',
    issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
    value: '1'
  },
  pays: { value: '1', currency: 'SWT', issuer: '' },
  seq: 5,
  effects: [
    {
      effect: 'offer_created',
      gets: [Object],
      pays: [Object],
      type: 'sell',
      seq: 5,
      price: '1'
    }
  ],
  balances: { SWT: 30.95 },
  balancesPrev: { SWT: 30.96 }
}
```

### 4.6 获得账号挂单列表

##### 方法:remote.getAccountOrders(address);

##### 参数:

| 参数    | 类型   |           说明 |
| ------- | ------ | -------------: |
| address | String | 挂单方钱包地址 |

##### 返回: Promise - json

##### 例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
remote
  .getAccountOrders("jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz")
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
> {
  account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  ledger_hash: '8824A222275B2E0545CDFEBBC95821F9E25C3A32320C07B1651F2C7BA0727DFD',
  ledger_index: 14685287,
  offers: [
    {
      flags: 131072,
      seq: 5,
      taker_gets: [Object],
      taker_pays: '1000000'
    }
  ],
  validated: true
}
```

### 4.7 获得账号事务信息

##### 方法:remote.getAccountTransaction(address, hash);

##### 参数:

| 参数    | 类型   |        说明 |
| ------- | ------ | ----------: |
| address | String |    钱包地址 |
| hash    | String | 交易的 hash |

##### 返回: Promise - json

##### 例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
remote
  .getAccountTransaction(
    "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
    "F42226C6A483D14ED14D34945E366917EE508CC04BE00CFF50E200440E6B0AD9"
  )
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
> {
  date: 1576696930,
  hash: 'F42226C6A483D14ED14D34945E366917EE508CC04BE00CFF50E200440E6B0AD9',
  type: 'sent',
  fee: '0.01',
  result: 'tesSUCCESS',
  memos: [],
  counterparty: 'j3vyFAMQW2Ls48eoFCTsMXFq2KNWVUskSx',
  amount: {
    currency: 'JSLASH',
    issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
    value: '1'
  },
  effects: [],
  balances: { JSLASH: 86, SWT: 30.97 },
  balancesPrev: { JSLASH: 87, SWT: 30.98 }
}
```

### 4.8 获得账号交易记录

##### 方法:remote.getAccountTransactions(address);

##### 参数:

| 参数    | 类型   |     说明 |
| ------- | ------ | -------: |
| address | String | 钱包地址 |

##### 返回: Promise - json

##### 例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
remote
  .getAccountTransactions("jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz", { limit: 4 })
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
> {
  account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  ledger_index_max: 14685341,
  ledger_index_min: 14335272,
  limit: 4,
  marker: { ledger: 14548229, seq: 2 },
  transactions: [
    {
      date: 1576697880,
      hash: '8D6DC86FF64DFE83AFB9B5B0E43B7BCA05B9FAB88C5F73D540814FE1DE195CAA',
      type: 'offernew',
      fee: '0.01',
      result: 'tesSUCCESS',
      memos: [Array],
      offertype: 'sell',
      gets: [Object],
      pays: [Object],
      seq: 5,
      effects: [Array],
      balances: [Object],
      balancesPrev: [Object]
    },
    {
      date: 1576697180,
      hash: '84CCE378A2882D417AC311CA027FC1EAD21E5486B7C7E6FBFE71187FF28E0F65',
      type: 'sent',
      fee: '0.01',
      result: 'tesSUCCESS',
      memos: [Array],
      counterparty: 'j3vyFAMQW2Ls48eoFCTsMXFq2KNWVUskSx',
      amount: [Object],
      effects: [],
      balances: [Object],
      balancesPrev: [Object]
    },
    {
      date: 1576696930,
      hash: 'F42226C6A483D14ED14D34945E366917EE508CC04BE00CFF50E200440E6B0AD9',
      type: 'sent',
      fee: '0.01',
      result: 'tesSUCCESS',
      memos: [],
      counterparty: 'j3vyFAMQW2Ls48eoFCTsMXFq2KNWVUskSx',
      amount: [Object],
      effects: [],
      balances: [Object],
      balancesPrev: [Object]
    },
    {
      date: 1576696810,
      hash: 'FA45FD2FD57BF051EF19C967DFC17CD2721E29BF432B0E10CBE0AF0510A9F032',
      type: 'received',
      fee: '0.01',
      result: 'tesSUCCESS',
      memos: [],
      counterparty: 'j3vyFAMQW2Ls48eoFCTsMXFq2KNWVUskSx',
      amount: [Object],
      effects: [],
      balances: [Object],
      balancesPrev: [Object]
    }
  ]
}
```

##### 返回结果说明

### 4.9 获得帐号交易序列号

##### 方法:remote.getAccountSequence(address)

##### 参数:

| 参数    | 类型   |     说明 |
| ------- | ------ | -------: |
| address | String | 钱包地址 |

##### 返回: Promise - json

##### 例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
remote
  .getAccountSequence("jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz")
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```
> { sequence: 11 }
```

### 4.10 获得货币对的挂单列表 - 买/卖

##### 方法:remote.getOrderBooks(base, counter);

##### 方法:remote.getOrderBooks(counter, base);

##### 参数:

| 参数    | 类型   |                                                     说明 |
| ------- | ------ | -------------------------------------------------------: |
| base    | String | 基准货币（currency+counterparty），兼容 swt+counterparty |
| counter | String | 目标货币（currency+counterparty），兼容 swt+counterparty |

##### [可选参数:](#optionalParameters)

| 参数   | 类型   |     说明 |
| ------ | ------ | -------: |
| marker | object | 位置标记 |

##### 返回: Promise - json

##### 例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
remote
  .getOrderBooks("SWT", "CNY+" + remote._issuer)
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```
> {
  ledger_current_index: 14685409,
  offers: [
    {
      Account: 'jPZuCxWTL28vnfb86vHrLvgTnwiBEgaVrE',
      BookDirectory: '51603377F758E3C8FA007C77312DDA06A737A1395CD5FC435D0972DE6F6C8572',
      BookNode: '0000000000000000',
      Flags: 0,
      LedgerEntryType: 'Offer',
      OwnerNode: '0000000000000001',
      PreviousTxnID: '7C79CF7AE14DA02488A925488BA94F095F8E9C7DC9386FB93D4837DAA5A6CACB',
      PreviousTxnLgrSeq: 14685379,
      Sequence: 1452,
      TakerGets: [Object],
      TakerPays: '740000000000',
      index: '428D120A4DFB65A9D23AD2DD0EF712FF24C67BEC885C4B68D324EE6435FCA9C0',
      owner_funds: '23868.88806657596',
      quality: '265957446.8085106'
    },
    {
      Account: 'jJPQhnoGdm9bD1Ngcgk7k2kRUsJypGoUEw',
      BookDirectory: '51603377F758E3C8FA007C77312DDA06A737A1395CD5FC435D0972DE6F6C8572',
      BookNode: '0000000000000000',
      FeeCurrency: 'SWT',
      Flags: 0,
      LedgerEntryType: 'Offer',
      OfferFeeRateDen: '00000000000003E8',
      OfferFeeRateNum: '0000000000000002',
      OwnerNode: '0000000000000000',
      Platform: 'jDXCeSHSpZ9LiX6ihckWaYDeDt5hFrdTto',
      PreviousTxnID: '33358081F0331D1440C54DD166BCD86B5816C16E5F088DEEA05F8FB72ED2C1CF',
      PreviousTxnLgrSeq: 14684636,
      Sequence: 3080,
      TakerGets: [Object],
      TakerPays: '1757250000000',
      index: '9EB2FD56627E76CCD2DBD2921F2B8C7362BB6B675210F23F971CB3512820F762',
      owner_funds: '6607.26151815719',
      quality: '265957446.8085106'
    },
    {
      Account: 'jw2jAYv2VifjYVCCjv5qDah9hknMKMtg9e',
      BookDirectory: '51603377F758E3C8FA007C77312DDA06A737A1395CD5FC435D0A01F4F7D16890',
      BookNode: '0000000000000000',
      FeeCurrency: 'SWT',
      Flags: 0,
      LedgerEntryType: 'Offer',
      OfferFeeRateDen: '00000000000F4240',
      OfferFeeRateNum: '00000000000003E8',
      OwnerNode: '0000000000000000',
      Platform: 'jGrVFKACsF7W6PhMHn5upPN7fPUyG8NVKx',
      PreviousTxnID: 'FA7FFA476ED893218256C5735D590FFCEC9BE67849177131123100998EF16103',
      PreviousTxnLgrSeq: 14678331,
      Sequence: 165,
      TakerGets: [Object],
      TakerPays: '40515000000',
      index: 'DFFF4E69DB07355467D3510F82C37AADC0CDA6F658531F8504B29887246C33EB',
      owner_funds: '182.8264976823619',
      quality: '281690140.8450704'
    }
  ],
  validated: false
}
```

##### 返回结果说明

### 4.11 获得某一事务信息

##### 方法:remote.getTransaction(hash);

##### 参数:

| 参数 | 类型   |        说明 |
| ---- | ------ | ----------: |
| hash | String | 交易的 hash |

##### 返回: Promise - json

##### 例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
remote
  .getTransaction(
    "FA45FD2FD57BF051EF19C967DFC17CD2721E29BF432B0E10CBE0AF0510A9F032"
  )
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
> {
  Account: 'j3vyFAMQW2Ls48eoFCTsMXFq2KNWVUskSx',
  Amount: '5000000',
  Destination: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  Fee: '10000',
  Flags: 0,
  Sequence: 197,
  SigningPubKey: '0302357748343E2F41D65692B9B2A6B52157D9ECF9D8555C098A8A407C06093350',
  TransactionType: 'Payment',
  TxnSignature: '304402207B4F7647A4CFBAE591C4D2426494A705CCB565DB6562ADFE6DAA1A677AF3447C02206267E5260311FC3B08C5BB223282351FBE6BC436B72E52FD498D73F802B55043',
  date: 630012010,
  hash: 'FA45FD2FD57BF051EF19C967DFC17CD2721E29BF432B0E10CBE0AF0510A9F032',
  inLedger: 14685168,
  ledger_index: 14685168,
  meta: {
    AffectedNodes: [ [Object], [Object], [Object] ],
    TransactionIndex: 4,
    TransactionResult: 'tesSUCCESS'
  },
  validated: true
}
```

##### 返回结果说明

### 4.12 获得最新帐本

##### 方法:remote.getLedger();

##### 参数: 无

##### 返回: Promise - json

##### 例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
remote.getLedger().then(console.log).catch(console.error)
```

##### 返回结果

```javascript
> {
  ledger_hash: 'EBD02238BB712D969CAEF588834DEF15E95FE2E41355A119FF888FDB1F3847C0',
  ledger_index: 14685450,
  ledger_time: 630014830
}
```

##### 返回结果说明

| 参数         | 类型    |            说明 |
| ------------ | ------- | --------------: |
| ledger_hash  | String  |       账本 hash |
| ledger_index | Integer | 账本号/区块高度 |

### 4.13 获得某一帐本及其交易信息

##### 方法:remote.getLedger(hash_or_index);

##### 参数:

| 参数          | 类型   |                      说明 |
| ------------- | ------ | ------------------------: |
| hash_or_index | string | 账本号/区块高度 或者 哈希 |

##### 返回: Promise - json

##### 例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
remote.getLedger(14685450).then(console.log).catch(console.error)
remote
  .getLedger("EBD02238BB712D969CAEF588834DEF15E95FE2E41355A119FF888FDB1F3847C0")
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
> {
  accepted: true,
  account_hash: 'EB7D100F0B603F388F231EF3AD89D0A33027F022CD907F35E5A73B608D86AE35',
  close_time: 630014830,
  close_time_human: '2019-Dec-18 20:07:10',
  close_time_resolution: 10,
  closed: true,
  hash: 'EBD02238BB712D969CAEF588834DEF15E95FE2E41355A119FF888FDB1F3847C0',
  ledger_hash: 'EBD02238BB712D969CAEF588834DEF15E95FE2E41355A119FF888FDB1F3847C0',
  ledger_index: '14685450',
  parent_hash: '09D980AC4F3FF5ED6F9895D143EB52EA06662EDDA770B2EB4F86C0672452C92F',
  seqNum: '14685450',
  totalCoins: '599999999999460713',
  total_coins: '599999999999460713',
  transaction_hash: '7FA3C98DBAD910FB394664C8BF0A80615473A4BA04BA018C4B7C1E8C86E447D5',
  transactions: [
    '03C0156CD184DA77D3C7B79E511CDE4BDE4D066C909FFA830EB69829D514FB1B',
    '10D169C3EC7575562A5C9ACF5373348946B377FD1584451BE8A228FA3C8048EA',
    '27E362082AFC877F3169C7822B2C330CF338F9C3EB2E6AB5A08D9F45A5166A25',
    '7FB681496D49ADFBF29A04D6C1EF17649B41C3D7FBB9AC037FA5A947162F77A5',
    'A0E2C660C8035175E2D0F12AE510B20DFE6C74A52E46262AADC72CAE70AD7357',
    'F8E74EC60D1ABA07B8B3457C1C597EF5749ED0AE6CE9B538A6F491AA0691AC12'
  ]
}
```

##### 返回结果说明

| 参数                  | 类型    |               说明 |
| --------------------- | ------- | -----------------: |
| accepted              | Boolean |   区块是否已经产生 |
| account_hash          | String  |     状态 hash 树根 |
| close_time            | Integer |           关闭时间 |
| close_time_human      | String  |           关闭时间 |
| close_time_resolution | Integer |           关闭周期 |
| closed                | Boolean |   账本是否已经关闭 |
| hash                  | String  |          账本 hash |
| ledger_hash           | String  |          账本 hash |
| ledger_index          | String  |  账本高度/区块高度 |
| parent_hash           | String  |   上一区块 hash 值 |
| seqNum                | String  |  账本高度/区块高度 |
| totalCoins            | String  |           swt 总量 |
| total_coins           | String  |           swt 总量 |
| transaction_hash      | String  |     交易 hash 树根 |
| transactions          | Array   | 该账本里的交易列表 |

### 4.14 获得挂单佣金信息

##### 方法:remote.getAccountBrokerage(address);

##### 参数:

| 参数    | 类型   |     说明 |
| ------- | ------ | -------: |
| address | String | 钱包地址 |

##### 返回: Promise - json

##### 例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
remote
  .getAccountBrokerage("jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz")
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
> {
  account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  brokerages: [
    {
      FeeCurrency: 'JSLASH',
      FeeCurrencyIssuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      OfferFeeRateDen: '1000',
      OfferFeeRateNum: '1',
      Platform: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
      fee_account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz'
    }
  ],
  ledger_hash: 'EA0F6CA08241D01AE6CFCD8376AB9ED3747DCF8366FED35127F79CA20EC581FF',
  ledger_index: 14685952,
  validated: true
}
```

### 4.15 支付

##### 首先通过 buildPaymentTx 方法返回一个 Transaction 对象，然后通过 submitPromise()方法提交支付信息。

##### <a name="paymentBuildTx"></a> 4.15.1 创建支付对象

###### 方法: remote.buildPaymentTx({});

###### 参数:

| 参数    | 类型   |     说明 |
| ------- | ------ | -------: |
| account | String | 发起账号 |
| to      | String | 目标账号 |
| amount  | Object | 支付金额 |

###### 返回:Transaction 对象

##### <a name="paymentSubmit"></a> 4.15.2 提交支付

###### 方法:tx.submitPromise(secret, memo)

###### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |
| memo   | String |     备注信息 |

###### 返回: Promise

##### 支付完整例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
remote
  .buildPaymentTx({
    account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
    to: "j3vyFAMQW2Ls48eoFCTsMXFq2KNWVUskSx",
    amount: remote.makeAmount(1, "JSLASH")
  })
  .submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C", "payment memo")
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  tx_blob: '1200002200000000240000000461D4838D7EA4C680000000000000000000004A534C4153480000000000A582E432BFC48EEDEF852C814EC57F3CD2D415966840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574463044022068680CA0919F8908656DB8761CA7FBE1A9AC02216BDEEEB6A0D94A5F744CF5340220249698FA0158C24833068CD373B97B67244BD0F98E141CB694AE4B8185C44F7281141359AA928F4D98FDB3D93E8B690C80D37DED11C3831456FE5CE2D298C9493022FB43596A1B23AE3E3728F9EA7D0C74657374207061796D656E74E1F1',
  tx_json: {
    Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Amount: {
      currency: 'JSLASH',
      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      value: '1'
    },
    Destination: 'j3vyFAMQW2Ls48eoFCTsMXFq2KNWVUskSx',
    Fee: '10000',
    Flags: 0,
    Memos: [ [Object] ],
    Sequence: 4,
    SigningPubKey: '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
    TransactionType: 'Payment',
    TxnSignature: '3044022068680CA0919F8908656DB8761CA7FBE1A9AC02216BDEEEB6A0D94A5F744CF5340220249698FA0158C24833068CD373B97B67244BD0F98E141CB694AE4B8185C44F72',
    hash: '84CCE378A2882D417AC311CA027FC1EAD21E5486B7C7E6FBFE71187FF28E0F65'
  }
}
```

##### 返回结果说明

| 参数                              | 类型    |                  说明 |
| --------------------------------- | ------- | --------------------: |
| engine_result                     | String  |              请求结果 |
| engine_result_code                | Array   |          请求结果编码 |
| engine_result_message             | String  | 请求结果 message 信息 |
| tx_blob                           | String  |   16 进制签名后的交易 |
| tx_json                           | Object  |              交易内容 |
| &nbsp;&nbsp;&nbsp;Account         | String  |              账号地址 |
| &nbsp;&nbsp;&nbsp;Amount          | Object  |              交易金额 |
| &nbsp;&nbsp;&nbsp;Destination     | String  |                  对家 |
| &nbsp;&nbsp;&nbsp;Fee             | String  |                交易费 |
| &nbsp;&nbsp;&nbsp;Flags           | Integer |              交易标记 |
| &nbsp;&nbsp;&nbsp;Memos           | Array   |                  备注 |
| &nbsp;&nbsp;&nbsp;Sequence        | Integer |            单子序列号 |
| &nbsp;&nbsp;&nbsp;SigningPubKey   | Object  |              签名公钥 |
| &nbsp;&nbsp;&nbsp;TransactionType | String  |              交易类型 |
| &nbsp;&nbsp;&nbsp;TxnSignature    | String  |              交易签名 |
| &nbsp;&nbsp;&nbsp;hash            | String  |             交易 hash |

### 4.16 设置关系

##### 首先通过 buildRelationTx 方法返回一个 Transaction 对象，然后通过 submitPromise()方法提交支付信息。目前支持的关系类型:信任(trust)、授权(authorize)、冻结 (freeze)

##### <a name="relationBuildTx"></a> 4.16.1 创建关系对象

###### 方法:remote.buildRelationTx({});

###### 参数

| 参数     | 类型   |                                         说明 |
| -------- | ------ | -------------------------------------------: |
| type     | String |                                     关系种类 |
| account  | String |                             设置关系的源账号 |
| target   | String |                     目标账号，授权和冻结才有 |
| limit    | Object |                                     关系金额 |
| value    | String |                                         数量 |
| currency | String | 货币种类，三到六个字母或 20 字节的自定义货币 |
| issuer   | String |                                   货币发行方 |

###### 返回:Transaction 对象

##### <a name="relationSubmit"></a> 4.16.2 关系设置

###### 方法:tx.submitPromise(secret, memo)

###### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |
| memo   | String |     备注信息 |

###### 返回: Promise

##### 设置关系完整例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
let options = {
  account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  target: "j3vyFAMQW2Ls48eoFCTsMXFq2KNWVUskSx",
  limit: remote.makeAmount(1, "JSLASH"),
  type: "authorize"
}
let tx = remote.buildRelationTx(options)
tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C", "授权")
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  tx_blob: '1200152200000000240000000620230000000163D4838D7EA4C680000000000000000000004A534C4153480000000000A582E432BFC48EEDEF852C814EC57F3CD2D415966840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E157446304402204C540968F04F958AF4FAE64EEB54CACB4BAFFFD599EBEE11BED02CB5E94A0BEE022005DA39B36B03AE999C91A36121BC5EBAFD0B675739A39F254D2E1FC08AC6175281141359AA928F4D98FDB3D93E8B690C80D37DED11C3871456FE5CE2D298C9493022FB43596A1B23AE3E3728F9EA7D06E68E88E69D83E1F1',
  tx_json: {
    Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Fee: '10000',
    Flags: 0,
    LimitAmount: {
      currency: 'JSLASH',
      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      value: '1'
    },
    Memos: [ [Object] ],
    RelationType: 1,
    Sequence: 6,
    SigningPubKey: '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
    Target: 'j3vyFAMQW2Ls48eoFCTsMXFq2KNWVUskSx',
    TransactionType: 'RelationSet',
    TxnSignature: '304402204C540968F04F958AF4FAE64EEB54CACB4BAFFFD599EBEE11BED02CB5E94A0BEE022005DA39B36B03AE999C91A36121BC5EBAFD0B675739A39F254D2E1FC08AC61752',
    hash: 'D3AB416FC4C74C50FC2268C552E4B05EE1516906F92EBD9F98E085CD21619CCE'
  }
}
```

##### 返回结果说明

| 参数                             | 类型    |                                                          说明 |
| -------------------------------- | ------- | ------------------------------------------------------------: |
| engine_result                    | String  |                                                      请求结果 |
| engine_result_code               | Array   |                                                  请求结果编码 |
| engine_result_message            | String  |                                         请求结果 message 信息 |
| tx_blob                          | String  |                                           16 进制签名后的交易 |
| tx_json                          | Object  |                                                      交易内容 |
| &nbsp;&nbsp;Account              | String  |                                                      账号地址 |
| &nbsp;&nbsp;Fee                  | String  |                                                        交易费 |
| &nbsp;&nbsp;Flags                | Integer |                                                      交易标记 |
| &nbsp;&nbsp;LimitAmount          | Object  |                                                    关系的额度 |
| &nbsp;&nbsp;&nbsp;&nbsp;currency | String  |                                                          货币 |
| &nbsp;&nbsp;&nbsp;&nbsp;issuer   | String  |                                                    货币发行方 |
| &nbsp;&nbsp;&nbsp;&nbsp;value    | String  |                                                          额度 |
| &nbsp;&nbsp;RelationType         | Integer |                           关系类型:0 信任;1 授权;3 冻结/解冻; |
| &nbsp;&nbsp;Sequence             | Integer |                                                    单子序列号 |
| &nbsp;&nbsp;SigningPubKey        | Object  |                                                      签名公钥 |
| &nbsp;&nbsp;Target               | String  |                                                      关系对家 |
| &nbsp;&nbsp;Timestamp            | Integer |                                                        时间戳 |
| &nbsp;&nbsp;TransactionType      | String  | 交易类型:TrustSet 信任;RelationDel 解冻;RelationSet 授权/冻结 |
| &nbsp;&nbsp;TxnSignature         | String  |                                                      交易签名 |
| &nbsp;&nbsp;hash                 | String  |                                                     交易 hash |

### 4.17 设置账号属性 ------待完善

##### 首先通过 buildAccountSetTx 方法返回一个 Transaction 对象，然后通过 submitPromise()方法设置账号属性。目前支持的三类:`property`、`delegate` 、`signer`。property 用于设置账号一般属性;delegate 用于某账号设置委托帐户;signer 用于设置签名。

##### <a name="accountSetBuild"></a>4.17.1 创建属性对象

###### 方法:remote.buildAccountSetTx({});

###### 参数:

| 参数     | 类型   |             说明 |
| -------- | ------ | ---------------: |
| type     | String |         属性种类 |
| account  | String | 设置属性的源账号 |
| set_flag | String |         属性编号 |

###### 返回:Transaction 对象

##### <a name="accountSetSubmit"></a>4.17.2 属性设置

###### 方法:tx.submitPromise(secret, memo)

###### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |
| memo   | String |     备注信息 |

###### 返回: Promise

##### 设置属性完整例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
let options = {
  account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  type: "property"
}
var tx = remote.buildAccountSetTx(options)
tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  tx_blob: '120003220000000024000000076840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15744630440220524FB0AD378CEB7BEA8BCC99A8011B0D9A57DFDFC54252C8A2961C850E4B30EA022028F3A405AD690394A4BC28A7EBC0A81726460515A3450989BCCAE154C76B223581141359AA928F4D98FDB3D93E8B690C80D37DED11C3',
  tx_json: {
    Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Fee: '10000',
    Flags: 0,
    Sequence: 7,
    SigningPubKey: '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
    TransactionType: 'AccountSet',
    TxnSignature: '30440220524FB0AD378CEB7BEA8BCC99A8011B0D9A57DFDFC54252C8A2961C850E4B30EA022028F3A405AD690394A4BC28A7EBC0A81726460515A3450989BCCAE154C76B2235',
    hash: 'C56D6AAC50DD268CF392B27ABB4A9FDBD29EE3A18B9FE21A42BC0674758EB373'
  }
}
```

### 4.18 挂单

##### 首先通过 buildOfferCreateTx 方法返回一个 Transaction 对象，然后通过通过.submitPromise()方法提交挂单。

##### <a name="offerCreateBuild"></a> 4.18.1 创建挂单对象

###### 方法:remote.buildOfferCreateTx({});

###### 参数:

| 参数                       | 类型   |                             说明 |
| -------------------------- | ------ | -------------------------------: |
| type                       | String | 挂单类型，固定的两个值:Buy、Sell |
| account                    | String |                       挂单方账号 |
| taker_gets                 | Object |       对方得到的，即挂单方支付的 |
| &nbsp;&nbsp;&nbsp;value    | String |                             数量 |
| &nbsp;&nbsp;&nbsp;currency | String |                         货币种类 |
| &nbsp;&nbsp;&nbsp;issuer   | String |                       货币发行方 |
| taker_pays                 | Object |       对方支付的，即挂单方获得的 |
| &nbsp;&nbsp;&nbsp;value    | String |                             数量 |
| &nbsp;&nbsp;&nbsp;currency | String |                         货币种类 |
| &nbsp;&nbsp;&nbsp;issuer   | String |                       货币发行方 |

###### 返回:Transaction 对象

##### <a name="offerCreateSubmit"></a> 4.18.2 提交挂单

###### 方法:tx.submitPromise(secret, memo)

###### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |
| memo   | String |     备注信息 |

###### 返回: Promise

##### 设置属性完整例子

##### 挂单完整例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
let options = {
  type: "Sell",
  account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  taker_pays: remote.makeAmount(1),
  taker_gets: remote.makeAmount(1, "JSLASH")
}
let tx = remote.buildOfferCreateTx(options)
tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
  .then(console.log)
  .catch(console.error)
```

###### 返回结果:

```javascript
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  tx_blob: '120007220008000024000000056440000000000F424065D4838D7EA4C680000000000000000000004A534C4153480000000000A582E432BFC48EEDEF852C814EC57F3CD2D415966840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574463044022047DAE10BD5BFD70601A11EF0F9873DF1145C606F676F8C09D2DFC444A5CE95220220777D3D0629BD48532A70BF46FA742B8DDE5B6DABE4F6F0D9E720E13DBB95305581141359AA928F4D98FDB3D93E8B690C80D37DED11C3F9EA7D116D656D6F206F6666657220637265617465E1F1',
  tx_json: {
    Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Fee: '10000',
    Flags: 524288,
    Memos: [ [Object] ],
    Sequence: 5,
    SigningPubKey: '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
    TakerGets: {
      currency: 'JSLASH',
      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      value: '1'
    },
    TakerPays: '1000000',
    TransactionType: 'OfferCreate',
    TxnSignature: '3044022047DAE10BD5BFD70601A11EF0F9873DF1145C606F676F8C09D2DFC444A5CE95220220777D3D0629BD48532A70BF46FA742B8DDE5B6DABE4F6F0D9E720E13DBB953055',
    hash: '8D6DC86FF64DFE83AFB9B5B0E43B7BCA05B9FAB88C5F73D540814FE1DE195CAA'
  }
}
```

###### 返回结果说明:

| 参数                                         | 类型          |                                                          说明 |
| -------------------------------------------- | ------------- | ------------------------------------------------------------: |
| engine_result                                | String        |                                                      请求结果 |
| engine_result_code                           | Array         |                                                  请求结果编码 |
| engine_result_message                        | String        |                                         请求结果 message 信息 |
| tx_blob                                      | String        |                                           16 进制签名后的交易 |
| tx_json                                      | Object        |                                                      交易内容 |
| &nbsp;&nbsp;&nbsp;Account                    | String        |                                                      账号地址 |
| &nbsp;&nbsp;&nbsp;Fee                        | String        |                                                        交易费 |
| &nbsp;&nbsp;&nbsp;Flags                      | Integer       |                                                      交易标记 |
| &nbsp;&nbsp;&nbsp;Sequence                   | Integer       |                                                    单子序列号 |
| &nbsp;&nbsp;&nbsp;SigningPubKey              | String        |                                                      签名公钥 |
| &nbsp;&nbsp;&nbsp;TakerGets                  | String/Object |                                                    对家得到的 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;currency | String        |                                                          货币 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;issuer   | String        |                                                    货币发行方 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;value    | String        |                                                          额度 |
| &nbsp;&nbsp;&nbsp;TakerPays                  | String/Object |                                                   对家支付的; |
| &nbsp;&nbsp;&nbsp;Timestamp                  | Integer       |                                                        时间戳 |
| &nbsp;&nbsp;&nbsp;TransactionType            | String        | 交易类型:TrustSet 信任;RelationDel 解冻;RelationSet 授权/冻结 |
| &nbsp;&nbsp;&nbsp;TxnSignature               | String        |                                                      交易签名 |
| &nbsp;&nbsp;&nbsp;hash                       | String        |                                                     交易 hash |

### 4.19 取消挂单

##### 首先通过 buildOfferCancelTx 方法返回一个 Transaction 对象，然后通过 submitPromise()方法取消挂单。

##### 4.19.1 <a name="offerCancelBuild"></a> 创建取消挂单对象

##### 方法:remote.buildOfferCancelTx({});

##### 参数:

| 参数     | 类型    |         说明 |
| -------- | ------- | -----------: | ---------- |
| account  | String  |              | 挂单方账号 |
| sequence | Integer | 取消的单子号 |

##### 返回:Transaction 对象

##### <a name="offerCancelSubmit"></a> 4.19.2 取消挂单

###### 方法:tx.submitPromise(secret, memo)

###### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |
| memo   | String |     备注信息 |

###### 返回: Promise

##### 取消挂单完整例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
let options = { account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz", sequence: 5 }
let tx = remote.buildOfferCancelTx(options)
tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  tx_blob: '120008220000000024000000082019000000056840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100DC02575A15060C96A5846BE0778082F677C63E231ACEE8C358C1F01C4D558871022049EAAD87A2C12FD4E904C186A96CB2DC7C16082D371A501235E60C4516D6282D81141359AA928F4D98FDB3D93E8B690C80D37DED11C3',
  tx_json: {
    Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Fee: '10000',
    Flags: 0,
    OfferSequence: 5,
    Sequence: 8,
    SigningPubKey: '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
    TransactionType: 'OfferCancel',
    TxnSignature: '3045022100DC02575A15060C96A5846BE0778082F677C63E231ACEE8C358C1F01C4D558871022049EAAD87A2C12FD4E904C186A96CB2DC7C16082D371A501235E60C4516D6282D',
    hash: 'E7A23787101254365370CE4A077F007160DADCD920D4AA385C44EBBA3147F5CA'
  }
}

```

##### 返回结果说明

| 参数                              | 类型    |                          说明 |
| --------------------------------- | ------- | ----------------------------: |
| engine_result                     | String  |                      请求结果 |
| engine_result_code                | Array   |                  请求结果编码 |
| engine_result_message             | String  |         请求结果 message 信息 |
| tx_blob                           | String  |           16 进制签名后的交易 |
| tx_json                           | Object  |                      交易内容 |
| &nbsp;&nbsp;&nbsp;Account         | String  |                      账号地址 |
| &nbsp;&nbsp;&nbsp;Fee             | String  |                        交易费 |
| &nbsp;&nbsp;&nbsp;Flags           | Integer |                      交易标记 |
| &nbsp;&nbsp;&nbsp;OfferSequence   | Integer |                  取消的单子号 |
| &nbsp;&nbsp;&nbsp;Sequence        | Integer |                    单子序列号 |
| &nbsp;&nbsp;&nbsp;SigningPubKey   | String  |                      签名公钥 |
| &nbsp;&nbsp;&nbsp;Timestamp       | Integer |                        时间戳 |
| &nbsp;&nbsp;&nbsp;TransactionType | String  | 交易类型:OfferCancel 取消订单 |
| &nbsp;&nbsp;&nbsp;TxnSignature    | String  |                      交易签名 |
| &nbsp;&nbsp;&nbsp;hash            | String  |                     交易 hash |

### 4.20 部署合约 lua - 尚未支持

##### 首先通过 buildContractDeployTx (或者 deployContractTx)方法返回一个 Transaction 对象，然后通过 submitPromise()方法部署合约。

##### <a name="contractDeployBuild"></a>4.20.1 创建部署合约对象

###### 方法:remote.buildContractDeployTx({});

###### 参数:

| 参数    | 类型          |                        说明 |
| ------- | ------------- | --------------------------: |
| account | String        |              合约交易源账号 |
| amount  | String/Number |  支付金额(最多支持六位小数) |
| payload | String        | 智能合约代码(16 进制字符串) |

###### 可选参数:

| 参数   | 类型   |     说明 |
| ------ | ------ | -------: |
| params | String | 合约参数 |

##### 返回:Transaction 对象

##### <a name="contractDeploySubmit"></a> 4.20.2 部署合约

###### 方法:tx.submitPromise(secret, memo);

###### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |
| memo   | String |     备注信息 |

##### 部署合约完整例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var utils = Remote.utils
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
var options = {
  account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  amount: 10,
  payload: utils.stringToHex(
    "result={}; function Init(t) result=scGetAccountBalance(t) return result end; function foo(t) result=scGetAccountBalance(t) return result end;"
  ),
  params: ["jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz"]
}
var tx = remote.buildContractDeployTx(options)
tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
{ success: true,
  status_code: '0',
  ContractState: 'jNnyPvw4Gu4HycKAUwhtw82p3wk1pYKYPE',
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '12001E220000000024000003D52026000000006140000000009896806840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100F558E6571C5F4217E3871C5D791B895C910E57AEC6175CE7B70E490A2180EE9B0220508C847807079DA2BBD92A8B26AE81B1C2608C2D3E0F929B8BEFE3DFE91865F970108D726573756C743D7B7D3B2066756E6374696F6E20496E697428742920726573756C743D73634765744163636F756E7442616C616E63652874292072657475726E20726573756C7420656E643B2066756E6374696F6E20666F6F28742920726573756C743D73634765744163636F756E7442616C616E63652874292072657475726E20726573756C7420656E643B81141359AA928F4D98FDB3D93E8B690C80D37DED11C3FEEF7013226A706D4B456D32735565766670466A533751486454385378375A476F4558544A417AE1F1',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Amount: '10000000',
     Args: [ [Object] ],
     Fee: '10000',
     Flags: 0,
     Method: 0,
     Payload:
      '726573756C743D7B7D3B2066756E6374696F6E20496E697428742920726573756C743D73634765744163636F756E7442616C616E63652874292072657475726E20726573756C7420656E643B2066756E6374696F6E20666F6F28742920726573756C743D73634765744163636F756E7442616C616E63652874292072657475726E20726573756C7420656E643B',
     Sequence: 981,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TransactionType: 'ConfigContract',
     TxnSignature:
      '3045022100F558E6571C5F4217E3871C5D791B895C910E57AEC6175CE7B70E490A2180EE9B0220508C847807079DA2BBD92A8B26AE81B1C2608C2D3E0F929B8BEFE3DFE91865F9',
     hash:
      '7AFDF4925CA11E0DA1D249BC88A7DE29CE07CF11186660CDE40B850F616B138B' } }
```

##### 返回结果说明

| 参数                              | 类型    |                               说明 |
| --------------------------------- | ------- | ---------------------------------: |
| success                           | Boolean |                           请求结果 |
| ContractState                     | String  |                     生成的合约地址 |
| engine_result                     | String  |                           请求结果 |
| engine_result_code                | Array   |                       请求结果编码 |
| engine_result_message             | String  |              请求结果 message 信息 |
| tx_blob                           | String  |                16 进制签名后的交易 |
| tx_json                           | Object  |                           交易内容 |
| &nbsp;&nbsp;&nbsp;Account         | String  |                           账号地址 |
| &nbsp;&nbsp;&nbsp;Fee             | String  |                             交易费 |
| &nbsp;&nbsp;&nbsp;Flags           | Integer |                           交易标记 |
| &nbsp;&nbsp;&nbsp;Method          | Integer | 合约交易方法:0 表示部署;1 表示调用 |
| &nbsp;&nbsp;&nbsp;Payload         | Integer |                    16 进制合约代码 |
| &nbsp;&nbsp;&nbsp;Sequence        | Integer |                         单子序列号 |
| &nbsp;&nbsp;&nbsp;SigningPubKey   | String  |                           签名公钥 |
| &nbsp;&nbsp;&nbsp;TransactionType | String  |   交易类型:ConfigContract 部署合约 |
| &nbsp;&nbsp;&nbsp;TxnSignature    | String  |                           交易签名 |
| &nbsp;&nbsp;&nbsp;hash            | String  |                          交易 hash |

### 4.21 执行合约 lua - 尚未支持

##### 首先通过 buildContractCallTx (或者 callContractTx)方法返回一个 Transaction 对象，然后通过通过 submitPromise()方法执行合约

##### <a name="contractCallBuild"></a> 4.21.1 创建执行合约对象

###### 方法:remote.buildContractCallTx({});

###### 参数:

| 参数        | 类型   |           说明 |
| ----------- | ------ | -------------: |
| account     | String | 合约交易源账号 |
| destination | String |       合约地址 |
| foo         | String |     合约函数名 |

###### 可选参数:

| 参数   | 类型   |     说明 |
| ------ | ------ | -------: |
| params | String | 合约参数 |

##### 返回:Transaction 对象

##### <a name="contractCallSubmit"></a> 4.21.2 执行合约

###### 方法:tx.submitPromise(secret, memo);

###### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |
| memo   | String |         留言 |

##### 执行合约完整例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
var options = {
  account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  destination: "jNdpxLQbmMMf4ZVXjn3nb98xPYQ7EpEpTN",
  foo: "foo",
  params: ["jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz"]
}
var tx = remote.buildContractCallTx(options)
tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
> { success: true,
  status_code: '0',
  ContractState: '10489759828',
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '12001E220000000024000003D62026000000016840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15744630440220552CC3A84A3D02D886F4E71A628B76A8FA616A8969886965658962047CF70CEC022024DCE5FFEC37E5BC0AD085F7363392CBAAF80E729BCE8E20B5CD030CA87D84AE701203666F6F81141359AA928F4D98FDB3D93E8B690C80D37DED11C383148F8A6014111019B6968A1D6DD2B159AA27304D8EFEEF7013226A706D4B456D32735565766670466A533751486454385378375A476F4558544A417AE1F1',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Args: [ [Object] ],
     ContractMethod: '666F6F',
     Destination: 'jNnyPvw4Gu4HycKAUwhtw82p3wk1pYKYPE',
     Fee: '10000',
     Flags: 0,
     Method: 1,
     Sequence: 982,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TransactionType: 'ConfigContract',
     TxnSignature:
      '30440220552CC3A84A3D02D886F4E71A628B76A8FA616A8969886965658962047CF70CEC022024DCE5FFEC37E5BC0AD085F7363392CBAAF80E729BCE8E20B5CD030CA87D84AE',
     hash:
      'CA9B2CCDBB231B98CA3B69F81EB40F1D8D56807F3F3CFC0A0266B57D7F0AF6C8' } }
```

##### 返回结果说明

| 参数                              | 类型    |                               说明 |
| --------------------------------- | ------- | ---------------------------------: |
| success                           | Boolean |                           请求结果 |
| ContractState                     | String  |                     调用的合约结果 |
| engine_result                     | String  |                           请求结果 |
| engine_result_code                | Array   |                       请求结果编码 |
| engine_result_message             | String  |              请求结果 message 信息 |
| tx_blob                           | String  |                16 进制签名后的交易 |
| tx_json                           | Object  |                           交易内容 |
| &nbsp;&nbsp;&nbsp;Account         | String  |                           账号地址 |
| &nbsp;&nbsp;&nbsp;Args            | Array   |                     合约传入的参数 |
| &nbsp;&nbsp;&nbsp;ContractMethod  | String  |                         合约函数名 |
| &nbsp;&nbsp;&nbsp;Destination     | String  |                     调用的合约地址 |
| &nbsp;&nbsp;&nbsp;Fee             | String  |                             交易费 |
| &nbsp;&nbsp;&nbsp;Flags           | Integer |                           交易标记 |
| &nbsp;&nbsp;&nbsp;Method          | Integer | 合约交易方法:0 表示部署;1 表示调用 |
| &nbsp;&nbsp;&nbsp;Sequence        | Integer |                         单子序列号 |
| &nbsp;&nbsp;&nbsp;SigningPubKey   | String  |                           签名公钥 |
| &nbsp;&nbsp;&nbsp;TransactionType | String  |     交易类型:ConfigContract 合约类 |
| &nbsp;&nbsp;&nbsp;TxnSignature    | String  |                           交易签名 |
| &nbsp;&nbsp;&nbsp;hash            | String  |                          交易 hash |

### 4.22 设置挂单佣金

##### 首先通过 buildBrokerageTx 方法返回一个 Transaction 对象，然后通过 submitPromise()方法设置平台手续费

##### 4.22.1 创建挂单佣金对象

###### 方法: remote.buildBrokerageTx({})

###### 参数:

| 参数     | 类型    |                               说明 |
| -------- | ------- | ---------------------------------: |
| account  | String  |                         管理员账号 |
| mol      | Integer |                   分子(0 和正整数) |
| den      | Integer |                       分母(正整数) |
| app      | Integer |               应用来源序号(正整数) |
| amount   | Object  |                           币种对象 |
| value    | String  | 数量，这里只是占位，没有实际意义。 |
| currency | String  |                           货币种类 |
| issuer   | String  |                         货币发行方 |

##### 4.22.2 设置挂单佣金

###### 方法:tx.submitPromise(secret, memo);

###### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |

##### 设置挂单佣金完整例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
let options = {
  account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  mol: 1,
  den: 1000,
  feeAccount: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  amount: remote.makeAmount(3, "JSLASH")
}
let tx = remote.buildBrokerageTx(options)
tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  tx_blob: '1200CD220000000024000000093900000000000000013A00000000000003E861D48AA87BEE5380000000000000000000004A534C4153480000000000A582E432BFC48EEDEF852C814EC57F3CD2D415966840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100D3D455E933CEA48F6976424E6C42CDC1460108A2E229DBC97463B916C0AF432B0220410B6462ED03E0B4851D2EEE7A8E84A667D264400802E88709092C821A9CE4DE81141359AA928F4D98FDB3D93E8B690C80D37DED11C389141359AA928F4D98FDB3D93E8B690C80D37DED11C3',
  tx_json: {
    Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Amount: {
      currency: 'JSLASH',
      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      value: '3'
    },
    Fee: '10000',
    FeeAccountID: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Flags: 0,
    OfferFeeRateDen: '00000000000003E8',
    OfferFeeRateNum: '0000000000000001',
    Sequence: 9,
    SigningPubKey: '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
    TransactionType: 'Brokerage',
    TxnSignature: '3045022100D3D455E933CEA48F6976424E6C42CDC1460108A2E229DBC97463B916C0AF432B0220410B6462ED03E0B4851D2EEE7A8E84A667D264400802E88709092C821A9CE4DE',
    hash: '700833A35F8F126C75BFDAF597B268EE5FC107070031030D7E6C748441A322AB'
  }
}

```

### 4.23 部署合约 Solidity 版 - 尚未支持

##### 首先通过 buildContractInitTx (或者 initContract)方法返回一个 Transaction 对象，然后通过 submitPromise()方法完成合约的部署

##### 4.23.1 创建合约部署对象

###### 方法:remote.initContract({});

###### 参数

| 参数    | 类型    |                       说明 |
| ------- | ------- | -------------------------: |
| account | String  |                 合约发布者 |
| amount  | Integer |                     手续费 |
| payload | String  | 合约编译后的 16 进制字节码 |
| abi     | Array   |                   合约 abi |
| params  | Array   |       可选，合约初始化参数 |

###### 返回:Transaction 对象

##### <a name="initContractSubmit"></a> 4.23.2 部署合约

###### 方法:tx.submitPromise(secret);

###### 参数: 密钥

| 参数   | 类型   |           说明 |
| ------ | ------ | -------------: |
| secret | String | 合约发布者私钥 |

###### 返回: Promise

##### 部署合约完整例子

```javascript
const japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  solidity: true
})
const v = {
  address: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  secret: "ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C"
}
const abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "withdraw",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_from", type: "address" }],
    name: "SWTBalance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "address" }
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "initialSupply", type: "uint256" },
      { name: "tokenName", type: "string" },
      { name: "tokenSymbol", type: "string" }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  }
]
const payload =
  "60806040526012600260006101000a81548160ff021916908360ff16021790555034801561002c57600080fd5b50604051610c7e380380610c7e8339810180604052606081101561004f57600080fd5b8101908080519060200190929190805164010000000081111561007157600080fd5b8281019050602081018481111561008757600080fd5b81518560018202830111640100000000821117156100a457600080fd5b505092919060200180516401000000008111156100c057600080fd5b828101905060208101848111156100d657600080fd5b81518560018202830111640100000000821117156100f357600080fd5b5050929190505050600260009054906101000a900460ff1660ff16600a0a8302600381905550600354600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555081600090805190602001906101759291906101d6565b50806001908051906020019061018c9291906101d6565b5033600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505061027b565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061021757805160ff1916838001178555610245565b82800160010185558215610245579182015b82811115610244578251825591602001919060010190610229565b5b5090506102529190610256565b5090565b61027891905b8082111561027457600081600090555060010161025c565b5090565b90565b6109f48061028a6000396000f3fe6080604052600436106100ae576000357c01000000000000000000000000000000000000000000000000000000009004806370a082311161007657806370a082311461020e5780638da5cb5b1461027357806395d89b41146102ca578063a9059cbb1461035a578063dd62ed3e146103b5576100ae565b806306fdde03146100b357806318160ddd14610143578063313ce5671461016e5780633ccfd60b1461019f578063675c7ae6146101a9575b600080fd5b3480156100bf57600080fd5b506100c861043a565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101085780820151818401526020810190506100ed565b50505050905090810190601f1680156101355780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561014f57600080fd5b506101586104d8565b6040518082815260200191505060405180910390f35b34801561017a57600080fd5b506101836104de565b604051808260ff1660ff16815260200191505060405180910390f35b6101a76104f1565b005b3480156101b557600080fd5b506101f8600480360360208110156101cc57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506105cf565b6040518082815260200191505060405180910390f35b34801561021a57600080fd5b5061025d6004803603602081101561023157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506105f0565b6040518082815260200191505060405180910390f35b34801561027f57600080fd5b50610288610608565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156102d657600080fd5b506102df61062e565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561031f578082015181840152602081019050610304565b50505050905090810190601f16801561034c5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561036657600080fd5b506103b36004803603604081101561037d57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506106cc565b005b3480156103c157600080fd5b50610424600480360360408110156103d857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506106db565b6040518082815260200191505060405180910390f35b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104d05780601f106104a5576101008083540402835291602001916104d0565b820191906000526020600020905b8154815290600101906020018083116104b357829003601f168201915b505050505081565b60035481565b600260009054906101000a900460ff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561054d57600080fd5b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f193505050501580156105cc573d6000803e3d6000fd5b50565b60008173ffffffffffffffffffffffffffffffffffffffff16319050919050565b60056020528060005260406000206000915090505481565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106c45780601f10610699576101008083540402835291602001916106c4565b820191906000526020600020905b8154815290600101906020018083116106a757829003601f168201915b505050505081565b6106d7338383610700565b5050565b6006602052816000526040600020602052806000526040600020600091509150505481565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415151561073c57600080fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015151561078a57600080fd5b600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205481600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020540111151561081857600080fd5b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401905081600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555080600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054600560008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054011415156109c257fe5b5050505056fea165627a7a72305820d122ff8ff7133c0852e95b8334f76d8f494b11ac94ac3c4b3409bad19f0d09340029"

let tx = remote.buildContractInitTx({
  account: v.address,
  amount: 10,
  payload,
  abi,
  params: [2000, "TestCurrency", "TEST1"]
})
tx.submitPromise(v.secret).then(console.log).catch(console.error)
```

##### 输出

```javascript
> { success: true,
  status_code: '0',
  ContractState: 'jKPNruYVLQ7BthSA1EaFqDePX2gcVCjk5k',
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '12001F2200000000240000040D2026000000006140000000009896806840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15744630440220225A8CC267B51B0A8C27CC0FE0B849CDC536B7A93AA877E96E856555A7F02FBA022072389A007BE2FAE36ACBA8DD81C6D41A4D156E2679B54977721F7A48D3DE262A7010DAFB3630383036303430353236303132363030323630303036313031303030613831353438313630666630323139313639303833363066663136303231373930353535303334383031353631303032633537363030303830666435623530363034303531363130633765333830333830363130633765383333393831303138303630343035323630363038313130313536313030346635373630303038306664356238313031393038303830353139303630323030313930393239313930383035313634303130303030303030303831313131353631303037313537363030303830666435623832383130313930353036303230383130313834383131313135363130303837353736303030383066643562383135313835363030313832303238333031313136343031303030303030303038323131313731353631303061343537363030303830666435623530353039323931393036303230303138303531363430313030303030303030383131313135363130306330353736303030383066643562383238313031393035303630323038313031383438313131313536313030643635373630303038306664356238313531383536303031383230323833303131313634303130303030303030303832313131373135363130306633353736303030383066643562353035303932393139303530353035303630303236303030393035343930363130313030306139303034363066663136363066663136363030613061383330323630303338313930353535303630303335343630303536303030333337336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135323630323030313930383135323630323030313630303032303831393035353530383136303030393038303531393036303230303139303631303137353932393139303631303164363536356235303830363030313930383035313930363032303031393036313031386339323931393036313031643635363562353033333630303436303030363130313030306138313534383137336666666666666666666666666666666666666666666666666666666666666666666666666666666630323139313639303833373366666666666666666666666666666666666666666666666666666666666666666666666666666666313630323137393035353530353035303530363130323762353635623832383035343630303138313630303131363135363130313030303230333136363030323930303439303630303035323630323036303030323039303630316630313630323039303034383130313932383236303166313036313032313735373830353136306666313931363833383030313137383535353631303234353536356238323830303136303031303138353535383231353631303234353537393138323031356238323831313131353631303234343537383235313832353539313630323030313931393036303031303139303631303232393536356235623530393035303631303235323931393036313032353635363562353039303536356236313032373839313930356238303832313131353631303237343537363030303831363030303930353535303630303130313631303235633536356235303930353635623930353635623631303966343830363130323861363030303339363030306633666536303830363034303532363030343336313036313030616535373630303033353763303130303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303930303438303633373061303832333131313631303037363537383036333730613038323331313436313032306535373830363338646135636235623134363130323733353738303633393564383962343131343631303263613537383036336139303539636262313436313033356135373830363364643632656433653134363130336235353736313030616535363562383036333036666464653033313436313030623335373830363331383136306464643134363130313433353738303633333133636535363731343631303136653537383036333363636664363062313436313031396635373830363336373563376165363134363130316139353735623630303038306664356233343830313536313030626635373630303038306664356235303631303063383631303433613536356236303430353138303830363032303031383238313033383235323833383138313531383135323630323030313931353038303531393036303230303139303830383338333630303035623833383131303135363130313038353738303832303135313831383430313532363032303831303139303530363130306564353635623530353035303530393035303930383130313930363031663136383031353631303133353537383038323033383035313630303138333630323030333631303130303061303331393136383135323630323030313931353035623530393235303530353036303430353138303931303339306633356233343830313536313031346635373630303038306664356235303631303135383631303464383536356236303430353138303832383135323630323030313931353035303630343035313830393130333930663335623334383031353631303137613537363030303830666435623530363130313833363130346465353635623630343035313830383236306666313636306666313638313532363032303031393135303530363034303531383039313033393066333562363130316137363130346631353635623030356233343830313536313031623535373630303038306664356235303631303166383630303438303336303336303230383131303135363130316363353736303030383066643562383130313930383038303335373366666666666666666666666666666666666666666666666666666666666666666666666666666666313639303630323030313930393239313930353035303530363130356366353635623630343035313830383238313532363032303031393135303530363034303531383039313033393066333562333438303135363130323161353736303030383066643562353036313032356436303034383033363033363032303831313031353631303233313537363030303830666435623831303139303830383033353733666666666666666666666666666666666666666666666666666666666666666666666666666666663136393036303230303139303932393139303530353035303631303566303536356236303430353138303832383135323630323030313931353035303630343035313830393130333930663335623334383031353631303237663537363030303830666435623530363130323838363130363038353635623630343035313830383237336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135323630323030313931353035303630343035313830393130333930663335623334383031353631303264363537363030303830666435623530363130326466363130363265353635623630343035313830383036303230303138323831303338323532383338313831353138313532363032303031393135303830353139303630323030313930383038333833363030303562383338313130313536313033316635373830383230313531383138343031353236303230383130313930353036313033303435363562353035303530353039303530393038313031393036303166313638303135363130333463353738303832303338303531363030313833363032303033363130313030306130333139313638313532363032303031393135303562353039323530353035303630343035313830393130333930663335623334383031353631303336363537363030303830666435623530363130336233363030343830333630333630343038313130313536313033376435373630303038306664356238313031393038303830333537336666666666666666666666666666666666666666666666666666666666666666666666666666666631363930363032303031393039323931393038303335393036303230303139303932393139303530353035303631303663633536356230303562333438303135363130336331353736303030383066643562353036313034323436303034383033363033363034303831313031353631303364383537363030303830666435623831303139303830383033353733666666666666666666666666666666666666666666666666666666666666666666666666666666663136393036303230303139303932393139303830333537336666666666666666666666666666666666666666666666666666666666666666666666666666666631363930363032303031393039323931393035303530353036313036646235363562363034303531383038323831353236303230303139313530353036303430353138303931303339306633356236303030383035343630303138313630303131363135363130313030303230333136363030323930303438303630316630313630323038303931303430323630323030313630343035313930383130313630343035323830393239313930383138313532363032303031383238303534363030313831363030313136313536313031303030323033313636303032393030343830313536313034643035373830363031663130363130346135353736313031303038303833353430343032383335323931363032303031393136313034643035363562383230313931393036303030353236303230363030303230393035623831353438313532393036303031303139303630323030313830383331313631303462333537383239303033363031663136383230313931356235303530353035303530383135363562363030333534383135363562363030323630303039303534393036313031303030613930303436306666313638313536356236303034363030303930353439303631303130303061393030343733666666666666666666666666666666666666666666666666666666666666666666666666666666663136373366666666666666666666666666666666666666666666666666666666666666666666666666666666313633333733666666666666666666666666666666666666666666666666666666666666666666666666666666663136313431353135363130353464353736303030383066643562363030343630303039303534393036313031303030613930303437336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136363130386663333037336666666666666666666666666666666666666666666666666666666666666666666666666666666631363331393038313135303239303630343035313630303036303430353138303833303338313835383838386631393335303530353035303135383031353631303563633537336436303030383033653364363030306664356235303536356236303030383137336666666666666666666666666666666666666666666666666666666666666666666666666666666631363331393035303931393035303536356236303035363032303532383036303030353236303430363030303230363030303931353039303530353438313536356236303034363030303930353439303631303130303061393030343733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135363562363030313830353436303031383136303031313631353631303130303032303331363630303239303034383036303166303136303230383039313034303236303230303136303430353139303831303136303430353238303932393139303831383135323630323030313832383035343630303138313630303131363135363130313030303230333136363030323930303438303135363130366334353738303630316631303631303639393537363130313030383038333534303430323833353239313630323030313931363130366334353635623832303139313930363030303532363032303630303032303930356238313534383135323930363030313031393036303230303138303833313136313036613735373832393030333630316631363832303139313562353035303530353035303831353635623631303664373333383338333631303730303536356235303530353635623630303636303230353238313630303035323630343036303030323036303230353238303630303035323630343036303030323036303030393135303931353035303534383135363562363030303733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383237336666666666666666666666666666666666666666666666666666666666666666666666666666666631363134313531353135363130373363353736303030383066643562383036303035363030303835373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353236303230303139303831353236303230303136303030323035343130313531353135363130373861353736303030383066643562363030353630303038333733666666666666666666666666666666666666666666666666666666666666666666666666666666663136373366666666666666666666666666666666666666666666666666666666666666666666666666666666313638313532363032303031393038313532363032303031363030303230353438313630303536303030383537336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135323630323030313930383135323630323030313630303032303534303131313135313536313038313835373630303038306664356236303030363030353630303038343733666666666666666666666666666666666666666666666666666666666666666666666666666666663136373366666666666666666666666666666666666666666666666666666666666666666666666666666666313638313532363032303031393038313532363032303031363030303230353436303035363030303836373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353236303230303139303831353236303230303136303030323035343031393035303831363030353630303038363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136373366666666666666666666666666666666666666666666666666666666666666666666666666666666313638313532363032303031393038313532363032303031363030303230363030303832383235343033393235303530383139303535353038313630303536303030383537336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135323630323030313930383135323630323030313630303032303630303038323832353430313932353035303831393035353530383036303035363030303835373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353236303230303139303831353236303230303136303030323035343630303536303030383737336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135323630323030313930383135323630323030313630303032303534303131343135313536313039633235376665356235303530353035303536666561313635363237613761373233303538323064313232666638666637313333633038353265393562383333346637366438663439346231316163393461633363346233343039626164313966306430393334303032393030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303037643030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303630303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303061303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030306335343635373337343433373537323732363536653633373930303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030353534343535333534333130303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303081141359AA928F4D98FDB3D93E8B690C80D37DED11C3',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Amount: '10000000',
     Fee: '10000',
     Flags: 0,
     Method: 0,
     Payload:
      '36303830363034303532363031323630303236303030363130313030306138313534383136306666303231393136393038333630666631363032313739303535353033343830313536313030326335373630303038306664356235303630343035313631306337653338303338303631306337653833333938313031383036303430353236303630383131303135363130303466353736303030383066643562383130313930383038303531393036303230303139303932393139303830353136343031303030303030303038313131313536313030373135373630303038306664356238323831303139303530363032303831303138343831313131353631303038373537363030303830666435623831353138353630303138323032383330313131363430313030303030303030383231313137313536313030613435373630303038306664356235303530393239313930363032303031383035313634303130303030303030303831313131353631303063303537363030303830666435623832383130313930353036303230383130313834383131313135363130306436353736303030383066643562383135313835363030313832303238333031313136343031303030303030303038323131313731353631303066333537363030303830666435623530353039323931393035303530353036303032363030303930353439303631303130303061393030343630666631363630666631363630306130613833303236303033383139303535353036303033353436303035363030303333373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353236303230303139303831353236303230303136303030323038313930353535303831363030303930383035313930363032303031393036313031373539323931393036313031643635363562353038303630303139303830353139303630323030313930363130313863393239313930363130316436353635623530333336303034363030303631303130303061383135343831373366666666666666666666666666666666666666666666666666666666666666666666666666666666303231393136393038333733666666666666666666666666666666666666666666666666666666666666666666666666666666663136303231373930353535303530353035303631303237623536356238323830353436303031383136303031313631353631303130303032303331363630303239303034393036303030353236303230363030303230393036303166303136303230393030343831303139323832363031663130363130323137353738303531363066663139313638333830303131373835353536313032343535363562383238303031363030313031383535353832313536313032343535373931383230313562383238313131313536313032343435373832353138323535393136303230303139313930363030313031393036313032323935363562356235303930353036313032353239313930363130323536353635623530393035363562363130323738393139303562383038323131313536313032373435373630303038313630303039303535353036303031303136313032356335363562353039303536356239303536356236313039663438303631303238613630303033393630303066336665363038303630343035323630303433363130363130306165353736303030333537633031303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303039303034383036333730613038323331313136313030373635373830363337306130383233313134363130323065353738303633386461356362356231343631303237333537383036333935643839623431313436313032636135373830363361393035396362623134363130333561353738303633646436326564336531343631303362353537363130306165353635623830363330366664646530333134363130306233353738303633313831363064646431343631303134333537383036333331336365353637313436313031366535373830363333636366643630623134363130313966353738303633363735633761653631343631303161393537356236303030383066643562333438303135363130306266353736303030383066643562353036313030633836313034336135363562363034303531383038303630323030313832383130333832353238333831383135313831353236303230303139313530383035313930363032303031393038303833383336303030356238333831313031353631303130383537383038323031353138313834303135323630323038313031393035303631303065643536356235303530353035303930353039303831303139303630316631363830313536313031333535373830383230333830353136303031383336303230303336313031303030613033313931363831353236303230303139313530356235303932353035303530363034303531383039313033393066333562333438303135363130313466353736303030383066643562353036313031353836313034643835363562363034303531383038323831353236303230303139313530353036303430353138303931303339306633356233343830313536313031376135373630303038306664356235303631303138333631303464653536356236303430353138303832363066663136363066663136383135323630323030313931353035303630343035313830393130333930663335623631303161373631303466313536356230303562333438303135363130316235353736303030383066643562353036313031663836303034383033363033363032303831313031353631303163633537363030303830666435623831303139303830383033353733666666666666666666666666666666666666666666666666666666666666666666666666666666663136393036303230303139303932393139303530353035303631303563663536356236303430353138303832383135323630323030313931353035303630343035313830393130333930663335623334383031353631303231613537363030303830666435623530363130323564363030343830333630333630323038313130313536313032333135373630303038306664356238313031393038303830333537336666666666666666666666666666666666666666666666666666666666666666666666666666666631363930363032303031393039323931393035303530353036313035663035363562363034303531383038323831353236303230303139313530353036303430353138303931303339306633356233343830313536313032376635373630303038306664356235303631303238383631303630383536356236303430353138303832373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353236303230303139313530353036303430353138303931303339306633356233343830313536313032643635373630303038306664356235303631303264663631303632653536356236303430353138303830363032303031383238313033383235323833383138313531383135323630323030313931353038303531393036303230303139303830383338333630303035623833383131303135363130333166353738303832303135313831383430313532363032303831303139303530363130333034353635623530353035303530393035303930383130313930363031663136383031353631303334633537383038323033383035313630303138333630323030333631303130303061303331393136383135323630323030313931353035623530393235303530353036303430353138303931303339306633356233343830313536313033363635373630303038306664356235303631303362333630303438303336303336303430383131303135363130333764353736303030383066643562383130313930383038303335373366666666666666666666666666666666666666666666666666666666666666666666666666666666313639303630323030313930393239313930383033353930363032303031393039323931393035303530353036313036636335363562303035623334383031353631303363313537363030303830666435623530363130343234363030343830333630333630343038313130313536313033643835373630303038306664356238313031393038303830333537336666666666666666666666666666666666666666666666666666666666666666666666666666666631363930363032303031393039323931393038303335373366666666666666666666666666666666666666666666666666666666666666666666666666666666313639303630323030313930393239313930353035303530363130366462353635623630343035313830383238313532363032303031393135303530363034303531383039313033393066333562363030303830353436303031383136303031313631353631303130303032303331363630303239303034383036303166303136303230383039313034303236303230303136303430353139303831303136303430353238303932393139303831383135323630323030313832383035343630303138313630303131363135363130313030303230333136363030323930303438303135363130346430353738303630316631303631303461353537363130313030383038333534303430323833353239313630323030313931363130346430353635623832303139313930363030303532363032303630303032303930356238313534383135323930363030313031393036303230303138303833313136313034623335373832393030333630316631363832303139313562353035303530353035303831353635623630303335343831353635623630303236303030393035343930363130313030306139303034363066663136383135363562363030343630303039303534393036313031303030613930303437336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136333337336666666666666666666666666666666666666666666666666666666666666666666666666666666631363134313531353631303534643537363030303830666435623630303436303030393035343930363130313030306139303034373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363631303866633330373366666666666666666666666666666666666666666666666666666666666666666666666666666666313633313930383131353032393036303430353136303030363034303531383038333033383138353838383866313933353035303530353031353830313536313035636335373364363030303830336533643630303066643562353035363562363030303831373366666666666666666666666666666666666666666666666666666666666666666666666666666666313633313930353039313930353035363562363030353630323035323830363030303532363034303630303032303630303039313530393035303534383135363562363030343630303039303534393036313031303030613930303437336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353635623630303138303534363030313831363030313136313536313031303030323033313636303032393030343830363031663031363032303830393130343032363032303031363034303531393038313031363034303532383039323931393038313831353236303230303138323830353436303031383136303031313631353631303130303032303331363630303239303034383031353631303663343537383036303166313036313036393935373631303130303830383335343034303238333532393136303230303139313631303663343536356238323031393139303630303035323630323036303030323039303562383135343831353239303630303130313930363032303031383038333131363130366137353738323930303336303166313638323031393135623530353035303530353038313536356236313036643733333833383336313037303035363562353035303536356236303036363032303532383136303030353236303430363030303230363032303532383036303030353236303430363030303230363030303931353039313530353035343831353635623630303037336666666666666666666666666666666666666666666666666666666666666666666666666666666631363832373366666666666666666666666666666666666666666666666666666666666666666666666666666666313631343135313531353631303733633537363030303830666435623830363030353630303038353733666666666666666666666666666666666666666666666666666666666666666666666666666666663136373366666666666666666666666666666666666666666666666666666666666666666666666666666666313638313532363032303031393038313532363032303031363030303230353431303135313531353631303738613537363030303830666435623630303536303030383337336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135323630323030313930383135323630323030313630303032303534383136303035363030303835373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353236303230303139303831353236303230303136303030323035343031313131353135363130383138353736303030383066643562363030303630303536303030383437336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135323630323030313930383135323630323030313630303032303534363030353630303038363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136373366666666666666666666666666666666666666666666666666666666666666666666666666666666313638313532363032303031393038313532363032303031363030303230353430313930353038313630303536303030383637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135323630323030313930383135323630323030313630303032303630303038323832353430333932353035303831393035353530383136303035363030303835373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353236303230303139303831353236303230303136303030323036303030383238323534303139323530353038313930353535303830363030353630303038353733666666666666666666666666666666666666666666666666666666666666666666666666666666663136373366666666666666666666666666666666666666666666666666666666666666666666666666666666313638313532363032303031393038313532363032303031363030303230353436303035363030303837373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353236303230303139303831353236303230303136303030323035343031313431353135363130396332353766653562353035303530353035366665613136353632376137613732333035383230643132326666386666373133336330383532653935623833333466373664386634393462313161633934616333633462333430396261643139663064303933343030323930303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030376430303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303036303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030613030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303063353436353733373434333735373237323635366536333739303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303535343435353335343331303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030',
     Sequence: 1037,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TransactionType: 'AlethContract',
     TxnSignature:
      '30440220225A8CC267B51B0A8C27CC0FE0B849CDC536B7A93AA877E96E856555A7F02FBA022072389A007BE2FAE36ACBA8DD81C6D41A4D156E2679B54977721F7A48D3DE262A',
     hash:
      '8EADEC523DC59A3687B021E27244103B0C9CE8487B93E27F76E0479E4A40F03D' } }
```

### 4.24 调用合约(Solidity 版) - 尚未支持

##### 首先通过 buildContractInvokeTx (或者 invokeContract)方法返回一个 Transaction 对象，然后通过 submitPromise()方法完成合约的调用。

##### 4.24.1 创建合约调用对象

###### 方法:remote.buildContractInvokeTx({})

###### 参数

| 参数        | 类型   |             说明 |
| ----------- | ------ | ---------------: |
| account     | String |       合约发布者 |
| destination | String |         合约帐号 |
| abi         | Array  |         合约 abi |
| func        | String | 合约函数名及参数 |

###### 返回:Transaction 对象

##### <a name="invokeContractSubmit"></a> 4.24.2 执行合约

###### 方法:tx.submitPromise(secret);

###### 参数:

| 参数   | 类型   |           说明 |
| ------ | ------ | -------------: |
| secret | String | 合约执行者私钥 |

###### 返回: Promise

###### 例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "https://tapi.jingtum.com", solidity: true })
const v = {
  address: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  secret: "ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C"
}
const abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "withdraw",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_from", type: "address" }],
    name: "SWTBalance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "address" }
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "initialSupply", type: "uint256" },
      { name: "tokenName", type: "string" },
      { name: "tokenSymbol", type: "string" }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  }
]
var destination = "jKPNruYVLQ7BthSA1EaFqDePX2gcVCjk5k"
let tx = remote.buildContractInvokeTx({
  account: v.address,
  destination,
  abi,
  func: `transfer("${destination}", 5)`
})
tx.submitPromise(v.secret).then(console.log).catch(console.error)
```

###### 输出

```javascript
> { success: true,
  status_code: '0',
  ContractState: '',
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '12001F220000000024000004172026000000016140000000000000006840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100FD7DF650C0C753C0589159C383A809C5F2DB7AA53705E1880EF882DFAB577EB702202A91F83336E81EA709C937E1C3DD531BBF52D9A39A386A5AEB49571F7D07F0B781141359AA928F4D98FDB3D93E8B690C80D37DED11C38314C9A6E277B39563107F89277EAF319F5952F5F5C0FEEF70138861393035396362623030303030303030303030303030303063396136653237376233393536333130376638393237376561663331396635393532663566356330363531336564613130303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303035041000E1F1',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Amount: '0',
     Args: [ [Object] ],
     Destination: 'jKPNruYVLQ7BthSA1EaFqDePX2gcVCjk5k',
     Fee: '10000',
     Flags: 0,
     Method: 1,
     Sequence: 1047,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TransactionType: 'AlethContract',
     TxnSignature:
      '3045022100FD7DF650C0C753C0589159C383A809C5F2DB7AA53705E1880EF882DFAB577EB702202A91F83336E81EA709C937E1C3DD531BBF52D9A39A386A5AEB49571F7D07F0B7',
     hash:
      '7968F7E8C341F8F12DD1943B3EFE909A4F553FCFEE07E3605E2303CDF3C4641C' } }
```

## 5 本地签名和可选参数

### 5.1 本地签名

##### 方法: postBlob(blob);

##### 参数:

| 参数 | 类型   |                 说明 |
| ---- | ------ | -------------------: |
| blob | Object | {blob: 'signedblob'} |

##### 返回: Promise - json

##### 例子

```javascript
var japi = require("@swtc/api")
var Remote = japi.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
remote
  .postBlob({
    blob: "12001F220000000024000004172026000000016140000000000000006840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100FD7DF650C0C753C0589159C383A809C5F2DB7AA53705E1880EF882DFAB577EB702202A91F83336E81EA709C937E1C3DD531BBF52D9A39A386A5AEB49571F7D07F0B781141359AA928F4D98FDB3D93E8B690C80D37DED11C38314C9A6E277B39563107F89277EAF319F5952F5F5C0FEEF70138861393035396362623030303030303030303030303030303063396136653237376233393536333130376638393237376561663331396635393532663566356330363531336564613130303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303035041000E1F1"
  })
  .then(console.log)
  .catch(console.error)
```

##### 返回结果

```javascript
> { success: true,
  status_code: '0',
  ContractState: '',
  engine_result: 'tefPAST_SEQ',
  engine_result_code: -190,
  engine_result_message: 'This sequence number has already past.',
  tx_blob:
   '12001F220000000024000004172026000000016140000000000000006840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100FD7DF650C0C753C0589159C383A809C5F2DB7AA53705E1880EF882DFAB577EB702202A91F83336E81EA709C937E1C3DD531BBF52D9A39A386A5AEB49571F7D07F0B781141359AA928F4D98FDB3D93E8B690C80D37DED11C38314C9A6E277B39563107F89277EAF319F5952F5F5C0FEEF70138861393035396362623030303030303030303030303030303063396136653237376233393536333130376638393237376561663331396635393532663566356330363531336564613130303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303035041000E1F1',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Amount: '0',
     Args: [ [Object] ],
     Destination: 'jKPNruYVLQ7BthSA1EaFqDePX2gcVCjk5k',
     Fee: '10000',
     Flags: 0,
     Method: 1,
     Sequence: 1047,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TransactionType: 'AlethContract',
     TxnSignature:
      '3045022100FD7DF650C0C753C0589159C383A809C5F2DB7AA53705E1880EF882DFAB577EB702202A91F83336E81EA709C937E1C3DD531BBF52D9A39A386A5AEB49571F7D07F0B7',
     hash:
      '7968F7E8C341F8F12DD1943B3EFE909A4F553FCFEE07E3605E2303CDF3C4641C' } }
```

### 5.2 可选参数

##### 方法: .getXYZ()

##### 可选参数:

可选参数自身是一个 javascript 对象， 放在参数后面， 常见的包括
|参数|类型|说明|
|----|----|---:|
|results_per_page|Number|分页显示时每页显示的数目|
|page|Number|分页显示返回的页码|
|marker|Object|分页相关，位置标记|
|currency|String|通证代码|
|issuer|String|银关|

##### 返回: Promise - json

##### 例子

```javascript
remote.getAccountBalances("jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz", {
  currency: "CNY"
})
remote.getAccountOffers("jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz", {
  results_per_page: 100
})
```

## 6 交易记录信息

### 交易类型: Payment、OfferCreate、OfferCancel 和 RelationSet

> ##### 交易信息存储在系统中，查询交易信息时，系统解析交易信息，将交易信息解析为主要有如下信息：
>
> ##### date 交易时间 UNIXTIME hash 交易 hash fee 交易费用 result 交易结果 client_resource_id 交易资源号 memos 交易的备注信息 type 交易类型

### type

> 1. sent，用户进行支付操作，在交易信息中包含的信息有：
>
> | 参数                       | 类型   |                 说明 |
> | -------------------------- | ------ | -------------------: |
> | counterparty               | String |   支付对家，即接收方 |
> | amount                     | Object |         交易记录标记 |
> | &nbsp;&nbsp;&nbsp;value    | String |                 金额 |
> | &nbsp;&nbsp;&nbsp;currency | String |                 货币 |
> | &nbsp;&nbsp;&nbsp;issuer   | String | 货币发行方，SWT 为空 |
> | effects                    | Array  |               []，空 |
>
> 2. received，用户接受支付，在交易信息中包含的信息有：
>
> | 参数                       | 类型   |                 说明 |
> | -------------------------- | ------ | -------------------: |
> | counterparty               | String |   支付对家，即接收方 |
> | amount                     | Object |         交易记录标记 |
> | &nbsp;&nbsp;&nbsp;value    | String |                 金额 |
> | &nbsp;&nbsp;&nbsp;currency | String |                 货币 |
> | &nbsp;&nbsp;&nbsp;issuer   | String | 货币发行方，SWT 为空 |
> | effects                    | Array  |               []，空 |
>
> 3. convert，用户进行兑换操作，在交易信息中包含的信息有：
>
> | 参数                       | 类型                 |           说明 |
> | -------------------------- | -------------------- | -------------: |
> | spent                      | Object               | 兑换支付的金额 |
> | &nbsp;&nbsp;&nbsp;value    | String               |           金额 |
> | &nbsp;&nbsp;&nbsp;currency | String               |           货币 |
> | issuer                     |
> | String                     | 货币发行方，SWT 为空 |
> | amount                     | Object               |   交易记录标记 |
> | &nbsp;&nbsp;&nbsp;value    | String               |           金额 |
> | &nbsp;&nbsp;&nbsp;currency | String               |           货币 |
> | issuer                     |
> | String                     | 货币发行方，SWT 为空 |
> | effects                    | Array                |         []，空 |
>
> 4. offernew，用户进行挂单操作，在交易信息中包含的信息有：
>
> | 参数      | 类型   |                    说明 |
> | --------- | ------ | ----------------------: |
> | offertype | String |   挂单类型，sell 或 buy |
> | pair      | String |            交易的货币对 |
> | amount    | String |              挂单的数量 |
> | price     | String |              挂单的价格 |
> | effects   | Array  | 详见下面的 effects 解释 |
>
> 5. offercancel，用户进行取消挂单操作，在交易信息中包含的信息有：
>
> | 参数    | 类型   |                    说明 |
> | ------- | ------ | ----------------------: |
> | type    | String | 挂单的类型，sell 或 buy |
> | pair    | String |            交易的货币对 |
> | amount  | String |              挂单的数量 |
> | price   | String |              挂单的价格 |
> | effects | Array  | 详见下面的 effects 解释 |
>
> 6. offereffect，挂单成交情况，即被动成交的情况，在交易信息中包含的信息有：
>
> | 参数    | 类型  |                    说明 |
> | ------- | ----- | ----------------------: |
> | effects | Array | 详见下面的 effects 解释 |

### effects

##### effects 是每个用户交易记录信息里面的交易效果，是个 JSON 数组，数字可以包含多项，每项内容都包含效果类型 effect 字段，根据 effect 的不同里面的内容也不同 ：

> 1. offer_funded，交易实际成交；交易提示信息建议：交易成交，您以 XXX 价格买了/卖了 XXX 卖了/买了 XXX，价格是 XXX；其中包含的信息有：
>
> | 参数                       | 类型    |                       说明 |
> | -------------------------- | ------- | -------------------------: |
> | effect                     | String  |               offer_funded |
> | type                       | String  |      交易类型，sell 或 buy |
> | pair                       | String  |               交易的货币对 |
> | amount                     | String  |                 挂单的数量 |
> | got                        | Object  |             用户获得的金额 |
> | &nbsp;&nbsp;&nbsp;value    | String  |                       金额 |
> | &nbsp;&nbsp;&nbsp;currency | String  |                       货币 |
> | &nbsp;&nbsp;&nbsp;issuer   | String  |       货币发行方，SWT 为空 |
> | paid                       | Object  |             用户付出的金额 |
> | &nbsp;&nbsp;&nbsp;value    | String  |                       金额 |
> | &nbsp;&nbsp;&nbsp;currency | String  |                       货币 |
> | &nbsp;&nbsp;&nbsp;issuer   | String  |       货币发行方，SWT 为空 |
> | price                      | String  |             价格，4 位小数 |
> | seq                        | Integer | 挂单序号，表示被成交的单子 |
> | counterparty               | Object  |                   对家信息 |
> | &nbsp;&nbsp;&nbsp;account  | String  |                   对家账号 |
> | &nbsp;&nbsp;&nbsp;seq      | Integer |               对家单子序号 |
> | &nbsp;&nbsp;&nbsp;hash     | String  |              对家交易 hash |
>
> 2. offer_partially_funded，交易部分成交；交易提示信息建议：交易部分成交，您以 XXX 价格买了/卖了 XXX 卖了/买了 XXX，价格是 XXX，剩余挂单由于金额不足被取消（可选，根据 cancelled），还剩 XXX 单子（可选，根据 remaining）；其中包含的信息有：
>
> | 参数                       | 类型    |                                说明 |
> | -------------------------- | ------- | ----------------------------------: |
> | effect                     | String  |              offer_partially_funded |
> | type                       | String  |            交易类型，sold 或 bought |
> | got                        | Object  |                      用户获得的金额 |
> | &nbsp;&nbsp;&nbsp;value    | String  |                                金额 |
> | &nbsp;&nbsp;&nbsp;currency | String  |                                货币 |
> | &nbsp;&nbsp;&nbsp;issuer   | String  |                货币发行方，SWT 为空 |
> | paid                       | Object  |                      用户付出的金额 |
> | &nbsp;&nbsp;&nbsp;value    | String  |                                金额 |
> | &nbsp;&nbsp;&nbsp;currency | String  |                                货币 |
> | &nbsp;&nbsp;&nbsp;issuer   | String  |                货币发行方，SWT 为空 |
> | price                      | String  |                      价格，4 位小数 |
> | seq                        | Integer |          挂单序号，表示被成交的单子 |
> | cancelled                  | Boolean |        剩余的单子是否被取消了，可选 |
> | remaining                  | Boolean |              是否有剩余的单子，可选 |
> | pair                       | String  | 交易的货币对,remaining 为 true 才有 |
> | amount                     | String  |  挂单的数量，remaining 为 true 才有 |
> | price                      | String  |  挂单的价格，remaining 为 true 才有 |
> | counterparty               | Object  |                            对家信息 |
> | &nbsp;&nbsp;&nbsp;account  | String  |                            对家账号 |
> | &nbsp;&nbsp;&nbsp;seq      | Integer |                        对家单子序号 |
> | &nbsp;&nbsp;&nbsp;hash     | String  |                       对家交易 hash |
>
> 3. offer_cancelled，被关联交易取消单子，交易单子被取消；交易提示信息建议：由于缺少金额单子 XXX 被取消；其中包含的信息有：
>
> | 参数    | 类型    |                            说明 |
> | ------- | ------- | ------------------------------: |
> | effect  | String  |                 offer_cancelled |
> | type    | String  |           交易类型，sell 或 buy |
> | pair    | String  |                    交易的货币对 |
> | amount  | String  |                      挂单的数量 |
> | price   | String  |                      挂单的价格 |
> | seq     | Integer |                被取消单子的序号 |
> | hash    | String  |               被取消单子的 hash |
> | deleted | Boolean | 单子是否被删除，取消单子为 true |
>
> 4. offer_created，交易单子创建；交易提示信息建议：您创建了一个买/卖单，以 XXX 交易 XXX；其中包含的信息有：
>
> | 参数   | 类型    |                  说明 |
> | ------ | ------- | --------------------: |
> | effect | String  |         offer_created |
> | type   | String  | 交易类型，sell 或 buy |
> | pair   | String  |          交易的货币对 |
> | amount | String  |            挂单的数量 |
> | price  | String  |            挂单的价格 |
> | seq    | Integer |        新建的单子序号 |
>
> 5. offer_bought，挂单买到/卖出，成交的单子信息；交易提示信息建议：您以 XXX 价格买了/卖了 XXX 卖了/买了 XXX；其中包含的信息有：
>
> | 参数                       | 类型    |                  说明 |
> | -------------------------- | ------- | --------------------: |
> | effect                     | String  |          offer_bought |
> | type                       | String  | 交易类型，sell 或 buy |
> | got                        | Object  |        用户获得的金额 |
> | &nbsp;&nbsp;&nbsp;value    | String  |                  金额 |
> | &nbsp;&nbsp;&nbsp;currency | String  |                  货币 |
> | &nbsp;&nbsp;&nbsp;issuer   | String  |  货币发行方，SWT 为空 |
> | paid                       | Object  |        用户付出的金额 |
> | &nbsp;&nbsp;&nbsp;value    | String  |                  金额 |
> | &nbsp;&nbsp;&nbsp;currency | String  |                  货币 |
> | &nbsp;&nbsp;&nbsp;issuer   | String  |  货币发行方，SWT 为空 |
> | price                      | String  |        价格，4 位小数 |
> | pair                       | String  |          交易的货币对 |
> | amount                     | String  |            挂单的数量 |
> | counterparty               | Object  |              对家信息 |
> | &nbsp;&nbsp;&nbsp;account  | String  |              对家账号 |
> | &nbsp;&nbsp;&nbsp;seq      | Integer |          对家单子序号 |
> | &nbsp;&nbsp;&nbsp;hash     | String  |         对家交易 hash |

## 7 错误信息

### 客户端错误 - ClientError

##### ClientError，此错误主要是客户端请求参数错误，包括井通地址格式不对，私钥格式不对，货币格式不对等以及根据每个接口提交的参数格式不对等导致的错误；

### 网络错误 - NetworkError

##### NetworkError，此错误主要是网络错误，包括链接井通网络没有连上，请求服务超时等；

### 交易错误 - Transaction Error

##### TransactionError，此错误主要是重复资源号的错误，即 DuplicateTransactionError；

### 服务端错误 - ServerError

##### ServerError，此错误主要是后台程序错误，包括代码 BUG、代码实现问题等；

| 错误代码 |                                                                         说明 |
| -------- | ---------------------------------------------------------------------------: |
| 0        |                                                                      success |
| 1000     |                                                                 client error |
| 1001     |                                                   Invalid parameter: address |
| 1002     |                                                    Invalid parameter: secret |
| 1003     |                                                  Invalid parameter: currency |
| 1004     |                                                    Invalid parameter: issuer |
| 1005     |                                                     Invalid parameter: order |
| 1006     |                                                Invalid parameter: order.type |
| 1007     |                                               Invalid parameter: order.price |
| 1008     |                                            Invalid parameter: order.sequence |
| 1009     |                                                      Invalid parameter: hash |
| 1010     |                                                     not an order transaction |
| 1011     |                       Transaction specified did not affect the given account |
| 1012     |                                                      Invalid parameter: base |
| 1013     |                                                   Invalid parameter: counter |
| 1014     |                                       Invalid parameter: destination_address |
| 1015     |                                                    Invalid parameter: amount |
| 1016     |                                                   Invalid parameter: payment |
| 1017     |                                            Invalid parameter: payment.source |
| 1018     |                                       Invalid parameter: payment.destination |
| 1019     |                                            Invalid parameter: payment.amount |
| 1020     |                                 Invalid parameter: memos,it must be an array |
| 1021     |                                Invalid parameter: choice,it must be a string |
| 1022     |                                Invalid parameter: client_id,must be a number |
| 1023     |                                  Invalid parameter: client_id, already exits |
| 1024     |                                         Invalid parameter: choice, not exist |
| 1025     |                                                    Not a payment transaction |
| 1026     |                                           Invalid parameter:results_per_page |
| 1027     |                                                       Invalid parameter:page |
| 1028     | Invalid parameter:results_per_page, it mast be a number and not less than 10 |
| 1029     |                                                Invalid parameter: order.pair |
| 1030     |                                              Invalid parameter: order.amount |
| 1031     |                                                           Missing parameters |
| 1032     |                                 Invalid parameter: method, it must be 0 or 1 |
| 1033     |                                Invalid parameter: payload, it must be string |
| 1034     |              Invalid parameter: amount,it must be a number greater than zero |
| 1035     |                                Invalid parameter: params,it must be an array |
| 2000     |                                                                 Server error |
| 3000     |                                                            Transaction error |
| 3001     |                                                    Could not generate wallet |
| 4000     |                                                                Network error |
| 4001     |                                                       Remote is disconnected |
| 4002     |                                                                     Time out |
| 4003     |                                                                  Bad gateway |

## 8. 合约

## 9. erc20 源码

```javascript
pragma solidity ^0.5.4;
contract TokenTest {
    string public name;
    string public symbol;
    uint8  public decimals = 18;  // decimals 可以有的小数点个数，最小的代币单位。18 是建议的默认值
    uint256 public totalSupply;
    address  payable public owner;
    // 用mapping保存每个地址对应的余额
    mapping (address => uint256) public balanceOf;
    // 存储对账号的控制
    mapping (address => mapping (address => uint256)) public allowance;
    /**
     * 初始化构造
     */
    constructor(uint256 initialSupply, string memory tokenName , string  memory tokenSymbol) public {
        totalSupply = initialSupply * 10 ** uint256(decimals);  // 供应的份额，份额跟最小的代币单位有关，份额 = 币数 * 10 ** decimals。
        balanceOf[msg.sender] = totalSupply;
        name = tokenName; // 代币名称
        symbol = tokenSymbol;  // 代币符号
        owner = msg.sender;
    }

    /**
     * 代币交易转移的内部实现
     */
    function _transfer(address   _from, address  _to, uint  _value) internal{
        // 确保目标地址不为0x0，因为0x0地址代表销毁
        require(_to != address(0x0));
        // 检查发送者余额
        require(balanceOf[_from] >= _value);
        // 确保转移为正数个
        require(balanceOf[_to] + _value > balanceOf[_to]);

        // 以下用来检查交易，
        uint previousBalances = balanceOf[_from] + balanceOf[_to];
        // Subtract from the sender
        balanceOf[_from] -= _value;
        // Add the same to the recipient
        balanceOf[_to] += _value;

        // 用assert来检查代码逻辑。
        assert(balanceOf[_from] + balanceOf[_to] == previousBalances);
    }
    /**
     *  代币交易转移
     * 从自己（创建交易者）账号发送`_value`个代币到 `_to`账号
     * @param _to 接收者地址
     * @param _value 转移数额
     */
    function transfer(address _to, uint256 _value) public {
        _transfer(msg.sender, _to, _value);
    }

    function withdraw() payable public{
        require(msg.sender == owner);
        owner.transfer(address(this).balance);
    }
    function SWTBalance(address _from) public view returns (uint256)  {
        return _from.balance;
    }
}
```

## 10. erc721 源码

## 11. 多重签名

### 11.1 查询帐号的签名列表

##### 通过 getAccountSignerList 方法

###### 方法:remote.getAccountSignerList(address)

###### 参数

| 参数    | 类型   |   说明 |
| ------- | ------ | -----: |
| account | String | 源账号 |

###### 返回: Promise

##### 查询帐号的签名列表完整例子

```javascript
const jlib = require("@swtc/api")
var Remote = jlib.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
const a = {
  secret: "snaK5evc1SddiDca1BpZbg1UBft42",
  address: "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n"
}
const log_json = object => console.log(JSON.stringify(object, "", 2))
const sleep = time => new Promise(res => setTimeout(() => res(), time || 1))

sleep()
  .then(async () => {
    let result = await remote.getAccountSignerList(a.address)
    console.log(result)
    log_json(result.account_objects)
  })
  .catch(console.error)
```

##### 输出

```javascript
{
  account: 'j3UbbRX36997CWXqYqLUn28qH55v9Dh37n',
  account_objects: [
    {
      Flags: 0,
      LedgerEntryType: 'SignerList',
      OwnerNode: '0000000000000000',
      PreviousTxnID: 'F5C29AA790682CF238F397610F98910D0947334EF63BA565B30BAE8029AE634E',
      PreviousTxnLgrSeq: 549864,
      SignerEntries: [Array],
      SignerQuorum: 5,
      index: 'D1A5CF852001ABB5FC6E7C7ECF527737F11EA3E2B6E4077B94EB7679CB371F50'
    }
  ],
  ledger_current_index: 990624,
  validated: false
}
[
  {
    "Flags": 0,
    "LedgerEntryType": "SignerList",
    "OwnerNode": "0000000000000000",
    "PreviousTxnID": "F5C29AA790682CF238F397610F98910D0947334EF63BA565B30BAE8029AE634E",
    "PreviousTxnLgrSeq": 549864,
    "SignerEntries": [
      {
        "SignerEntry": {
          "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
          "SignerWeight": 3
        }
      },
      {
        "SignerEntry": {
          "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
          "SignerWeight": 3
        }
      }
    ],
    "SignerQuorum": 5,
    "index": "D1A5CF852001ABB5FC6E7C7ECF527737F11EA3E2B6E4077B94EB7679CB371F50"
  }
]
```

##### 返回结果说明

| 参数                                                         | 类型    |                                          说明 |
| ------------------------------------------------------------ | ------- | --------------------------------------------: |
| account                                                      | String  |                          设置签名列表的源账号 |
| account_objects                                              | Array   |                              签名列表相关信息 |
| &nbsp;&nbsp;----                                             | Object  |                              签名列表相关信息 |
| &nbsp;&nbsp;&nbsp;&nbsp;Flags                                | Integer |                                      交易标记 |
| &nbsp;&nbsp;&nbsp;&nbsp;LedgerEntryType                      | String  | 账本数据结构类型，SignerList 表示签名列表类型 |
| &nbsp;&nbsp;&nbsp;&nbsp;OwnerNode                            | String  |                                  列表索引标记 |
| &nbsp;&nbsp;&nbsp;&nbsp;PreviousTxnID                        | String  |                               上一笔交易 hash |
| &nbsp;&nbsp;&nbsp;&nbsp;PreviousTxnLgrSeq                    | Integer |                          上一笔交易所在账本号 |
| &nbsp;&nbsp;&nbsp;&nbsp;SignerEntries                        | Array   |                                      签名列表 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SignerEntry              | Object  |                                  单个签名对象 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Account      | String  |                                签名者账号地址 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SignerWeight | Integer |                    该签名者在签名列表中的权重 |
| &nbsp;&nbsp;&nbsp;&nbsp;SignerQuorum                         | Integer |                                  签名列表阈值 |
| &nbsp;&nbsp;&nbsp;&nbsp;index                                | String  |                                   签名列表 id |
| ledger_current_index                                         | String  |                                    当前账本号 |
| validated                                                    | Boolean |                  当前账本中，交易是否通过验证 |

### 11.2 设置帐号的签名列表

##### 首先通过 buildSignerListTx 方法返回一个 Transaction 对象，通过 submit 方法提交列表信息

##### 11.2.1 创建签名列表对象

###### 方法:remote.buildSignerListTx({})

###### 参数

| 参数                            | 类型    |     说明 |
| ------------------------------- | ------- | -------: |
| account                         | String  | 交易账号 |
| threshold                       | Integer | 生效阈值 |
| lists                           | Array   | 签名列表 |
| &nbsp;&nbsp;---                 | Object  | 列表对象 |
| &nbsp;&nbsp;&nbsp;&nbsp;account | String  |     帐号 |
| &nbsp;&nbsp;&nbsp;&nbsp;weight  | String  |     权重 |

####### 注：不可将交易源账号设为签名列表名单内

###### 返回:Transaction 对象

##### 11.2.2 设置签名列表

###### 方法:tx.submitPromise(secret)

###### 参数: 密钥

| 参数   | 类型   |     说明 |
| ------ | ------ | -------: |
| secret | String | 钱包私钥 |

###### 返回: Promise

##### 设置帐号的签名列表完整例子

```javascript
const jlib = require("@swtc/api")
var Remote = jlib.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
const a = {
  secret: "snaK5evc1SddiDca1BpZbg1UBft42",
  address: "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n"
}
const a1 = {
  secret: "ssmhW3gLLg8wLPzko3dx1LbuDcwCW",
  address: "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq"
}
const a2 = {
  secret: "ssXLTUGS6ZFRpGRs5p94BBu6mV1vv",
  address: "jUv833RRTAZhbUyRzSsAutM9GwbprregiE"
}
const log_json = object => console.log(JSON.stringify(object, "", 2))
const sleep = time => new Promise(res => setTimeout(() => res(), time || 1))

//设置签名列表
const tx = remote.buildSignerListTx({
  account: a.address,
  threshold: 7,
  lists: [
    { account: a1.address, weight: 4 },
    { account: a2.address, weight: 5 }
  ]
})

sleep()
  .then(async () => {
    await tx._setSequencePromise()
    log_json(tx.tx_json)
    console.log(`需要设置足够的燃料支持多签交易tx.setFee()`)
    tx.setFee(30000) // 燃料
    log_json(tx.tx_json)
    let result = await tx.submitPromise(a.secret)
    console.log(result)
    log_json(result.tx_json)
  })
  .catch(console.error)
```

##### 输出

```javascript
{
  "Flags": 0,
  "Fee": 10000,
  "SignerEntries": [
    {
      "SignerEntry": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SignerWeight": 4
      }
    },
    {
      "SignerEntry": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SignerWeight": 5
      }
    }
  ],
  "TransactionType": "SignerListSet",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "SignerQuorum": 7,
  "Sequence": 20
}
需要设置足够的燃料支持多签交易tx.setFee()
{
  "Flags": 0,
  "Fee": 30000,
  "SignerEntries": [
    {
      "SignerEntry": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SignerWeight": 4
      }
    },
    {
      "SignerEntry": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SignerWeight": 5
      }
    }
  ],
  "TransactionType": "SignerListSet",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "SignerQuorum": 7,
  "Sequence": 20
}
{
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  tx_blob: '1200CF220000000024000000142026000000076840000000000075307321024A02206AEFF63AF72BF6BE116073DE6D75E8D3404462CC73EC0F35207DF272287447304502210094001DBADCADE86B400E2D6DDA1D423F3182D8D2CBB9DB7C8AEDF798759E4E010220783C09F9E17812DC5FF768805A7E85DD5D830EDF0CC266C3C7D28657713C7B6381144EFA5550AA0B6A0C06793161C0D2EDC635469AC8FBEC130004811423A7CE52916DFDE210D371CF8487CFDB790B1DCBE1EC130005811482D518A6A562B198E72BC1B8976F83D996E3CCD5E1F1',
  tx_json: {
    Account: 'j3UbbRX36997CWXqYqLUn28qH55v9Dh37n',
    Fee: '30000',
    Flags: 0,
    Sequence: 20,
    SignerEntries: [ [Object], [Object] ],
    SignerQuorum: 7,
    SigningPubKey: '024A02206AEFF63AF72BF6BE116073DE6D75E8D3404462CC73EC0F35207DF27228',
    TransactionType: 'SignerListSet',
    TxnSignature: '304502210094001DBADCADE86B400E2D6DDA1D423F3182D8D2CBB9DB7C8AEDF798759E4E010220783C09F9E17812DC5FF768805A7E85DD5D830EDF0CC266C3C7D28657713C7B63',
    hash: '5F22F243B6235267C23CFC1C625E60C71355774F68638971638D1E3FC11347F8'
  }
}
{
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "Fee": "30000",
  "Flags": 0,
  "Sequence": 20,
  "SignerEntries": [
    {
      "SignerEntry": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SignerWeight": 4
      }
    },
    {
      "SignerEntry": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SignerWeight": 5
      }
    }
  ],
  "SignerQuorum": 7,
  "SigningPubKey": "024A02206AEFF63AF72BF6BE116073DE6D75E8D3404462CC73EC0F35207DF27228",
  "TransactionType": "SignerListSet",
  "TxnSignature": "304502210094001DBADCADE86B400E2D6DDA1D423F3182D8D2CBB9DB7C8AEDF798759E4E010220783C09F9E17812DC5FF768805A7E85DD5D830EDF0CC266C3C7D28657713C7B63",
  "hash": "5F22F243B6235267C23CFC1C625E60C71355774F68638971638D1E3FC11347F8"
}
```

##### 返回结果说明

| 参数                                                               | 类型    |                                                     说明 |
| ------------------------------------------------------------------ | ------- | -------------------------------------------------------: |
| engine_result                                                      | String  |                                                 请求结果 |
| engine_result_code                                                 | Array   |                                             请求结果编码 |
| engine_result_message                                              | String  |                                    请求结果 message 信息 |
| tx_blob                                                            | String  |                                      16 进制签名后的交易 |
| tx_json                                                            | Object  |                                                 交易内容 |
| &nbsp;&nbsp;&nbsp;Account                                          | String  |                                           交易源账号地址 |
| &nbsp;&nbsp;&nbsp;Fee                                              | String  |                                                   交易费 |
| &nbsp;&nbsp;&nbsp;Flags                                            | Integer |                                                 交易标记 |
| &nbsp;&nbsp;&nbsp;Sequence                                         | Integer |                                               单子序列号 |
| &nbsp;&nbsp;&nbsp;SignerEntries                                    | Array   |                     签名列表条目；销毁列表时，没有该字段 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SignerEntry                    | Object  |                                             单个签名条目 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Account      | String  |                                           签名账号的地址 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SignerWeight | String  |                             该签名在多重签名交易中的权重 |
| &nbsp;&nbsp;&nbsp;SignerQuorum                                     | Integer | 多重签名交易通过的阈值，应大于等于零，零表示销毁签名列表 |
| &nbsp;&nbsp;&nbsp;SigningPubKey                                    | String  |                                                 签名公钥 |
| &nbsp;&nbsp;&nbsp;TransactionType                                  | String  |                 交易类型，设置签名列表类为 SignerListSet |
| &nbsp;&nbsp;&nbsp;TxnSignature                                     | String  |                                                 交易签名 |
| &nbsp;&nbsp;&nbsp;hash                                             | String  |                                                交易 hash |

### 11.3 废除帐号的主密钥

##### 本功能为禁止某账号做交易而设定，且只有该账号设置了签名列表才可以废除 masterkey 成功。首先通过 buildAccountSetTx 方法返回一个 Transaction 对象，最后通过 submitPromise 方法提交到底层

##### 11.3.1 创建废除密钥交易

###### 方法:remote.buildAccountSetTx({})

###### 参数

| 参数     | 类型    |                          说明 |
| -------- | ------- | ----------------------------: |
| account  | String  | 被废除或激活 masterkey 的账号 |
| type     | String  |     类型，这里固定为 property |
| set_flag | Integer |                    4 表示废除 |

###### 返回:Transaction 对象

##### 11.3.2 废除

###### 方法:tx.submitPromise(secret);

###### 参数: 密钥

| 参数   | 类型   |     说明 |
| ------ | ------ | -------: |
| secret | String | 钱包私钥 |

###### 返回: Promise

##### 废除主密钥完整例子

```javascript
const jlib = require("@swtc/api")
var Remote = jlib.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
const a = {
  secret: "snaK5evc1SddiDca1BpZbg1UBft42",
  address: "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n"
}
const log_json = object => console.log(JSON.stringify(object, "", 2))
const sleep = time => new Promise(res => setTimeout(() => res(), time || 1))

//设置废除主密钥
const tx = remote.buildAccountSetTx({
  account: a.address,
  type: "property",
  set_flag: 4
})

sleep()
  .then(async () => {
    await tx._setSequencePromise()
    log_json(tx.tx_json)
    let result = await tx.submitPromise(a.secret)
    console.log(result)
  })
  .catch(console.error)
```

##### 输出

```javascript
{
  "Flags": 0,
  "Fee": 10000,
  "TransactionType": "AccountSet",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "SetFlag": 4,
  "Sequence": 21
}
{
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  tx_blob: '120003220000000024000000152021000000046840000000000027107321024A02206AEFF63AF72BF6BE116073DE6D75E8D3404462CC73EC0F35207DF27228744630440220065CCCA45E57AB9D4F5821C1D52610FD4A08ADB91A657D656AD04F89A156053002205F6EF6C6E19A017DB7EADE3F4ED2B3F5AA873BB662CD73934E925BF655B4E8DC81144EFA5550AA0B6A0C06793161C0D2EDC635469AC8',
  tx_json: {
    Account: 'j3UbbRX36997CWXqYqLUn28qH55v9Dh37n',
    Fee: '10000',
    Flags: 0,
    Sequence: 21,
    SetFlag: 4,
    SigningPubKey: '024A02206AEFF63AF72BF6BE116073DE6D75E8D3404462CC73EC0F35207DF27228',
    TransactionType: 'AccountSet',
    TxnSignature: '30440220065CCCA45E57AB9D4F5821C1D52610FD4A08ADB91A657D656AD04F89A156053002205F6EF6C6E19A017DB7EADE3F4ED2B3F5AA873BB662CD73934E925BF655B4E8DC',
    hash: '7211EA365F32F49B7CB0468A6254FD1ADD58934A7473062C4E15D43E25431FD4'
  }
}
```

##### 返回结果说明

| 参数                              | 类型    |                              说明 |
| --------------------------------- | ------- | --------------------------------: |
| engine_result                     | String  |                          请求结果 |
| engine_result_code                | Array   |                      请求结果编码 |
| engine_result_message             | String  |             请求结果 message 信息 |
| tx_blob                           | String  |               16 进制签名后的交易 |
| tx_json                           | Object  |                          交易内容 |
| &nbsp;&nbsp;&nbsp;Account         | String  |                    交易源账号地址 |
| &nbsp;&nbsp;&nbsp;Fee             | String  |                            交易费 |
| &nbsp;&nbsp;&nbsp;Flags           | Integer |                          交易标记 |
| &nbsp;&nbsp;&nbsp;Sequence        | Integer |                        单子序列号 |
| &nbsp;&nbsp;&nbsp;SetFlag         | Integer |                      账号属性标记 |
| &nbsp;&nbsp;&nbsp;SigningPubKey   | String  |                          签名公钥 |
| &nbsp;&nbsp;&nbsp;TransactionType | String  | 交易类型，账号属性类为 AccountSet |
| &nbsp;&nbsp;&nbsp;TxnSignature    | String  |                          交易签名 |
| &nbsp;&nbsp;&nbsp;hash            | String  |                         交易 hash |

### 11.4 激活帐号的主密钥

##### 激活通过多签列表中的账号去完成激活，如用账号 a1 和 a2 激活，详见下面例子

##### 11.4.1 创建激活密钥交易

###### 方法:remote.buildAccountSetTx({})

###### 参数

| 参数       | 类型    |                                       说明 |
| ---------- | ------- | -----------------------------------------: |
| account    | String  |              被废除或激活 masterkey 的账号 |
| type       | String  |                  类型，这里固定为 property |
| clear_flag | Integer | 4 表示激活主密钥，用于多签中激活 masterkey |

###### 返回:Transaction 对象

##### 11.4.2 激活

###### 方法:tx.submitPromise();

###### 参数: 无

###### 返回: Promise

##### 激活主密钥完整例子

```javascript
const jlib = require("@swtc/api")
var Remote = jlib.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
const a = {
  secret: "snaK5evc1SddiDca1BpZbg1UBft42",
  address: "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n"
}
const a1 = {
  secret: "ssmhW3gLLg8wLPzko3dx1LbuDcwCW",
  address: "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq"
}
const a2 = {
  secret: "ssXLTUGS6ZFRpGRs5p94BBu6mV1vv",
  address: "jUv833RRTAZhbUyRzSsAutM9GwbprregiE"
}
const log_json = object => console.log(JSON.stringify(object, "", 2))
const sleep = time => new Promise(res => setTimeout(() => res(), time || 1))

//设置激活主密钥
const tx = remote.buildAccountSetTx({
  account: a.address,
  type: "property",
  clear_flag: 4
})

sleep()
  .then(async () => {
    // 设置sequence
    await tx._setSequencePromise()
    log_json(tx.tx_json)
    console.log(`需要设置足够的燃料支持多签交易tx.setFee()`)
    tx.setFee(20000) // 燃料
    log_json(tx.tx_json)
    tx.multiSigning(a1)
    tx.multiSigning(a2)
    log_json(tx.tx_json)
    tx.multiSigned()
    log_json(tx.tx_json)
    let result = await tx.submitPromise() // multisign submit does not need any secret
    console.log(result)
    log_json(result.tx_json)
  })
  .catch(console.error)
```

##### 输出

```javascript
{
  "Flags": 0,
  "Fee": 10000,
  "TransactionType": "AccountSet",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "ClearFlag": 4,
  "Sequence": 22
}
需要设置足够的燃料支持多签交易tx.setFee()
{
  "Flags": 0,
  "Fee": 20000,
  "TransactionType": "AccountSet",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "ClearFlag": 4,
  "Sequence": 22
}
{
  "Flags": 0,
  "Fee": 20000,
  "TransactionType": "AccountSet",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "ClearFlag": 4,
  "Sequence": 22,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "30450221008D4B0B6B8EE4E0E027192CD857697754A613DCB17DBEE35E7673867CA3D01930022005C0A4FCFCE258D694679B5A70CA7DDDDAFE7A465DD3DBC41CDC1E909F1C6D1C"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "30450221009F2AA42390A237C064D9D2FCF4C29F46356192EB65B6271E5269C9AE68E769F6022007F687CC2E4CBDC40266724748318B9879C74BFED7941DFE83ADE5B93261FEA4"
      }
    }
  ]
}
{
  "Flags": 0,
  "Fee": 20000,
  "TransactionType": "AccountSet",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "ClearFlag": 4,
  "Sequence": 22,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "30450221008D4B0B6B8EE4E0E027192CD857697754A613DCB17DBEE35E7673867CA3D01930022005C0A4FCFCE258D694679B5A70CA7DDDDAFE7A465DD3DBC41CDC1E909F1C6D1C"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "30450221009F2AA42390A237C064D9D2FCF4C29F46356192EB65B6271E5269C9AE68E769F6022007F687CC2E4CBDC40266724748318B9879C74BFED7941DFE83ADE5B93261FEA4"
      }
    }
  ]
}
true
{
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  tx_blob: '12000322000000002400000016202200000004684000000000004E20730081144EFA5550AA0B6A0C06793161C0D2EDC635469AC8FCED7321028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF744730450221008D4B0B6B8EE4E0E027192CD857697754A613DCB17DBEE35E7673867CA3D01930022005C0A4FCFCE258D694679B5A70CA7DDDDAFE7A465DD3DBC41CDC1E909F1C6D1C811423A7CE52916DFDE210D371CF8487CFDB790B1DCBE1ED7321022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26744730450221009F2AA42390A237C064D9D2FCF4C29F46356192EB65B6271E5269C9AE68E769F6022007F687CC2E4CBDC40266724748318B9879C74BFED7941DFE83ADE5B93261FEA4811482D518A6A562B198E72BC1B8976F83D996E3CCD5E1F1',
  tx_json: {
    Account: 'j3UbbRX36997CWXqYqLUn28qH55v9Dh37n',
    ClearFlag: 4,
    Fee: '20000',
    Flags: 0,
    Sequence: 22,
    Signers: [ [Object], [Object] ],
    SigningPubKey: '',
    TransactionType: 'AccountSet',
    hash: '17254C4615EFF245205DC9E064A21CDE54177CD936E27C1E84ACDD94B6E84D46'
  }
}
{
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "ClearFlag": 4,
  "Fee": "20000",
  "Flags": 0,
  "Sequence": 22,
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "30450221008D4B0B6B8EE4E0E027192CD857697754A613DCB17DBEE35E7673867CA3D01930022005C0A4FCFCE258D694679B5A70CA7DDDDAFE7A465DD3DBC41CDC1E909F1C6D1C"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "30450221009F2AA42390A237C064D9D2FCF4C29F46356192EB65B6271E5269C9AE68E769F6022007F687CC2E4CBDC40266724748318B9879C74BFED7941DFE83ADE5B93261FEA4"
      }
    }
  ],
  "SigningPubKey": "",
  "TransactionType": "AccountSet",
  "hash": "17254C4615EFF245205DC9E064A21CDE54177CD936E27C1E84ACDD94B6E84D46"
}
```

##### 返回结果说明

| 参数                                                                | 类型    |                                 说明 |
| ------------------------------------------------------------------- | ------- | -----------------------------------: |
| engine_result                                                       | String  |                             请求结果 |
| engine_result_code                                                  | Array   |                         请求结果编码 |
| engine_result_message                                               | String  |                请求结果 message 信息 |
| tx_blob                                                             | String  |                  16 进制签名后的交易 |
| tx_json                                                             | Object  |                             交易内容 |
| &nbsp;&nbsp;&nbsp;Account                                           | String  |                       交易源账号地址 |
| &nbsp;&nbsp;&nbsp;ClearFlag                                         | Integer |                         账号属性标记 |
| &nbsp;&nbsp;&nbsp;Fee                                               | String  |                               交易费 |
| &nbsp;&nbsp;&nbsp;Flags                                             | Integer |                             交易标记 |
| &nbsp;&nbsp;&nbsp;Sequence                                          | Integer |                           单子序列号 |
| &nbsp;&nbsp;&nbsp;Signers                                           | Array   | 签名列表条目；销毁列表时，没有该字段 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Signer                          | Object  |                         单个签名条目 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Account       | String  |               给该交易签名的账号地址 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SigningPubKey | String  |               给该交易签名的账号公钥 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TxnSignature  | String  |       Account 账号给该交易的交易签名 |
| &nbsp;&nbsp;&nbsp;SigningPubKey                                     | String  |                             签名公钥 |
| &nbsp;&nbsp;&nbsp;TransactionType                                   | String  |    交易类型，账号属性类为 AccountSet |
| &nbsp;&nbsp;&nbsp;hash                                              | String  |                            交易 hash |

### 11.5 多重签名 - tx.multiSigning, tx.multiSigned

##### 通过 Transaction 多签， 创建正常交易，然后依次进行多签(multiSigning)， 最后确认(multiSigned)提交(tx.submitPromise)

##### 11.5.1 创建正常交易

###### 方法:remote.buildPaymentTx({})

###### 返回:Transaction 对象

##### 11.5.2 多重签名

###### 方法:tx.multiSigning() ... tx.multiSigned()

###### 参数:

###### 返回: tx

##### 11.5.3 交易

###### 方法:tx.submitPromise()

###### 返回: promise

##### 多签支付完整例子

```javascript
const jlib = require("@swtc/api")
var Remote = jlib.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
const a = {
  secret: "snaK5evc1SddiDca1BpZbg1UBft42",
  address: "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n"
}
const a1 = {
  secret: "ssmhW3gLLg8wLPzko3dx1LbuDcwCW",
  address: "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq"
}
const a2 = {
  secret: "ssXLTUGS6ZFRpGRs5p94BBu6mV1vv",
  address: "jUv833RRTAZhbUyRzSsAutM9GwbprregiE"
}

let to = "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz"
const log_json = object => console.log(JSON.stringify(object, "", 2))
const sleep = time => new Promise(res => setTimeout(() => res(), time || 1))

// 创建支付交易
let tx = remote.buildPaymentTx({
  account: a.address,
  to,
  amount: remote.makeAmount(1)
})
tx.addMemo("multisigned payment test")

sleep()
  .then(async () => {
    // 设置sequence
    await tx._setSequencePromise()
    console.log(`需要设置足够的燃料支持多签交易tx.setFee()`)
    tx.setFee(20000) // 燃料
    log_json(tx.tx_json)
    tx = tx.multiSigning(a1)
    log_json(tx.tx_json)
    // tx.tx_json 需要依次传递给不同的多签方
    let tx_json = tx.tx_json
    // 然后重组成tx
    let tx2 = remote.buildMultisignedTx(tx_json)
    tx2.multiSigning(a2)
    log_json(tx2.tx_json)
    tx2.multiSigned()
    log_json(tx2.tx_json)
    let result = await tx2.submitPromise() // multisign submit does not need any secret
    console.log(result)
    log_json(result.tx_json)
  })
  .catch(console.error)
```

##### 输出

```javascript
需要设置足够的燃料支持多签交易tx.setFee()
{
  "Flags": 0,
  "Fee": 20000,
  "TransactionType": "Payment",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "Amount": "1000000",
  "Destination": "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  "Memos": [
    {
      "Memo": {
        "MemoData": "6d756c74697369676e6564207061796d656e742074657374"
      }
    }
  ],
  "Sequence": 23
}
{
  "Flags": 0,
  "Fee": 20000,
  "TransactionType": "Payment",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "Amount": "1000000",
  "Destination": "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  "Memos": [
    {
      "Memo": {
        "MemoData": "6d756c74697369676e6564207061796d656e742074657374"
      }
    }
  ],
  "Sequence": 23,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3045022100DD3C6FB4E271A6010C67F4D34F73074FEAFA32C90A7F9558BB05D919F3EC009C0220349CB803473D4E633564380F9F58E5B58747986E18B35ABB7C4C2463BDA83E6C"
      }
    }
  ]
}
{
  "Flags": 0,
  "Fee": 20000,
  "TransactionType": "Payment",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "Amount": "1000000",
  "Destination": "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  "Memos": [
    {
      "Memo": {
        "MemoData": "6d756c74697369676e6564207061796d656e742074657374"
      }
    }
  ],
  "Sequence": 23,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3045022100DD3C6FB4E271A6010C67F4D34F73074FEAFA32C90A7F9558BB05D919F3EC009C0220349CB803473D4E633564380F9F58E5B58747986E18B35ABB7C4C2463BDA83E6C"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "3044022100F5FFE445A60A7A689CED595D2848632353867535FA95B28739592B41A1B193F0021F2B6B5D839506B5DC2065612AB34DDB7EAEBEF7F49A4334C273D1F446F89674"
      }
    }
  ]
}
{
  "Flags": 0,
  "Fee": 20000,
  "TransactionType": "Payment",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "Amount": "1000000",
  "Destination": "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  "Memos": [
    {
      "Memo": {
        "MemoData": "6d756c74697369676e6564207061796d656e742074657374"
      }
    }
  ],
  "Sequence": 23,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3045022100DD3C6FB4E271A6010C67F4D34F73074FEAFA32C90A7F9558BB05D919F3EC009C0220349CB803473D4E633564380F9F58E5B58747986E18B35ABB7C4C2463BDA83E6C"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "3044022100F5FFE445A60A7A689CED595D2848632353867535FA95B28739592B41A1B193F0021F2B6B5D839506B5DC2065612AB34DDB7EAEBEF7F49A4334C273D1F446F89674"
      }
    }
  ]
}
{
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  tx_blob: '120000220000000024000000176140000000000F4240684000000000004E20730081144EFA5550AA0B6A0C06793161C0D2EDC635469AC883141359AA928F4D98FDB3D93E8B690C80D37DED11C3F9EA7D186D756C74697369676E6564207061796D656E742074657374E1F1FCED7321028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF74473045022100DD3C6FB4E271A6010C67F4D34F73074FEAFA32C90A7F9558BB05D919F3EC009C0220349CB803473D4E633564380F9F58E5B58747986E18B35ABB7C4C2463BDA83E6C811423A7CE52916DFDE210D371CF8487CFDB790B1DCBE1ED7321022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C2674463044022100F5FFE445A60A7A689CED595D2848632353867535FA95B28739592B41A1B193F0021F2B6B5D839506B5DC2065612AB34DDB7EAEBEF7F49A4334C273D1F446F89674811482D518A6A562B198E72BC1B8976F83D996E3CCD5E1F1',
  tx_json: {
    Account: 'j3UbbRX36997CWXqYqLUn28qH55v9Dh37n',
    Amount: '1000000',
    Destination: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Fee: '20000',
    Flags: 0,
    Memos: [ [Object] ],
    Sequence: 23,
    Signers: [ [Object], [Object] ],
    SigningPubKey: '',
    TransactionType: 'Payment',
    hash: '297687746C738E61D30399C58D0410C8B604C74A93E19F1910FBA5B95C50976E'
  }
}
{
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "Amount": "1000000",
  "Destination": "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  "Fee": "20000",
  "Flags": 0,
  "Memos": [
    {
      "Memo": {
        "MemoData": "6D756C74697369676E6564207061796D656E742074657374"
      }
    }
  ],
  "Sequence": 23,
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3045022100DD3C6FB4E271A6010C67F4D34F73074FEAFA32C90A7F9558BB05D919F3EC009C0220349CB803473D4E633564380F9F58E5B58747986E18B35ABB7C4C2463BDA83E6C"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "3044022100F5FFE445A60A7A689CED595D2848632353867535FA95B28739592B41A1B193F0021F2B6B5D839506B5DC2065612AB34DDB7EAEBEF7F49A4334C273D1F446F89674"
      }
    }
  ],
  "SigningPubKey": "",
  "TransactionType": "Payment",
  "hash": "297687746C738E61D30399C58D0410C8B604C74A93E19F1910FBA5B95C50976E"
}
```

##### 返回结果说明

| 参数                                                                | 类型    |                                                                               说明 |
| ------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------: |
| engine_result                                                       | String  |                                                                           请求结果 |
| engine_result_code                                                  | Array   |                                                                       请求结果编码 |
| engine_result_message                                               | String  |                                                              请求结果 message 信息 |
| tx_blob                                                             | String  |                                                                16 进制签名后的交易 |
| tx_json                                                             | Object  |                                                                           交易内容 |
| &nbsp;&nbsp;&nbsp;Account                                           | String  |                                                                     交易源账号地址 |
| &nbsp;&nbsp;&nbsp;Fee                                               | String  |                                                                             交易费 |
| &nbsp;&nbsp;&nbsp;Flags                                             | Integer |                                                                           交易标记 |
| &nbsp;&nbsp;&nbsp;Sequence                                          | Integer |                                                                         单子序列号 |
| &nbsp;&nbsp;&nbsp;--                                                | --      | 相关交易对应的其他字段，如 Payment 类型有 Amount、Destination 字段，这里不一一列举 |
| &nbsp;&nbsp;&nbsp;Signers                                           | Array   |                                               签名列表条目；销毁列表时，没有该字段 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Signer                          | Object  |                                                                       单个签名条目 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Account       | String  |                                                             给该交易签名的账号地址 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SigningPubKey | String  |                                                             给该交易签名的账号公钥 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TxnSignature  | String  |                                                     Account 账号给该交易的交易签名 |
| &nbsp;&nbsp;&nbsp;SigningPubKey                                     | String  |                                                       交易签名公钥，必须为空字符串 |
| &nbsp;&nbsp;&nbsp;TransactionType                                   | String  |                                                                           交易类型 |
| &nbsp;&nbsp;&nbsp;hash                                              | String  |                                                    交易 hash，该 hash 可在链上查到 |

### 11.6 多重签名 - remote.buildSignFirstTx, remote.buildSignOtherTx, remote.buildMultisignedTx

##### 通过 Transaction 多签， 创建正常交易，然后依次进行多签(multiSigning)， 最后确认(multiSigned)提交(tx.submitPromise)

##### 11.6.1 创建正常交易

###### 方法:remote.buildPaymentTx({})

###### 返回:Transaction 对象

##### 11.6.2 多重签名

###### 方法:remote.buildSignFirstTx({}) ... remote.buildSignOtherTx({}), remote.buildMultisignedTx(tx_json), tx.multiSigned()

###### 参数:

###### 返回: tx

##### 11.6.3 交易

###### 方法:tx.submitPromise()

###### 返回: promise

##### 多签支付完整例子

```javascript
const jlib = require("@swtc/api")
var Remote = jlib.Remote
var remote = new Remote({ server: "http://swtcproxy.swtclib.ca:5080" })
const a = {
  secret: "snaK5evc1SddiDca1BpZbg1UBft42",
  address: "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n"
}
const a1 = {
  secret: "ssmhW3gLLg8wLPzko3dx1LbuDcwCW",
  address: "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq"
}
const a2 = {
  secret: "ssXLTUGS6ZFRpGRs5p94BBu6mV1vv",
  address: "jUv833RRTAZhbUyRzSsAutM9GwbprregiE"
}

let to = "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz"
const log_json = object => console.log(JSON.stringify(object, "", 2))
const sleep = time => new Promise(res => setTimeout(() => res(), time || 1))

// 创建支付交易
let tx = remote.buildPaymentTx({
  account: a.address,
  to,
  amount: remote.makeAmount(1)
})
tx.addMemo("multisigned payment test")

sleep()
  .then(async () => {
    // 设置sequence
    await tx._setSequencePromise()
    console.log(`需要设置足够的燃料支持多签交易tx.setFee()`)
    tx.setFee(20000) // 燃料
    log_json(tx.tx_json)
    tx = remote.buildSignFirstTx({ tx, account: a1.address, secret: a1.secret })
    log_json(tx.tx_json)
    // tx.tx_json 需要依次传递给不同的多签方
    let tx_json = tx.tx_json
    // 然后重组成tx
    let tx2 = remote.buildSignOtherTx({
      tx_json,
      account: a2.address,
      secret: a2.secret
    })
    log_json(tx2.tx_json)
    let tx3 = remote.buildMultisignedTx(tx2.tx_json)
    log_json(tx3.tx_json)
    tx3.multiSigned()
    log_json(tx3.tx_json)
    let result = await tx3.submitPromise() // multisign submit does not need any secret
    console.log(result)
    log_json(result.tx_json)
  })
  .catch(console.error)
```

##### 输出

```javascript
需要设置足够的燃料支持多签交易tx.setFee()
{
  "Flags": 0,
  "Fee": 20000,
  "TransactionType": "Payment",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "Amount": "1000000",
  "Destination": "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  "Memos": [
    {
      "Memo": {
        "MemoData": "6d756c74697369676e6564207061796d656e742074657374"
      }
    }
  ],
  "Sequence": 24
}
{
  "Flags": 0,
  "Fee": 20000,
  "TransactionType": "Payment",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "Amount": "1000000",
  "Destination": "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  "Memos": [
    {
      "Memo": {
        "MemoData": "6d756c74697369676e6564207061796d656e742074657374"
      }
    }
  ],
  "Sequence": 24,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3044022023CCB793A4AC5912B4CD7BEFD769B30DED870634E94C2C127DCA7572C6B62A060220790AC05A5D2B9CB5BBFCCBCECC0F18A4B6202FBB8E2B4F82D14353A32F16F5DA"
      }
    }
  ]
}
{
  "Flags": 0,
  "Fee": 20000,
  "TransactionType": "Payment",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "Amount": "1000000",
  "Destination": "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  "Memos": [
    {
      "Memo": {
        "MemoData": "6d756c74697369676e6564207061796d656e742074657374"
      }
    }
  ],
  "Sequence": 24,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3044022023CCB793A4AC5912B4CD7BEFD769B30DED870634E94C2C127DCA7572C6B62A060220790AC05A5D2B9CB5BBFCCBCECC0F18A4B6202FBB8E2B4F82D14353A32F16F5DA"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "304402204DEA0D84FCCA5D3181D2535B9297879547B54C898BDA2C55C05B07C34609521F022013496CE02FFA94890364FE7BDA3BD4A0CEFED5CF9DD458B072F003C153BCEA92"
      }
    }
  ]
}
{
  "Flags": 0,
  "Fee": 20000,
  "TransactionType": "Payment",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "Amount": "1000000",
  "Destination": "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  "Memos": [
    {
      "Memo": {
        "MemoData": "6d756c74697369676e6564207061796d656e742074657374"
      }
    }
  ],
  "Sequence": 24,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3044022023CCB793A4AC5912B4CD7BEFD769B30DED870634E94C2C127DCA7572C6B62A060220790AC05A5D2B9CB5BBFCCBCECC0F18A4B6202FBB8E2B4F82D14353A32F16F5DA"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "304402204DEA0D84FCCA5D3181D2535B9297879547B54C898BDA2C55C05B07C34609521F022013496CE02FFA94890364FE7BDA3BD4A0CEFED5CF9DD458B072F003C153BCEA92"
      }
    }
  ]
}
{
  "Flags": 0,
  "Fee": 20000,
  "TransactionType": "Payment",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "Amount": "1000000",
  "Destination": "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  "Memos": [
    {
      "Memo": {
        "MemoData": "6d756c74697369676e6564207061796d656e742074657374"
      }
    }
  ],
  "Sequence": 24,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3044022023CCB793A4AC5912B4CD7BEFD769B30DED870634E94C2C127DCA7572C6B62A060220790AC05A5D2B9CB5BBFCCBCECC0F18A4B6202FBB8E2B4F82D14353A32F16F5DA"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "304402204DEA0D84FCCA5D3181D2535B9297879547B54C898BDA2C55C05B07C34609521F022013496CE02FFA94890364FE7BDA3BD4A0CEFED5CF9DD458B072F003C153BCEA92"
      }
    }
  ]
}
{
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  tx_blob: '120000220000000024000000186140000000000F4240684000000000004E20730081144EFA5550AA0B6A0C06793161C0D2EDC635469AC883141359AA928F4D98FDB3D93E8B690C80D37DED11C3F9EA7D186D756C74697369676E6564207061796D656E742074657374E1F1FCED7321028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF74463044022023CCB793A4AC5912B4CD7BEFD769B30DED870634E94C2C127DCA7572C6B62A060220790AC05A5D2B9CB5BBFCCBCECC0F18A4B6202FBB8E2B4F82D14353A32F16F5DA811423A7CE52916DFDE210D371CF8487CFDB790B1DCBE1ED7321022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C267446304402204DEA0D84FCCA5D3181D2535B9297879547B54C898BDA2C55C05B07C34609521F022013496CE02FFA94890364FE7BDA3BD4A0CEFED5CF9DD458B072F003C153BCEA92811482D518A6A562B198E72BC1B8976F83D996E3CCD5E1F1',
  tx_json: {
    Account: 'j3UbbRX36997CWXqYqLUn28qH55v9Dh37n',
    Amount: '1000000',
    Destination: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Fee: '20000',
    Flags: 0,
    Memos: [ [Object] ],
    Sequence: 24,
    Signers: [ [Object], [Object] ],
    SigningPubKey: '',
    TransactionType: 'Payment',
    hash: '7FA74E186AA850773A40E8E591F8E3AEB78777D4E0D9F38974E33441FE55E92E'
  }
}
{
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "Amount": "1000000",
  "Destination": "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  "Fee": "20000",
  "Flags": 0,
  "Memos": [
    {
      "Memo": {
        "MemoData": "6D756C74697369676E6564207061796D656E742074657374"
      }
    }
  ],
  "Sequence": 24,
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3044022023CCB793A4AC5912B4CD7BEFD769B30DED870634E94C2C127DCA7572C6B62A060220790AC05A5D2B9CB5BBFCCBCECC0F18A4B6202FBB8E2B4F82D14353A32F16F5DA"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "304402204DEA0D84FCCA5D3181D2535B9297879547B54C898BDA2C55C05B07C34609521F022013496CE02FFA94890364FE7BDA3BD4A0CEFED5CF9DD458B072F003C153BCEA92"
      }
    }
  ],
  "SigningPubKey": "",
  "TransactionType": "Payment",
  "hash": "7FA74E186AA850773A40E8E591F8E3AEB78777D4E0D9F38974E33441FE55E92E"
}
```

##### 返回结果说明

| 参数                                                                | 类型    |                                                                               说明 |
| ------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------: |
| engine_result                                                       | String  |                                                                           请求结果 |
| engine_result_code                                                  | Array   |                                                                       请求结果编码 |
| engine_result_message                                               | String  |                                                              请求结果 message 信息 |
| tx_blob                                                             | String  |                                                                16 进制签名后的交易 |
| tx_json                                                             | Object  |                                                                           交易内容 |
| &nbsp;&nbsp;&nbsp;Account                                           | String  |                                                                     交易源账号地址 |
| &nbsp;&nbsp;&nbsp;Fee                                               | String  |                                                                             交易费 |
| &nbsp;&nbsp;&nbsp;Flags                                             | Integer |                                                                           交易标记 |
| &nbsp;&nbsp;&nbsp;Sequence                                          | Integer |                                                                         单子序列号 |
| &nbsp;&nbsp;&nbsp;--                                                | --      | 相关交易对应的其他字段，如 Payment 类型有 Amount、Destination 字段，这里不一一列举 |
| &nbsp;&nbsp;&nbsp;Signers                                           | Array   |                                               签名列表条目；销毁列表时，没有该字段 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Signer                          | Object  |                                                                       单个签名条目 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Account       | String  |                                                             给该交易签名的账号地址 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SigningPubKey | String  |                                                             给该交易签名的账号公钥 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TxnSignature  | String  |                                                     Account 账号给该交易的交易签名 |
| &nbsp;&nbsp;&nbsp;SigningPubKey                                     | String  |                                                       交易签名公钥，必须为空字符串 |
| &nbsp;&nbsp;&nbsp;TransactionType                                   | String  |                                                                           交易类型 |
| &nbsp;&nbsp;&nbsp;hash                                              | String  |                                                    交易 hash，该 hash 可在链上查到 |
