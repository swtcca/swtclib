# SWTC-RPC

[[toc]]

## 0. 接口说明

::: tip

- 使用 rpc 接口，不依赖于 websocket
- 对于返回的内容不作进一步处理, 原生通证的单位通常是 `1e-6 swtc`,
- 所有 rpc 调用基于 Promise
- 安全，强制本地签名
- 隐藏不稳定调用 rpcLedgerEntry() rpcSkywellPathFind()
- 错误处理
- 所有 rpc 交互对应一个方法， 名字以`rpc`开头
- 所有 rpc 交互对应一个等价方法， 名字以`get`开头, 将最有意义的参数（若不多于两个）单独提前 （submit/submitMultisigned 省略`get`）
- 提供一部分额外方法，以便捷或者保持和其它库相似性为目的

参考

- https://xrpl.org/public-rippled-methods.html
- https://github.com/jingtum/jingtum-core
  :::

## 1 安装

1. 安装 SWTC 公链库(rpc)

```bash
npm install --save @swtc/rpc
```

## 2 项目文件结构

##### @swtc/rpc 库基于 rpc 协议跟底层交互，内部实现我们包装的是流行的`axios`库

## 3 创建钱包

::: tip

##### 首先引入@swtc/rpc 库的 Wallet 对象，然后使用以下两种方法创建钱包

##### 方法 1: Wallet.generate()

##### 方法 2: Wallet.fromSecret(secret);

:::

##### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |

::: details 代码示例

```javascript
//创建Wallet对象
var jlib = require("@swtc/lib")
var Wallet = jlib.Wallet
//方式一
var w1 = Wallet.generate()

console.log(w1)
//方式二
var w2 = Wallet.fromSecret("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
var w3 = Wallet.fromSecret("ssLX1xmdj51Gu4BemCKb1ZKhFTjec")
var w4 = Wallet.fromSecret("snaSEqR4cTU6stvgtQKjq9FNPet8m")
console.log(w2)
console.log(w3)
```

:::

##### 返回的结果信息:

| 参数    | 类型   |         说明 |
| ------- | ------ | -----------: |
| secret  | String | 井通钱包私钥 |
| address | String | 井通钱包地址 |

::: details 代码输出

```javascript
> Wallet.generate()
{ secret: 'ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C',
  address: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz' }
```

:::

## 4 rpc 交互

### 4.1 Remote 对象

::: tip
Remote 是与节点 rpc 交互的抽象类
:::
::: details 实例化 Remote

```javascript
const Remote = require("@swtc/rpc").Remote
const remote = new Remote({ server: "http://swtclib.ca:5050" })
remote.config()
```

输出

```javascript
{
  server: 'http://swtclib.ca:5050',
  token: 'SWT',
  solidity: false,
  issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
  backend: 'rpc'
}
```

:::

#### 4.1.1 rpc 调用列表

- rpcVersion()
- rpcRandom()
- rpcServerInfo()
- rpcServerState()
- rpcLedgerClosed()
- rpcLedgerCurrent()
- rpcLedger(params: IRpcLedgerOptions = {})
- rpcLedgerData(params: IRpcLedgerDataOptions = {})
- rpcTxHistory(params: IRpcTxHistoryOptions = { start: 0 })
- rpcTx(params: IRpcTxOptions)
- rpcTxEntry(params: IRpcTxEntryOptions)
- rpcSubmit(params: IRpcSubmitOptions)
- rpcSubmitMultisigned(params: IRpcSubmitMultisignedOptions)
- rpcFeeInfo(params: IRpcFeeInfoOptions)
- rpcBlacklistInfo(params: IRpcBlacklistInfoOptions = {})
- rpcAccountInfo(params: IRpcAccountInfoOptions)
- rpcAccountObjects(params: IRpcAccountObjectsOptions)
- rpcAccountCurrencies(params: IRpcAccountCurrenciesOptions)
- rpcAccountLines(params: IRpcAccountLinesOptions)
- rpcAccountRelation(params: IRpcAccountRelationOptions)
- rpcAccountOffers(params: IRpcAccountOffersOptions)
- rpcAccountTx(params: IRpcAccountTxOptions)
- rpcBookOffers(params: IRpcBookOffersOptions)
- rpcLedgerEntry(params: IRpcLedgerEntryOptions = {})
- rpcSkywellPathFind(params: IRpcSkywellPathFindOptions)

#### 4.1.2 派生调用列表

- async getAccountBalances(address: string, params = {})
- async getAccountSequence(address: string, params = {})
- getAccountCurrencies(address: string, params = {})
- getAccountInfo(address: string, params = {})
- getAccountObjects(address: string, params = {})
- getAccountOffers(address: string, params = {})
- getAccountRelation(address: string, params = {})
- getAccountSignerList(address: string, params = {})
- getAccountTrusts(address: string, params = {})
- getAccountTx(address: string, params = {})
- getBlacklistInfo(params: IRpcBlacklistInfoOptions = {})
- getBookOffers(taker_gets: object, taker_pays: object, params = {})
- getBrokerage(address: string, params = {})
- getLedger(params: IRpcLedgerOptions = {})
- getLedgerClosed()
- getLedgerCurrent()
- getLedgerData(params: IRpcLedgerDataOptions = {})
- getLedgerEntry(params: IRpcLedgerEntryOptions = {})
- getRandom()
- getServerInfo()
- getServerState()
- getSkywellPathFind(params: IRpcSkywellPathFindOptions)
- getTx(transaction: string, params = {})
- getTxEntry(tx_hash: string, params = {})
- getTxHistory(start: number = 0, params = {})
- getVersion()

#### 4.1.3 事务创建列表

- buildPaymentTx(options: IPaymentTxOptions)
- buildOfferCreateTx(options: IOfferCreateTxOptions)
- buildOfferCancelTx(options: IOfferCancelTxOptions)
- buildRelationTx(options: IRelationTxOptions)
- buildAccountSetTx(options: IAccountSetTxOptions)
- buildSignTx(options: ISignTxOptions)
- buildContractDeployTx(options: IContractDeployTxOptions)
- buildContractCallTx(options: IContractCallTxOptions)
- buildContractInitTx(options: IContractInitTxOptions)
- buildContractInvokeTx(options: IContractInvokeTxOptions)
- buildBrokerageTx(options: IBrokerageTxOptions)
- buildSignerListTx(options: ISignerListTxOptions)
- buildTx(tx_json: object)

### 4.2 节点相关

#### 4.2.1 Remote.rpcServerInfo() 获取节点信息

::: tip 参数
无

等价

```typescript
public getServerInfo() {
  return this.rpcServerInfo()
}
```

:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcServerInfo().then(console.log)
Promise { <pending> }
> {
  info: {
    build_version: '0.28.1',
    complete_ledgers: '266955-17849981',
    hostid: 'BING',
    io_latency_ms: 1,
    last_close: { converge_time_s: 2.001, proposers: 8 },
    load_factor: 1,
    peers: 15,
    pubkey_node: 'n9LWVPJSuztHtgePSB4c8g37WUPM1EEphHjSY6si7jPeTqMbKmiM',
    server_state: 'full   11:52:25',
    startup_time: '2020-Dec-13 14:53:46',
    validated_ledger: {
      age: 5,
      base_fee_swt: 0.00001,
      fee_account_swt: 'jEoSyfChhUMzpRDttAJXuie8XhqyoPBYvV',
      hash: 'D335479AD59416E8CEA2B0286FBCD756C8FC818B83A8291E27E8B92A7249D602',
      issuerop_account: 'j4TVCesxU2s6tjYpsDoH4Pc81c4WMvNHPo',
      manager_account: 'jHZhYWj3kLvitkmqZan46FPkzbQYszuhvF',
      reserve_base_swt: 20,
      reserve_inc_swt: 5,
      seq: 17849981
    },
    validation_quorum: 5
  },
  status: 'success'
}
```

:::

#### 4.2.2 Remote.rpcServerState() 获取节点状态

::: tip 参数
无

等价

```typescript
public getServerState() {
  return this.rpcServerState()
}
```

:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcServerState().then(console.log)
Promise { <pending> }
> {
  state: {
    build_version: '0.28.1',
    complete_ledgers: '266955-17854908',
    io_latency_ms: 1,
    last_close: { converge_time: 2001, proposers: 9 },
    load_base: 256,
    load_factor: 256,
    peers: 15,
    pubkey_node: 'n9LWVPJSuztHtgePSB4c8g37WUPM1EEphHjSY6si7jPeTqMbKmiM',
    server_state: 'full   09:09:06',
    startup_time: '2020-Dec-13 14:53:46',
    validated_ledger: {
      base_fee: 10,
      close_time: 661710590,
      fee_account: 'jEoSyfChhUMzpRDttAJXuie8XhqyoPBYvV',
      hash: '1C681687739A2AE3CAC7BE4943F735BFC3B321110B7AE7158D1D3FBDEE2D1A7F',
      reserve_base: 20000000,
      reserve_inc: 5000000,
      seq: 17854908
    },
    validation_quorum: 5
  },
  status: 'success'
}
```

:::

### 4.3 帐本相关

#### 4.3.1 Remote.rpcLedgerClosed() 获取已关闭帐本信息

::: tip 参数
无

等价

```typescript
public getLedgerClosed() {
  return this.rpcLedgerClosed()
}
```

:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcLedgerClosed().then(console.log)
Promise { <pending> }
> {
  ledger_hash: '6D2FCA61969249A890452DBA50F2D665C413B6AC7CF8922B04CD5DA8BEF2CD2B',
  ledger_index: 17854964,
  status: 'success'
}
```

:::

#### 4.3.2 Remote.rpcLedgerCurrent() 获取当前帐本信息

::: tip 参数
无

等价

```typescript
public getLedgerCurrent() {
  return this.rpcLedgerCurrent()
}
```

:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcLedgerCurrent().then(console.log)
Promise { <pending> }
> { ledger_current_index: 17854969, status: 'success' }
```

:::

#### 4.3.3 Remote.rpcLedger(params: IRpcLedgerOptions) 获取帐本列表

::: tip 参数

```typescript
interface IRpcLedgerOptions {
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  expand?: boolean
  transactions?: boolean
  accounts?: boolean
  full?: boolean
  binary?: boolean
}
```

等价

```typescript
public getLedger(params: IRpcLedgerOptions = {}) {
  return this.rpcLedger(params)
}
```

