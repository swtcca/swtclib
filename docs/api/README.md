# SWTC-API

## [jingtum-api 官方文档](http://developer.jingtum.com/api2_doc.html)

## swtc-api 接口说明

> ### swtc-api 对 jingtum-api 作出包装， 消除不安全操作 并且提供类似 swtc-lib 的接口支持 jingtum-api 缺失的操作
>
> ### 强制本地签名
>
> ### 合约测试只能在特定节点运行, solidity 支持到 0.5.4, 需要安装 swtc-tum3 / tum3-eth-abi

## 目录

1. ### [安装](#installation)
2. ### [项目说明](#structure)
3. ### [创建钱包](#wallet)
4. ### [REMOTE 类](#remote)
   > ### 4.1 [创建 Remote 对象](#remoteCreate)
   >
   > ### 4.2 [获得账号余额](#getAccountBalances)
   >
   > ### 4.3 [获得账号支付信息](#getAccountPayment)
   >
   > ### 4.4 [获得账号支付记录](#getAccountPayments)
   >
   > ### 4.5 [获得账号挂单信息](#getAccountOrder)
   >
   > ### 4.6 [获得账号挂单列表](#getAccountOrders)
   >
   > ### 4.7 [获得账号交易信息](#getAccountTransaction)
   >
   > ### 4.8 [获得账号交易记录](#getAccountTransactions)
   >
   > ### 4.9 [获得货币对的挂单列表](#getOrderBooks)
   >
   > ### 4.10 [获得货币对的买单列表](#getOrderBooksBids)
   >
   > ### 4.11 [获得货币对的卖单列表](#getOrderBooksAsks)
   >
   > ### 4.12 [获得交易信息](#getTransaction)
   >
   > ### 4.13 [获得最新账本号](#getLedger)
   >
   > ### 4.14 [获得某一特定账本号](#getLedgerDetail)
   >
   > ### 4.15 [支付](#paymentTx)
   >
   > - 4.15.1 创建支付对象
   > - 4.15.2 提交支付
   >
   > ### 4.16 [设置关系](#relationTx)
   >
   > - 4.16.1 创建关系对象
   > - 4.16.2 关系设置
   >
   > ### 4.17 [设置账号属性 --- 待完善](#accountSetTx)
   >
   > - 4.17.1 创建属性对象
   > - 4.17.2 属性设置
   >
   > ### 4.18 [挂单](#offerCreate)
   >
   > - 4.18.1 创建挂单对象
   > - 4.18.2 提交挂单
   >
   > ### 4.19 [取消挂单](#offerCancel)
   >
   > - 4.19.1 创建取消挂单对象
   > - 4.19.2 取消挂单
   >
   > ### 4.20 [部署合约 lua](#contractDeploy)
   >
   > - 4.20.1 创建部署合约对象
   > - 4.20.2 部署合约
   >
   > ### 4.21 [调用合约 lua](#contractCall)
   >
   > - 4.21.1 创建执行合约对象
   > - 4.21.2 执行合约
   >
   > ### 4.22 [设置挂单佣金](#buildBrokerageTx)
   >
   > - 4.22.1 创建挂单佣金对象
   > - 4.22.2 设置挂单佣金
   >
   > ### 4.23 [部署合约 solidity](#initContract)
   >
   > - 4.23.1 创建部署合约对象
   > - 4.23.2 部署合约
   >
   > ### 4.24 [调用合约 solidity](#invokeContract)
   >
   > - 4.24.1 创建执行合约对象
   > - 4.24.2 执行合约
5. ### [本地签名和可选参数](#localSignOptionalParams)
   > ### 5.1 [本地签名](#localSign)
   >
   > ### 5.2 [可选参数](#optionalParameters)
6. ### [交易信息](#transaction)
7. ### 工具类 swtc-utils 类是工具类
8. ### [底层常见错误附录](#errors)
9. ### [solidity erc20 源码](#erc20src)
10. ### [solidity erc721 源码](#erc721src)

## <a name="installation"></a>1 安装

1. 安装库

```bash
npm install --save swtc-api
```

## <a name="structure"></a>2 项目说明

> ### swtc-api 库操作 jingtum-api 提供的 restapi, 但是实现了本地签名， 避免密钥传输到网络上
>
> ### swtc-api 提供比 jingtum-api 更多的操作

## <a name="wallet"></a>3 创建钱包

> ### 首先引入 swtc-api 库的 Wallet 对象，然后使用以下两种方法创建钱包
>
> ### 方法 1: Wallet.generate()
>
> ### 方法 2: Wallet.fromSecret(secret);

### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |

```javascript
//创建Wallet对象
var japi = require("swtc-api");
var Wallet = japi.Remote.Wallet;
//方式一
var w1 = Wallet.generate();

console.log(w1);
//方式二
var w2 = Wallet.fromSecret("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C");
console.log(w2);
```

### 返回的结果信息:

| 参数    | 类型   |         说明 |
| ------- | ------ | -----------: |
| secret  | String | 井通钱包私钥 |
| address | String | 井通钱包地址 |

### 输出

```javascript
> Wallet.generate()
{ secret: 'ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C',
  address: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz' }
```

## <a name="remote"></a>4 REMOTE 类

### Remote 是跟 jingtum-api 的 restapi 交互的类，它包装所有 jingtum-api 提供的方法, 还提供额外的类似 swtc-lib 的接口

- Remote(options)
- getAccountBalances(address)
- getAccountPayment(address, hash)
- getAccountPayments(address)
- postAccountPayments(address, options) 不安全
- getAccountOrder(address, hash)
- getAccountOrders(address)
- postAccountOrders(address, options) 不安全
- getAccountTransaction(address, hash)
- getAccountTransactions(address)
- getTransaction(hash)
- getLedger()
- getLedger(hash_or_index)
- getOrderBooks(base, counter)
- getOrderBooksBids(base, counter)
- getOrderBooksAsks(base, counter)
- postAccountContractDeploy(address, options) 不安全
- postAccountContractCall(address, options) 不安全
- buildPaymentTx(options)
- buildRelationTx(options)
- buildAccountSetTx(options)
- buildOfferCreateTx(options)
- buildOfferCancelTx(options)
- buildContractDeployTx(options)
- buildContractCallTx(options)

### swtc-api REMOTE 独享

- buildContractInitTx(options)
- buildContractInvokeTx(options)
- makeCurrency()
- makeAmount()
- txSignPromise()
- txSubmitPromise()
- tx.signPromise()
- tx.submitPromise()

### <a name="remoteCreate"></a>4.1 创建 Remote 对象

#### 方法:new Remote(options);

#### 参数:

| 参数     | 类型    |                   说明 |
| -------- | ------- | ---------------------: |
| server   | String  | 井通 rest api 服务地址 |
| issuer   | String  |               默认银关 |
| solidity | Boolean |     启用 solidity 支持 |

#### 例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
```

### <a name="getAccountBalances"></a> 4.2 获得账号余额

#### 方法:remote.getAccountBalances(address);

#### 参数:

| 参数    | 类型   |         说明 |
| ------- | ------ | -----------: |
| address | String | 井通钱包地址 |

#### [可选参数:](#optionalParameters)

| 参数     | 类型   |                       说明 |
| -------- | ------ | -------------------------: |
| currency | String |     指定返回对应货币的余额 |
| issuer   | String | 指定返回对应银关发行的货币 |

#### 返回: Promise - json

#### 例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
remote
  .getAccountBalances("jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz")
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

```javascript
> { success: true,
  status_code: '0',
  balances:
   [ { value: '10499.851252',
       currency: 'SWT',
       issuer: '',
       freezed: '51' },
     { value: '95.955000182',
       currency: 'CNY',
       issuer: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
       freezed: '2.000000' } ],
  sequence: 976 }
```

#### 返回结果说明

| 参数                       | 类型    |                               说明 |
| -------------------------- | ------- | ---------------------------------: |
| success                    | Boolean |                           请求结果 |
| balances                   | Array   |                           余额数组 |
| &nbsp;&nbsp;&nbsp;value    | String  |                               余额 |
| &nbsp;&nbsp;&nbsp;currency | String  | 货币名称，三个字母或 20 字节的货币 |
| &nbsp;&nbsp;&nbsp;issuer   | String  |                         货币发行方 |
| &nbsp;&nbsp;&nbsp;freezed  | String  |                         冻结的金额 |
| sequence                   | Integer |     当前交易序列号（用于本地签名） |

### <a name="getAccountPayment"></a> 4.3 获得账号支付信息

#### 方法:remote.getAccountPayment(address, hash);

#### 参数:

| 参数    | 类型   |             说明 |
| ------- | ------ | ---------------: |
| address | String | 支付用户钱包地址 |
| hash    | String |  支付交易的 hash |

#### 返回: Promise - json

#### 例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
remote
  .getAccountPayment(
    "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
    "F500406922F8C0D71939EF3CA6232EA50C97C0B5BBC3777843EA0219C7EB22F1"
  )
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

```javascript
> { success: true,
  status_code: '0',
  date: 1559225370,
  hash:
   'F500406922F8C0D71939EF3CA6232EA50C97C0B5BBC3777843EA0219C7EB22F1',
  type: 'sent',
  fee: '0.01',
  result: 'tesSUCCESS',
  memos: [ 'hello memo' ],
  counterparty: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
  amount: { value: '1.999999', currency: 'SWT', issuer: '' },
  effects: [] }
```

#### 返回结果说明

| 参数         | 类型    |                              说明 |
| ------------ | ------- | --------------------------------: |
| success      | Boolean |                          请求结果 |
| date         | Integer |           支付时间，UNIXTIME 时间 |
| hash         | String  |                         支付 hash |
| type         | String  |        支付类型，sent 或 received |
| fee          | String  |                          支付费用 |
| result       | String  |                  支付的服务器结果 |
| memos        | Array   |           支付的备注，String 数组 |
| counterparty | String  |                          交易对家 |
| amount       | Object  |                          交易金额 |
| effects      | Array   | [支付的效果](#transactionEffects) |

### <a name="getAccountPayments"></a> 4.4 获得账号支付记录

#### 方法:remote.getAccountPayments(address);

#### 参数:

| 参数    | 类型   |             说明 |
| ------- | ------ | ---------------: |
| address | String | 支付用户钱包地址 |

#### 返回: Promise - json

#### 例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
remote
  .getAccountPayments("jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz")
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

```javascript
> { success: true,
  status_code: '0',
  marker: { ledger: 3345651, seq: 0 },
  payments:
   [ { date: 1559225370,
       hash:
        'F500406922F8C0D71939EF3CA6232EA50C97C0B5BBC3777843EA0219C7EB22F1',
       type: 'sent',
       fee: '0.01',
       result: 'tesSUCCESS',
       memos: [Array],
       counterparty: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
       amount: [Object],
       effects: [] },
     { date: 1559225350,
       hash:
        '624D13BC5B9E6EC1D470E9D53687445D50D60FD7728B2B5ADBA4D824891DC8E7',
       type: 'sent',
       fee: '0.01',
       result: 'tesSUCCESS',
       memos: [],
       counterparty: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
       amount: [Object],
       effects: [] } ] }
```

#### 返回结果说明

| 参数     | 类型    |                         说明 |
| -------- | ------- | ---------------------------: |
| success  | Boolean |                     请求结果 |
| payments | Array   | 支付历史, 同交易记录中的信息 |

### <a name="getAccountOrder"></a> 4.5 获得账号挂单信息

#### 方法:remote.getAccountOrder(address, hash);

#### 参数:

| 参数    | 类型   |            说明 |
| ------- | ------ | --------------: |
| address | String |  挂单方钱包地址 |
| hash    | String | 挂单交易的 hash |

#### 返回: Promise - json

#### 例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
remote
  .getAccountOrder(
    "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
    "AC1A4249608B7E5096557A922861600273ACDD4A7AE9BAFE7A585567BD87DCD2"
  )
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

```javascript
> { success: true,
  status_code: '0',
  hash:
   'AC1A4249608B7E5096557A922861600273ACDD4A7AE9BAFE7A585567BD87DCD2',
  fee: '0.01',
  action: 'sell',
  order:
   { account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     pair: 'CNY:jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS/SWT',
     amount: '0.009',
     price: '111.11111111111111111111',
     type: 'sell',
     sequence: 966 } }
```

#### 返回结果说明

| 参数                       | 类型    |                  说明 |
| -------------------------- | ------- | --------------------: |
| success                    | Boolean |              请求结果 |
| hash                       | String  |             交易 Hash |
| fee                        | String  |    交易费用，井通计价 |
| action                     | String  |        交易的动作类型 |
| order                      | Object  |          交易单子信息 |
| &nbsp;&nbsp;&nbsp;account  | String  |              交易帐号 |
| &nbsp;&nbsp;&nbsp;pair     | String  |          交易的货币对 |
| &nbsp;&nbsp;&nbsp;amount   | String  |            挂单的数量 |
| &nbsp;&nbsp;&nbsp;price    | String  |            挂单的价格 |
| &nbsp;&nbsp;&nbsp;type     | Integer | 交易类型，sell 或 buy |
| &nbsp;&nbsp;&nbsp;sequence | Integer |            交易序列号 |

### <a name="getAccountOrders"></a> 4.6 获得账号挂单列表

#### 方法:remote.getAccountOrders(address);

#### 参数:

| 参数    | 类型   |           说明 |
| ------- | ------ | -------------: |
| address | String | 挂单方钱包地址 |

#### 返回: Promise - json

#### 例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
remote
  .getAccountOrders("jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz")
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

```javascript
> { success: true,
  status_code: '0',
  orders:
   [ { type: 'buy',
       pair: 'CNY:jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS/SWT',
       amount: '0.007',
       price: '142.85714285714285714286',
       sequence: 190 },
     { type: 'buy',
       pair: 'CNY:jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS/SWT',
       amount: '0.007',
       price: '142.85714285714285714286',
       sequence: 191 },
     { type: 'buy',
       pair: 'CNY:jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS/SWT',
       amount: '0.007',
       price: '142.85714285714285714286',
       sequence: 192 },
     { type: 'sell',
       pair: 'SWT/CNY:jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
       amount: '1.000000',
       price: '0.01',
       sequence: 380 },
     { type: 'sell',
       pair: 'SWT/CNY:jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
       amount: '1.000000',
       price: '0.01',
       sequence: 394 },
     { type: 'sell',
       pair: 'SWT/CNY:jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
       amount: '1.000000',
       price: '0.01',
       sequence: 531 } ] }