````
:::
::: details 参数说明
| 参数          | 类型        | 解析
|--------------|-------------|-----|
| ledger_index | Uint/string | 指定查询账本,"validated","closed","current"或区块编号 |
| ledger_hash  | string      | 指定查询账本, 区块哈希 |
| accounts     | Boolean     | 可选参数，默认为假，如果设置为真，将返回账本中所有的账户信息，如 果没有指定账本，则会忽略。|
| full         | Boolean     | 可选参数，默认为假，设置为真时，将返回账本中的所有信息，如果没有 指定账本，则会忽略。|
| transactions | Boolean     | 可选参数，默认为假，设置为真时，将返回账本中所有的交易信息，如果 没有指定账本，则会忽略。|
| expand       | Boolean     | 可选参数，默认为假，设置为真时，将以 json 格式返回账户和交易信息， 但是如果账户和交易参数为假，这个值将会忽略。|
| binary       | Boolean     | 可选参数，默认为假，设置为真时，交易以原始编码返回|
| owner_funds  | Boolean     | 可选参数，默认为假，设置为真时，在交易元数据中的创建挂单的交易中 包含 owner_funds 字段。但是如果交易和 expand 参数为假时，将会忽略。|
:::
::: details 代码示例
```javascript
const Remote = require("@swtc/rpc").Remote
const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcLedger({ledger_index: "closed"}).then(console.log)
Promise { <pending> }
> {
  ledger: {
    accepted: true,
    account_hash: 'FF7B9EDCB820E7BF6C79FED8E77CEAD652A6CFACA40D5D9F4AB5C741DDB7A64B',
    close_time: 661661510,
    close_time_human: '2020-Dec-19 02:51:50',
    close_time_resolution: 10,
    closed: true,
    hash: '4B70E1B2C1C710A4B4546B39C2234303180CC9B4CFE128219B4DAF4B1102AC17',
    ledger_hash: '4B70E1B2C1C710A4B4546B39C2234303180CC9B4CFE128219B4DAF4B1102AC17',
    ledger_index: '17850000',
    parent_hash: '501B47BAB2276319BB5FFD024A2A67FE7063424F8BDCD1F5387188A974414BAC',
    seqNum: '17850000',
    totalCoins: '599999999999460713',
    total_coins: '599999999999460713',
    transaction_hash: '798E3F8953101B74C038FF81CD6A3E655F280927EDC6ABD08370B13F83D76933'
  },
  ledger_hash: '4B70E1B2C1C710A4B4546B39C2234303180CC9B4CFE128219B4DAF4B1102AC17',
  ledger_index: 17850000,
  status: 'success',
  validated: true
}

````

输出说明

```
键名              类型     解析
Ledger           Object   完整的账本头数据
Account_hash     String   该账本中所有账户状态信息的哈希，十六进制。
Account Array    Account  参数为真时有，账本中所有账户信息。
Close_time       Int      该账本的关闭时间，距离井通元年时间。
Close_time_human String   以标准时间形式显示账本关闭时间。
Close            Boolean  是否这个账本已经关闭
Ledger_hash      String   标识该账本的账本哈希
Ledger_index     Uint     账本序列号，可以通过该序列号引用该账本。参数 ledger_index 为"validated"时，返回值为当前最新区块。
Parent_hash      String   该账本父母账本的哈希。
Total_coins      Int      网络中所有的井通币数目
Transaction_hash String   该账本中所有交易的哈希。
Transaction      Array    Tranaction 参数为真时，账本中所有交易信息。
```

:::

#### 4.3.4 Remote.rpcLedgerData(params: IRpcLedgerDataOptions) 获取帐本数据

::: tip 参数

```typescript
interface IRpcLedgerDataOptions {
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  binray?: boolean
  limit?: number
  marker?: IMarker
}
```

等价

```typescript
public getLedgerData(params: IRpcLedgerDataOptions = {}) {
  return this.rpcLedgerData(params)
}
```

:::
::: details 参数说明
| 参数 | 类型 | 解析
|--------------|-------------|-----|
| ledger_index | Uint/string | 可选参数, 指定账本,"validated","closed","current"或区块编号 |
| ledger_hash | string | 可选参数, 指定账本, 区块哈希 |
| binary | Boolean | 可选参数，默认为假，设置为真时，以原始编码返回|
| limit | Number | 可选参数，返回数量|
| marker | IMarker | 可选参数，分页相关|
:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcLedgerData({limit: 2, binary: true}).then(console.log)
Promise { <pending> }
> {
  ledger_current_index: 17855102,
  ledger_hash: '72CA9373AFA1E894A61A700CA7936DDC3B8F5B5FEE53511E4F804B3BDE36F7A8',
  ledger_index: '17855102',
  marker: '0000072D097A02B52E70B09D1C9A2B4AF6C0A256DE4E50649C626F73903A6DF1',
  state: [
    {
      data: '110061220000000024000000012500B17A972D00000001559BBDDBE6996E16FD8AE87B6EE64997C98E16B59C246C173281A822F124DF1B66624000000002160EC081143BF0D3DC4719F3BD2221A7AAD216E16E8BD68EB9',
      index: '0000035323A056896406C8C16C21CB382175ADF83F41E14E91B4ADFD4B72743A'
    },
    {
      data: '11007222001100002500DA4F27370000000000000000380000000000008EC955126E65949BD9F9190AA9FF70F8502554E181BA444F5AC1AF3B38815CAF1184FA62D4838D7EA4C680000000000000000000000000004353500000000000000000000000000000000000000000000000000166D7038D7EA4C68000000000000000000000000000435350000000000002BF6C5E4E68145EF6F144165AB847BBD2302BB86780000000000000000000000000000000000000004353500000000000A582E432BFC48EEDEF852C814EC57F3CD2D41596',
      index: '000006B7C0C15ED622FC359154790CCF77898EF0B90B86A9E9D8863AE19D7D6B'
    }
  ],
  status: 'success',
  validated: false
}
```

:::

#### 4.3.5 Remote.rpcLedgerEntry(params: IRpcLedgerEntryOptions) 获取帐本数据

::: tip 参数

```typescript
interface IRpcLedgerEntryOptions {
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  binray?: boolean
  type?: string
  [key: string]: any
}
```

等价

```typescript
public getLedgerEntry(params: IRpcLedgerEntryOptions = {}) {
  return this.rpcLedgerEntry(params)
}
```