```

#### 返回结果说明

| 参数    | 类型    |                     说明 |
| ------- | ------- | -----------------------: |
| success | Boolean |                 请求结果 |
| orders  | Array   | 挂单列表, 同挂单中的信息 |

### <a name="getAccountTransaction"></a> 4.7 获得账号交易信息

#### 方法:remote.getAccountTransaction(address, hash);

#### 参数:

| 参数    | 类型   |        说明 |
| ------- | ------ | ----------: |
| address | String |    钱包地址 |
| hash    | String | 交易的 hash |

#### 返回: Promise - json

#### 例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
remote
  .getAccountTransaction(
    "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
    "F500406922F8C0D71939EF3CA6232EA50C97C0B5BBC3777843EA0219C7EB22F1"
  )
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

```javascript
> { success: true,
  status_code: '0',
  transaction:
   { date: 1559225370,
     hash:
      'F500406922F8C0D71939EF3CA6232EA50C97C0B5BBC3777843EA0219C7EB22F1',
     type: 'sent',
     fee: '0.01',
     result: 'tesSUCCESS',
     memos: [ 'hello memo' ],
     counterparty: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
     amount: { value: '1.999999', currency: 'SWT', issuer: '' },
     effects: [],
     ledger: 3345654 } }
```

#### 返回结果说明

| 参数                           | 类型    |                            说明 |
| ------------------------------ | ------- | ------------------------------: |
| success                        | Boolean |                        请求结果 |
| transaction                    | Object  |                  具体的交易信息 |
| &nbsp;&nbsp;&nbsp;date         | Integer |              交易时间，UNIXTIME |
| &nbsp;&nbsp;&nbsp;hash         | Object  |                       交易 hash |
| &nbsp;&nbsp;&nbsp;type         | Object  |                        交易类型 |
| &nbsp;&nbsp;&nbsp;fee          | Object  |              交易费用，井通计价 |
| &nbsp;&nbsp;&nbsp;result       | Object  |                        交易结果 |
| &nbsp;&nbsp;&nbsp;counterparty | Object  |                        交易对家 |
| &nbsp;&nbsp;&nbsp;amount       | Object  |                        交易金额 |
| &nbsp;&nbsp;&nbsp;effects      | Object  | [交易效果](#transactionEffects) |

### <a name="getAccountTransactions"></a> 4.8 获得账号交易记录

#### 方法:remote.getAccountTransactions(address);

#### 参数:

| 参数    | 类型   |     说明 |
| ------- | ------ | -------: |
| address | String | 钱包地址 |

#### 返回: Promise - json

#### 例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
remote
  .getAccountTransactions("jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz", {
    results_per_page: 4
  })
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

```javascript
> { success: true,
  status_code: '0',
  marker: { ledger: 3345647, seq: 0 },
  transactions:
   [ { date: 1559225370,
       hash:
        'F500406922F8C0D71939EF3CA6232EA50C97C0B5BBC3777843EA0219C7EB22F1',
       type: 'sent',
       fee: '0.01',
       result: 'tesSUCCESS',
       memos: [Array],
       counterparty: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
       amount: [Object],
       effects: [] },
     { date: 1559225350,
       hash:
        '624D13BC5B9E6EC1D470E9D53687445D50D60FD7728B2B5ADBA4D824891DC8E7',
       type: 'sent',
       fee: '0.01',
       result: 'tesSUCCESS',
       memos: [],
       counterparty: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
       amount: [Object],
       effects: [] },
     { date: 1559225340,
       hash:
        '50B45492428ABFA037F57F24717DB590DD626E53F8FB7FDB037322297C5380AE',
       type: 'sent',
       fee: '0.01',
       result: 'tesSUCCESS',
       memos: [],
       counterparty: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
       amount: [Object],
       effects: [] },
     { date: 1559225310,
       hash:
        '1E2B5F1B2843BFB8442FD1B1DB92F2BFF740E2FFC6892738704E4589730F8D13',
       type: 'sent',
       fee: '0.01',
       result: 'tesSUCCESS',
       memos: [Array],
       counterparty: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
       amount: [Object],
       effects: [] } ] }

```

#### 返回结果说明

| 参数                           | 类型    |                                        说明 |
| ------------------------------ | ------- | ------------------------------------------: |
| success                        | Boolean |                                    调用结果 |
| marker                         | Object  |                                交易记录标记 |
| transactions                   | Array   |                          具体的交易信息数组 |
| &nbsp;&nbsp;&nbsp;date         | Integer |                          交易时间，UNIXTIME |
| &nbsp;&nbsp;&nbsp;hash         | String  |                                   交易 hash |
| &nbsp;&nbsp;&nbsp;type         | String  |                                    交易类型 |
| &nbsp;&nbsp;&nbsp;fee          | String  |                          交易费用，井通计价 |
| &nbsp;&nbsp;&nbsp;result       | String  |                                    交易结果 |
| &nbsp;&nbsp;&nbsp;memos        | String  |                                    交易备注 |
| &nbsp;&nbsp;&nbsp;counterparty | String  |                      交易对家，支付交易才有 |
| &nbsp;&nbsp;&nbsp;amount       | String  | 交易金额/挂单数量，支付交易或者挂单交易才有 |
| &nbsp;&nbsp;&nbsp;offertype    | String  |       挂单类型，sell 或者 buy，挂单交易才有 |
| &nbsp;&nbsp;&nbsp;pair         | String  |                  交易的货币对，挂单交易才有 |
| &nbsp;&nbsp;&nbsp;price        | String  |                    挂单的价格，挂单交易才有 |
| &nbsp;&nbsp;&nbsp;effects      | Object  |             [交易效果](#transactionEffects) |

### <a name="getOrderBooks"></a> 4.9 获得货币对的挂单列表

#### 方法:remote.getOrderBooks(base, counter);

#### 参数:

| 参数    | 类型   |                                                     说明 |
| ------- | ------ | -------------------------------------------------------: |
| base    | String | 基准货币（currency+counterparty），兼容 swt+counterparty |
| counter | String | 目标货币（currency+counterparty），兼容 swt+counterparty |

#### [可选参数:](#optionalParameters)

| 参数             | 类型    |                                     说明 |
| ---------------- | ------- | ---------------------------------------: |
| results_per_page | Integer | 返回的每页数据量，默认每页买卖单各 10 项 |
| page             | Integer |                   页码，默认从第一页开始 |

#### 返回: Promise - json

#### 例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
remote
  .getOrderBooks("SWT", "CNY+" + remote._issuer)
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

```javascript
> { success: true,
  status_code: '0',
  pair: 'SWT/CNY+jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
  bids: [],
  asks:
   [ { price: 0.00699,
       order_maker: 'jH6L8EzkgwMKWRmLVC4oLchqft4oNqUUj',
       sequence: 4,
       passive: false,
       sell: true,
       funded: 0.428572 },
     { price: 0.01,
       order_maker: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
       sequence: 380,
       passive: false,
       sell: true,
       funded: 1 },
     { price: 0.01,
       order_maker: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
       sequence: 394,
       passive: false,
       sell: true,
       funded: 1 },
     { price: 0.01,
       order_maker: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
       sequence: 531,
       passive: false,
       sell: true,
       funded: 1 },
     { price: 0.0124,
       order_maker: 'jQNdYXxgNHY49oxDL8mrjr7J6k7tdNy1kM',
       sequence: 6,
       passive: false,
       sell: true,
       funded: 100 },
     { price: 0.3,
       order_maker: 'jH6L8EzkgwMKWRmLVC4oLchqft4oNqUUj',
       sequence: 1,
       passive: false,
       sell: true,
       funded: 5 } ] }
```

#### 返回结果说明

| 参数                          | 类型    |                     说明 |
| ----------------------------- | ------- | -----------------------: |
| success                       | Boolean |                 请求结果 |
| pair                          | String  |               挂单货币对 |
| bids/asks                     | Array   |                   买入单 |
| &nbsp;&nbsp;&nbsp;price       | Object  |               该档的价格 |
| &nbsp;&nbsp;&nbsp;funded      | Integer | 实际中用户可以成交的金额 |
| &nbsp;&nbsp;&nbsp;order_maker | String  |                 挂单用户 |
| &nbsp;&nbsp;&nbsp;sequence    | String  |                 交易序号 |
| &nbsp;&nbsp;&nbsp;passive     | Boolean |       交易是否是被动交易 |

### <a name="getOrderBooksBids"></a> 4.10 获得货币对的买单列表

#### 方法:remote.getOrderBooksBids(base, counter);

#### 参数:

| 参数    | 类型   |                                                     说明 |
| ------- | ------ | -------------------------------------------------------: |
| base    | String | 基准货币（currency+counterparty），兼容 swt+counterparty |
| counter | String | 目标货币（currency+counterparty），兼容 swt+counterparty |

#### [可选参数:](#optionalParameters)

| 参数             | 类型    |                                 说明 |
| ---------------- | ------- | -----------------------------------: |
| results_per_page | Integer | 返回的每页数据量，默认每页买单 10 项 |
| page             | Integer |               页码，默认从第一页开始 |

#### 返回: Promise - json

#### 例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
remote
  .getOrderBooksBids("SWT", "CNY+" + remote._issuer)
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

```javascript
> { success: true,
  status_code: '0',
  pair: 'CNY+jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS/SWT',
  bids:
   [ { price: 142.85714,
       order_maker: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
       sequence: 190,
       passive: false,
       sell: false,
       funded: 0.007 },
     { price: 142.85714,
       order_maker: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
       sequence: 191,
       passive: false,
       sell: false,
       funded: 0.007 },
     { price: 142.85714,
       order_maker: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
       sequence: 192,
       passive: false,
       sell: false,
       funded: 0.007 },
     { price: 0.00045,
       order_maker: 'j3UcBBbes7HFgmTLmGkEQQShM2jdHbdGAe',
       sequence: 37,
       passive: false,
       sell: false,
       funded: 0.02 } ] }
```

#### 返回结果说明

| 参数                          | 类型    |                     说明 |
| ----------------------------- | ------- | -----------------------: |
| success                       | Boolean |                 请求结果 |
| pair                          | String  |               挂单货币对 |
| bids                          | Array   |                   买入单 |
| &nbsp;&nbsp;&nbsp;price       | Object  |               该档的价格 |
| &nbsp;&nbsp;&nbsp;funded      | Integer | 实际中用户可以成交的金额 |
| &nbsp;&nbsp;&nbsp;order_maker | String  |                 挂单用户 |
| &nbsp;&nbsp;&nbsp;sequence    | String  |                 交易序号 |
| &nbsp;&nbsp;&nbsp;passive     | Boolean |       交易是否是被动交易 |

### <a name="getOrderBooksAsks"></a> 4.11 获得货币对的卖单列表

#### 方法:remote.getOrderBooksAsks(base, counter);

#### 参数:

| 参数    | 类型   |                                                     说明 |
| ------- | ------ | -------------------------------------------------------: |
| base    | String | 基准货币（currency+counterparty），兼容 swt+counterparty |
| counter | String | 目标货币（currency+counterparty），兼容 swt+counterparty |

#### [可选参数:](#optionalParameters)

| 参数             | 类型    |                                 说明 |
| ---------------- | ------- | -----------------------------------: |
| results_per_page | Integer | 返回的每页数据量，默认每页卖单 10 项 |
| page             | Integer |               页码，默认从第一页开始 |

#### 返回: Promise - json

#### 例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
remote
  .getOrderBooksAsks("SWT", "CNY+" + remote._issuer)
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

```javascript
> { success: true,
  status_code: '0',
  pair: 'SWT/CNY+jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
  asks:
   [ { price: 0.00699,
       order_maker: 'jH6L8EzkgwMKWRmLVC4oLchqft4oNqUUj',
       sequence: 4,
       passive: false,
       sell: true,
       funded: 0.428572 },
     { price: 0.01,
       order_maker: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
       sequence: 380,
       passive: false,
       sell: true,
       funded: 1 },
     { price: 0.01,
       order_maker: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
       sequence: 394,
       passive: false,
       sell: true,
       funded: 1 },
     { price: 0.01,
       order_maker: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
       sequence: 531,
       passive: false,
       sell: true,
       funded: 1 },
     { price: 0.0124,
       order_maker: 'jQNdYXxgNHY49oxDL8mrjr7J6k7tdNy1kM',
       sequence: 6,
       passive: false,
       sell: true,
       funded: 100 },
     { price: 0.3,
       order_maker: 'jH6L8EzkgwMKWRmLVC4oLchqft4oNqUUj',
       sequence: 1,
       passive: false,
       sell: true,
       funded: 5 } ] }
```

#### 返回结果说明

| 参数                          | 类型    |                     说明 |
| ----------------------------- | ------- | -----------------------: |
| success                       | Boolean |                 请求结果 |
| pair                          | String  |               挂单货币对 |
| asks                          | Array   |                   卖出单 |
| &nbsp;&nbsp;&nbsp;price       | Object  |               该档的价格 |
| &nbsp;&nbsp;&nbsp;funded      | Integer | 实际中用户可以成交的金额 |
| &nbsp;&nbsp;&nbsp;order_maker | String  |                 挂单用户 |
| &nbsp;&nbsp;&nbsp;sequence    | String  |                 交易序号 |
| &nbsp;&nbsp;&nbsp;passive     | Boolean |       交易是否是被动交易 |

### <a name="getTransaction"></a> 4.12 获得某一交易信息

#### 方法:remote.getTransaction(hash);

#### 参数:

| 参数 | 类型   |        说明 |
| ---- | ------ | ----------: |
| hash | String | 交易的 hash |

#### 返回: Promise - json

#### 例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
remote
  .getTransaction(
    "F500406922F8C0D71939EF3CA6232EA50C97C0B5BBC3777843EA0219C7EB22F1"
  )
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

```javascript
> { success: true,
  status_code: '0',
  transaction:
   { date: 1559225370,
     hash:
      'F500406922F8C0D71939EF3CA6232EA50C97C0B5BBC3777843EA0219C7EB22F1',
     type: 'sent',
     fee: '0.01',
     result: 'tesSUCCESS',
     memos: [ 'hello memo' ],
     counterparty: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
     amount: { value: '1.999999', currency: 'SWT', issuer: '' },
     effects: [],
     ledger: 3345654 } }
```

#### 返回结果说明

| 参数                           | 类型    |                            说明 |
| ------------------------------ | ------- | ------------------------------: |
| success                        | Boolean |                        请求结果 |
| transaction                    | Object  |                  具体的交易信息 |
| &nbsp;&nbsp;&nbsp;date         | Integer |              交易时间，UNIXTIME |
| &nbsp;&nbsp;&nbsp;hash         | Object  |                       交易 hash |
| &nbsp;&nbsp;&nbsp;type         | Object  |                        交易类型 |
| &nbsp;&nbsp;&nbsp;fee          | Object  |              交易费用，井通计价 |
| &nbsp;&nbsp;&nbsp;result       | Object  |                        交易结果 |
| &nbsp;&nbsp;&nbsp;counterparty | Object  |                        交易对家 |
| &nbsp;&nbsp;&nbsp;amount       | Object  |                        交易金额 |
| &nbsp;&nbsp;&nbsp;effects      | Object  | [交易效果](#transactionEffects) |

### <a name="getLedger"></a> 4.13 获得最新帐本

#### 方法:remote.getLedger();

#### 参数: 无

#### 返回: Promise - json

#### 例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
remote
  .getLedger()
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

```javascript
> { success: true,
  status_code: '0',
  ledger_hash:
   '2C0D839779AB96E009F70CDC5CCFD7081F96671AF81952C25B9F782FA3978F6D',
  ledger_index: 3348251 }