:::
::: details 参数说明
| 参数 | 类型 | 解析
|--------------|-------------|-----|
| ledger_index | Uint/string | 可选参数, 指定账本,"validated","closed","current"或区块编号 |
| ledger_hash | string | 可选参数, 指定账本, 区块哈希 |
| binary | Boolean | 可选参数，默认为假，设置为真时，以原始编码返回|
| limit | Number | 可选参数，返回数量|
| marker | IMarker | 可选参数，分页相关|
:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcLedgerEntry({type: "account_root", account_root: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz"}).then(console.log)
Promise { <pending> }
> {
  index: 'DB35CDEAF3F0D3C190B041C0C7D92FB0E43CBCBFAD4F498C28858A35CEA8BBB7',
  ledger_current_index: 17855371,
  node: {
    Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Balance: '52359960',
    Flags: 0,
    LedgerEntryType: 'AccountRoot',
    OwnerCount: 7,
    PreviousTxnID: '55791A6BD2C0D71D339B2366D9A60F2AB71829648EC8F0B10EBD941A5D663433',
    PreviousTxnLgrSeq: 17051932,
    Sequence: 109,
    index: 'DB35CDEAF3F0D3C190B041C0C7D92FB0E43CBCBFAD4F498C28858A35CEA8BBB7'
  },
  status: 'success',
  validated: false
}
```

:::

### 4.4 事务相关

#### 4.4.0 Remote.rpcSign() Remote.rpcSignFor() 服务器签名

::: danger
不安全操作，不予提供
:::

#### 4.4.1 Remote.rpcTxHistory(params: IRpcTxHistoryOptions) 获取最近事务列表

::: tip 参数

```typescript
export interface IRpcTxHistoryOptions {
  start?: number
}
```

等价

```typescript
public getTxHistory(params: IRpcTxHistoryOptions = {}) {
  return this.rpcTxHistory({start: 0, ...params})
}
```

:::
::: details 参数说明
| 参数 | 类型 | 解析
|--------------|-------------|-----|
| start | number | 可选参数，略过事务 |
:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcTxHistory().then(console.log)
Promise { <pending> }
> {
  index: 0,
  status: 'success',
  txs: [
    {
      Account: 'j35tEXrGej8U69ffiQSaXuxWBmq5oxSbCa',
      Amount: [Object],
      Destination: 'j36znoDj2V9YRvZprJgc3eFovxdbrebTqY',
      Fee: '20',
      Flags: 0,
      Memos: [Array],
      Sequence: 818,
      SigningPubKey: '02F3066AA10B81BDD088B6EE54C7BAE9E1EEB4F18C4F16CE4E115FA5800FB22E1D',
      TransactionType: 'Payment',
      TxnSignature: '3045022100FEA587BE9255AD240D1AF8F09CC1F959705D8613581CCD6F59815F369B4A9C3502206452C673BE62BD72752FFDCAAAD457A97FEB2AA181194F272015E728F6312955',
      hash: '6BB25BF815EE0A2339C951C6553ECC519BDB0B43A241E44AC0717793B2DDF3FF',
      inLedger: 17855666,
      ledger_index: 17855666
    },
    {
      Account: 'jKimtpPTnQyz2DrHBHhVuX5Zz8W4PNo6GA',
      Amount: [Object],
      Destination: 'jLHErZNEwevjzWXCqzAxcAid7TAG1NMjFj',
      Fee: '20',
      Flags: 0,
      Memos: [Array],
      Sequence: 463,
      SigningPubKey: '027C4F80C38CB4C2662F67FBB50A448F5B7B2D1993C9D7210DD84C19F6D2525464',
      TransactionType: 'Payment',
      TxnSignature: '304402207A6AFD08BCD15974A68F87F40CDAFFDBDCD239F79E1352B7BA69A04CD3A33F8902206C68EDCE9BA4703ADC1857B23834929E12FFF5C6A4FE2857C24558DCEFD83029',
      hash: '4816C3B849A96C68A3B11C1011CA75603D836AEB163E5F0C13F9F4A3EA905BDB',
      inLedger: 17855666,
      ledger_index: 17855666
    }
  ]
}
```

:::

#### 4.4.2 Remote.rpcTx(params: IRpcTxOptions) 获取事务内容

::: tip 参数

```typescript
export interface IRpcTxOptions {
  transaction: string
  binray?: boolean
  min_ledger?: number
  max_ledger?: number
}
```

等价

```typescript
public getTx(transaction: string, params: IRpcTxOptions = {transaction: ""}) {
  return this.rpcTx({ ...params, transaction })
}
```

:::
::: details 参数说明
| 参数 | 类型 | 解析
|--------------|-------------|-----|
| transaction | string | 指定事务哈希 |
| binary | Boolean | 可选参数，默认为假，设置为真时，以原始编码返回|
:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcTx({transaction: '1C955BFC05E5A434DF041C4E4AFA8891DF1AAFBE504707F01A94EBD0F0A76181'}).then(console.log)
Promise { <pending> }
> {
  Account: 'jasyAHN5mKpLJpefdnpyPeaihoTdsY5RUo',
  Amount: {
    currency: 'JEQC',
    issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
    value: '2.146'
  },
  Destination: 'jM6wEZJnHYWv6Vdy4skdhpb1xAUXGvf3uD',
  Fee: '10',
  Flags: 0,
  Memos: [ { Memo: [Object] } ],
  Sequence: 2,
  SigningPubKey: '022B17F87C523C1675BCE5BDCF0CB263159F28382C745AC13D64022DDAD7EFA332',
  TransactionType: 'Payment',
  TxnSignature: '3044022078DC1A37C8EEA61B93A1DF24F1102D1708F5A4F3A1D1D04BFF326C61541F2B8802203415FA3E32F857CC6FE593757D09D941F6608427644DF9C07AA64B7834B6B07F',
  date: 661161510,
  hash: '1C955BFC05E5A434DF041C4E4AFA8891DF1AAFBE504707F01A94EBD0F0A76181',
  inLedger: 17800000,
  ledger_index: 17800000,
  meta: {
    AffectedNodes: [ [Object], [Object], [Object], [Object] ],
    TransactionIndex: 0,
    TransactionResult: 'tesSUCCESS'
  },
  status: 'success',
  validated: true
}

```

:::

#### 4.4.3 Remote.rpcTxEntry(params: IRpcTxEntryOptions) 从特定帐本获取事务内容

::: tip 参数

```typescript
export interface IRpcTxEntryOptions {
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  tx_hash: string
}
```

等价

```typescript
public getTxEntry(tx_hash: string, params: IRpcTxEntryOptions = {tx_hash: ""}) {
  return this.rpcTxEntry({ ...params, tx_hash })
}
```

:::
::: details 参数说明
| 参数 | 类型 | 解析
|--------------|-------------|-----|
| tx_hash | string | 指定事务, 区块哈希 |
| ledger_index | Uint/string | 可选参数, 指定账本,"validated","closed","current"或区块编号 |
| ledger_hash | string | 可选参数, 指定账本, 区块哈希 |
:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcTxEntry({ledger_hash: "433D4046C84DE4E9619FF17F1BCF4C6D908DF08E5AE762D5170097E104405B70", tx_hash: "1C955BFC05E5A434DF041C4E4AFA8891DF1AAFBE504707F01A94EBD0F0A76181"}).then(console.log)
Promise { <pending> }
> {
  ledger_hash: '433D4046C84DE4E9619FF17F1BCF4C6D908DF08E5AE762D5170097E104405B70',
  ledger_index: 17800000,
  metadata: {
    AffectedNodes: [ [Object], [Object], [Object], [Object] ],
    TransactionIndex: 0,
    TransactionResult: 'tesSUCCESS'
  },
  status: 'success',
  tx_json: {
    Account: 'jasyAHN5mKpLJpefdnpyPeaihoTdsY5RUo',
    Amount: {
      currency: 'JEQC',
      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      value: '2.146'
    },
    Destination: 'jM6wEZJnHYWv6Vdy4skdhpb1xAUXGvf3uD',
    Fee: '10',
    Flags: 0,
    Memos: [ [Object] ],
    Sequence: 2,
    SigningPubKey: '022B17F87C523C1675BCE5BDCF0CB263159F28382C745AC13D64022DDAD7EFA332',
    TransactionType: 'Payment',
    TxnSignature: '3044022078DC1A37C8EEA61B93A1DF24F1102D1708F5A4F3A1D1D04BFF326C61541F2B8802203415FA3E32F857CC6FE593757D09D941F6608427644DF9C07AA64B7834B6B07F',
    hash: '1C955BFC05E5A434DF041C4E4AFA8891DF1AAFBE504707F01A94EBD0F0A76181',
    inLedger: 17800000,
    ledger_index: 17800000
  },
  validated: true
}

```

:::

#### 4.4.4 Remote.rpcSubmit(params: IRpcSubmitOptions) 提交单签事务

::: danger
sign-and-submit 模式不应该使用，这里只使用 submit-only 模式，本地签名
:::
::: tip 参数

```typescript
export interface IRpcSubmitOptions {
  tx_blob: string
  fail_hard?: boolean
}
```

等价

```typescript
public submit(tx_blob: string, params: IRpcSubmitOptions = {tx_blob: ""}) {
  return this.rpcSubmit({ ...params, tx_blob })
}
```

:::
::: details 参数说明
| 参数 | 类型 | 解析
|--------------|-------------|-----|
| tx_blob | string | 签名后得到的 blob，是序列化后的哈希 |
| fail_hard | boolean | 可选参数, 默认 false。 为真时不尝试其它服务器 |
:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcSubmit({tx_blob: "12000022000000002400000EA4614000000002160EC068400000000000000A732103E466DB080F3863F354E9C1B1CA0927175B338C41789ACFC0EFAD50301524C23E7446304402200A1F6E65FD9D7076E4589C5BA13E2433B1C2CA9E7C0E42EFC7D57F22C74B1B780220355A2456589B79FD6D6185FD5A74BDE44CFB10E0F6711E4A3BF86FE531C72E6C81141C3D155BB13D3FE79CBF85E5C1DCB6B508079ABE83140ECD295EA24E99608A9B346838EB991BCF143E62F9EA7C06737472696E677D00E1F1"}).then(console.log)
Promise { <pending> }
> {
  engine_result: 'tefPAST_SEQ',
  engine_result_code: -190,
  engine_result_message: 'This sequence number has already past.',
  status: 'success',
  tx_blob: '12000022000000002400000EA4614000000002160EC068400000000000000A732103E466DB080F3863F354E9C1B1CA0927175B338C41789ACFC0EFAD50301524C23E7446304402200A1F6E65FD9D7076E4589C5BA13E2433B1C2CA9E7C0E42EFC7D57F22C74B1B780220355A2456589B79FD6D6185FD5A74BDE44CFB10E0F6711E4A3BF86FE531C72E6C81141C3D155BB13D3FE79CBF85E5C1DCB6B508079ABE83140ECD295EA24E99608A9B346838EB991BCF143E62F9EA7C06737472696E677D00E1F1',
  tx_json: {
    Account: 'js2KaXJMUZoXA47Ua2wZyXRDmLL55mhPSN',
    Amount: '35000000',
    Destination: 'jpMGNZgCk4jnDnQfr95XF3NnnryC4tduAG',
    Fee: '10',
    Flags: 0,
    Memos: [ [Object] ],
    Sequence: 3748,
    SigningPubKey: '03E466DB080F3863F354E9C1B1CA0927175B338C41789ACFC0EFAD50301524C23E',
    TransactionType: 'Payment',
    TxnSignature: '304402200A1F6E65FD9D7076E4589C5BA13E2433B1C2CA9E7C0E42EFC7D57F22C74B1B780220355A2456589B79FD6D6185FD5A74BDE44CFB10E0F6711E4A3BF86FE531C72E6C',
    hash: 'B7C029F58D754C133D329243B21959E10DC5FC2E36DEC8DF4713086EBEA097A9'
  }
}
```

:::

#### 4.4.5 Remote.rpcSubmitMultisigned(params: IRpcSubmitMultisignedOptions) 提交多签事务

::: warning
To be successful, the weights of the signatures must be equal or higher than the quorum of the SignerList.
:::
::: tip 参数

```typescript
export interface IRpcSubmitMultisignedOptions {
  tx_json: object
  fail_hard?: boolean
}
```

等价

```typescript
public submitMultisigned(tx_json: object, params: IRpcSubmitMultisignedOptions = {tx_json: {}}) {
  return this.rpcSubmitMultisigned({ ...params, tx_json })
}
```

:::
::: details 参数说明
| 参数 | 类型 | 解析
|--------------|-------------|-----|
| tx_json | object | 多签签名后得到的 tx_json |
| fail_hard | boolean | 可选参数, 默认 false。 为真时不尝试其它服务器 |
:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> tx_json = {
...   "Flags": 0,
...   "Fee": 20000,
...   "TransactionType": "Payment",
...   "Account": "jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D",
...   "Amount": "1000000",
...   "Destination": "jLXCzapdDd1K11EtUv4Nz4agj8DPVbARjk",
...   "Sequence": 11,
...   "Signers": [
...     {
.....       "Signer": {
.......         "Account": "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
.......         "SigningPubKey": "029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15",
.......         "TxnSignature": "3045022100D788CFBD76BB183D43E175191BD37965D01EFDD9D7F978B4DC7AED1F6421CA5B0220334448FEAF2A153EEF24FDFB7E4BC90BFFB29EBEB32342CEA3234F4737E9C967"
.......       }
.....     },
...     {
.....       "Signer": {
.......         "Account": "jfdqBEDsbk3eMSXX2t7CGeu2RPkEjHs6ie",
.......         "SigningPubKey": "0261DD84455B92BDFD59C1DB2A5BD9CE1A3AF0FD531A08EEB2EE354C3BB230B878",
.......         "TxnSignature": "3045022100FC692AF1374D347C7E53205F165EF7F9AD3F96F558A2BE339947E277AB74447102204B8103DCA38AEC05A1EFD65C4E635242E882449B98328EAF13DC0DD2AFC0F239"
.......       }
.....     }
...   ],
...   "SigningPubKey": ""
... }
{
  Flags: 0,
  Fee: 20000,
  TransactionType: 'Payment',
  Account: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
  Amount: '1000000',
  Destination: 'jLXCzapdDd1K11EtUv4Nz4agj8DPVbARjk',
  Sequence: 11,
  Signers: [ { Signer: [Object] }, { Signer: [Object] } ],
  SigningPubKey: ''
}
> remote.rpcSubmitMultisigned({tx_json}).then(console.log)
Promise { <pending> }
> {
  engine_result: 'terPRE_SEQ',
  engine_result_code: -92,
  engine_result_message: 'Missing/inapplicable prior transaction.',
  status: 'success',
  tx_blob: '1200002200000000240000000B6140000000000F4240684000000000004E2073008114054FADDC8595E2950FA43F673F65C2009F58C7F18314D6376941DD44B16D5A9652C5A8B928B2B336B95FFCED7321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100D788CFBD76BB183D43E175191BD37965D01EFDD9D7F978B4DC7AED1F6421CA5B0220334448FEAF2A153EEF24FDFB7E4BC90BFFB29EBEB32342CEA3234F4737E9C96781141359AA928F4D98FDB3D93E8B690C80D37DED11C3E1ED73210261DD84455B92BDFD59C1DB2A5BD9CE1A3AF0FD531A08EEB2EE354C3BB230B87874473045022100FC692AF1374D347C7E53205F165EF7F9AD3F96F558A2BE339947E277AB74447102204B8103DCA38AEC05A1EFD65C4E635242E882449B98328EAF13DC0DD2AFC0F239811448C7F1F5E9D4D0FC0D3F16F1606ACCCFB8D51463E1F1',
  tx_json: {
    Account: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
    Amount: '1000000',
    Destination: 'jLXCzapdDd1K11EtUv4Nz4agj8DPVbARjk',
    Fee: '20000',
    Flags: 0,
    Sequence: 11,
    Signers: [ [Object], [Object] ],
    SigningPubKey: '',
    TransactionType: 'Payment',
    hash: '92BD7DC9D9955C5813E61A4C2D9FB712379A29A9C7F3FD7384FDBB01E8A7829B'
  }
}
```

:::

### 4.5 路径和挂单相关

#### 4.5.1 Remote.rpcBookOffers(params: IRpcBookOffersOptions) 获取交易两种通证的挂单

::: tip 参数

```typescript
export interface IRpcBookOffersOptions {
  taker_pays: object
  taker_gets: object
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  limit?: number
}
```

等价

```typescript
public getBookOffers(taker_gets: ICurrency, taker_pays: ICurrency, params: IRpcBookOffersOptions = {taker_gets: {}, taker_pays: {}}) {
  return this.rpcBookOffers({...params, taker_gets, taker_pays})
}
```

:::
::: details 参数说明
| 参数 | 类型 | 解析
|--------------|-------------|-----|
| taker_gets | object | 接受挂单的账号`得到`的货币和发行者 |
| taker_pays | object | 接受挂单的账号`提供`的货币和发行者 |
| ledger_index | Uint/string | 可选参数, 指定账本,"validated","closed","current"或区块编号 |
| ledger_hash | string | 可选参数, 指定账本, 区块哈希 |
| limit | number | 可选参数，限制返回的数目 |
:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcBookOffers({taker_pays: {currency: "SWT", issuer: ""}, taker_gets: {currency: "CNY", issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"}, limit: 2}).then(console.log)
Promise { <pending> }
> {
  ledger_current_index: 17857995,
  offers: [
    {
      Account: 'jajX5uTGnkhskXYjvnhhER7cK6Hum4H51U',
      BookDirectory: '51603377F758E3C8FA007C77312DDA06A737A1395CD5FC435D20E477B26300B0',
      BookNode: '0000000000000000',
      Flags: 0,
      LedgerEntryType: 'Offer',
      OwnerNode: '0000000000000000',
      PreviousTxnID: '5B1D643C21275976D57DFE923D553AD71536E8A6EFD9CD65717D4A5BF6037256',
      PreviousTxnLgrSeq: 17854900,
      Sequence: 2791,
      TakerGets: [Object],
      TakerPays: '500000000000',
      index: '15E1C0A9A84B21A57858A24070FEAC91424C601BDB8BB35E553CEC1C7351C016',
      owner_funds: '8502.275898725341',
      quality: '925840199.9814832'
    },
    {
      Account: 'jwpEySXz9NCfKhE5BL5g7o7QKfnc9xcbz2',
      BookDirectory: '51603377F758E3C8FA007C77312DDA06A737A1395CD5FC435D20E52955EFE040',
      BookNode: '0000000000000000',
      Flags: 0,
      LedgerEntryType: 'Offer',
      OwnerNode: '0000000000000000',
      PreviousTxnID: '7118865C9EC18F257EE1DD4141B591D3DD7E0034CC6D4155C34180E340E78040',
      PreviousTxnLgrSeq: 17854730,
      Sequence: 14991,
      TakerGets: [Object],
      TakerPays: '535197754071',
      index: '4441FFCC9A604F1EF8D907C43C33076F922B632A91FF9C15818EF5558DEDBA95',
      owner_funds: '580.0194615722775',
      quality: '925916495.2944704'
    }
  ],
  status: 'success',
  validated: false
}
```

:::

#### 4.5.2 Remote.rpcSkywellPathFind(params: IRpcSkywellPathFindOptions) 获取两个账户间的交易路径

::: tip 参数

```typescript
export interface IRpcBookOffersOptions {
  taker_pays: object
  taker_gets: object
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  limit?: number
}
```

等价

```typescript
public getSkywellPathFind(params: IRpcSkywellPathFindOptions) {
  return this.rpcSkywellPathFind(params)
}
```

:::
::: details 参数说明
| 参数 | 类型 | 解析
|--------------|-------------|-----|
| taker_gets | object | 接受挂单的账号`得到`的货币和发行者 |
| taker_pays | object | 接受挂单的账号`提供`的货币和发行者 |
| ledger_index | Uint/string | 可选参数, 指定账本,"validated","closed","current"或区块编号 |
| ledger_hash | string | 可选参数, 指定账本, 区块哈希 |
| limit | number | 可选参数，限制返回的数目 |
:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcSkywellPathFind({
        destination_account: "jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG",
        source_account: "jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG",
        destination_amount: remote.makeAmount(1, "cny"),
        source_currencies: [ remote.makeCurrency("vcc"), remote.makeCurrency("jcc") ]
      }).then(console.log)

  Promise { <pending> }
> {
  alternatives: [
    {
      paths_canonical: [],
      paths_computed: [Array],
      source_amount: [Object]
    }
  ],
  destination_account: 'jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG',
  destination_currencies: [
    'JETH',
    'BGT',
    'CNY',
    'VCC',
    'SWT',
    'SPC',
    'SEAA',
    'JMOAC',
    'JEKT',
    'HJT',
    'JJCC',
    'JCALL',
    'JSLASH'
  ],
  status: 'success'
}
```

:::

### 4.6 账户相关

#### 4.6.0 Remote.rpcBlacklistInfo(params: IRpcBlacklistInfoOptions = {}) 获取已关闭账户列表

::: tip 参数

```typescript
interface IRpcBlacklistInfoOptions {
  account?: string
  marker?: IMarker
}
```

等价

```typescript
public getBlacklistInfo(params: IRpcBlacklistInfoOptions = {}) {
  return this.rpcBlacklistInfo(params)
}
```

:::
::: details 参数说明
| 参数 | 类型 | 解析
|--------------|-------------|-----|
| account | string | 指定账户, 地址 |
| marker | IMarker | 可选参数, 分页相关 |
:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcBlacklistInfo().then(console.log)
Promise { <pending> }
> {
  ledger_hash: '3CBF6F0B72CA68AC7F00CB640587BDA83487EA84ED84057FC11DFF241287DB87',
  ledger_index: '17890257',
  marker: '007926FCDB6FC3626F3A6C79F5640D148AC35998FE9838FE950613C9E0852CC8',
  state: [
    {
      BlackListAccountID: 'jBV2vaet8BZx1zvtKAhxe9AZhnchGvwYvo',
      Flags: 0,
      LedgerEntryType: 'BlackList',
      index: '00009FCA9BBBFD274D7478332830786A817BA4D3729A8FBD4ED871A484C70A37'
    },
    {
      BlackListAccountID: 'jnZVj3TfY553kKChqxyLbYCtgxZ4iouEZx',
      Flags: 0,
      LedgerEntryType: 'BlackList',
      index: '0001111F9D4BC1B4A07403850C72B82B5F554821888738B951327D15346D3FA8'
    },
    ... 156 more items
  ],
  status: 'success'
}
```

:::

#### 4.6.1 Remote.rpcAccountInfo(params: IRpcAccountInfoOptions) 获取账户基本信息

::: tip 参数

```typescript
export interface IRpcAccountInfoOptions {
  account: string
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
}
```

等价

```typescript
public getAccountInfo(address: string, params: IRpcAccountInfoOptions = {account: ""}): Promise<any> {
  return this.rpcAccountInfo({ ...params, account: address })
}
```

:::
::: details 参数说明
| 参数 | 类型 | 解析
|--------------|-------------|-----|
| account | string | 指定账户, 地址 |
| ledger_index | Uint/string | 可选参数, 指定账本,"validated","closed","current"或区块编号 |
| ledger_hash | string | 可选参数, 指定账本, 区块哈希 |
:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcAccountInfo({account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz"}).then(console.log)
Promise { <pending> }
> {
  account_data: {
    Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Balance: '52359960',
    Flags: 0,
    LedgerEntryType: 'AccountRoot',
    OwnerCount: 7,
    PreviousTxnID: '55791A6BD2C0D71D339B2366D9A60F2AB71829648EC8F0B10EBD941A5D663433',
    PreviousTxnLgrSeq: 17051932,
    Sequence: 109,
    index: 'DB35CDEAF3F0D3C190B041C0C7D92FB0E43CBCBFAD4F498C28858A35CEA8BBB7'
  },
  ledger_current_index: 17857652,
  status: 'success',
  validated: false
}
```

:::

#### 4.6.2 Remote.rpcAccountObjects(params: IRpcAccountObjectsOptions) 获取账户扩展信息

::: tip 参数

```typescript
export interface IRpcAccountObjectsOptions {
  account: string
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  type?: "offer" | "ticket" | "state" | "deposit_preauth" | "SignerList"
  limit?: number
  marker?: IMarker
}
```

等价

```typescript
public getAccountObjects(address: string, params: IRpcAccountObjectsOptions = {account: ""}) {
  return this.rpcAccountObjects({...params, account: address)
}
```

:::
::: details 参数说明
| 参数 | 类型 | 解析
|--------------|-------------|-----|
| account | string | 指定账户, 地址 |
| ledger_index | Uint/string | 可选参数, 指定账本,"validated","closed","current"或区块编号 |
| ledger_hash | string | 可选参数, 指定账本, 区块哈希 |
| type | string | 可选参数，过滤类型 |
| limit | number | 可选参数，默认 10 |
| marker | IMarker | 可选参数，分页相关 |
:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcAccountObjects({account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz"}).then(console.log)
Promise { <pending> }
> {
  account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  account_objects: [
    {
      Balance: [Object],
      Flags: 1114112,
      HighLimit: [Object],
      HighNode: '000000000000A54B',
      LedgerEntryType: 'SkywellState',
      LowLimit: [Object],
      LowNode: '0000000000000000',
      PreviousTxnID: '55791A6BD2C0D71D339B2366D9A60F2AB71829648EC8F0B10EBD941A5D663433',
      PreviousTxnLgrSeq: 17051932,
      index: 'B5904B308E9CD91DCF9ECB863F27FDD24B94C9109BAD70AE184CC0C8F0D0F4D7'
    },
    {
      Balance: [Object],
      Flags: 0,
      HighLimit: [Object],
      HighNode: '0000000000000000',
      LedgerEntryType: 'TrustState',
      LowLimit: [Object],
      LowNode: '0000000000000000',
      RelationType: 1,
      index: 'F27DB8B79BFE0A2ADC7225301945D3B24023AD32BDFAF010B76B4CD62821C53E'
    },
    {
      FeeAccountID: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
      FeeCurrency: 'JSLASH',
      FeeCurrencyIssuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      Flags: 0,
      HighNode: '000000000000B0B2',
      LedgerEntryType: 'Brokerage',
      LowNode: '0000000000000000',
      OfferFeeRateDen: '00000000000003E8',
      OfferFeeRateNum: '0000000000000001',
      Platform: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
      index: 'F4BAC6B760B91575B18922CA630AE448F2796C365086EF2EC2A9A84806457970'
    },
    {
      Flags: 0,
      LedgerEntryType: 'SignerList',
      OwnerNode: '0000000000000000',
      PreviousTxnID: '5917B3F760BFC0F5BFE5EF5EAE2642FDEE6908606E37FE76561C7A7F137B76C9',
      PreviousTxnLgrSeq: 15203720,
      SignerEntries: [Array],
      SignerQuorum: 5,
      index: '4A017344F9068871DC873D548052FFFF7271B86DDEB68AA93A515A5D0228BC21'
    },
    {
      Balance: [Object],
      Flags: 0,
      HighLimit: [Object],
      HighNode: '0000000000000000',
      LedgerEntryType: 'TrustState',
      LowLimit: [Object],
      LowNode: '0000000000000000',
      RelationType: 3,
      index: '765D5AE12803F142209C246ECB3DF61A6BA883019DBE7CE065D7BB25266EB20E'
    },
    {
      FeeAccountID: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
      FeeCurrency: 'CNY',
      FeeCurrencyIssuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      Flags: 0,
      HighNode: '000000000000DD69',
      LedgerEntryType: 'Brokerage',
      LowNode: '0000000000000000',
      OfferFeeRateDen: '00000000000003E8',
      OfferFeeRateNum: '0000000000000001',
      Platform: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
      index: 'E58E4B5BE423BDBC8C9DCC09E31B723E02FB95716C9F26FB132EBBB782CDE610'
    },
    {
      Balance: [Object],
      Flags: 1114112,
      HighLimit: [Object],
      HighNode: '000000000000ED46',
      LedgerEntryType: 'SkywellState',
      LowLimit: [Object],
      LowNode: '0000000000000000',
      PreviousTxnID: '722DD0C5D911F8CABFBDD495A1609FDB6EA047F03E450F535B6006BC37C001C4',
      PreviousTxnLgrSeq: 16941122,
      index: '8AB1084F4EACAEF5BCCF0317B96BCACCA4EB3253B2D5BDAC5955C73DCCB4AA26'
    }
  ],
  ledger_current_index: 17857656,
  status: 'success',
  validated: false
}
```

:::

#### 4.6.3 Remote.rpcAccountCurrencies(params: IRpcAccountCurrenciesOptions) 获取账户可发送/接收 token

::: tip 参数

```typescript
export interface IRpcAccountCurrenciesOptions {
  account: string
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  strict?: boolean
}
```

等价

```typescript
public getAccountCurrencies(address: string, params: IRpcAccountCurrenciesOptions = {account: ""}) {
  return this.rpcAccountCurrencies({...params, account: address})
}
```

:::
::: details 参数说明
| 参数 | 类型 | 解析
|--------------|-------------|-----|
| account | string | 指定账户, 地址 |
| ledger_index | Uint/string | 可选参数, 指定账本,"validated","closed","current"或区块编号 |
| ledger_hash | string | 可选参数, 指定账本, 区块哈希 |
| strict | boolean | 可选参数, 严格模式，account 要求地址或公钥 |
:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcAccountCurrencies({account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz"}).then(console.log)
Promise { <pending> }
> {
  ledger_current_index: 17857771,
  receive_currencies: [ 'JCALL', 'JSLASH' ],
  send_currencies: [ 'JCALL', 'JSLASH' ],
  status: 'success',
  validated: false
}
```

:::

#### 4.6.4 Remote.rpcAccountLines(params: IRpcAccountLinesOptions) 获取账户信任线

::: tip 参数

```typescript
export interface IRpcAccountLinesOptions {
  account: string
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  strict?: boolean
  peer?: string
  marker?: IMarker
}
```

等价

```typescript
public getAccountTrusts(address: string, params: IRpcAccountLinesOptions = {account: ""}) {
  return this.rpcAccountLines({...params, account: address})
}
```

:::
::: details 参数说明
| 参数 | 类型 | 解析
|--------------|-------------|-----|
| account | string | 指定账户, 地址 |
| ledger_index | Uint/string | 可选参数, 指定账本,"validated","closed","current"或区块编号 |
| ledger_hash | string | 可选参数, 指定账本, 区块哈希 |
| strict | boolean | 可选参数, 严格模式，account 要求地址或公钥 |
| peer | string | 可选参数, 第二个账户的地址，如果提供，则只显示连接这两个账户之间的 trust_line |
| marker | IMarker | 可选参数，分页相关 |
:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcAccountLines({account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz"}).then(console.log)
Promise { <pending> }
> {
  account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  ledger_current_index: 17857806,
  lines: [
    {
      account: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      balance: '61.998',
      currency: 'JSLASH',
      limit: '10000000000',
      limit_peer: '0',
      no_skywell: true,
      quality_in: 0,
      quality_out: 0
    },
    {
      account: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      balance: '6',
      currency: 'JCALL',
      limit: '10000000000',
      limit_peer: '0',
      no_skywell: true,
      quality_in: 0,
      quality_out: 0
    }
  ],
  status: 'success',
  validated: false
}
```

:::

#### 4.6.5 Remote.rpcAccountOffers(params: IRpcAccountOffersOptions) 获取账户挂单

::: tip 参数

```typescript
export interface IRpcAccountOffersOptions {
  account: string
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  strict?: boolean
  limit?: number
  marker?: IMarker
}
```

等价

```typescript
public getAccountOffers(address: string, params: IRpcAccountOffersOptions = {account: ""}): Promise<any> {
  return this.rpcAccountOffers({ ...params, account: address })
}
```

:::
::: details 参数说明
| 参数 | 类型 | 解析
|--------------|-------------|-----|
| account | string | 指定账户, 地址 |
| ledger_index | Uint/string | 可选参数, 指定账本,"validated","closed","current"或区块编号 |
| ledger_hash | string | 可选参数, 指定账本, 区块哈希 |
| strict | boolean | 可选参数, 严格模式，account 要求地址或公钥 |
| limit | number | 可选参数, 分页相关， 最大返回数目 |
| marker | IMarker | 可选参数，分页相关 |
:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcAccountOffers({account: "jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG"}).then(console.log)
Promise { <pending> }
> {
  account: 'jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG',
  ledger_current_index: 17858547,
  offers: [
    {
      flags: 131072,
      seq: 758,
      taker_gets: [Object],
      taker_pays: '625000000000'
    }
  ],
  status: 'success',
  validated: false
}
```

:::

#### 4.6.6 Remote.rpcAccountTx(params: IRpcAccountTxOptions) 获取账户事务

::: tip 参数

```typescript
export interface IRpcAccountTxOptions {
  account: string
  ledger_index_min?: number
  ledger_index_max?: number
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  binary?: boolean
  forward?: boolean
  limit?: number
  marker?: IMarker
}
```

等价

```typescript
public getAccountTx(address: string, params: IRpcAccountTxOptions = {account: ""}) {
  return this.rpcAccountTx({...params, account: address})
}
```

:::
::: details 参数说明
| 参数 | 类型 | 解析
|--------------|-------------|-----|
| account | string | 指定账户, 地址 |
| ledger_index_min | Int | 可选参数, 指定包含交易的最早账本，-1 表示指定服务器使用最早可以获得的经过验证的账本。 |
| ledger_index_max | Int | 可选参数, 指定包含交易的最迟账本，-1 表示指定服务器使用最迟可以获得的经过验证的账本。 |
| ledger_index | Uint/string | 可选参数, 指定账本,"validated","closed","current"或区块编号 |
| ledger_hash | string | 可选参数, 指定账本, 区块哈希 |
| strict | boolean | 可选参数, 严格模式，account 要求地址或公钥 |
| limit | number | 可选参数, 分页相关， 最大返回数目 |
| marker | IMarker | 可选参数，分页相关 |
:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcAccountTx({account: "jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG", limit: 3}).then(console.log)
Promise { <pending> }
> {
  account: 'jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG',
  ledger_index_max: 17858550,
  ledger_index_min: 266955,
  limit: 3,
  marker: { ledger: 17832370, seq: 0 },
  status: 'success',
  transactions: [
    { meta: [Object], tx: [Object], validated: true },
    { meta: [Object], tx: [Object], validated: true },
    { meta: [Object], tx: [Object], validated: true }
  ]
}
```

:::

#### 4.6.7 Remote.rpcAccountRelation(params: IRpcAccountRelationOptions) 获取账户关系

::: tip 参数

```typescript
export interface IRpcAccountRelationOptions {
  account: string
  ledger_index?: "validated" | "closed" | "current" | number
  ledger_hash?: string
  strict?: boolean
  peer?: string
  marker?: IMarker
}
```

等价

```typescript
public getAccountRelation(address: string, params: IRpcAccountRelationOptions = {account: ""}) {
  return this.rpcAccountRelation({...params, account: address})
}
```

:::
::: details 参数说明
| 参数 | 类型 | 解析
|--------------|-------------|-----|
| account | string | 指定账户, 地址 |
| ledger_index | Uint/string | 可选参数, 指定账本,"validated","closed","current"或区块编号 |
| ledger_hash | string | 可选参数, 指定账本, 区块哈希 |
| strict | boolean | 可选参数, 严格模式，account 要求地址或公钥 |
| peer | string | 可选参数, 第二个账户的地址，如果提供，则只显示连接这两个账户之间的 relation |
| marker | IMarker | 可选参数，分页相关 |
:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcAccountRelation({account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz"}).then(console.log)
Promise { <pending> }
> {
  account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  ledger_current_index: 17867635,
  lines: [
    {
      currency: 'JSLASH',
      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      limit: '1',
      limit_peer: 'j3vyFAMQW2Ls48eoFCTsMXFq2KNWVUskSx',
      relation_type: '1'
    },
    {
      currency: 'CNY',
      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      limit: '0.1',
      limit_peer: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
      relation_type: '3'
    }
  ],
  status: 'success',
  validated: false
}
```

:::

## 5 错误处理

所有 rpc 交互都是通过 axios 进行的，返回`Promise`, 不成功时抛出`Exception`

### 5.1 RpcError 对象

::: tip
当 Remote 与节点 rpc 交互时，如果出现错误就会抛出 RpcError

- 包含 axios 请求的各种错误
- 包括 axios 应答的各种错误
- 包括 rpc 应答中`status`不是`success`时

```typescript
export class RpcError {
  public error
  public error_code
  public error_message
  public status
  constructor(inst: any = {}) {
    this.status = inst.status || "error"
    this.error = inst.error || "axiosIssue"
    this.error_code = inst.error_code || -9999
    this.error_message = inst.message || inst.error_message || "axios Issue."
  }
}
```

:::

### 5.2 axios 请求错误 生成 RpcError 对象

::: tip
包括 请求方法，参数(钱包地址)校验
:::
::: details 实例化 RpcError

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.getAccountInfo("jGxW97eCqxfAWvmqSgNkwc2apCejiM89bGwrongaddress").then(console.log).catch(console.error)
Promise { <pending> }
> RpcError {
  status: 'error',
  error: 'validationError',
  error_code: -8888,
  error_message: 'invalid account specified'
}
```

:::

### 5.3 axios 应答错误 生成 RpcError 对象

::: details 实例化 RpcError

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://aixos.exception.example:5050"})
> remote.rpcVersion().catch(e => console.log(e))
Promise { <pending> }
> RpcError {
  status: 'error',
  error: 'axiosIssue',
  error_code: -9999,
  error_message: 'getaddrinfo ENOTFOUND aixos.exception.example'
}
```

:::

### 5.4 rpc 应答错误 生成 RpcError 对象

::: details 实例化 RpcError

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.rpcAccountInfo().then(console.log).catch(console.error)
Promise { <pending> }
> RpcError {
  status: 'error',
  error: 'invalidParams',
  error_code: 29,
  error_message: "Missing field 'account'."
}
```

:::

## 6 派生调用

派生调用是运用 rpc 交互实现一些方便的功能，或者尝试使用其它库相似/一致的方式来实现

### 6.1 方便调用

#### 6.1.1 Remote.getAccountBalance(address: string) 账户余额

::: tip 调用

```javascript
await Remote.rpcAccountInfo({ account: address })
await Remote.rpcAccountLines({ account: address })
await Remote.rpcAccountRelation({ account: address })
await Remote.rpcAccountOffers({ account: address })
```

:::

::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote()
> remote.getAccountBalances("jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz").then(console.log).catch(console.error)
Promise { <pending> }
> {
  balances: [
    { value: 62.07996, currency: 'SWT', issuer: '', freezed: 30 },
    {
      value: '60.798',
      currency: 'JSLASH',
      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      freezed: 1
    },
    {
      value: '6',
      currency: 'JCALL',
      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      freezed: 0
    }
  ],
  sequence: 121
}
```

:::

#### 6.1.2 Remote.getAccountSequence(address: string) 账户序号

::: tip 调用

```javascript
return (await Remote.rpcAccountInfo({ account: address })).account_data.Sequence
```

:::

#### 6.1.3 Remote.submit(tx_blob: string) 提交单签事务

::: tip 调用

```javascript
return Remote.rpcSubmit({ tx_blog })
```

:::

#### 6.1.4 Remote.submitMultisigned(tx_json: object) 提交多签事务

::: tip 调用

```javascript
return Remote.rpcSubmitMultisigned({ tx_json })
```

:::

### 6.2 其它查询相关

#### 6.2.1 Remote.getAccountInfo(address: string, params: IRpcAccountInfoOptions = {account: ""}) 账户基本信息

等价 `Remote.rpcAccountInfo(params)`

#### 6.2.2 Remote.getAccountOffers(address: string, params: IRpcAccountOffersOptions = {account: ""}) 账户挂单

等价 `Remote.rpcAccountOffers(params)`

#### 6.2.3 Remote.getAccountTrusts(address: string) 账户信任

::: tip 调用

```javascript
return Remote.rpcAccountLines({ account: address })
```

:::

#### 6.2.4 Remote.getAccountRelation(address: string, params: IRpcAccountRelationOptions = {account: ""}) 账户关系

等价 `Remote.rpcAccountRelation(params)`

#### 6.2.5 Remote.getAccountTx(address: string, params: IRpcAccountTxOptions = {account: ""}) 账户事务

等价 `Remote.rpcAccountTx(params)`

#### 6.2.6 Remote.getBrokerage(address: string, params: IRpcFeeInfoOptions = { account: ""}) 挂单佣金

::: tip 调用

```javascript
return Remote.rpcFeeInfo({ ...params, account: address })
```

:::

## 7 写入事务

### 7.0 连接@swtc/transaction

#### 7.0.1 Remote.rpcAccountInfo()

#### 7.0.2 Remote.rpcSubmit()

#### 7.0.3 Remote.rpcSubmitMultisigned()

::: warning
通过 rpc 调用已经连通 @swtc/transaction

下面都是 `Transaction` 的简单调用
:::

### 7.1 写入相关 - 单签

::: tip 事务 (和 lib/api Remote 表现一致)
buildXyzTx(options) 生成 (@swtc/transaction).Transaction 实例 tx

使用 tx.submitPromise([secret[, memo[, sequence]]])提交

单签也可以分步骤:

- `tx.setSequence(sequence)` 或者 `tx._setSequencePromise()`
- `tx.addMemo(memo)`
- `tx.signPromise(secret)`
  :::

#### 7.1.1 Remote.buildPaymentTx(options: IPaymentTxOptions) 支付

::: tip 参数

```typescript
interface IPaymentTxOptions {
  amount: IAmount
  source?: string
  from?: string
  account?: string
  destination?: string
  to?: string
  memo?: string
  secret?: string
  invoice?: string
  sequence?: string | number
}
```

:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> const tx = remote.buildPaymentTx({from: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz", to: "jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D", amount: remote.makeAmount(0.01)})
> tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C","payment tx demo").then(console.log).catch(console.error)
Promise { <pending> }
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  status: 'success',
  tx_blob: '1200002200000000240000006E6140000000000027106840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E157447304502210098FF76746D03A50D671FDBC09046E05ED163C2A5C01BD13AEF2512A7A4EDF4E302203D27A795D0E4271336612E9DB92384C65B99255765B1240F2F179217B27CED2281141359AA928F4D98FDB3D93E8B690C80D37DED11C38314054FADDC8595E2950FA43F673F65C2009F58C7F1F9EA7D0F7061796D656E742074782064656D6FE1F1',
  tx_json: {
    Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Amount: '10000',
    Destination: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
    Fee: '10000',
    Flags: 0,
    Memos: [ [Object] ],
    Sequence: 110,
    SigningPubKey: '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
    TransactionType: 'Payment',
    TxnSignature: '304502210098FF76746D03A50D671FDBC09046E05ED163C2A5C01BD13AEF2512A7A4EDF4E302203D27A795D0E4271336612E9DB92384C65B99255765B1240F2F179217B27CED22',
    hash: '1BA252F38A64DDF3E729E4FB84675403D664AA71C7EB97837D3EC96F7DCC9513'
  }
}
```

:::

#### 7.1.2 Remote.buildOfferCreateTx(options: IOfferCreateTxOptions) 挂单

::: tip 参数

```typescript
interface IOfferCreateTxOptions {
  type: string
  source?: string
  from?: string
  account?: string
  gets?: IAmount
  pays?: IAmount
  taker_gets?: IAmount
  taker_pays?: IAmount
  platform?: any
  memo?: string
  secret?: string
  sequence?: string | number
}
```

:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> const tx = remote.buildOfferCreateTx({
... type: 'Sell',
... account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
... taker_pays: remote.makeAmount(1),
... taker_gets: remote.makeAmount(0.01, "slash")
... })
> tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C","payment tx demo").then(console.log).catch(console.error)
Promise { <pending> }
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  status: 'success',
  tx_blob: '120007220008000024000000706440000000000F424065D4038D7EA4C680000000000000000000004A534C4153480000000000A582E432BFC48EEDEF852C814EC57F3CD2D415966840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100DF3A6A51BBE9C3D87C9923DE59C59D443A58A78254DB99881A2BE095D3C1B3C6022009947792ADA2E6FFB920D73E1E98331BE07DA55786251937B36536A8A4EBD15C81141359AA928F4D98FDB3D93E8B690C80D37DED11C3F9EA7D0F7061796D656E742074782064656D6FE1F1',
  tx_json: {
    Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Fee: '10000',
    Flags: 524288,
    Memos: [ [Object] ],
    Sequence: 112,
    SigningPubKey: '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
    TakerGets: {
      currency: 'JSLASH',
      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      value: '0.01'
    },
    TakerPays: '1000000',
    TransactionType: 'OfferCreate',
    TxnSignature: '3045022100DF3A6A51BBE9C3D87C9923DE59C59D443A58A78254DB99881A2BE095D3C1B3C6022009947792ADA2E6FFB920D73E1E98331BE07DA55786251937B36536A8A4EBD15C',
    hash: '27BE735F6D1A226A67821EDE68270B21F09A9DEDCEA2B018A3EBE341E28829B4'
  }
}
```

:::

#### 7.1.3 Remote.buildOfferCancelTx(options: IOfferCancelTxOptions) 取消挂单

::: tip 参数

```typescript
export interface IOfferCancelTxOptions {
  sequence: number
  source?: string
  from?: string
  account?: string
  memo?: string
  secret?: string
}
```

:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> const tx = remote.buildOfferCancelTx({
... account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
... sequence: 112
... })
> tx.tx_json
{
  Flags: 0,
  Fee: 10000,
  TransactionType: 'OfferCancel',
  Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  OfferSequence: 112
}
> tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C").then(console.log).catch(console.error)
Promise { <pending> }
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  status: 'success',
  tx_blob: '120008220000000024000000712019000000706840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E157446304402200B73C7069C8AEA5A676393940870FB6FC0A480264B2751AB30841D26FD0F48C002202B7D1EE21D3501064112F2A503058E2967DC3D448D813CD1D2BCBDEC8C33493881141359AA928F4D98FDB3D93E8B690C80D37DED11C3',
  tx_json: {
    Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Fee: '10000',
    Flags: 0,
    OfferSequence: 112,
    Sequence: 113,
    SigningPubKey: '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
    TransactionType: 'OfferCancel',
    TxnSignature: '304402200B73C7069C8AEA5A676393940870FB6FC0A480264B2751AB30841D26FD0F48C002202B7D1EE21D3501064112F2A503058E2967DC3D448D813CD1D2BCBDEC8C334938',
    hash: '6687AB600DC12F13897582BAA62CE5304068D77E725A4C6DDDC9EF6CE8A9DE78'
  }
}
```

:::

#### 7.1.4 Remote.buildRelationTx(options: IRelationTxOptions) 信任/授权/冻结

::: tip 参数

```typescript
interface IRelationTxOptions {
  type: "trust" | "authorize" | "freeze"
  source?: string
  from?: string
  account?: string
  target?: string
  limit: IAmount
  quality_out?: any
  quality_in?: any
  memo?: string
  secret?: string
  sequence?: string | number
}
}
```

:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.buildRelationTx({
... account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
... target: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
... limit: remote.makeAmount(0.1, "slash"),
... type: "authorize"
... }).submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C", "授权").then(console.log).catch(console.error)
Promise { <pending> }
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  status: 'success',
  tx_blob: '1200152200000000240000007220230000000163D4438D7EA4C680000000000000000000004A534C4153480000000000A582E432BFC48EEDEF852C814EC57F3CD2D415966840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100E3EC883EAC255018DEAC561D182F0DED824E9301BF56BC30292414F7835398D3022042807AFD74DC4BBF54A65BAB57B34D14F2012D028A1E32E9BB32A3A13EEDEBAD81141359AA928F4D98FDB3D93E8B690C80D37DED11C38714054FADDC8595E2950FA43F673F65C2009F58C7F1F9EA7D06E68E88E69D83E1F1',
  tx_json: {
    Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Fee: '10000',
    Flags: 0,
    LimitAmount: {
      currency: 'JSLASH',
      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      value: '0.1'
    },
    Memos: [ [Object] ],
    RelationType: 1,
    Sequence: 114,
    SigningPubKey: '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
    Target: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
    TransactionType: 'RelationSet',
    TxnSignature: '3045022100E3EC883EAC255018DEAC561D182F0DED824E9301BF56BC30292414F7835398D3022042807AFD74DC4BBF54A65BAB57B34D14F2012D028A1E32E9BB32A3A13EEDEBAD',
    hash: '7C9D297C1F13FE45FAAF34CA6DCD97593BB40D6761B7F9174B54BB8AE207490F'
  }
}

> remote.buildRelationTx({
... account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
... limit: remote.makeAmount(10000, "slash"),
... type: "trust"
... }).submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C", "信任").then(console.log).catch(console.error)
Promise { <pending> }
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  status: 'success',
  tx_blob: '1200142200000000240000007263D5838D7EA4C680000000000000000000004A534C4153480000000000A582E432BFC48EEDEF852C814EC57F3CD2D415966840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E157446304402200DB5BB2B331C27A6322866934B443F01D4105D2DE2AE01149AEA2F09E85ABDFA0220225963707BF00C712C2AA92381E94D33136D225BCCAEBDC2453AD93163A5286881141359AA928F4D98FDB3D93E8B690C80D37DED11C3F9EA7D06E4BFA1E4BBBBE1F1',
  tx_json: {
    Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Fee: '10000',
    Flags: 0,
    LimitAmount: {
      currency: 'JSLASH',
      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      value: '10000'
    },
    Memos: [ [Object] ],
    Sequence: 114,
    SigningPubKey: '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
    TransactionType: 'TrustSet',
    TxnSignature: '304402200DB5BB2B331C27A6322866934B443F01D4105D2DE2AE01149AEA2F09E85ABDFA0220225963707BF00C712C2AA92381E94D33136D225BCCAEBDC2453AD93163A52868',
    hash: '4B4B922B63156AFDF5DB4241F67601E67A35F290032B274ABAD9FFBC2314572D'
  }
}
```

#### 7.1.5 Remote.buildAccountSetTx(options: IAccountSetTxOptions) 帐号属性

::: tip 参数

```typescript
interface IAccountSetTxOptions {
  type: "property" | "delegate" | "signer"
  source?: string
  from?: string
  account?: string
  set?: string | number
  set_flag?: string | number
  clear?: string | number
  clear_flag?: string | number
  delegate_key?: string
  memo?: string
  secret?: string
  sequence?: string | number
}
```

:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> const tx = remote.buildAccountSetTx({
... account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
... type:'property'
... })
> tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C").then(console.log).catch(console.error)
Promise { <pending> }
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  status: 'success',
  tx_blob: '120003220000000024000000736840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E157446304402207E0514A928B7CBB6662815A835B8B7EDE04397867AF501DB8764BC8CECF74B5D0220357CA75B9EBB0A782099CC4340EEBB1FCA8951B165F2F732ACFADDA462DD6A6981141359AA928F4D98FDB3D93E8B690C80D37DED11C3',
  tx_json: {
    Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Fee: '10000',
    Flags: 0,
    Sequence: 115,
    SigningPubKey: '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
    TransactionType: 'AccountSet',
    TxnSignature: '304402207E0514A928B7CBB6662815A835B8B7EDE04397867AF501DB8764BC8CECF74B5D0220357CA75B9EBB0A782099CC4340EEBB1FCA8951B165F2F732ACFADDA462DD6A69',
    hash: 'F2BD8774F1816A0957D74AC42975A9AF6CFC94152D671D9756D732418E49DD90'
  }
}
```

:::

#### 7.1.6 Remote.buildBrokerageTx(options) 挂单佣金

::: tip 参数

```typescript
interface IBrokerageTxOptions {
  account: string
  address?: string
  feeAccount: string
  mol?: number
  molecule?: number
  den?: number
  denominator?: number
  amount: IAmount
  memo?: string
  secret?: string
  sequence?: string | number
}
```

:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> const tx = remote.buildBrokerageTx({
... account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
... mol: 10,
... den: 1000,
... feeAccount: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
... amount: remote.makeAmount(3, "slash")
... })
undefined
> tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C").then(console.log).catch(console.error)
Promise { <pending> }
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  status: 'success',
  tx_blob: '1200CD2200000000240000007439000000000000000A3A00000000000003E861D48AA87BEE5380000000000000000000004A534C4153480000000000A582E432BFC48EEDEF852C814EC57F3CD2D415966840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E157447304502210091F0DBF8C80E53F93C1D7E9898CB96E00AE5F1CB5B68A20828E31807B1333A920220047F13F40B05AFB1CCC7EA0670FF3840F3ADD4CB442929650A63FB487335ECEB81141359AA928F4D98FDB3D93E8B690C80D37DED11C389141359AA928F4D98FDB3D93E8B690C80D37DED11C3',
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
    OfferFeeRateNum: '000000000000000A',
    Sequence: 116,
    SigningPubKey: '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
    TransactionType: 'Brokerage',
    TxnSignature: '304502210091F0DBF8C80E53F93C1D7E9898CB96E00AE5F1CB5B68A20828E31807B1333A920220047F13F40B05AFB1CCC7EA0670FF3840F3ADD4CB442929650A63FB487335ECEB',
    hash: '67506B732F4298F731EF6FF32BAB3DB19AB6D75607556828B56B308B14599026'
  }
}
```

:::

### 7.2 写入相关 - 多签

::: tip 事务 (和 lib/api Remote 表现一致)
buildXyzTx(options) 生成 单签(@swtc/transaction).Transaction 实例 tx

但是签名是由预先设置好的多个账户进行签名， 达到预设的阈值可以提交到帐本中

- 账户设置
- 创建单签事务 tx = Remote.buildXyzTx(options)
- 设置 sequence tx.\_setSequencePromise()
- 设置足够的燃料 tx.setFee()
- 分发并收集签名 tx.multiSigning()
- 组装 tx.multiSigned()

多签应该本地签好/组装好

使用 tx.submitPromise()提交

:::

#### 7.2.0 Remote.buildTx(tx_json: object) 可以组装事务

::: tip
多签过程中需要 传送 `tx_json`, 可配合重新组装

等价 `Transaction.buildTx(tx_json: object, Remote)`
:::

#### 7.2.0 Remote.getAccountSignerList(address: string, params: IRpcAccountObjectsOptions = {account: ""}) 查询账户设置

::: tip 调用

```typescript
public getAccountSignerList(address: string, params: IRpcAccountObjectsOptions = {account: ""}) {
  return this.getAccountObjects(address, {...params, type: "SignerList"})
}
```

:::
::: details 代码示例

```javascript
> const Remote = require("@swtc/rpc").Remote
> const remote = new Remote({server: "http://swtclib.ca:5050"})
> remote.getAccountSignerList("jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz").then(console.log).catch(console.error)
Promise { <pending> }
> {
  account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  account_objects: [
    {
      Flags: 0,
      LedgerEntryType: 'SignerList',
      OwnerNode: '0000000000000000',
      PreviousTxnID: '5917B3F760BFC0F5BFE5EF5EAE2642FDEE6908606E37FE76561C7A7F137B76C9',
      PreviousTxnLgrSeq: 15203720,
      SignerEntries: [Array],
      SignerQuorum: 5,
      index: '4A017344F9068871DC873D548052FFFF7271B86DDEB68AA93A515A5D0228BC21'
    }
  ],
  ledger_current_index: 17881328,
  status: 'success',
  validated: false
}
> remote.getAccountSignerList("jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz").then(result => console.log(result.account_objects[0].SignerEntries)).catch(console.error)
Promise { <pending> }
> [
  {
    SignerEntry: { Account: 'jfdqBEDsbk3eMSXX2t7CGeu2RPkEjHs6ie', SignerWeight: 3 }
  },
  {
    SignerEntry: { Account: 'jfqiMxoT228vp3dMrXKnJXo6V9iYEx94pt', SignerWeight: 3 }
  }
]
```

:::

#### 7.2.1 Remote.buildSignerListTx(options: ISignerListTxOptions) 更新账户设置

::: warning 废止主密钥
通常情况下， 启用多签的账户应该废止主密钥

可以通过 `Remote.buildAccountSetTx({account, type: "property", set_flag: 4}).submitPromise()`
:::
::: tip 参数

```typescript
interface ISignerListTxOptions {
  lists: any[]
  account?: string
  address?: string
  threshold: string | number
}
```

:::
::: details 代码示例

```javascript
const sleep = timeout =>
  new Promise(resolve => setTimeout(() => resolve(), timeout || 1))
const { Remote } = require("@swtc/rpc")
const Wallet = Remote.Wallet

const remote = new Remote({ server: "http://swtcnode:5050" })

const wallet = Wallet.fromSecret("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
const wallet_ec = Wallet.fromSecret("shVCQFSxkF7DLXkrHY8X2PBKCKxS9")
const wallet_ed = Wallet.fromSecret("sEdTJSpen5J8ZA7H4cVGDF6oSSLLW2Y")
const wallet_nosign = "jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh"
const wallet_to = "jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG"

const tx = remote.buildSignerListTx({
  account: wallet.address,
  threshold: 5,
  lists: [
    { account: wallet_ec.address, weight: 3 },
    { account: wallet_ed.address, weight: 3 },
    { account: wallet_nosign, weight: 3 }
  ]
})
console.log(tx.tx_json)

main()

async function main() {
  let result = await remote.getAccountSignerList(wallet.address)
  console.log("===========before===========")
  console.log(result.account_objects[0].SignerEntries)
  console.log("===========update===========")
  console.log(await tx.submitPromise(wallet.secret))
  console.log("===========sleeping===========")
  await sleep(15 * 1000)
  console.log("===========after===========")
  result = await remote.getAccountSignerList(wallet.address)
  console.log(result.account_objects[0].SignerEntries)
}
```

输出

```javascript
{
  Flags: 0,
  Fee: 10000,
  SignerEntries: [
    { SignerEntry: [Object] },
    { SignerEntry: [Object] },
    { SignerEntry: [Object] }
  ],
  TransactionType: 'SignerListSet',
  Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  SignerQuorum: 5
}
===========before===========
[
  {
    SignerEntry: { Account: 'jfdqBEDsbk3eMSXX2t7CGeu2RPkEjHs6ie', SignerWeight: 3 }
  },
  {
    SignerEntry: { Account: 'jfqiMxoT228vp3dMrXKnJXo6V9iYEx94pt', SignerWeight: 3 }
  }
]
===========update===========
{
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  status: 'success',
  tx_blob: '1200CF220000000024000000752026000000056840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E157446304402205A2638F015DEA84EA23B609423545BAB51C3B3A3AD87644B55C63A6FFAEE23CD022001E2E0E39F0E3410F07F64088509C0047374C76BFBAE02295E61EF8DF32F181681141359AA928F4D98FDB3D93E8B690C80D37DED11C3FBEC130003811448C7F1F5E9D4D0FC0D3F16F1606ACCCFB8D51463E1EC13000381144B0DECFADE9D4170260CD5BA9EC1CF065CA88946E1EC1300038114B5F762798A53D543A014CAF8B297CFF8F2F937E8E1F1',
  tx_json: {
    Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Fee: '10000',
    Flags: 0,
    Sequence: 117,
    SignerEntries: [ [Object], [Object], [Object] ],
    SignerQuorum: 5,
    SigningPubKey: '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
    TransactionType: 'SignerListSet',
    TxnSignature: '304402205A2638F015DEA84EA23B609423545BAB51C3B3A3AD87644B55C63A6FFAEE23CD022001E2E0E39F0E3410F07F64088509C0047374C76BFBAE02295E61EF8DF32F1816',
    hash: '20CC980EDC53BD8D0BB8C10422147A27C3037CBB5A292A0750C8E8ED29325477'
  }
}
===========sleeping===========
===========after===========
[
  {
    SignerEntry: { Account: 'jfdqBEDsbk3eMSXX2t7CGeu2RPkEjHs6ie', SignerWeight: 3 }
  },
  {
    SignerEntry: { Account: 'jfqiMxoT228vp3dMrXKnJXo6V9iYEx94pt', SignerWeight: 3 }
  },
  {
    SignerEntry: { Account: 'jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh', SignerWeight: 3 }
  }
]
```

:::

#### 7.2.2 创建单签 设置序号/费用/memo

::: tip 创建事务
`组织者` 创建常规事务，这里以支付为例。

`tx.tx_json` 用来传送给多签参与者组装/签名/返回

`组织者`(简化情况下也可以最后一个签名者) 完成最后组装 提交
:::

::: details 代码示例

```javascript
> const Remote = require('@swtc/rpc').Remote
> const Wallet = Remote.Wallet
> const remote = new Remote({server: "http://swtcnode:5050"})
> const wallet = Wallet.fromSecret("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
> const tx = remote.buildPaymentTx({
... from: wallet.address,
... to: "jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG",
... amount: remote.makeAmount(0.1, "slash")
... })
> tx._setSequencePromise().then(() => {})
Promise { <pending> }
> tx.addMemo("多签示例")
> tx.setFee(30000)
undefined
> console.log(JSON.stringify(tx.tx_json,"",2))
{
  "Flags": 0,
  "Fee": 30000,
  "TransactionType": "Payment",
  "Account": "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  "Amount": {
    "currency": "JSLASH",
    "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    "value": 0.1
  },
  "Destination": "jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG",
  "Memos": [
    {
      "Memo": {
        "MemoData": "多签示例"
      }
    }
  ],
  "Sequence": 120
}
```

:::

#### 7.2.3 tx.multiSigning(wallet: object) 传递/组装/签名/回传

::: tip
简化流程下， `组织者` 可以依次传送 tx.tx_json 给多签参与方， 这样不需要手工更新签名

1. 传送 `tx_json` 给第一个同意签名者， 完成后收到回传的 `tx_json`, 此时内容已更新并包含第一个签名
2. 传送 更新后的`tx_json` 给下一个同意签名者， 完成后收到回传的 `tx_json`, 此时内容已更新并包含下一个签名
3. 依次递推
   :::

::: details 代码示例
第一个签名，以收到的 `tx_json` 组装 tx_first, 签名后 将 `tx_first.tx_json` 回传 （简化情况下可以直接传递给下一个签名者）

```javascript
> //const tx_json = `in whatever way you received`
> const Remote = require('@swtc/rpc').Remote
> const Wallet = Remote.Wallet
> const Transaction = Remote.Transaction
> const remote = new Remote({server: "http://swtcnode:5050"})
> const wallet_first = Wallet.fromSecret("shVCQFSxkF7DLXkrHY8X2PBKCKxS9")
> let tx_first = Transaction.buildTx(tx_json, remote)
> tx_first.multiSigning(wallet_first)
> console.log(JSON.stringify(tx_first.tx_json,"",2))
{
  "Flags": 0,
  "Fee": 0.03,
  "TransactionType": "Payment",
  "Account": "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  "Amount": {
    "currency": "JSLASH",
    "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    "value": "0.1"
  },
  "Destination": "jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG",
  "Memos": [
    {
      "Memo": {
        "MemoData": "E5A49AE7ADBEE7A4BAE4BE8B"
      }
    }
  ],
  "Sequence": 120,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jfdqBEDsbk3eMSXX2t7CGeu2RPkEjHs6ie",
        "SigningPubKey": "0261DD84455B92BDFD59C1DB2A5BD9CE1A3AF0FD531A08EEB2EE354C3BB230B878",
        "TxnSignature": "3045022100FDF8BEE7A22AAFB43B7862F943B3D2A1AF5A6937602401E07F45564F51A33C0902201C0371A4377234AE70F9A16BC5A44ABB863032544E70F48FFE8E790C05502A4C"
      }
    }
  ]
}
```

下一个签名，以收到的 `tx_json` 组装 tx_next, 签名后 将 `tx_next.tx_json` 回传 （简化情况下可以直接传递给下下一个签名者）

```javascript
> //const tx_json = `in whatever way you received`
> const Remote = require('@swtc/rpc').Remote
> const Wallet = Remote.Wallet
> const Transaction = Remote.Transaction
> const remote = new Remote({server: "http://swtcnode:5050"})
> const wallet_next = Wallet.fromSecret("shVCQFSxkF7DLXkrHY8X2PBKCKxS9")
> const tx_next = Transaction.buildTx(tx_json, remote)
> tx_next.multiSigning(wallet_next)
> console.log(JSON.stringify(tx_next.tx_json,"",2))
> {
  "Flags": 0,
  "Fee": 30000,
  "TransactionType": "Payment",
  "Account": "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  "Amount": {
    "currency": "JSLASH",
    "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    "value": "0.1"
  },
  "Destination": "jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG",
  "Memos": [
    {
      "Memo": {
        "MemoData": "E5A49AE7ADBEE7A4BAE4BE8B"
      }
    }
  ],
  "Sequence": 120,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jfdqBEDsbk3eMSXX2t7CGeu2RPkEjHs6ie",
        "SigningPubKey": "0261DD84455B92BDFD59C1DB2A5BD9CE1A3AF0FD531A08EEB2EE354C3BB230B878",
        "TxnSignature": "3045022100FDF8BEE7A22AAFB43B7862F943B3D2A1AF5A6937602401E07F45564F51A33C0902201C0371A4377234AE70F9A16BC5A44ABB863032544E70F48FFE8E790C05502A4C"
      }
    },
    {
      "Signer": {
        "Account": "jfqiMxoT228vp3dMrXKnJXo6V9iYEx94pt",
        "SigningPubKey": "ED68635043BC70DE82272BF5990642400CF79089B2ABCF8EF9D10FFFB96A658763",
        "TxnSignature": "40C4612F3BA50FAEEBA1FB30061CD0D77406BD2AFAAEF02AAC70E9FEAB7A8FF7DB207FFAA4A1F974CF86D383DB1112F543B7BA13E980DA2461ABB6F3EEAB170E"
      }
    }
  ]
}
```

:::

#### 7.2.4 tx.multiSigned() 最后组装/完成

::: tip
`组织者` 将收到的回传 `tx_json` 完成最后组装, 正常情况下需要 拷贝/粘贴 签名

简化流程下最后一个收到的 `tx_json` 中已经包含所有已经完成的签名
:::

::: details 代码示例

```javascript
> //const tx_json = `in whatever way you received`
> const Remote = require('@swtc/rpc').Remote
> const Transaction = Remote.Transaction
> const remote = new Remote({server: "http://swtcnode:5050"})
> const tx_final = Transaction.buildTx(tx_json, remote)
> tx_final.multiSigned()
> console.log(JSON.stringify(tx_final.tx_json,"",2))
{
  "Flags": 0,
  "Fee": 30000,
  "TransactionType": "Payment",
  "Account": "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  "Amount": {
    "currency": "JSLASH",
    "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    "value": "0.1"
  },
  "Destination": "jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG",
  "Memos": [
    {
      "Memo": {
        "MemoData": "E5A49AE7ADBEE7A4BAE4BE8B"
      }
    }
  ],
  "Sequence": 120,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jfdqBEDsbk3eMSXX2t7CGeu2RPkEjHs6ie",
        "SigningPubKey": "0261DD84455B92BDFD59C1DB2A5BD9CE1A3AF0FD531A08EEB2EE354C3BB230B878",
        "TxnSignature": "3045022100FDF8BEE7A22AAFB43B7862F943B3D2A1AF5A6937602401E07F45564F51A33C0902201C0371A4377234AE70F9A16BC5A44ABB863032544E70F48FFE8E790C05502A4C"
      }
    },
    {
      "Signer": {
        "Account": "jfqiMxoT228vp3dMrXKnJXo6V9iYEx94pt",
        "SigningPubKey": "ED68635043BC70DE82272BF5990642400CF79089B2ABCF8EF9D10FFFB96A658763",
        "TxnSignature": "40C4612F3BA50FAEEBA1FB30061CD0D77406BD2AFAAEF02AAC70E9FEAB7A8FF7DB207FFAA4A1F974CF86D383DB1112F543B7BA13E980DA2461ABB6F3EEAB170E"
      }
    }
  ]
}
```

:::

#### 7.2.5 tx.submitPromise() 提交

::: details 代码示例

```javascript
> tx_final.submitPromise().then(console.log).catch(console.error)
Promise { <pending> }
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  status: 'success',
  tx_blob: '1200002200000000240000007861D4438D7EA4C680000000000000000000004A534C4153480000000000A582E432BFC48EEDEF852C814EC57F3CD2D41596684000000000007530730081141359AA928F4D98FDB3D93E8B690C80D37DED11C38314AF09183A11AA70DA06E115E03B0E5478232740B5F9EA7D0CE5A49AE7ADBEE7A4BAE4BE8BE1F1FCED73210261DD84455B92BDFD59C1DB2A5BD9CE1A3AF0FD531A08EEB2EE354C3BB230B87874473045022100FDF8BEE7A22AAFB43B7862F943B3D2A1AF5A6937602401E07F45564F51A33C0902201C0371A4377234AE70F9A16BC5A44ABB863032544E70F48FFE8E790C05502A4C811448C7F1F5E9D4D0FC0D3F16F1606ACCCFB8D51463E1ED7321ED68635043BC70DE82272BF5990642400CF79089B2ABCF8EF9D10FFFB96A658763744040C4612F3BA50FAEEBA1FB30061CD0D77406BD2AFAAEF02AAC70E9FEAB7A8FF7DB207FFAA4A1F974CF86D383DB1112F543B7BA13E980DA2461ABB6F3EEAB170E81144B0DECFADE9D4170260CD5BA9EC1CF065CA88946E1F1',
  tx_json: {
    Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Amount: {
      currency: 'JSLASH',
      issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
      value: '0.1'
    },
    Destination: 'jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG',
    Fee: '30000',
    Flags: 0,
    Memos: [ [Object] ],
    Sequence: 120,
    Signers: [ [Object], [Object] ],
    SigningPubKey: '',
    TransactionType: 'Payment',
    hash: '58E8649815D892817168F4B0A30E0BFFC629F76C84FFF7576DDC3CCC5A8537E3'
  }
}
```

:::

### 7.3 写入相关 - 合约

::: tip 事务 (和 lib/api Remote 表现一致)
合约需要节点支持

目前公链上不支持
:::

#### 7.3.1 Remote.buildContractDeployTx(options: IContractDeployTxOptions) LUA 部署

#### 7.3.2 Remote.buildContractCallTx(options: IContractCallTxOptions) LUA 调用

#### 7.3.3 Remote.buildContractInitTx(options: IContractInitTxOptions) SOLIDITY 部署

#### 7.3.4 Remote.buildContractInvokeTx(options: IContractInvokeTxOptions) SOLIDITY 调用