```

#### 返回结果说明

| 参数         | 类型    |            说明 |
| ------------ | ------- | --------------: |
| success      | Boolean |        请求结果 |
| ledger_hash  | String  |       账本 hash |
| ledger_index | Integer | 账本号/区块高度 |

### <a name="getLedgerDetail"></a> 4.14 获得某一帐本及其交易信息

#### 方法:remote.getLedger(hash_or_index);

#### 参数:

| 参数          | 类型   |                      说明 |
| ------------- | ------ | ------------------------: |
| hash_or_index | string | 账本号/区块高度 或者 哈希 |

#### 返回: Promise - json

#### 例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
remote
  .getLedger(3348251)
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

```javascript
> { success: true,
  status_code: '0',
  accepted: true,
  account_hash:
   '9210C4928F284B81CF5CF6877FAA74A2974F451EBD29D5912BDB6A7B9959632C',
  close_time: 612566540,
  close_time_human: '2019-May-30 21:22:20',
  close_time_resolution: 10,
  closed: true,
  hash:
   '2C0D839779AB96E009F70CDC5CCFD7081F96671AF81952C25B9F782FA3978F6D',
  ledger_hash:
   '2C0D839779AB96E009F70CDC5CCFD7081F96671AF81952C25B9F782FA3978F6D',
  ledger_index: '3348251',
  parent_hash:
   '6C1F3CC145764A154AB347AD6751680010A100325F87874843D26959A4151F96',
  seqNum: '3348251',
  totalCoins: '600000000000000000',
  total_coins: '600000000000000000',
  transaction_hash:
   '0000000000000000000000000000000000000000000000000000000000000000',
  transactions: [] }
```

#### 返回结果说明

| 参数                  | 类型    |               说明 |
| --------------------- | ------- | -----------------: |
| success               | Boolean |           请求结果 |
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

### <a name="paymentTx"></a> 4.15 支付

#### 首先通过 buildPaymentTx 方法返回一个 Transaction 对象，然后通过 submitPromise()方法提交支付信息。

#### <a name="paymentBuildTx"></a> 4.15.1 创建支付对象

##### 方法: remote.buildPaymentTx({});

##### 参数:

| 参数     | 类型   |                                         说明 |
| -------- | ------ | -------------------------------------------: |
| account  | String |                                     发起账号 |
| to       | String |                                     目标账号 |
| amount   | Object |                                     支付金额 |
| value    | String |                                     支付数量 |
| currency | String | 货币种类，三到六个字母或 20 字节的自定义货币 |
| issuer   | String |                                   货币发行方 |

##### 返回:Transaction 对象

#### <a name="paymentSubmit"></a> 4.15.2 提交支付

##### 方法:tx.submitPromise(secret, memo)

##### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |
| memo   | String |     备注信息 |

##### 返回: Promise

#### 支付完整例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
remote
  .buildPaymentTx({
    account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
    to: "jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D",
    amount: remote.makeAmount(0.02)
  })
  .submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C", "payment memo")
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

```javascript
> { success: true,
  status_code: '0',
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '120000220000000024000003D0614000000000004E206840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E157446304402202D56D65F47E41AA74D0DD4C3846AB4CC38F463C21DA95BD638EFCD5C5FA67EEA02205F097D65BD83C5D1AAE902BD9D017598BEF0E96F6E36327BFE6CB03D1C2CC27881141359AA928F4D98FDB3D93E8B690C80D37DED11C38314054FADDC8595E2950FA43F673F65C2009F58C7F1F9EA7D0C7061796D656E74206D656D6FE1F1',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Amount: '20000',
     Destination: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
     Fee: '10000',
     Flags: 0,
     Memos: [ [Object] ],
     Sequence: 976,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TransactionType: 'Payment',
     TxnSignature:
      '304402202D56D65F47E41AA74D0DD4C3846AB4CC38F463C21DA95BD638EFCD5C5FA67EEA02205F097D65BD83C5D1AAE902BD9D017598BEF0E96F6E36327BFE6CB03D1C2CC278',
     hash:
      'E6654E461447CA68BF4D6E5156D6E63078D3DED9ED8904CA5537A66DAE7DF0EF' } }
```

#### 返回结果说明

| 参数                              | 类型    |                  说明 |
| --------------------------------- | ------- | --------------------: |
| success                           | Boolean |              请求结果 |
| engine_result                     | String  |              请求结果 |
| engine_result_code                | Array   |          请求结果编码 |
| engine_result_message             | String  | 请求结果 message 信息 |
| tx_blob                           | String  |   16 进制签名后的交易 |
| tx_json                           | Object  |              交易内容 |
| &nbsp;&nbsp;&nbsp;Account         | String  |              账号地址 |
| &nbsp;&nbsp;&nbsp;Amount          | String  |              交易金额 |
| &nbsp;&nbsp;&nbsp;Destination     | String  |                  对家 |
| &nbsp;&nbsp;&nbsp;Fee             | String  |                交易费 |
| &nbsp;&nbsp;&nbsp;Flags           | Integer |              交易标记 |
| &nbsp;&nbsp;&nbsp;Memos           | Array   |                  备注 |
| &nbsp;&nbsp;&nbsp;Sequence        | Integer |            单子序列号 |
| &nbsp;&nbsp;&nbsp;SigningPubKey   | Object  |              签名公钥 |
| &nbsp;&nbsp;&nbsp;TransactionType | String  |              交易类型 |
| &nbsp;&nbsp;&nbsp;TxnSignature    | String  |              交易签名 |
| &nbsp;&nbsp;&nbsp;hash            | String  |             交易 hash |

### <a name="relationTx"></a> 4.16 设置关系

#### 首先通过 buildRelationTx 方法返回一个 Transaction 对象，然后通过 submitPromise()方法提交支付信息。目前支持的关系类型:信任(trust)、授权(authorize)、冻结 (freeze)

#### <a name="relationBuildTx"></a> 4.16.1 创建关系对象

##### 方法:remote.buildRelationTx({});

##### 参数

| 参数     | 类型   |                                         说明 |
| -------- | ------ | -------------------------------------------: |
| type     | String |                                     关系种类 |
| account  | String |                             设置关系的源账号 |
| target   | String |                     目标账号，授权和冻结才有 |
| limit    | Object |                                     关系金额 |
| value    | String |                                         数量 |
| currency | String | 货币种类，三到六个字母或 20 字节的自定义货币 |
| issuer   | String |                                   货币发行方 |

##### 返回:Transaction 对象

#### <a name="relationSubmit"></a> 4.16.2 关系设置

##### 方法:tx.submitPromise(secret, memo)

##### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |
| memo   | String |     备注信息 |

##### 返回: Promise

#### 设置关系完整例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
let options = {
  account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  target: "jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D",
  limit: remote.makeAmount(1, "CNY"),
  type: "authorize"
};
let tx = remote.buildRelationTx(options);
tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C", "授权")
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

```javascript
> { success: true,
  status_code: '0',
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '120015220000000024000003D120230000000163D4838D7EA4C68000000000000000000000000000434E5900000000007478E561645059399B334448F7544F2EF308ED326840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574463044022046585A2EA1D1E21D1DF797D5614FC4CA2BE549C2235B43BE75C896DCFB6CE65902203230FFE3A4B17B29E9EFE29F70CF8E842F928D8F322FF580BBD8A93DFFEEDA5281141359AA928F4D98FDB3D93E8B690C80D37DED11C38714054FADDC8595E2950FA43F673F65C2009F58C7F1F9EA7D06E68E88E69D83E1F1',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Fee: '10000',
     Flags: 0,
     LimitAmount:
      { currency: 'CNY',
        issuer: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
        value: '1' },
     Memos: [ [Object] ],
     RelationType: 1,
     Sequence: 977,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     Target: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
     TransactionType: 'RelationSet',
     TxnSignature:
      '3044022046585A2EA1D1E21D1DF797D5614FC4CA2BE549C2235B43BE75C896DCFB6CE65902203230FFE3A4B17B29E9EFE29F70CF8E842F928D8F322FF580BBD8A93DFFEEDA52',
     hash:
      '17B58B5BA0109327ABA5C571C7370E7E9EA3A714D1F3F9EB959D51702F3B19A1' } }
```

#### 返回结果说明

| 参数                             | 类型    |                                                          说明 |
| -------------------------------- | ------- | ------------------------------------------------------------: |
| success                          | Boolean |                                                      请求结果 |
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

### <a name="accountSetTx"></a> 4.17 设置账号属性 ------待完善

#### 首先通过 buildAccountSetTx 方法返回一个 Transaction 对象，然后通过 submitPromise()方法设置账号属性。目前支持的三类:`property`、`delegate` 、`signer`。property 用于设置账号一般属性;delegate 用于某账号设置委托帐户;signer 用于设置签名。

#### <a name="accountSetBuild"></a>4.17.1 创建属性对象

##### 方法:remote.buildAccountSetTx({});

##### 参数:

| 参数     | 类型   |             说明 |
| -------- | ------ | ---------------: |
| type     | String |         属性种类 |
| account  | String | 设置属性的源账号 |
| set_flag | String |         属性编号 |

##### 返回:Transaction 对象

#### <a name="accountSetSubmit"></a>4.17.2 属性设置

##### 方法:tx.submitPromise(secret, memo)

##### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |
| memo   | String |     备注信息 |

##### 返回: Promise

#### 设置属性完整例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
let options = {
  account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  type: "property"
};
var tx = remote.buildAccountSetTx(options);
tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

```javascript
> { success: true,
  status_code: '0',
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '120003220000000024000003D26840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100C5D9C036DB7C6935BF0262C4DB02A10EADCDD9951E6F65B0F8C6F4F6990C3AA80220428AE8BFEB2C460EFDA37955ADD1DF8D19F80CC2783CB9DA11BAB0FE3A6E7E8181141359AA928F4D98FDB3D93E8B690C80D37DED11C3',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Fee: '10000',
     Flags: 0,
     Sequence: 978,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TransactionType: 'AccountSet',
     TxnSignature:
      '3045022100C5D9C036DB7C6935BF0262C4DB02A10EADCDD9951E6F65B0F8C6F4F6990C3AA80220428AE8BFEB2C460EFDA37955ADD1DF8D19F80CC2783CB9DA11BAB0FE3A6E7E81',
     hash:
      'AE6395C75582077ACDE786FA2001360D9843BBF972163B7C7CDCB0BD8FB472FE' } }
```

### <a name="offerCreate"></a> 4.18 挂单

#### 首先通过 buildOfferCreateTx 方法返回一个 Transaction 对象，然后通过通过.submitPromise()方法提交挂单。

#### <a name="offerCreateBuild"></a> 4.18.1 创建挂单对象

##### 方法:remote.buildOfferCreateTx({});

##### 参数:

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

##### 返回:Transaction 对象

#### <a name="offerCreateSubmit"></a> 4.18.2 提交挂单

##### 方法:tx.submitPromise(secret, memo)

##### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |
| memo   | String |     备注信息 |

##### 返回: Promise

#### 设置属性完整例子

#### 挂单完整例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
let options = {
  type: "Sell",
  account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  taker_pays: remote.makeAmount(0.01, "CNY"),
  taker_gets: remote.makeAmount(1)
};
let tx = remote.buildOfferCreateTx(options);
tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
  .then(console.log)
  .catch(console.error);
```

##### 返回结果:

```javascript
> { success: true,
  status_code: '0',
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '120007220008000024000003D364D4038D7EA4C68000000000000000000000000000434E5900000000007478E561645059399B334448F7544F2EF308ED326540000000000F42406840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574463044022038C287B02FB21AC10ADFCBC2EE5EDCFADE12F840C28AFA4E793F273FDC8141A90220058864F25986C8B0595A5FA327A919B72937971061FB2113A7B1313AB9E3FAEE81141359AA928F4D98FDB3D93E8B690C80D37DED11C3',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Fee: '10000',
     Flags: 524288,
     Sequence: 979,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TakerGets: '1000000',
     TakerPays:
      { currency: 'CNY',
        issuer: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
        value: '0.01' },
     TransactionType: 'OfferCreate',
     TxnSignature:
      '3044022038C287B02FB21AC10ADFCBC2EE5EDCFADE12F840C28AFA4E793F273FDC8141A90220058864F25986C8B0595A5FA327A919B72937971061FB2113A7B1313AB9E3FAEE',
     hash:
      '796D47FBD3001FF7B196E752A123ED79505E234F9FE511C44B2E592CDABE8B31' } }
```

##### 返回结果说明:

| 参数                                         | 类型    |                                                          说明 |
| -------------------------------------------- | ------- | ------------------------------------------------------------: |
| success                                      | Boolean |                                                      请求结果 |
| engine_result                                | String  |                                                      请求结果 |
| engine_result_code                           | Array   |                                                  请求结果编码 |
| engine_result_message                        | String  |                                         请求结果 message 信息 |
| tx_blob                                      | String  |                                           16 进制签名后的交易 |
| tx_json                                      | Object  |                                                      交易内容 |
| &nbsp;&nbsp;&nbsp;Account                    | String  |                                                      账号地址 |
| &nbsp;&nbsp;&nbsp;Fee                        | String  |                                                        交易费 |
| &nbsp;&nbsp;&nbsp;Flags                      | Integer |                                                      交易标记 |
| &nbsp;&nbsp;&nbsp;Sequence                   | Integer |                                                    单子序列号 |
| &nbsp;&nbsp;&nbsp;SigningPubKey              | String  |                                                      签名公钥 |
| &nbsp;&nbsp;&nbsp;TakerGets                  | Object  |                                                    对家得到的 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;currency | String  |                                                          货币 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;issuer   | String  |                                                    货币发行方 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;value    | String  |                                                          额度 |
| &nbsp;&nbsp;&nbsp;TakerPays                  | String  |                                                   对家支付的; |
| &nbsp;&nbsp;&nbsp;Timestamp                  | Integer |                                                        时间戳 |
| &nbsp;&nbsp;&nbsp;TransactionType            | String  | 交易类型:TrustSet 信任;RelationDel 解冻;RelationSet 授权/冻结 |
| &nbsp;&nbsp;&nbsp;TxnSignature               | String  |                                                      交易签名 |
| &nbsp;&nbsp;&nbsp;hash                       | String  |                                                     交易 hash |

### <a name="offerCancel"></a> 4.19 取消挂单

#### 首先通过 buildOfferCancelTx 方法返回一个 Transaction 对象，然后通过 submitPromise()方法取消挂单。

#### 4.19.1 <a name="offerCancelBuild"></a> 创建取消挂单对象

#### 方法:remote.buildOfferCancelTx({});

#### 参数:

| 参数     | 类型    |         说明 |
| -------- | ------- | -----------: |
| account  | String  |              | 挂单方账号 |
| sequence | Integer | 取消的单子号 |

#### 返回:Transaction 对象

#### <a name="offerCancelSubmit"></a> 4.19.2 取消挂单

##### 方法:tx.submitPromise(secret, memo)

##### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |
| memo   | String |     备注信息 |

##### 返回: Promise

#### 挂单完整例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
let options = { account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz", sequence: 979 };
let tx = remote.buildOfferCancelTx(options);
tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

```javascript
> { success: true,
  status_code: '0',
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '120008220000000024000003D42019000003D36840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100BA4DBA1D47DEE5C0A539479D1B24D966368187311D3B0D7FC2B6A32F135A422102206E16D95F4051412C87A04800BCF2CEE813BB82A62B5D9B0CAC933068ADF9B59C81141359AA928F4D98FDB3D93E8B690C80D37DED11C3',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Fee: '10000',
     Flags: 0,
     OfferSequence: 979,
     Sequence: 980,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TransactionType: 'OfferCancel',
     TxnSignature:
      '3045022100BA4DBA1D47DEE5C0A539479D1B24D966368187311D3B0D7FC2B6A32F135A422102206E16D95F4051412C87A04800BCF2CEE813BB82A62B5D9B0CAC933068ADF9B59C',
     hash:
      'B454B0282F30E9B18F550C18878B248DCD4ADCE417C8C61D0457F8EB3BCB4869' } }
```

#### 返回结果说明

| 参数                              | 类型    |                          说明 |
| --------------------------------- | ------- | ----------------------------: |
| success                           | Boolean |                      请求结果 |
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

### <a name="contractDeploy"></a>4.20 部署合约 lua

#### 首先通过 buildContractDeployTx (或者 deployContractTx)方法返回一个 Transaction 对象，然后通过 submitPromise()方法部署合约。

#### <a name="contractDeployBuild"></a>4.20.1 创建部署合约对象

##### 方法:remote.buildContractDeployTx({});

##### 参数:

| 参数    | 类型          |                        说明 |
| ------- | ------------- | --------------------------: |
| account | String        |              合约交易源账号 |
| amount  | String/Number |  支付金额(最多支持六位小数) |
| payload | String        | 智能合约代码(16 进制字符串) |

##### 可选参数:

| 参数   | 类型   |     说明 |
| ------ | ------ | -------: |
| params | String | 合约参数 |

#### 返回:Transaction 对象

#### <a name="contractDeploySubmit"></a> 4.20.2 部署合约

##### 方法:tx.submitPromise(secret, memo);

##### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |
| memo   | String |     备注信息 |

#### 部署合约完整例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var utils = Remote.utils;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
var options = {
  account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  amount: 10,
  payload: utils.stringToHex(
    "result={}; function Init(t) result=scGetAccountBalance(t) return result end; function foo(t) result=scGetAccountBalance(t) return result end;"
  ),
  params: ["jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz"]
};
var tx = remote.buildContractDeployTx(options);
tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

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

#### 返回结果说明

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

### <a name="contractCall"></a> 4.21 执行合约 lua

#### 首先通过 buildContractCallTx (或者 callContractTx)方法返回一个 Transaction 对象，然后通过通过 submitPromise()方法执行合约

#### <a name="contractCallBuild"></a> 4.21.1 创建执行合约对象

##### 方法:remote.buildContractCallTx({});

##### 参数:

| 参数        | 类型   |           说明 |
| ----------- | ------ | -------------: |
| account     | String | 合约交易源账号 |
| destination | String |       合约地址 |
| foo         | String |     合约函数名 |

##### 可选参数:

| 参数   | 类型   |     说明 |
| ------ | ------ | -------: |
| params | String | 合约参数 |

#### 返回:Transaction 对象

#### <a name="contractCallSubmit"></a> 4.21.2 执行合约

##### 方法:tx.submitPromise(secret, memo);

##### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |
| memo   | String |         留言 |

#### 执行合约完整例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
var options = {
  account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  destination: "jNdpxLQbmMMf4ZVXjn3nb98xPYQ7EpEpTN",
  foo: "foo",
  params: ["jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz"]
};
var tx = remote.buildContractCallTx(options);
tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

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

#### 返回结果说明

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

### <a name="buildBrokerageTx"></a> 4.22 设置挂单佣金

#### 首先通过 buildBrokerageTx 方法返回一个 Transaction 对象，然后通过 submitPromise()方法设置平台手续费

#### 4.22.1 创建挂单佣金对象

##### 方法: remote.buildBrokerageTx({})

##### 参数:

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

#### 4.22.2 设置挂单佣金

##### 方法:tx.submitPromise(secret, memo);

##### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |
| memo   | String |         留言 |

### <a name="initContract"></a>4.23 部署合约 Solidity 版

#### 首先通过 buildContractInitTx (或者 initContract)方法返回一个 Transaction 对象，然后通过 submitPromise()方法完成合约的部署

#### 4.23.1 创建合约部署对象

##### 方法:remote.initContract({});

##### 参数

| 参数    | 类型    |                       说明 |
| ------- | ------- | -------------------------: |
| account | String  |                 合约发布者 |
| amount  | Integer |                     手续费 |
| payload | String  | 合约编译后的 16 进制字节码 |
| abi     | Array   |                   合约 abi |
| params  | Array   |       可选，合约初始化参数 |

##### 返回:Transaction 对象

#### <a name="initContractSubmit"></a> 4.23.2 部署合约

##### 方法:tx.submitPromise(secret);

##### 参数: 密钥

| 参数   | 类型   |           说明 |
| ------ | ------ | -------------: |
| secret | String | 合约发布者私钥 |

##### 返回: Promise

#### 部署合约完整例子

```javascript
const japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  solidity: true
});
const v = {
  address: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  secret: "ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C"
};
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
    inputs: [{ name: "", type: "address" }, { name: "", type: "address" }],
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
];
const payload =
  "60806040526012600260006101000a81548160ff021916908360ff16021790555034801561002c57600080fd5b50604051610c7e380380610c7e8339810180604052606081101561004f57600080fd5b8101908080519060200190929190805164010000000081111561007157600080fd5b8281019050602081018481111561008757600080fd5b81518560018202830111640100000000821117156100a457600080fd5b505092919060200180516401000000008111156100c057600080fd5b828101905060208101848111156100d657600080fd5b81518560018202830111640100000000821117156100f357600080fd5b5050929190505050600260009054906101000a900460ff1660ff16600a0a8302600381905550600354600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555081600090805190602001906101759291906101d6565b50806001908051906020019061018c9291906101d6565b5033600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505061027b565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061021757805160ff1916838001178555610245565b82800160010185558215610245579182015b82811115610244578251825591602001919060010190610229565b5b5090506102529190610256565b5090565b61027891905b8082111561027457600081600090555060010161025c565b5090565b90565b6109f48061028a6000396000f3fe6080604052600436106100ae576000357c01000000000000000000000000000000000000000000000000000000009004806370a082311161007657806370a082311461020e5780638da5cb5b1461027357806395d89b41146102ca578063a9059cbb1461035a578063dd62ed3e146103b5576100ae565b806306fdde03146100b357806318160ddd14610143578063313ce5671461016e5780633ccfd60b1461019f578063675c7ae6146101a9575b600080fd5b3480156100bf57600080fd5b506100c861043a565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101085780820151818401526020810190506100ed565b50505050905090810190601f1680156101355780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561014f57600080fd5b506101586104d8565b6040518082815260200191505060405180910390f35b34801561017a57600080fd5b506101836104de565b604051808260ff1660ff16815260200191505060405180910390f35b6101a76104f1565b005b3480156101b557600080fd5b506101f8600480360360208110156101cc57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506105cf565b6040518082815260200191505060405180910390f35b34801561021a57600080fd5b5061025d6004803603602081101561023157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506105f0565b6040518082815260200191505060405180910390f35b34801561027f57600080fd5b50610288610608565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156102d657600080fd5b506102df61062e565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561031f578082015181840152602081019050610304565b50505050905090810190601f16801561034c5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561036657600080fd5b506103b36004803603604081101561037d57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506106cc565b005b3480156103c157600080fd5b50610424600480360360408110156103d857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506106db565b6040518082815260200191505060405180910390f35b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104d05780601f106104a5576101008083540402835291602001916104d0565b820191906000526020600020905b8154815290600101906020018083116104b357829003601f168201915b505050505081565b60035481565b600260009054906101000a900460ff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561054d57600080fd5b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f193505050501580156105cc573d6000803e3d6000fd5b50565b60008173ffffffffffffffffffffffffffffffffffffffff16319050919050565b60056020528060005260406000206000915090505481565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106c45780601f10610699576101008083540402835291602001916106c4565b820191906000526020600020905b8154815290600101906020018083116106a757829003601f168201915b505050505081565b6106d7338383610700565b5050565b6006602052816000526040600020602052806000526040600020600091509150505481565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415151561073c57600080fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015151561078a57600080fd5b600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205481600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020540111151561081857600080fd5b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401905081600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555080600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054600560008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054011415156109c257fe5b5050505056fea165627a7a72305820d122ff8ff7133c0852e95b8334f76d8f494b11ac94ac3c4b3409bad19f0d09340029";

let tx = remote.buildContractInitTx({
  account: v.address,
  amount: 10,
  payload,
  abi,
  params: [2000, "TestCurrency", "TEST1"]
});
tx.submitPromise(v.secret)
  .then(console.log)
  .catch(console.error);
```

#### 输出

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

### <a name="invokeContract"></a>4.24 调用合约(Solidity 版)

#### 首先通过 buildContractInvokeTx (或者 invokeContract)方法返回一个 Transaction 对象，然后通过 submitPromise()方法完成合约的调用。

#### 4.24.1 创建合约调用对象

##### 方法:remote.buildContractInvokeTx({})

##### 参数

| 参数        | 类型   |             说明 |
| ----------- | ------ | ---------------: |
| account     | String |       合约发布者 |
| destination | String |         合约帐号 |
| abi         | Array  |         合约 abi |
| func        | String | 合约函数名及参数 |

##### 返回:Transaction 对象

#### <a name="invokeContractSubmit"></a> 4.24.2 执行合约

##### 方法:tx.submitPromise(secret);

##### 参数:

| 参数   | 类型   |           说明 |
| ------ | ------ | -------------: |
| secret | String | 合约执行者私钥 |

##### 返回: Promise

##### 例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({ server: "https://tapi.jingtum.com", solidity: true });
const v = {
  address: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  secret: "ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C"
};
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
    inputs: [{ name: "", type: "address" }, { name: "", type: "address" }],
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
];
var destination = "jKPNruYVLQ7BthSA1EaFqDePX2gcVCjk5k";
let tx = remote.buildContractInvokeTx({
  account: v.address,
  destination,
  abi,
  func: `transfer("${destination}", 5)`
});
tx.submitPromise(v.secret)
  .then(console.log)
  .catch(console.error);
```

##### 输出

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

## <a name="localSignOptionalParams"></a>5 本地签名和可选参数

### <a name="localSign"></a>5.1 本地签名

#### 方法: postBlob(blob);

#### 参数:

| 参数 | 类型   |                 说明 |
| ---- | ------ | -------------------: |
| blob | Object | {blob: 'signedblob'} |

#### 返回: Promise - json

#### 例子

```javascript
var japi = require("swtc-api");
var Remote = japi.Remote;
var remote = new Remote({
  server: "https://tapi.jingtum.com",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
});
remote
  .postBlob({
    blob:
      "12001F220000000024000004172026000000016140000000000000006840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100FD7DF650C0C753C0589159C383A809C5F2DB7AA53705E1880EF882DFAB577EB702202A91F83336E81EA709C937E1C3DD531BBF52D9A39A386A5AEB49571F7D07F0B781141359AA928F4D98FDB3D93E8B690C80D37DED11C38314C9A6E277B39563107F89277EAF319F5952F5F5C0FEEF70138861393035396362623030303030303030303030303030303063396136653237376233393536333130376638393237376561663331396635393532663566356330363531336564613130303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303035041000E1F1"
  })
  .then(console.log)
  .catch(console.error);
```

#### 返回结果

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

### <a name="optionalParameters"></a>5.2 可选参数

#### 方法: .getXYZ()

#### 可选参数:

可选参数自身是一个 javascript 对象， 放在参数后面， 常见的包括
|参数|类型|说明|
|----|----|---:|
|results_per_page|Number|分页显示时每页显示的数目|
|page|Number|分页显示返回的页码|
|marker|Object|分页相关，位置标记|
|currency|String|通证代码|
|issuer|String|银关|

#### 返回: Promise - json

#### 例子

```javascript
remote.getAccountBalances("jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz", {
  currency: "CNY"
});
remote.getAccountOffers("jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz", {
  results_per_page: 100
});
```

## <a name="transaction"></a>6 交易记录信息

### 用户提交的交易类型主要有 Payment、OfferCreate、OfferCancel 和 RelationSet；

#### 交易信息存储在系统中，查询交易信息时，系统解析交易信息，将交易信息解析为主要有如下信息：

#### date 交易时间 UNIXTIME hash 交易 hash fee 交易费用 result 交易结果 client_resource_id 交易资源号 memos 交易的备注信息 type 交易类型

### type 有如下几种：

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

### <a name="transactionEffects"></a> 交易效果 effects

#### effects 是每个用户交易记录信息里面的交易效果，是个 JSON 数组，数字可以包含多项，每项内容都包含效果类型 effect 字段，根据 effect 的不同里面的内容也不同 ：

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

## <a name="errors"></a>7 错误信息

### 客户端错误 - ClientError

#### ClientError，此错误主要是客户端请求参数错误，包括井通地址格式不对，私钥格式不对，货币格式不对等以及根据每个接口提交的参数格式不对等导致的错误；

### 网络错误 - NetworkError

#### NetworkError，此错误主要是网络错误，包括链接井通网络没有连上，请求服务超时等；

### 交易错误 - Transaction Error

#### TransactionError，此错误主要是重复资源号的错误，即 DuplicateTransactionError；

### 服务端错误 - ServerError

#### ServerError，此错误主要是后台程序错误，包括代码 BUG、代码实现问题等；

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

## 9. <a name="erc20src"></a>erc20 源码

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
