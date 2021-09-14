# SWTC-LIB

[[toc]]

## 0. 接口说明

> ##### 强制本地签名
>
> ##### 合约测试只能在特定节点运行, solidity 支持到 0.5.4, 需要安装 swtc-tum3 / tum3-eth-abi, 没有达到可用阶段
>
> ##### 集成生态节点 failover `const remote = new Remote() ; remote.connectPromise().then(console.log).catch(console.error)`
>
> ##### 多重签名测试链上没有支持
>
> ##### [应用实例](../examples/)

## 1 安装

1. 安装 SWTC 公链库

```bash
npm install --save @swtc/lib
```

## 2 项目文件结构

##### @swtc/lib 库基于 ws 协议跟底层交互，其中 ws 封装到 Server 类中，Server 类是一个内部类，不对 外开放;Server 类封装在 Remote 类中，Remote 类提供对外访问接口并可创建两类对象:Get 方 式请求的 Request 对象和 Post 方式请求的 Transaction 对象，这两类对象都通过 submit()或者 submitPromise()方法提交 数据到底层。

文件结构图如下
![structure](/structure.png)

## 3 创建钱包

> ##### 首先引入@swtc/lib 库的 Wallet 对象，然后使用以下两种方法创建钱包
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

##### Remote 是跟井通底层交互最主要的类，它可以组装交易发送到底层、订阅事件及从底层拉取数据。提供以下方法:

- Remote(options)
- connect(callback)
- disconnect()
- requestServerInfo()
- requestLedgerClosed()
- requestLedger(options)
- requestTx(options)
- requestAccountInfo(options)
- requestAccountTums(options)
- requestAccountRelations(options)
- requestAccountOffers(options)
- requestAccountTx(options)
- requestOrderBook(options)
- requestPathFind(options)
- createAccountStub()
- createOrderBookStub()
- buildPaymentTx(options)
- buildRelationTx(options)
- buildAccountSetTx(options)
- buildOfferCreateTx(options)
- buildOfferCancelTx(options)
- deployContractTx(options)
- callContractTx(options)

##### @swtc/lib REMOTE 独享

- makeCurrency()
- makeAmount()
- remote.connectPromise()
- req.submitPromise()
- tx.signPromise()
- tx.submitPromise()

### 4.1 创建 Remote 对象

##### 方法:new Remote(options);

##### 参数:

| 参数     | 类型    |               说明 |
| -------- | ------- | -----------------: |
| server   | String  |   井通底层服务地址 |
| issuer   | String  |           默认银关 |
| solidity | Boolean | 启用 solidity 支持 |

##### 例子

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
```

### 4.2 创建连接

##### 每个 Remote 对象都应该首先手动连接底层，然后才可以请求底层的数据。请求结果在回调函数 callback 中

##### 方法: connect(callback)

##### 参数: 回调函数 callback(err, result)

##### 方法: connectPromise()

##### 参数: 无

##### 例子

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
// remote.connect( (error, server_info) => {
// 	if (error) {
// 		console.log(error)
// 	} else {
// 		console.log(server_info)
// 		remote.disconnect()
// 	}
// })
remote
  .connectPromise()
  .then(server_info => {
    console.log(server_info)
    remote.disconnect()
  })
  .catch(console.error)
```

##### 返回结果

```json
{
  "fee_base": 10,
  "fee_ref": 10,
  "hostid": "WALE",
  "ledger_hash": "325C01E5F35D6742D731883E4347A7CF227CF2C9410DBAFACCBF8007F29D47BB",
  "ledger_index": 2838574,
  "ledger_time": 607469770,
  "load_base": 256,
  "load_factor": 256,
  "pubkey_node": "n9KFgztij6QLsCk4AqDFteyJRJjMFRWV85h75wpaohRm6wVNRmDS",
  "random": "1E4412BDAC455C0FFED34716BFD414BC57298A1D456E502669E99EE35761DB96",
  "reserve_base": 10000000,
  "reserve_inc": 1000000,
  "server_status": "full",
  "validated_ledgers": "100-2064052,2106781-2838574"
}
```

##### 返回结果说明:

| 参数              | 类型    |                         说明 |
| ----------------- | ------- | ---------------------------: |
| fee_base          | Integer | 基础费用(手续费计算公式因子) |
| fee_ref           | Integer | 引用费用(手续费计算公式因子) |
| hostid            | String  |                       主机名 |
| ledger_hash       | String  |                    账本 hash |
| ledger_index      | Integer |                     区块高度 |
| ledger_time       | Integer |                 账本关闭时间 |
| pubkey_node       | String  |                     节点公钥 |
| reserve_base      | Integer |                   账号保留值 |
| reserve_inc       | Integer |   用户每次挂单或信任冻结数量 |
| server_status     | String  |                   服务器状态 |
| validated_ledgers | String  |                     账本区间 |

### 4.3 关闭连接 每个 Remote 对象可以手动关闭连接。

##### 方法:disconnect()

##### 参数:无

##### 例子

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote
  .connectPromise()
  .then(() => remote.disconnect())
  .catch(console.error)
```

### 4.4 请求底层服务器信息

##### 首先通过本方法返回一个 Request 对象，然后通过 submitPromise 方法获得井通底层的服务器信息，包含 服务程序版本号 version、该服务器缓存的账本区间 ledgers、节点公钥 node、服务器当前状态 state。其中服务器当前状态包含可提供服务状态 full 和验证节点状态 proposing。

##### 方法:requestServerInfo()

##### 参数:无

##### 返回:Request 对象

##### 例子:

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote
  .connectPromise()
  .then(async () => {
    let response = await remote.requestServerInfo().submitPromise()
    console.log(response)
    remote.disconnect()
  })
  .catch(console.error)
```

##### 返回结果

```javascript
> serverInfo: { complete_ledgers: '100-2064052,2106781-2838682',
  ledger:
   '77EC394117B23104A87F242664328045D380B419550EBF619B2251516991C548',
  public_key: 'n9KFgztij6QLsCk4AqDFteyJRJjMFRWV85h75wpaohRm6wVNRmDS',
  state: 'full   851:35:58',
  peers: 5,
  version: 'skywelld-0.29.60' }
```

##### 返回结果说明:

| 参数    | 类型   |               说明 |
| ------- | ------ | -----------------: |
| version | String | 服务器部署项目版本 |
| ledgers | String |           账本区间 |
| node    | String |           节点公钥 |
| state   | String |         服务器状态 |

### 4.5 获取最新账本信息

##### 首先通过本方法返回一个 Request 对象，然后通过 submitPromise 方法获得最新账本信息，包括区块高度(ledger_index)与区块 hash(ledger_hash)

##### 方法: requestLedgerClosed()

##### 参数: 无

##### 返回: Request 对象

##### 例子:

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote
  .connectPromise()
  .then(async () => {
    let response = await remote.requestLedgerClosed().submitPromise()
    console.log(response)
    remote.disconnect()
  })
  .catch(console.error)
```

##### 返回结果

```javascript
> ledgerInfo: { ledger_hash:
   '93D6C3B76B5D6A2637F92F88A8CFB42C8433DA0EE69BD08A8CFAC327571173DD',
  ledger_index: 2838718 }
```

##### 返回结果说明

| 参数         | 类型   |              说明 |
| ------------ | ------ | ----------------: |
| ledger_hash  | String |         账本 hash |
| ledger_index | String | 账本高度/区块高度 |

### 4.6 获取某一账本具体信息

##### 首先通过本方法返回一个 Request 对象，然后通过 submitPromise 方法获得某一账本的具体信息

##### 方法:remote.requestLedger({ledger_index:’8488670’,transactions:true});

##### 参数:

| 参数         | 类型    |                                        说明 |
| ------------ | ------- | ------------------------------------------: |
| ledger_index | String  |                                井通区块高度 |
| ledger_hash  | String  | 井通区块 hash(与上面 ledger_index 二选其一) |
| transactions | Boolean |   是否返回账本上的交易记录 hash，默认 false |

注:整体参数是 Object 类型，当参数都不填时，默认返回最新账本信息

##### 返回:Request 对象

##### 例子

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote
  .connectPromise()
  .then(async () => {
    let response = await remote
      .requestLedger({
        ledger_index: "2838718",
        transactions: true
      })
      .submitPromise()
    console.log(response)
    remote.disconnect()
  })
  .catch(console.error)
```

##### 返回结果

```javascript
> res: { accepted: true,
  account_hash:
   '4E64CF69B07D71B5216D8F9D8030D9D73958B34550A30FA7AC5894FF418FF9D4',
  close_time: 607471210,
  close_time_human: '2019-Apr-01 22:00:10',
  close_time_resolution: 10,
  closed: true,
  hash:
   '93D6C3B76B5D6A2637F92F88A8CFB42C8433DA0EE69BD08A8CFAC327571173DD',
  ledger_hash:
   '93D6C3B76B5D6A2637F92F88A8CFB42C8433DA0EE69BD08A8CFAC327571173DD',
  ledger_index: '2838718',
  parent_hash:
   '71CE1471C329AB64CDEF40C17484317760BA7C2DFFC731AE187AF0318BA6E20A',
  seqNum: '2838718',
  totalCoins: '600000000000000000',
  total_coins: '600000000000000000',
  transaction_hash:
   '0000000000000000000000000000000000000000000000000000000000000000',
  transactions: [] }
```

##### 返回结果说明

| 参数                   | 类型    |               说明 |
| ---------------------- | ------- | -----------------: |
| accepted               | Boolean |   区块是否已经产生 |
| account_hash           | String  |     状态 hash 树根 |
| close_time             | Integer |           关闭时间 |
| close_time_human       | String  |           关闭时间 |
| close_time_resoluti on | Integer |           关闭周期 |
| closed                 | Boolean |   账本是否已经关闭 |
| hash                   | String  |          账本 hash |
| ledger_hash            | String  |          账本 hash |
| ledger_index           | String  |  账本高度/区块高度 |
| parent_hash            | String  |   上一区块 hash 值 |
| seqNum                 | String  |  账本高度/区块高度 |
| totalCoins             | String  |           swt 总量 |
| total_coins            | String  |           swt 总量 |
| transaction_hash       | String  |     交易 hash 树根 |
| transactions           | Array   | 该账本里的交易列表 |

### 4.7 查询某一交易具体信息

##### 首先通过本方法返回一个 Request 对象，然后通过 submitPromise 方法获得某一交易的具体信息。

##### 方法:remote.requestTx({hash:’xxx’});

##### 参数:

| 参数 | 类型   |      说明 |
| ---- | ------ | --------: |
| hash | String | 交易 hash |

##### 返回: Request 对象

##### 例子:

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote
  .connectPromise()
  .then(async () => {
    let req = remote.requestTx({
      hash: "2C3F60ABEC539BEE768FAE1820B9C284C7EC2D45EF1D7F9E28F4357056E822F7"
    })
    let response = await req.submitPromise()
    console.log(response)
    remote.disconnect()
  })
  .catch(console.error)
```

##### 返回结果

```javascript
> res: { Account: 'jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF',
  Amount: '100000000000',
  Destination: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  Fee: '10000',
  Flags: 0,
  Memos: [ { Memo: [Object] }, { Memo: [Object] } ],
  Sequence: 3,
  SigningPubKey:
   '0294535FEE309F280DC4CF9F4134ECC909F8521CF51FEB7D72454E77F929DCB8C9',
  TransactionType: 'Payment',
  TxnSignature:
   '30440220725FF0939129E01A1BBFD6F557D82184B08F20406C4B637F6DFCCDC047F4783F022064EEFE5F42A58903E95C16D14CE228584CDE37EB599D496CAA3EDFF2E5913838',
  date: 607487990,
  hash:
   '2C3F60ABEC539BEE768FAE1820B9C284C7EC2D45EF1D7F9E28F4357056E822F7',
  inLedger: 2840396,
  ledger_index: 2840396,
  meta:
   { AffectedNodes: [ [Object], [Object], [Object] ],
     TransactionIndex: 0,
     TransactionResult: 'tesSUCCESS',
     delivered_amount: 'unavailable' },
  validated: true }
关键信息:【 交易费: 0.01 】
```

##### 返回结果说明

| 参数                                 | 类型           |             说明 |
| ------------------------------------ | -------------- | ---------------: |
| Account                              | String         |         钱包地址 |
| Amount                               | String/O bject |         交易金额 |
| Destination                          | String         |     交易对家地址 |
| Fee                                  | String         |           交易费 |
| Flags                                | Integer        |         交易标记 |
| Memos                                | Array          |             备注 |
| Sequence                             | Integer        | 自身账号的交易号 |
| SigningPubKey                        | String         |         签名公钥 |
| Timestamp                            | Integer        |   交易提交时间戳 |
| TransactionType                      | String         |         交易类型 |
| TxnSignature                         | String         |         交易签名 |
| date                                 | Integer        |   交易进账本时间 |
| hash                                 | String         |        交易 hash |
| inLedger                             | Integer        | 交易所在的账本号 |
| ledger_index                         | Integer        |         账本高度 |
| meta                                 | Object         |   交易影响的节点 |
| &nbsp;&nbsp;&nbsp; AffectedNodes     | Array          |     受影响的节点 |
| &nbsp;&nbsp;&nbsp; TransactionIndex  | Integer        |               -- |
| &nbsp;&nbsp;&nbsp; TransactionResult | String         |         交易结果 |
| validated                            | Boolean        | 交易是否通过验证 |

### 4.8 请求账号信息

##### 首先通过本方法返回一个 Request 对象，然后通过 submitPromise 方法获得某一账号的交易信息。

##### 方法:remote.requestAccountInfo({account:’xxx’});

##### 参数:

| 参数    | 类型   |         说明 |
| ------- | ------ | -----------: |
| account | String | 井通钱包地址 |

##### 返回:Request 对象

##### 例子

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote
  .connectPromise()
  .then(async () => {
    let options = { account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz" }
    let req = remote.requestAccountInfo(options)
    let response = await req.submitPromise()
    console.log(response)
    remote.disconnect()
  })
  .catch(console.error)
```

##### 返回结果

```javascript
> res: { account_data:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Balance: '100000000000',
     Flags: 0,
     LedgerEntryType: 'AccountRoot',
     OwnerCount: 0,
     PreviousTxnID:
      '2C3F60ABEC539BEE768FAE1820B9C284C7EC2D45EF1D7F9E28F4357056E822F7',
     PreviousTxnLgrSeq: 2840396,
     Sequence: 1,
     index:
      'DB35CDEAF3F0D3C190B041C0C7D92FB0E43CBCBFAD4F498C28858A35CEA8BBB7' },
  ledger_hash:
   '7669E43FAD8A9926ECDDF642939A0B7EA48E0584FD4730F4CA68994E4C6890AB',
  ledger_index: 2840469,
  validated: true }
```

##### 返回结果说明

| 参数                          | 类型    |                                   说明 |
| ----------------------------- | ------- | -------------------------------------: |
| account_data                  | Object  |                               账号信息 |
| &nbsp;&nbsp;Account           | String  |                               钱包地址 |
| &nbsp;&nbsp;Balance           | String  |                               swt 数量 |
| &nbsp;&nbsp;Domain            | String  |                                   域名 |
| &nbsp;&nbsp;Flags             | Integer |                               属性标志 |
| &nbsp;&nbsp;MessageKey        | String  | 公共密钥，用于发送加密的邮件到这个帐户 |
| &nbsp;&nbsp;OwnerCount        | Integer |     用户拥有的挂单数和信任线数量的总和 |
| &nbsp;&nbsp;PreviousTxnID     | String  |            操作该帐号的上一笔交易 hash |
| &nbsp;&nbsp;PreviousTxnLgrSeq | Integer |           该帐号上一笔交易所在的账本号 |
| &nbsp;&nbsp;RegularKey        | String  |                             RegularKey |
| &nbsp;&nbsp;Sequence          | Integer |                         账号当前序列号 |
| &nbsp;&nbsp;TransferRate      | Integer |                             手续费汇率 |
| &nbsp;&nbsp;index             | String  |                    该数据所在索引 hash |
| ledger_hash                   | String  |                              账本 hash |
| ledger_index                  | Integer |                               账本高度 |
| validated                     | Boolean |                       交易是否通过验证 |

### 4.9 获得账号可接收和发送的货币

##### 首先通过本方法返回一个 Request 对象，然后通过 submitPromise 方法获得某一账号可发送和接收的货币种类。

##### 方法:remote.requestAccountTums({account:’xxx’});

##### 参数:

| 参数    | 类型   |         说明 |
| ------- | ------ | -----------: |
| account | String | 井通钱包地址 |

##### 返回:Request 对象

##### 例子:

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote
  .connectPromise()
  .then(async () => {
    let options = { account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz" }
    let req = remote.requestAccountTums(options)
    let response = await req.submitPromise()
    console.log(response)
    remote.disconnect()
  })
  .catch(console.error)
```

##### 返回结果

```javascript
> res: { ledger_hash:
   '80F7661460F62D707F923F4D6932624A1CBA6EF5E1F1CC4577AEA27D545CF2BD',
  ledger_index: 2861794,
  receive_currencies: [ 'CNY' ],
  send_currencies: [ 'CNY' ],
  validated: true }
```

##### 返回结果说明

| 参数               | 类型    |             说明 |
| ------------------ | ------- | ---------------: |
| ledger_hash        | String  |        账本 hash |
| ledger_index       | Integer |         账本高度 |
| receive_currencies | Array   | 可接收的货币列表 |
| send_currencies    | Array   | 可发送的货币列表 |
| validated          | Boolean | 交易是否通过验证 |

### 4.10 获得账号关系

##### 井通账户之间会建立各种不同的关系。这些关系由井通后台的关系(relations)机制来处理，目前支持以下关系:信任(trust)、授权(authorize)、冻结(freeze)。

##### 首先通过本方法返回一个 Request 对象，然后通过 submitPromise 方法获得某一账号指定关系的信息

##### 方法:remote.requestAccountRelations({account:’xxx’,type:’xxx’});

##### 参数:

| 参数    | 类型   |                                            说明 |
| ------- | ------ | ----------------------------------------------: |
| account | String |                                    井通钱包地址 |
| type    | String | 关系类型，固定的三个值:trust、authorize、freeze |

##### 返回: Request 对象

##### 例子

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote
  .connectPromise()
  .then(async () => {
    let options = {
      account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
      type: "trust"
    }
    let req = remote.requestAccountRelations(options)
    let response = await req.submitPromise()
    console.log(response)
    remote.disconnect()
  })
  .catch(console.error)
```

##### 返回结果

```javascript
> res: { account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  ledger_hash:
   '427B3AD89CDA0A9B7ED229796EA4D10B781E4CAA14F89DBDA61086BBCCD0BA42',
  ledger_index: 2861802,
  lines:
   [ { account: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
       balance: '100',
       currency: 'CNY',
       limit: '1000000000',
       limit_peer: '0',
       no_skywell: true,
       quality_in: 0,
       quality_out: 0 } ],
  validated: true }
```

##### 返回结果说明

| 参数         | 类型    |                       说明 |
| ------------ | ------- | -------------------------: |
| account      | String  |                   钱包地址 |
| ledger_hash  | String  |                  账本 hash |
| ledger_index | Integer |                   账本高度 |
| lines        | Array   |             该账户的信任线 |
| account      | String  |                 信任的银关 |
| balance      | String  |                       余额 |
| currency     | String  |                   货币种类 |
| limit        | String  |                   信任额度 |
| limit_peer   | String  | 对方设置的信任额度，默认 0 |
| quality_in   | Integer | 兑换比例，默认 0，暂时未用 |
| quality_out  | Integer | 兑换比例，默认 0，暂时未用 |
| validated    | Boolean |           交易是否通过验证 |

### 4.11 获得账号挂单

##### 首先通过本方法返回一个 Request 对象，然后通过 submitPromise 方法获得某一账号的挂单信息

##### 方法:remote.requestAccountOffers({account:’xxx’});

##### 参数:

| 参数    | 类型   |         说明 |
| ------- | ------ | -----------: |
| account | String | 井通钱包地址 |

##### 例子

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote
  .connectPromise()
  .then(async () => {
    let options = { account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz" }
    let req = remote.requestAccountOffers(options)
    let response = await req.submitPromise()
    console.log(response)
    remote.disconnect()
  })
  .catch(console.error)
```

##### 返回结果

```javascript
> res: { account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  ledger_hash:
   'E02BA6ED09F7D946D6D4FE85FB5F29590A358551ECD463D9FEE40B8B9F6141E9',
  ledger_index: 2861816,
  offers:
   [ { flags: 131072,
       seq: 4,
       taker_gets: '1000000',
       taker_pays: [Object] } ],
  validated: true }
```

##### 返回结果说明

| 参数                             | 类型    |                              说明 |
| -------------------------------- | ------- | --------------------------------: |
| account                          | String  |                          钱包地址 |
| ledger_hash                      | String  |                         账本 hash |
| ledger_index                     | Integer |                          账本高度 |
| offers                           | Array   |                  该账户的挂单列表 |
| &nbsp;&nbsp;flags                | Integer | 买卖类型(131072 表示卖，否则是买) |
| &nbsp;&nbsp;seq                  | String  |                              余额 |
| &nbsp;&nbsp;taker_gets           | String  |                          货币种类 |
| &nbsp;&nbsp;&nbsp;&nbsp;value    | String  |                              金额 |
| &nbsp;&nbsp;&nbsp;&nbsp;currency | String  |                          货币种类 |
| &nbsp;&nbsp;&nbsp;&nbsp;issuer   | String  |                              货币 |
| &nbsp;&nbsp;taket_pays           | String  |                          信任额度 |
| &nbsp;&nbsp;&nbsp;&nbsp;value    | String  |                              金额 |
| &nbsp;&nbsp;&nbsp;&nbsp;currency | String  |                          货币种类 |
| &nbsp;&nbsp;&nbsp;&nbsp;issuer   | String  |                              货币 |
| validated                        | Boolean |                  交易是否通过验证 |

### 4.12 获得账号交易列表

##### 首先通过本方法返回一个 Request 对象，然后通过 submitPromise 方法获得某一账号的交易列表信息。

##### 方法:remote.requestAccountTx({account:’xxx’});

##### 参数:

| 参数    | 类型    |                         说明 |
| ------- | ------- | ---------------------------: |
| account | String  |                 井通钱包地址 |
| limit   | Integer | 限定返回多少条记录，默认 200 |

##### 返回:Request 对象

##### 例子:

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote
  .connectPromise()
  .then(async () => {
    let options = { account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz" }
    let req = remote.requestAccountTx(options)
    let response = await req.submitPromise()
    console.log(response)
    remote.disconnect()
  })
  .catch(console.error)
```

##### 返回结果

```javascript
> res: { account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  ledger_index_max: 2844681,
  ledger_index_min: 101,
  transactions:
   [ { date: 1554174490,
       hash:
        'EB94F5155E8977B888E553C10C8EAC9567426BD3AF186E321CB614F4DCD1A4F2',
       type: 'sent',
       fee: '0.01',
       result: 'tesSUCCESS',
       memos: [Array],
       counterparty: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
       amount: [Object],
       effects: [] },
     { date: 1554172790,
       hash:
        '2C3F60ABEC539BEE768FAE1820B9C284C7EC2D45EF1D7F9E28F4357056E822F7',
       type: 'received',
       fee: '0.01',
       result: 'tesSUCCESS',
       memos: [Array],
       counterparty: 'jpLpucnjfX7ksggzc9Qw6hMSm1ATKJe3AF',
       amount: [Object],
       effects: [] } ] }
```

##### 返回结果说明

| 参数                                   | 类型    |                         说明 |
| -------------------------------------- | ------- | ---------------------------: |
| account                                | String  |                     钱包地址 |
| ledger_index_max                       | Integer | 当前节点缓存的账本区间最大值 |
| ledger_index_min                       | Integer | 当前节点缓存的账本区间最小值 |
| marker                                 | Object  |           查到的当前记录标记 |
| transactions                           | Array   |                 交易记录列表 |
| &nbsp;&nbsp;date                       | Integer |                       时间戳 |
| &nbsp;&nbsp;hash                       | String  |                    交易 hash |
| &nbsp;&nbsp;type                       | String  |                     交易类型 |
| &nbsp;&nbsp;fee                        | String  |                       手续费 |
| &nbsp;&nbsp;result                     | String  |                     交易结果 |
| &nbsp;&nbsp;memos                      | Array   |                         备注 |
| &nbsp;&nbsp;counterparty               | String  |                     交易对家 |
| &nbsp;&nbsp;amount                     | Object  |                 交易金额对象 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;value    | String  |                         金额 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;currency | String  |                     货币种类 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;issuer   | String  |                         货币 |
| effects                                | Array   |                     交易效果 |

### 4.13 获得市场挂单

##### 首先通过本方法返回一个 Request 对象，然后通过 submitPromise 方法获得市场挂单列表信息。

##### 方法:remote.requestOrderBook({});

##### 参数:

| 参数 | 类型   |                   说明 |
| ---- | ------ | ---------------------: |
| gets | Object | 对家想要获得的货币信息 |
| pays | Object | 对家想要支付的货币信息 |

##### 例子

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote
  .connectPromise()
  .then(async () => {
    let options = {
      limit: 5,
      pays: remote.makeCurrency(),
      gets: remote.makeCurrency("CNY")
    }
    let req = remote.requestOrderBook(options)
    let response = await req.submitPromise()
    console.log(response)
    remote.disconnect()
  })
  .catch(console.error)
```

##### 返回结果

```javascript
> res: { ledger_current_index: 2861869,
  offers:
   [ { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
       BookDirectory:
        'AEC975E9D5B0DB3D88C5D0A31AB2884D40328C8ABE4E02664D038D7EA4C68000',
       BookNode: '0000000000000000',
       Flags: 131072,
       LedgerEntryType: 'Offer',
       OwnerNode: '0000000000000000',
       PreviousTxnID:
        '3EB37E4CB1017C1A5F4DA81B95CBB94345405BA7F791445BF9EEA9AB8C177DD8',
       PreviousTxnLgrSeq: 2861851,
       Sequence: 7,
       TakerGets: '1000000',
       TakerPays: [Object],
       index:
        '483DCDC95C3B1BECE5E67CBE8AD883607F6B63151E3233C9151C50AE4E96C59E',
       owner_funds: '11085930000',
       quality: '0.00000001' } ],
  validated: false }
```

##### 返回结果说明

| 参数                             | 类型    |                                                                   说明 |
| -------------------------------- | ------- | ---------------------------------------------------------------------: |
| ledger_current_index             | String  |                                                             当前账本号 |
| offers                           | Array   |                                                           市场挂单列表 |
| &nbsp;&nbsp;Account              | Integer |                                                               账号地址 |
| &nbsp;&nbsp;BookDirectory        | String  |                                                                     -- |
| &nbsp;&nbsp;BookNode             | String  |                                                                     -- |
| &nbsp;&nbsp;Flags                | Integer |                                                           挂单买卖标记 |
| &nbsp;&nbsp;LedgerEntryType      | String  |                                                       账本数据结构类型 |
| &nbsp;&nbsp;OwnerNode            | Array   |                                                                     -- |
| &nbsp;&nbsp;PreviousTxnID        | String  |                                                        上一笔交易 hash |
| &nbsp;&nbsp;PreviousTxnLgrSeq    | Integer |                                                   上一笔交易所在账本号 |
| &nbsp;&nbsp;Sequence             | Integer |                                                             单子序列号 |
| &nbsp;&nbsp;TakerGets            | Object  | 对方得到的。(买卖双方，当货币是 swt 时，数据类型 为对象;否则为 string) |
| &nbsp;&nbsp;&nbsp;&nbsp;value    | String  |                                                                   金额 |
| &nbsp;&nbsp;&nbsp;&nbsp;currency | String  |                                                               货币种类 |
| &nbsp;&nbsp;&nbsp;&nbsp;issuer   | String  |                                                                   货币 |
| TakerPays                        | String  |                                                             对方支付的 |
| index                            | String  |                                                    该数据所在索引 hash |
| owner_funds                      | String  |                                                          用户 swt 资产 |
| quality                          | String  |                                                       价格或价格的倒数 |
| validated                        | Boolean |                                                       交易是否通过验证 |

### 4.14 获得挂单佣金设置信息

##### 首先通过 requestBrokerage 方法返回一个 Request 对象，然后通过 submitPromise 方法提交。

##### 4.14.1 创建查询挂单佣金对象

###### 方法: remote.requestBrokerage({});

###### 参数:

| 参数    | 类型   |         说明 |
| ------- | ------ | -----------: |
| account | String | 井通钱包地址 |

###### 返回:Request 对象

##### <a name="brokerageSubmit"></a> 4.14.2 提交查询

###### 方法:request.submitPromise()

###### 参数: 无

###### 返回: Promise

##### 查询佣金完整例子

```javascript
const jlib = require("@swtc/lib")
const Remote = jlib.Remote
const remote = new Remote()
account = "jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG"
remote.connectPromise().then(async () => {
  let request = remote.requestBrokerage({ account })
  let result = await request.submitPromise()
  remote.disconnect()
  console.log(result)
})
```

##### 返回结果

```javascript
{ account: 'jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG',
  brokerages:
   [ { FeeCurrency: 'CNY',
       FeeCurrencyIssuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
       OfferFeeRateDen: '1000',
       OfferFeeRateNum: '1',
       Platform: 'jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG',
       fee_account: 'jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG' } ],
  ledger_hash:
   'D096FC540E2AA2AD0432EDF1B7F545D814D72972E6C8BA0B5A8221CB8612FE0E',
  ledger_index: 13681307,
  validated: true }
```

### 4.15 支付

##### 首先通过 buildPaymentTx 方法返回一个 Transaction 对象，addMemo 添加备注为可选项，最后通过 submitPromise 方法提交支付信息。

##### <a name="buildPaymentTx"></a> 4.15.1 创建支付对象

###### 方法: remote.buildPaymentTx({});

###### 参数:

| 参数     | 类型   |                                         说明 |
| -------- | ------ | -------------------------------------------: |
| account  | String |                                     发起账号 |
| to       | String |                                     目标账号 |
| amount   | Object |                                     支付金额 |
| value    | String |                                     支付数量 |
| currency | String | 货币种类，三到六个字母或 20 字节的自定义货币 |
| issuer   | String |                                   货币发行方 |

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
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote
  .connectPromise()
  .then(async () => {
    let tx = remote.buildPaymentTx({
      account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
      to: "jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D",
      amount: remote.makeAmount(99900)
    })
    let response = await tx.submitPromise(
      "ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C",
      "给支付"
    )
    console.log(response)
    remote.disconnect()
  })
  .catch(console.error)
```

##### 返回结果

```javascript
> res: { engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '120000220000000024000000016140000017428107006840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100EC761F10DDA2371C77437EE2C7A71379B4214CF77E1C4058C46236B3E446ACE90220456CFB5ACDEE1EB7DEAC4819B5CD19C09911518BD38810A77EF20863C776FC8081141359AA928F4D98FDB3D93E8B690C80D37DED11C38314054FADDC8595E2950FA43F673F65C2009F58C7F1F9EA7D09E7BB99E694AFE4BB98E1F1',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Amount: '99900000000',
     Destination: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
     Fee: '10000',
     Flags: 0,
     Memos: [ [Object] ],
     Sequence: 1,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TransactionType: 'Payment',
     TxnSignature:
      '3045022100EC761F10DDA2371C77437EE2C7A71379B4214CF77E1C4058C46236B3E446ACE90220456CFB5ACDEE1EB7DEAC4819B5CD19C09911518BD38810A77EF20863C776FC80',
     hash:
      'EB94F5155E8977B888E553C10C8EAC9567426BD3AF186E321CB614F4DCD1A4F2' } }
```

##### 返回结果说明

| 参数                              | 类型    |                  说明 |
| --------------------------------- | ------- | --------------------: |
| engine_result                     | String  |              请求结果 |
| engine_result_code                | Array   |          请求结果编码 |
| engine_result_message             | String  | 请求结果 message 信息 |
| &nbsp;&nbsp;&nbsp;tx_blob         | String  |   16 进制签名后的交易 |
| &nbsp;&nbsp;&nbsp;tx_json         | Object  |              交易内容 |
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

### 4.16 设置关系

##### 首先通过 buildRelationTx 方法返回一个 Transaction 对象，然后通过 submitPromise 方法提交支付信息。目前支持的关系类型:信任(trust)、授权(authorize)、冻结 (freeze)

##### <a name="buildRelationTx"></a> 4.16.1 创建关系对象

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

###### 方法: tx.submitPromise(secret);

###### 参数:无

##### 设置关系完整例子

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote
  .connectPromise()
  .then(async () => {
    let options = {
      account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
      target: "jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D",
      limit: remote.makeAmount(1, "CNY"),
      type: "authorize"
    }
    let tx = remote.buildRelationTx(options)
    let response = await tx.submitPromise(
      "ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C",
      "授权"
    )
    console.log(response)
    remote.disconnect()
  })
  .catch(console.error)
```

##### 返回结果

```javascript
> res: { engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '1200152200000000240000000820230000000163D4838D7EA4C68000000000000000000000000000434E590000000000054FADDC8595E2950FA43F673F65C2009F58C7F16840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574463044022078E283810BF73CB8D932077C757A9FC5881C52B7475BE010BFD8A9731FDE1BB802202268AE34DFF38C171A70623A5E4EFA9069645E39F12D03DE6D9DD826F481FAC881141359AA928F4D98FDB3D93E8B690C80D37DED11C38714054FADDC8595E2950FA43F673F65C2009F58C7F1',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Fee: '10000',
     Flags: 0,
     LimitAmount:
      { currency: 'CNY',
        issuer: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
        value: '1' },
     RelationType: 1,
     Sequence: 8,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     Target: 'jVnqw7H46sjpgNFzYvYWS4TAp13NKQA1D',
     TransactionType: 'RelationSet',
     TxnSignature:
      '3044022078E283810BF73CB8D932077C757A9FC5881C52B7475BE010BFD8A9731FDE1BB802202268AE34DFF38C171A70623A5E4EFA9069645E39F12D03DE6D9DD826F481FAC8',
     hash:
      'C95235169DB1F994F67E0CC73BB98D0D044D2C4093E846675B29E4F13BE97DAC' } }
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

##### 首先通过 buildAccountSetTx 方法返回一个 Transaction 对象，然后通过 submitPromise 方法设置账号属性。目前支持的三类:`property`、`delegate` 、`signer`。property 用于设置账号一般属性;delegate 用于某账号设置委托帐户;signer 用于设置签名。

##### <a name="buildAccountSetTx"></a>4.17.1 创建属性对象

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
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote.connect(function (err, result) {
  if (err) {
    return console.log("err:", err)
  }
  var options = {
    account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
    type: "property"
  }
  var tx = remote.buildAccountSetTx(options)
  tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
    .then(console.log)
    .catch(console.error)
})
```

##### 返回结果

```javascript
> res: { engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '120003220000000024000000022F2436322C6840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E157446304402201FED6F42DE3F437321D59706846DD9A1DF4D90568A57E2F601AAE138F427800A0220108F4E08476283CC549A9DB21E36DFBBCDF2012C3A690AFBD9AE789C2C9C6C6581141359AA928F4D98FDB3D93E8B690C80D37DED11C3',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Fee: '10000',
     Flags: 0,
     Sequence: 2,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     Timestamp: 607531564,
     TransactionType: 'AccountSet',
     TxnSignature:
      '304402201FED6F42DE3F437321D59706846DD9A1DF4D90568A57E2F601AAE138F427800A0220108F4E08476283CC549A9DB21E36DFBBCDF2012C3A690AFBD9AE789C2C9C6C65',
     hash:
      '56969504AF776BB5EBC8830D87822E201973C4EBCD24CEA64A90D10EF740BD90' } }
```

### 4.18 挂单

##### 首先通过 buildOfferCreateTx 方法返回一个 Transaction 对象，然后通过 submitPromise 方法提交挂单。

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
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({ server: "ws://ws.swtclib.ca:5020" })
remote
  .connectPromise()
  .then(async () => {
    let options = {
      type: "Sell",
      account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
      taker_pays: remote.makeAmount(1),
      taker_gets: remote.makeAmount(0.01, "slash")
    }
    let tx = remote.buildOfferCreateTx(options)
    let response = await tx.submitPromise(
      "ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C",
      "payment tx demo"
    )
    console.log(response)
    remote.disconnect()
  })
  .catch(console.error)
```

###### 返回结果:

```javascript
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

###### 返回结果说明:

| 参数                                         | 类型    |                                                          说明 |
| -------------------------------------------- | ------- | ------------------------------------------------------------: |
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

### 4.19 取消挂单

##### 首先通过 buildOfferCancelTx 方法返回一个 Transaction 对象，然后通过 submitPromise 方法取消挂单。

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
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote
  .connectPromise()
  .then(async () => {
    let options = { account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz", sequence: 7 }
    let tx = remote.buildOfferCancelTx(options)
    let response = await tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
    console.log(response)
    remote.disconnect()
  })
  .catch(console.error)
```

##### 返回结果

```javascript
> res: { engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '120008220000000024000000092019000000076840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100DA68AEF2F6A29A593490AD89218890E98CB0D9DEB645DCA92A6444E3DE9957440220141D389B41ACB777B14A862B58FCE2CDBC5353ECBDED42C2FD9D584B39F61AF181141359AA928F4D98FDB3D93E8B690C80D37DED11C3',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Fee: '10000',
     Flags: 0,
     OfferSequence: 7,
     Sequence: 9,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TransactionType: 'OfferCancel',
     TxnSignature:
      '3045022100DA68AEF2F6A29A593490AD89218890E98CB0D9DEB645DCA92A6444E3DE9957440220141D389B41ACB777B14A862B58FCE2CDBC5353ECBDED42C2FD9D584B39F61AF1',
     hash:
      'AAD3063387632E3BEDF947FBBD2694A364FE1FF15EC1CDE26B7FEBA70B32BDD7' } }
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

### 4.20 部署合约 lua

##### 首先通过 deployContractTx 方法返回一个 Transaction 对象，然后通过 submitPromise 方法部署合约。

##### <a name="contractDeployBuild"></a>4.20.1 创建部署合约对象

###### 方法:remote.deployContractTx({});

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

###### 返回: Promise

##### 部署合约完整例子

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var utils = Remote.utils
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote.connect(function (err, result) {
  if (err) {
    return console.log("err:", err)
  }
  var options = {
    account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
    amount: 10,
    payload: utils.stringToHex(
      "result={}; function Init(t) result=scGetAccountBalance(t) return result end; function foo(t) result=scGetAccountBalance(t) return result end;"
    ),
    // payload: utils.stringToHex('result={}; function Init(t) result=scGetAccountInfo(t) return result end; function foo(t) a={} result=scGetAccountInfo(t) return result end'),
    params: ["jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz"]
  }
  var tx = remote.deployContractTx(options)
  tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
    .then(console.log)
    .catch(console.error)
})
```

##### 返回结果

```javascript
> res: { ContractState: 'jNdpxLQbmMMf4ZVXjn3nb98xPYQ7EpEpTN',
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '12001E220000000024000000052024000000006140000000009896806840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100EDC511C9AD68BEBD47F00CF7271E7DD6BF608E6C7A1ACC3B1D471B057B5E2C0C02203292629E4E6905C222BF99BE8023356B3040355D446DE2FAE6D1099DA6AE426B7F8D726573756C743D7B7D3B2066756E6374696F6E20496E697428742920726573756C743D73634765744163636F756E7442616C616E63652874292072657475726E20726573756C7420656E643B2066756E6374696F6E20666F6F28742920726573756C743D73634765744163636F756E7442616C616E63652874292072657475726E20726573756C7420656E643B81141359AA928F4D98FDB3D93E8B690C80D37DED11C3FAEB7012226A706D4B456D32735565766670466A533751486454385378375A476F4558544A417AE1F1',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Amount: '10000000',
     Args: [ [Object] ],
     Fee: '10000',
     Flags: 0,
     Method: 0,
     Payload:
      '726573756C743D7B7D3B2066756E6374696F6E20496E697428742920726573756C743D73634765744163636F756E7442616C616E63652874292072657475726E20726573756C7420656E643B2066756E6374696F6E20666F6F28742920726573756C743D73634765744163636F756E7442616C616E63652874292072657475726E20726573756C7420656E643B',
     Sequence: 5,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TransactionType: 'ConfigContract',
     TxnSignature:
      '3045022100EDC511C9AD68BEBD47F00CF7271E7DD6BF608E6C7A1ACC3B1D471B057B5E2C0C02203292629E4E6905C222BF99BE8023356B3040355D446DE2FAE6D1099DA6AE426B',
     hash:
      '71C1AAEAAB9D2F9CC4C65D9A9DB733EB80DF6037BDC6D4A6F1445BFDBDE25A02' } }
```

##### 返回结果说明

| 参数                              | 类型    |                               说明 |
| --------------------------------- | ------- | ---------------------------------: |
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

### 4.21 执行合约 lua

##### 首先通过 callContractTx 方法返回一个 Transaction 对象，然后通过 submitPromise 方法执行合约

##### <a name="contractCallBuild"></a> 4.21.1 创建执行合约对象

###### 方法:remote.callContractTx({});

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
| memo   | String |     备注信息 |

###### 返回: Promise

##### 执行合约完整例子

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote.connect(function (err, result) {
  if (err) {
    return console.log("err:", err)
  }
  var options = {
    account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
    destination: "jNdpxLQbmMMf4ZVXjn3nb98xPYQ7EpEpTN",
    foo: "foo",
    params: ["jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz"]
  }
  var tx = remote.callContractTx(options)
  tx.submitPromise("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
    .then(console.log)
    .catch(console.error)
})
```

##### 返回结果

```javascript
> res: { ContractState: '99889937242',
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '12001E220000000024000000062024000000016840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574473045022100DCB940C040EC1FE8BCC12E6BC2B4F980249048A29BDE21819851A794267E3CF9022033589643344130F1B8DA29C437B411875BA98C84056228AC1CC758FE8E98DB4F701103666F6F81141359AA928F4D98FDB3D93E8B690C80D37DED11C38314956A3DB0148D023D018A67AD20FE8E5275FB5B17FAEB7012226A706D4B456D32735565766670466A533751486454385378375A476F4558544A417AE1F1',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Args: [ [Object] ],
     ContractMethod: '666F6F',
     Destination: 'jNdpxLQbmMMf4ZVXjn3nb98xPYQ7EpEpTN',
     Fee: '10000',
     Flags: 0,
     Method: 1,
     Sequence: 6,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TransactionType: 'ConfigContract',
     TxnSignature:
      '3045022100DCB940C040EC1FE8BCC12E6BC2B4F980249048A29BDE21819851A794267E3CF9022033589643344130F1B8DA29C437B411875BA98C84056228AC1CC758FE8E98DB4F',
     hash:
      '060E534F8274A25EF4D48C5A6DC49F4200173BF6E61F287854821F598829BEBC' } }
```

##### 返回结果说明

| 参数                              | 类型    |                               说明 |
| --------------------------------- | ------- | ---------------------------------: |
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

##### 首先通过 buildBrokerageTx 方法返回一个 Transaction 对象，然后通过 submitPromise 方法设置平台手续费

##### 4.22.1 创建挂单佣金对象

###### 方法: remote.buildBrokerageTx({})

###### 参数:

| 参数                 | 类型    |                               说明 |
| -------------------- | ------- | ---------------------------------: |
| account              | String  |                         管理员账号 |
| mol                  | Integer |                   分子(0 和正整数) |
| den                  | Integer |                       分母(正整数) |
| app                  | Integer |               应用来源序号(正整数) |
| amount               | Object  |                           币种对象 |
| &nbsp;&nbsp;value    | String  | 数量，这里只是占位，没有实际意义。 |
| &nbsp;&nbsp;currency | String  |                           货币种类 |
| &nbsp;&nbsp;issuer   | String  |                         货币发行方 |

##### 4.22.2 设置挂单佣金

###### 方法:tx.submitPromise(secret);

###### 参数: `secret` 密钥

###### 返回: Promise

##### 设置挂单佣金完整例子

```javascript
const jlib = require("@swtc/lib")
const Remote = jlib.Remote
const remote = new Remote()
secret = "s.........."
account = "jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG"
remote
  .connectPromise()
  .then(async () => {
    let tx = remote.buildBrokerageTx({
      account,
      mol: 1,
      den: 1000,
      feeAccount: account,
      amount: remote.makeAmount(3, "CNY")
    })
    let result = await tx.submitPromise(secret)
    remote.disconnect()
    console.log(result)
  })
  .catch(console.error)
```

##### 返回结果

```javascript
{ engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '1200CD220000000024000002873900000000000000013A00000000000003E861D48AA87BEE538000000000000000000000000000434E590000000000A582E432BFC48EEDEF852C814EC57F3CD2D41596684000000000002710732102197F1426BCA2F59B6B910F0391E55888B4FE80AF962478493104A33274B1B03A74463044022074D90571F33918F429BE4C88B33206BD0848C0DAFB4A2B88256B642AB44D858002201BBEE1EBD5C0AEE07C604BA36F6E6479D4BD7D70DA143CF27E8D3A4E30673B1B8114AF09183A11AA70DA06E115E03B0E5478232740B58914AF09183A11AA70DA06E115E03B0E5478232740B5',
  tx_json:
   { Account: 'jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG',
     Amount:
      { currency: 'CNY',
        issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
        value: '3' },
     Fee: '10000',
     FeeAccountID: 'jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG',
     Flags: 0,
     OfferFeeRateDen: '00000000000003E8',
     OfferFeeRateNum: '0000000000000001',
     Sequence: 647,
     SigningPubKey:
      '02197F1426BCA2F59B6B910F0391E55888B4FE80AF962478493104A33274B1B03A',
     TransactionType: 'Brokerage',
     TxnSignature:
      '3044022074D90571F33918F429BE4C88B33206BD0848C0DAFB4A2B88256B642AB44D858002201BBEE1EBD5C0AEE07C604BA36F6E6479D4BD7D70DA143CF27E8D3A4E30673B1B',
     hash:
      'A74D89B9FBA9A6D9F4158373EF9C57180186548B48CCA9C70F933083F12B5B0B' } }
```

##### 返回结果说明

### 4.23 部署合约 Solidity 版

##### 首先通过 initContract 方法返回一个 Transaction 对象，然后通过 setSecret 传入密钥，最后通过 submit 方法完成合约的部署

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
const jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
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

remote
  .connectPromise()
  .then(async () => {
    let tx = remote.initContract({
      account: v.address,
      amount: 10,
      payload,
      abi,
      params: [2000, "TestCurrency", "TEST1"]
    })
    let result = await tx.submitPromise(v.secret)
    console.log(result)
    remote.disconnect()
  })
  .catch(console.error)
```

##### 输出

```javascript
{ ContractState: 'j3QhjEeyB2uje8HeyYKByRNqS3sYzH7Yuz',
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '12001F220000000024000002702026000000006140000000009896806840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E1574463044022043113BE98D73B0404E5B2D27CF66E89D03F1523E6C5D662ED0F3CDE983962FC90220099391CB17B50D6941B69344D070C9C1A43BF98DBE401B8E4522E4DABB499F407010DAFB3630383036303430353236303132363030323630303036313031303030613831353438313630666630323139313639303833363066663136303231373930353535303334383031353631303032633537363030303830666435623530363034303531363130633765333830333830363130633765383333393831303138303630343035323630363038313130313536313030346635373630303038306664356238313031393038303830353139303630323030313930393239313930383035313634303130303030303030303831313131353631303037313537363030303830666435623832383130313930353036303230383130313834383131313135363130303837353736303030383066643562383135313835363030313832303238333031313136343031303030303030303038323131313731353631303061343537363030303830666435623530353039323931393036303230303138303531363430313030303030303030383131313135363130306330353736303030383066643562383238313031393035303630323038313031383438313131313536313030643635373630303038306664356238313531383536303031383230323833303131313634303130303030303030303832313131373135363130306633353736303030383066643562353035303932393139303530353035303630303236303030393035343930363130313030306139303034363066663136363066663136363030613061383330323630303338313930353535303630303335343630303536303030333337336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135323630323030313930383135323630323030313630303032303831393035353530383136303030393038303531393036303230303139303631303137353932393139303631303164363536356235303830363030313930383035313930363032303031393036313031386339323931393036313031643635363562353033333630303436303030363130313030306138313534383137336666666666666666666666666666666666666666666666666666666666666666666666666666666630323139313639303833373366666666666666666666666666666666666666666666666666666666666666666666666666666666313630323137393035353530353035303530363130323762353635623832383035343630303138313630303131363135363130313030303230333136363030323930303439303630303035323630323036303030323039303630316630313630323039303034383130313932383236303166313036313032313735373830353136306666313931363833383030313137383535353631303234353536356238323830303136303031303138353535383231353631303234353537393138323031356238323831313131353631303234343537383235313832353539313630323030313931393036303031303139303631303232393536356235623530393035303631303235323931393036313032353635363562353039303536356236313032373839313930356238303832313131353631303237343537363030303831363030303930353535303630303130313631303235633536356235303930353635623930353635623631303966343830363130323861363030303339363030306633666536303830363034303532363030343336313036313030616535373630303033353763303130303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303930303438303633373061303832333131313631303037363537383036333730613038323331313436313032306535373830363338646135636235623134363130323733353738303633393564383962343131343631303263613537383036336139303539636262313436313033356135373830363364643632656433653134363130336235353736313030616535363562383036333036666464653033313436313030623335373830363331383136306464643134363130313433353738303633333133636535363731343631303136653537383036333363636664363062313436313031396635373830363336373563376165363134363130316139353735623630303038306664356233343830313536313030626635373630303038306664356235303631303063383631303433613536356236303430353138303830363032303031383238313033383235323833383138313531383135323630323030313931353038303531393036303230303139303830383338333630303035623833383131303135363130313038353738303832303135313831383430313532363032303831303139303530363130306564353635623530353035303530393035303930383130313930363031663136383031353631303133353537383038323033383035313630303138333630323030333631303130303061303331393136383135323630323030313931353035623530393235303530353036303430353138303931303339306633356233343830313536313031346635373630303038306664356235303631303135383631303464383536356236303430353138303832383135323630323030313931353035303630343035313830393130333930663335623334383031353631303137613537363030303830666435623530363130313833363130346465353635623630343035313830383236306666313636306666313638313532363032303031393135303530363034303531383039313033393066333562363130316137363130346631353635623030356233343830313536313031623535373630303038306664356235303631303166383630303438303336303336303230383131303135363130316363353736303030383066643562383130313930383038303335373366666666666666666666666666666666666666666666666666666666666666666666666666666666313639303630323030313930393239313930353035303530363130356366353635623630343035313830383238313532363032303031393135303530363034303531383039313033393066333562333438303135363130323161353736303030383066643562353036313032356436303034383033363033363032303831313031353631303233313537363030303830666435623831303139303830383033353733666666666666666666666666666666666666666666666666666666666666666666666666666666663136393036303230303139303932393139303530353035303631303566303536356236303430353138303832383135323630323030313931353035303630343035313830393130333930663335623334383031353631303237663537363030303830666435623530363130323838363130363038353635623630343035313830383237336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135323630323030313931353035303630343035313830393130333930663335623334383031353631303264363537363030303830666435623530363130326466363130363265353635623630343035313830383036303230303138323831303338323532383338313831353138313532363032303031393135303830353139303630323030313930383038333833363030303562383338313130313536313033316635373830383230313531383138343031353236303230383130313930353036313033303435363562353035303530353039303530393038313031393036303166313638303135363130333463353738303832303338303531363030313833363032303033363130313030306130333139313638313532363032303031393135303562353039323530353035303630343035313830393130333930663335623334383031353631303336363537363030303830666435623530363130336233363030343830333630333630343038313130313536313033376435373630303038306664356238313031393038303830333537336666666666666666666666666666666666666666666666666666666666666666666666666666666631363930363032303031393039323931393038303335393036303230303139303932393139303530353035303631303663633536356230303562333438303135363130336331353736303030383066643562353036313034323436303034383033363033363034303831313031353631303364383537363030303830666435623831303139303830383033353733666666666666666666666666666666666666666666666666666666666666666666666666666666663136393036303230303139303932393139303830333537336666666666666666666666666666666666666666666666666666666666666666666666666666666631363930363032303031393039323931393035303530353036313036646235363562363034303531383038323831353236303230303139313530353036303430353138303931303339306633356236303030383035343630303138313630303131363135363130313030303230333136363030323930303438303630316630313630323038303931303430323630323030313630343035313930383130313630343035323830393239313930383138313532363032303031383238303534363030313831363030313136313536313031303030323033313636303032393030343830313536313034643035373830363031663130363130346135353736313031303038303833353430343032383335323931363032303031393136313034643035363562383230313931393036303030353236303230363030303230393035623831353438313532393036303031303139303630323030313830383331313631303462333537383239303033363031663136383230313931356235303530353035303530383135363562363030333534383135363562363030323630303039303534393036313031303030613930303436306666313638313536356236303034363030303930353439303631303130303061393030343733666666666666666666666666666666666666666666666666666666666666666666666666666666663136373366666666666666666666666666666666666666666666666666666666666666666666666666666666313633333733666666666666666666666666666666666666666666666666666666666666666666666666666666663136313431353135363130353464353736303030383066643562363030343630303039303534393036313031303030613930303437336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136363130386663333037336666666666666666666666666666666666666666666666666666666666666666666666666666666631363331393038313135303239303630343035313630303036303430353138303833303338313835383838386631393335303530353035303135383031353631303563633537336436303030383033653364363030306664356235303536356236303030383137336666666666666666666666666666666666666666666666666666666666666666666666666666666631363331393035303931393035303536356236303035363032303532383036303030353236303430363030303230363030303931353039303530353438313536356236303034363030303930353439303631303130303061393030343733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135363562363030313830353436303031383136303031313631353631303130303032303331363630303239303034383036303166303136303230383039313034303236303230303136303430353139303831303136303430353238303932393139303831383135323630323030313832383035343630303138313630303131363135363130313030303230333136363030323930303438303135363130366334353738303630316631303631303639393537363130313030383038333534303430323833353239313630323030313931363130366334353635623832303139313930363030303532363032303630303032303930356238313534383135323930363030313031393036303230303138303833313136313036613735373832393030333630316631363832303139313562353035303530353035303831353635623631303664373333383338333631303730303536356235303530353635623630303636303230353238313630303035323630343036303030323036303230353238303630303035323630343036303030323036303030393135303931353035303534383135363562363030303733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383237336666666666666666666666666666666666666666666666666666666666666666666666666666666631363134313531353135363130373363353736303030383066643562383036303035363030303835373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353236303230303139303831353236303230303136303030323035343130313531353135363130373861353736303030383066643562363030353630303038333733666666666666666666666666666666666666666666666666666666666666666666666666666666663136373366666666666666666666666666666666666666666666666666666666666666666666666666666666313638313532363032303031393038313532363032303031363030303230353438313630303536303030383537336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135323630323030313930383135323630323030313630303032303534303131313135313536313038313835373630303038306664356236303030363030353630303038343733666666666666666666666666666666666666666666666666666666666666666666666666666666663136373366666666666666666666666666666666666666666666666666666666666666666666666666666666313638313532363032303031393038313532363032303031363030303230353436303035363030303836373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353236303230303139303831353236303230303136303030323035343031393035303831363030353630303038363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136373366666666666666666666666666666666666666666666666666666666666666666666666666666666313638313532363032303031393038313532363032303031363030303230363030303832383235343033393235303530383139303535353038313630303536303030383537336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135323630323030313930383135323630323030313630303032303630303038323832353430313932353035303831393035353530383036303035363030303835373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353236303230303139303831353236303230303136303030323035343630303536303030383737336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135323630323030313930383135323630323030313630303032303534303131343135313536313039633235376665356235303530353035303536666561313635363237613761373233303538323064313232666638666637313333633038353265393562383333346637366438663439346231316163393461633363346233343039626164313966306430393334303032393030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303037643030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303630303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303061303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030306335343635373337343433373537323732363536653633373930303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030353534343535333534333130303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303081141359AA928F4D98FDB3D93E8B690C80D37DED11C3',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Amount: '10000000',
     Fee: '10000',
     Flags: 0,
     Method: 0,
     Payload:
      '36303830363034303532363031323630303236303030363130313030306138313534383136306666303231393136393038333630666631363032313739303535353033343830313536313030326335373630303038306664356235303630343035313631306337653338303338303631306337653833333938313031383036303430353236303630383131303135363130303466353736303030383066643562383130313930383038303531393036303230303139303932393139303830353136343031303030303030303038313131313536313030373135373630303038306664356238323831303139303530363032303831303138343831313131353631303038373537363030303830666435623831353138353630303138323032383330313131363430313030303030303030383231313137313536313030613435373630303038306664356235303530393239313930363032303031383035313634303130303030303030303831313131353631303063303537363030303830666435623832383130313930353036303230383130313834383131313135363130306436353736303030383066643562383135313835363030313832303238333031313136343031303030303030303038323131313731353631303066333537363030303830666435623530353039323931393035303530353036303032363030303930353439303631303130303061393030343630666631363630666631363630306130613833303236303033383139303535353036303033353436303035363030303333373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353236303230303139303831353236303230303136303030323038313930353535303831363030303930383035313930363032303031393036313031373539323931393036313031643635363562353038303630303139303830353139303630323030313930363130313863393239313930363130316436353635623530333336303034363030303631303130303061383135343831373366666666666666666666666666666666666666666666666666666666666666666666666666666666303231393136393038333733666666666666666666666666666666666666666666666666666666666666666666666666666666663136303231373930353535303530353035303631303237623536356238323830353436303031383136303031313631353631303130303032303331363630303239303034393036303030353236303230363030303230393036303166303136303230393030343831303139323832363031663130363130323137353738303531363066663139313638333830303131373835353536313032343535363562383238303031363030313031383535353832313536313032343535373931383230313562383238313131313536313032343435373832353138323535393136303230303139313930363030313031393036313032323935363562356235303930353036313032353239313930363130323536353635623530393035363562363130323738393139303562383038323131313536313032373435373630303038313630303039303535353036303031303136313032356335363562353039303536356239303536356236313039663438303631303238613630303033393630303066336665363038303630343035323630303433363130363130306165353736303030333537633031303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303039303034383036333730613038323331313136313030373635373830363337306130383233313134363130323065353738303633386461356362356231343631303237333537383036333935643839623431313436313032636135373830363361393035396362623134363130333561353738303633646436326564336531343631303362353537363130306165353635623830363330366664646530333134363130306233353738303633313831363064646431343631303134333537383036333331336365353637313436313031366535373830363333636366643630623134363130313966353738303633363735633761653631343631303161393537356236303030383066643562333438303135363130306266353736303030383066643562353036313030633836313034336135363562363034303531383038303630323030313832383130333832353238333831383135313831353236303230303139313530383035313930363032303031393038303833383336303030356238333831313031353631303130383537383038323031353138313834303135323630323038313031393035303631303065643536356235303530353035303930353039303831303139303630316631363830313536313031333535373830383230333830353136303031383336303230303336313031303030613033313931363831353236303230303139313530356235303932353035303530363034303531383039313033393066333562333438303135363130313466353736303030383066643562353036313031353836313034643835363562363034303531383038323831353236303230303139313530353036303430353138303931303339306633356233343830313536313031376135373630303038306664356235303631303138333631303464653536356236303430353138303832363066663136363066663136383135323630323030313931353035303630343035313830393130333930663335623631303161373631303466313536356230303562333438303135363130316235353736303030383066643562353036313031663836303034383033363033363032303831313031353631303163633537363030303830666435623831303139303830383033353733666666666666666666666666666666666666666666666666666666666666666666666666666666663136393036303230303139303932393139303530353035303631303563663536356236303430353138303832383135323630323030313931353035303630343035313830393130333930663335623334383031353631303231613537363030303830666435623530363130323564363030343830333630333630323038313130313536313032333135373630303038306664356238313031393038303830333537336666666666666666666666666666666666666666666666666666666666666666666666666666666631363930363032303031393039323931393035303530353036313035663035363562363034303531383038323831353236303230303139313530353036303430353138303931303339306633356233343830313536313032376635373630303038306664356235303631303238383631303630383536356236303430353138303832373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353236303230303139313530353036303430353138303931303339306633356233343830313536313032643635373630303038306664356235303631303264663631303632653536356236303430353138303830363032303031383238313033383235323833383138313531383135323630323030313931353038303531393036303230303139303830383338333630303035623833383131303135363130333166353738303832303135313831383430313532363032303831303139303530363130333034353635623530353035303530393035303930383130313930363031663136383031353631303334633537383038323033383035313630303138333630323030333631303130303061303331393136383135323630323030313931353035623530393235303530353036303430353138303931303339306633356233343830313536313033363635373630303038306664356235303631303362333630303438303336303336303430383131303135363130333764353736303030383066643562383130313930383038303335373366666666666666666666666666666666666666666666666666666666666666666666666666666666313639303630323030313930393239313930383033353930363032303031393039323931393035303530353036313036636335363562303035623334383031353631303363313537363030303830666435623530363130343234363030343830333630333630343038313130313536313033643835373630303038306664356238313031393038303830333537336666666666666666666666666666666666666666666666666666666666666666666666666666666631363930363032303031393039323931393038303335373366666666666666666666666666666666666666666666666666666666666666666666666666666666313639303630323030313930393239313930353035303530363130366462353635623630343035313830383238313532363032303031393135303530363034303531383039313033393066333562363030303830353436303031383136303031313631353631303130303032303331363630303239303034383036303166303136303230383039313034303236303230303136303430353139303831303136303430353238303932393139303831383135323630323030313832383035343630303138313630303131363135363130313030303230333136363030323930303438303135363130346430353738303630316631303631303461353537363130313030383038333534303430323833353239313630323030313931363130346430353635623832303139313930363030303532363032303630303032303930356238313534383135323930363030313031393036303230303138303833313136313034623335373832393030333630316631363832303139313562353035303530353035303831353635623630303335343831353635623630303236303030393035343930363130313030306139303034363066663136383135363562363030343630303039303534393036313031303030613930303437336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136333337336666666666666666666666666666666666666666666666666666666666666666666666666666666631363134313531353631303534643537363030303830666435623630303436303030393035343930363130313030306139303034373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363631303866633330373366666666666666666666666666666666666666666666666666666666666666666666666666666666313633313930383131353032393036303430353136303030363034303531383038333033383138353838383866313933353035303530353031353830313536313035636335373364363030303830336533643630303066643562353035363562363030303831373366666666666666666666666666666666666666666666666666666666666666666666666666666666313633313930353039313930353035363562363030353630323035323830363030303532363034303630303032303630303039313530393035303534383135363562363030343630303039303534393036313031303030613930303437336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353635623630303138303534363030313831363030313136313536313031303030323033313636303032393030343830363031663031363032303830393130343032363032303031363034303531393038313031363034303532383039323931393038313831353236303230303138323830353436303031383136303031313631353631303130303032303331363630303239303034383031353631303663343537383036303166313036313036393935373631303130303830383335343034303238333532393136303230303139313631303663343536356238323031393139303630303035323630323036303030323039303562383135343831353239303630303130313930363032303031383038333131363130366137353738323930303336303166313638323031393135623530353035303530353038313536356236313036643733333833383336313037303035363562353035303536356236303036363032303532383136303030353236303430363030303230363032303532383036303030353236303430363030303230363030303931353039313530353035343831353635623630303037336666666666666666666666666666666666666666666666666666666666666666666666666666666631363832373366666666666666666666666666666666666666666666666666666666666666666666666666666666313631343135313531353631303733633537363030303830666435623830363030353630303038353733666666666666666666666666666666666666666666666666666666666666666666666666666666663136373366666666666666666666666666666666666666666666666666666666666666666666666666666666313638313532363032303031393038313532363032303031363030303230353431303135313531353631303738613537363030303830666435623630303536303030383337336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135323630323030313930383135323630323030313630303032303534383136303035363030303835373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353236303230303139303831353236303230303136303030323035343031313131353135363130383138353736303030383066643562363030303630303536303030383437336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135323630323030313930383135323630323030313630303032303534363030353630303038363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136373366666666666666666666666666666666666666666666666666666666666666666666666666666666313638313532363032303031393038313532363032303031363030303230353430313930353038313630303536303030383637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363733666666666666666666666666666666666666666666666666666666666666666666666666666666663136383135323630323030313930383135323630323030313630303032303630303038323832353430333932353035303831393035353530383136303035363030303835373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353236303230303139303831353236303230303136303030323036303030383238323534303139323530353038313930353535303830363030353630303038353733666666666666666666666666666666666666666666666666666666666666666666666666666666663136373366666666666666666666666666666666666666666666666666666666666666666666666666666666313638313532363032303031393038313532363032303031363030303230353436303035363030303837373366666666666666666666666666666666666666666666666666666666666666666666666666666666313637336666666666666666666666666666666666666666666666666666666666666666666666666666666631363831353236303230303139303831353236303230303136303030323035343031313431353135363130396332353766653562353035303530353035366665613136353632376137613732333035383230643132326666386666373133336330383532653935623833333466373664386634393462313161633934616333633462333430396261643139663064303933343030323930303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030376430303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303036303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030613030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303063353436353733373434333735373237323635366536333739303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303535343435353335343331303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030',
     Sequence: 624,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TransactionType: 'AlethContract',
     TxnSignature:
      '3044022043113BE98D73B0404E5B2D27CF66E89D03F1523E6C5D662ED0F3CDE983962FC90220099391CB17B50D6941B69344D070C9C1A43BF98DBE401B8E4522E4DABB499F40',
     hash:
      'BE321F06749FA9FFEA556BB5761BE964D5C3029BF95EE6D95B21EB738EF53765' } }
```

### 4.24 调用合约(Solidity 版)

##### 首先通过 invokeContract 方法返回一个 Transaction 对象，然后通过 submitPromise 方法完成合约的调用。

##### 4.24.1 创建合约调用对象

###### 方法:remote.invokeContract({})

###### 参数

| 参数        | 类型   |             说明 |
| ----------- | ------ | ---------------: |
| account     | String |       合约发布者 |
| destination | String |         合约帐号 |
| abi         | Array  |         合约 abi |
| func        | String | 合约函数名及参数 |

###### 返回:Transaction 对象

##### <a name="invokeContractSubmit"></a> 4.24.3 执行合约

###### 方法:tx.submitPromise(secret);

###### 参数:

| 参数   | 类型   |           说明 |
| ------ | ------ | -------------: |
| secret | String | 合约执行者私钥 |

###### 返回: Promise

###### 例子

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({ server: "ws://ts5.jingtum.com:5030", solidity: true })
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
var tx
var destination = "j3QhjEeyB2uje8HeyYKByRNqS3sYzH7Yuz"
remote
  .connectPromise()
  .then(async () => {
    tx = remote.invokeContract({
      account: v.address,
      destination,
      abi,
      func: `transfer("${destination}", 5)`
    })
    let result = await tx.submitPromise(v.secret)
    console.log(result)
  })
  .catch(console.error)
```

###### 输出

```javascript
{ ContractState: '',
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '12001F220000000024000002722026000000016140000000000000006840000000000027107321029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15744630440220508E92885543E6359463B420B4E1962D65DD4744D19FC90F278A2D6DC9F3D43102204C9E1D16759E1D76A0305C1A7782F633C5B23213B4FA3135E550C3F87ECA022581141359AA928F4D98FDB3D93E8B690C80D37DED11C383145124F49CD3012D9DF1A5359522CA54ED92C5A637FEEF70138861393035396362623030303030303030303030303030303035313234663439636433303132643964663161353335393532326361353465643932633561363337386232386436663530303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303035041000E1F1',
  tx_json:
   { Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Amount: '0',
     Args: [ [Object] ],
     Destination: 'j3QhjEeyB2uje8HeyYKByRNqS3sYzH7Yuz',
     Fee: '10000',
     Flags: 0,
     Method: 1,
     Sequence: 626,
     SigningPubKey:
      '029110C3744FB57BD1F4824F5B989AE75EB6402B4365B501F6EDCA9BE44A675E15',
     TransactionType: 'AlethContract',
     TxnSignature:
      '30440220508E92885543E6359463B420B4E1962D65DD4744D19FC90F278A2D6DC9F3D43102204C9E1D16759E1D76A0305C1A7782F633C5B23213B4FA3135E550C3F87ECA0225',
     hash:
      '041F2D514FCEABE5015B3E26F47041DB7E51FA577D9331507E9B2BB8DDCD0162' } }
```

### 4.25 监听事件

##### Remote 有两个监听事件:监听所有交易(transactions)和监听所有账本(ledger_closed)，监听结果放到回调函数中，回调中只有一个参数，为监听到的消息。

##### 方法:remote.on('transactions',callback);

##### 方法:remote.on('ledger_closed',callback);

##### 例子:

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote.connect(function (err, result) {
  if (err) {
    return console.log("err:", err)
  }
  remote.on("transactions", function (msg) {
    console.log("tx: ", msg)
  })
  remote.on("ledger_closed", function (msg) {
    console.log("ledger: ", msg)
  })
})
```

## 5 REQUEST 类

##### Request 类主管 GET 请求，包括获得服务器、账号、挂单、路径等信息。请求时不需要提供密 钥，且对所有用户公开。所有的请求是异步的，会提供一个回调函数。每个回调函数有两个参 数，一个是错误，另一个是结果。提供以下方法:

- selectLedger(ledger)
- submit(callback)
- submitPromise()

### 5.1 指定账本

##### 方法:selectLedger(ledger);

##### 参数:

| 参数   | 类型   |                  说明 |
| ------ | ------ | --------------------: |
| ledger | String | 账本高度或者账号 hash |

##### 例子

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote.connect(function (err, result) {
  if (err) {
    return console.log("err:", err)
  }
  var req = remote.requestAccountInfo({
    account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz"
  })
  req.selectLedger("2846000")
  req.submitPromise().then(console.log).catch(console.error)
})
```

### 5.2 提交请求

##### 方法:submit(callback);

##### 参数:回调函数，包含两个参数:错误信息和结果信息

##### 方法:submitPromise(secret, memo);

###### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |
| memo   | String |     备注信息 |

###### 返回: Promise

##### 例子

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote.connect(function (err, result) {
  if (err) {
    return console.log("err:", err)
  }
  var req = remote.requestAccountInfo({
    account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz"
  })
  req.submitPromise().then(console.log).catch(console.error)
})
```

## 6 TRANSACTION 类

##### Transaction 类主管 POST 请求，包括组装交易和交易参数。请求时需要提供密钥，且交易可以 进行本地签名和服务器签名。目前支持服务器签名，本地签名支持主要的交易，还有部分参数 不支持。所有的请求是异步的，会提供一个回调函数。每个回调函数有两个参数，一个是错误， 另一个是结果。提供以下方法:

- getAccount()
- getTransactionType()
- setSecret(secret)
- addMemo(memo)
- setPath(key)
- setSendMax(amount)
- setTransferRate(rate)
- setFlags(flags)
- submit(callback)

##### 额外

- signPromise(secret, [memo, [sequence])]
- submitPromise(secret, [memo, [sequence])]

### 6.1 获得交易账号

##### 方法:getAccount();

##### 参数:无

##### 返回:账号

##### 例子:

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
var options = { account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz", sequence: 4 }
var tx = remote.buildOfferCancelTx(options)
var account = tx.getAccount()
console.log(account)
```

### 6.2 获得交易类型

##### 方法:getTransactionType();

##### 参数:无

##### 返回:交易类型

##### 例子:

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
var options = { account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz", sequence: 4 }
var tx = remote.buildOfferCancelTx(options)
var type = tx.getTransactionType()
console.log(type)
```

### 6.3 传入私钥

##### 交易提交之前需要传入私钥。

##### 方法:setSecret(secret);

##### 参数:

| 参数   | 类型   |         说明 |
| ------ | ------ | -----------: |
| secret | String | 井通钱包私钥 |

##### 返回:Transaction 对象

##### 例子:

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
var options = { account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz", sequence: 8 }
var tx = remote.buildOfferCancelTx(options)
tx.setSecret("ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C")
```

### 6.4 添加备注 方法:addMemo(memo);

##### 参数:

| 参数 | 类型   |                  说明 |
| ---- | ------ | --------------------: |
| memo | String | 备注信息，不超过 2k。 |

##### 返回:Transaction 对象

##### 例子:

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
var tx = remote.buildPaymentTx({
  account: "jB7rxgh43ncbTX4WeMoeadiGMfmfqY2xLZ",
  to: "jDUjqoDZLhzx4DCf6pvSivjkjgtRESY62c",
  amount: remote.makeAmount(1)
})
tx.addMemo("给jDUjqoDZLhzx4DCf6pvSivjkjgtRESY62c支付0.5swt.")
```

### 6.5 提交请求

##### 方法:submit(callback);

##### 参数:回调函数，包含两个参数:错误信息和结果信息

##### 方法:submitPromise(secret, memo);

##### 参数:密钥, 留言

##### 例子:

```javascript
var jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({
  server: "ws://ts5.jingtum.com:5030",
  issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"
})
remote
  .connectPromise()
  .then(async () => {
    var req = remote.requestAccountInfo({
      account: "jB7rxgh43ncbTX4WeMoeadiGMfmfqY2xLZ"
    })
    let result = await req.submitPromise()
    console.log(result)
  })
  .catch(console.error)
```

## 7 底层常见错误附录

| 错误名称                   |                                                           说明 |
| -------------------------- | -------------------------------------------------------------: |
| tecCLAIM                   |                         Fee claimed. Sequence used. No action. |
| tecDIR_FULL                |                           Can not add entry to full directory. |
| tecFAILED_PROCESSING       |                       Failed to correctly process transaction. |
| tecINSUF_RESERVE_LINE      |                        Insufficient reserve to add trust line. |
| tecINSUF_RESERVE_OFFER     |                          Insufficient reserve to create offer. |
| tecNO_DST                  |             Destination does not exist. Send SWT to create it. |
| tecNO_DST_INSUF_SWT        |  Destination does not exist. Too little SWT sent to create it. |
| tecNO_LINE_INSUF_RESERVE   |                 No such line. Too little reserve to create it. |
| tecNO_LINE_REDUNDANT       |                        Can't set non-existent line to default. |
| tecPATH_DRY                |                            Path could not send partial amount. |
| tecPATH_PARTIAL            |                               Path could not send full amount. |
| tecMASTER_DISABLED         |                                        Master key is disabled. |
| tecNO_REGULAR_KEY          |                                        Regular key is not set. |
| tecUNFUNDED                |                  One of \_ADD, \_OFFER, or \_SEND. Deprecated. |
| tecUNFUNDED_ADD            |                        Insufficient SWT balance for WalletAdd. |
| tecUNFUNDED_OFFER          |                    Insufficient balance to fund created offer. |
| tecUNFUNDED_PAYMENT        |                              Insufficient SWT balance to send. |
| tecOWNERS                  |                                          Non-zero owner count. |
| tecNO_ISSUER               |                                 Issuer account does not exist. |
| tecNO_AUTH                 |                                  Not authorized to hold asset. |
| tecNO_LINE                 |                                                  No such line. |
| tecINSUFF_FEE              |                               Insufficient balance to pay fee. |
| tecFROZEN                  |                                               Asset is frozen. |
| tecNO_TARGET               |                                 Target account does not exist. |
| tecNO_PERMISSION           |                  No permission to perform requested operation. |
| tecNO_ENTRY                |                                       No matching entry found. |
| tecINSUFFICIENT_RESERVE    |          Insufficient reserve to complete requested operation. |
| tecNEED_MASTER_KEY         |              The operation requires the use of the Master Key. |
| tecDST_TAG_NEEDED          |                                 A destination tag is required. |
| tecINTERNAL                |              An internal error has occurred during processing. |
| tefALREADY                 |              The exact transaction was already in this ledger. |
| tefBAD_ADD_AUTH            |                                 Not authorized to add account. |
| tefBAD_AUTH                |                    Transaction's public key is not authorized. |
| tefBAD_LEDGER              |                                    Ledger in unexpected state. |
| tefCREATED                 |                          Can't add an already created account. |
| tefEXCEPTION               |                                      Unexpected program state. |
| tefFAILURE                 |                                               Failed to apply. |
| tefINTERNAL                |                                                Internal error. |
| tefMASTER_DISABLED         |                                        Master key is disabled. |
| tefMAX_LEDGER              |                                      Ledger sequence too high. |
| tefNO_AUTH_REQUIRED        |                                          Auth is not required. |
| tefPAST_SEQ                |                         This sequence number has already past. |
| tefWRONG_PRIOR             |                      This previous transaction does not match. |
| telLOCAL_ERROR             |                                                 Local failure. |
| telBAD_DOMAIN              |                                               Domain too long. |
| telBAD_PATH_COUNT          |                                     Malformed: Too many paths. |
| telBAD_PUBLIC_KEY          |                                           Public key too long. |
| telFAILED_PROCESSING       |                       Failed to correctly process transaction. |
| telINSUF_FEE_P             |                                              Fee insufficient. |
| telNO_DST_PARTIAL          |                 Partial payment to create account not allowed. |
| telBLKLIST                 |                                      Tx disable for blacklist. |
| telINSUF_FUND              |                                             Fund insufficient. |
| temMALFORMED               |                                         Malformed transaction. |
| temBAD_AMOUNT              |                                Can only send positive amounts. |
| temBAD_AUTH_MASTER         |           Auth for unclaimed account needs correct master key. |
| temBAD_CURRENCY            |                                       Malformed: Bad currency. |
| temBAD_EXPIRATION          |                                     Malformed: Bad expiration. |
| temBAD_FEE                 |                              Invalid fee, negative or not SWT. |
| temBAD_ISSUER              |                                         Malformed: Bad issuer. |
| temBAD_LIMIT               |                                   Limits must be non-negative. |
| temBAD_QUORUM              |                                  Quorums must be non-negative. |
| temBAD_WEIGHT              |                                  Weights must be non-negative. |
| temBAD_OFFER               |                                          Malformed: Bad offer. |
| temBAD_PATH                |                                           Malformed: Bad path. |
| temBAD_PATH_LOOP           |                                       Malformed: Loop in path. |
| temBAD_SEND_SWT_LIMIT      |        Malformed: Limit quality is not allowed for SWT to SWT. |
| temBAD_SEND_SWT_MAX        |             Malformed: Send max is not allowed for SWT to SWT. |
| temBAD_SEND_SWT_NO_DIR ECT |    Malformed: No Skywell direct is not allowed for SWT to SWT. |
| temBAD_SEND_SWT_PARTIAL    |      Malformed: Partial payment is not allowed for SWT to SWT. |
| temBAD_SEND_SWT_PATHS      |               Malformed: Paths are not allowed for SWT to SWT. |
| temBAD_SEQUENCE            |                        Malformed: Sequence is not in the past. |
| temBAD_SIGNATURE           |                                      Malformed: Bad signature. |
| temBAD_SRC_ACCOUNT         |                                 Malformed: Bad source account. |
| temBAD_TRANSFER_RATE       |                        Malformed: Transfer rate must be >= 1.0 |
| temDST_IS_SRC              |                                 Destination may not be source. |
| temDST_NEEDED              |                                     Destination not specified. |
| temINVALID                 |                                 The transaction is ill-formed. |
| temINVALID_FLAG            |                           The transaction has an invalid flag. |
| temREDUNDANT               |                                   Sends same currency to self. |
| temREDUNDANTSIGN           |                                   Add self as additional sign. |
| temSKYWELL_EMPTY           |                                         PathSet with no paths. |
| temUNCERTAIN               |              In process of determining result. Never returned. |
| temUNKNOWN                 |    The transaction requires logic that is not implemented yet. |
| temDISABLED                |     The transaction requires logic that is currently disabled. |
| temMULTIINIT               |                          contract code has multi init function |
| terRETRY                   |                                             Retry transaction. |
| terFUNDS_SPENT             |          Can't set password, password set funds already spent. |
| terINSUF_FEE_B             |                                 Account balance can't pay fee. |
| terLAST                    |                                                  Process last. |
| terNO_SKYWELL              |                                 Path does not permit rippling. |
| terNO_ACCOUNT              |                             The source account does not exist. |
| terNO_AUTH                 |                                   Not authorized to hold IOUs. |
| terNO_LINE                 |                                                  No such line. |
| terPRE_SEQ                 |                        Missing/inapplicable prior transaction. |
| terOWNERS                  |                                          Non-zero owner count. |
| tesSUCCESS                 | The transaction was applied. Only final in a validated ledger. |

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

### 11.0 费用

##### 多重签名需要耗费更多的资源，费用相应的增加，每一个签名需要相应费用, 用 tx.setFee()设置

### 11.1 查询帐号的签名列表

##### 首先通过 requestSignerList 方法返回一个 Request 对象，通过 submitPromise()方法提交列表信息

##### 11.1.1 创建查询签名列表

###### 方法:remote.requestSignerList({})

###### 参数

| 参数    | 类型   |   说明 |
| ------- | ------ | -----: |
| account | String | 源账号 |

###### 返回: Request 对象

##### 11.1.2 查询

###### 方法: request.submitPromise()

###### 返回: Promise

##### 查询帐号的签名列表完整例子

```javascript
const jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({ server: "ws://101.200.230.74:5020" })
const a = {
  secret: "snaK5evc1SddiDca1BpZbg1UBft42",
  address: "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n"
}
const log_json = object => console.log(JSON.stringify(object, "", 2))

remote
  .connectPromise()
  .then(async () => {
    let result = await remote
      .requestSignerList({ account: a.address })
      .submitPromise()
    console.log(result)
    log_json(result.account_objects)
    remote.disconnect()
  })
  .catch(console.error)
```

##### 输出

```javascript
{ account: 'j3UbbRX36997CWXqYqLUn28qH55v9Dh37n',
  account_objects:
   [ { Flags: 0,
       LedgerEntryType: 'SignerList',
       OwnerNode: '0000000000000000',
       PreviousTxnID:
        '9EC422C5D2153FC0FD26884DEA440596E9AC96435E3BCE3E543208CD075B5188',
       PreviousTxnLgrSeq: 532758,
       SignerEntries: [Array],
       SignerQuorum: 5,
       index:
        'D1A5CF852001ABB5FC6E7C7ECF527737F11EA3E2B6E4077B94EB7679CB371F50' } ],
  ledger_current_index: 549390,
  validated: false }
[
  {
    "Flags": 0,
    "LedgerEntryType": "SignerList",
    "OwnerNode": "0000000000000000",
    "PreviousTxnID": "9EC422C5D2153FC0FD26884DEA440596E9AC96435E3BCE3E543208CD075B5188",
    "PreviousTxnLgrSeq": 532758,
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

###### 方法:tx.submitPromise(secret);

###### 参数: 密钥

| 参数   | 类型   |     说明 |
| ------ | ------ | -------: |
| secret | String | 钱包私钥 |

###### 返回: Promise

##### 设置帐号的签名列表完整例子

```javascript
const jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({ server: "ws://101.200.230.74:5020" })
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

//设置签名列表
const tx = remote.buildSignerListTx({
  account: a.address,
  threshold: 5,
  lists: [
    { account: a1.address, weight: 3 },
    { account: a2.address, weight: 3 }
  ]
})

remote
  .connectPromise()
  .then(async () => {
    await tx._setSequencePromise()
    log_json(tx.tx_json)
    console.log(`需要设置足够的燃料支持多签交易tx.setFee()`)
    tx.setFee(30000) // 燃料
    log_json(tx.tx_json)
    let result = await tx.submitPromise(a.secret)
    console.log(result)
    log_json(result.tx_json)
    remote.disconnect()
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
  "TransactionType": "SignerListSet",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "SignerQuorum": 5,
  "Sequence": 12
}
需要设置足够的燃料支持多签交易tx.setFee()
{
  "Flags": 0,
  "Fee": 30000,
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
  "TransactionType": "SignerListSet",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "SignerQuorum": 5,
  "Sequence": 12
}
{ engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '1200CF2200000000240000000C2026000000056840000000000075307321024A02206AEFF63AF72BF6BE116073DE6D75E8D3404462CC73EC0F35207DF2722874473045022100A7F6B32CF70CCA45686B20501683D696D56FA57377A4EEA0B451E4FDB0450B7A022018268EECF64BAADA07F9A13C2E7582F544256BC2DBFB7400645BB9EB72F4814381144EFA5550AA0B6A0C06793161C0D2EDC635469AC8FBEC130003811423A7CE52916DFDE210D371CF8487CFDB790B1DCBE1EC130003811482D518A6A562B198E72BC1B8976F83D996E3CCD5E1F1',
  tx_json:
   { Account: 'j3UbbRX36997CWXqYqLUn28qH55v9Dh37n',
     Fee: '30000',
     Flags: 0,
     Sequence: 12,
     SignerEntries: [ [Object], [Object] ],
     SignerQuorum: 5,
     SigningPubKey:
      '024A02206AEFF63AF72BF6BE116073DE6D75E8D3404462CC73EC0F35207DF27228',
     TransactionType: 'SignerListSet',
     TxnSignature:
      '3045022100A7F6B32CF70CCA45686B20501683D696D56FA57377A4EEA0B451E4FDB0450B7A022018268EECF64BAADA07F9A13C2E7582F544256BC2DBFB7400645BB9EB72F48143',
     hash:
      'F5C29AA790682CF238F397610F98910D0947334EF63BA565B30BAE8029AE634E' } }
{
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "Fee": "30000",
  "Flags": 0,
  "Sequence": 12,
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
  "SigningPubKey": "024A02206AEFF63AF72BF6BE116073DE6D75E8D3404462CC73EC0F35207DF27228",
  "TransactionType": "SignerListSet",
  "TxnSignature": "3045022100A7F6B32CF70CCA45686B20501683D696D56FA57377A4EEA0B451E4FDB0450B7A022018268EECF64BAADA07F9A13C2E7582F544256BC2DBFB7400645BB9EB72F48143",
  "hash": "F5C29AA790682CF238F397610F98910D0947334EF63BA565B30BAE8029AE634E"
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
const jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({ server: "ws://101.200.230.74:5020" })
const a = {
  secret: "snaK5evc1SddiDca1BpZbg1UBft42",
  address: "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n"
}
const log_json = object => console.log(JSON.stringify(object, "", 2))

//设置废除主密钥
const tx = remote.buildAccountSetTx({
  account: a.address,
  type: "property",
  set_flag: 4
})

remote
  .connectPromise()
  .then(async () => {
    await tx._setSequencePromise()
    log_json(tx.tx_json)
    let result = await tx.submitPromise(a.secret)
    console.log(result)
    remote.disconnect()
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
  "Sequence": 13
}
{ engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '1200032200000000240000000D2021000000046840000000000027107321024A02206AEFF63AF72BF6BE116073DE6D75E8D3404462CC73EC0F35207DF2722874463044022049877787ECCEFA296A5193BBC5502D6793CE43873B2D2DB797A083F452A61C5302206DBA044629B00940A783824F0E57C2DBA3FB096317E349C784085014A26E5C4981144EFA5550AA0B6A0C06793161C0D2EDC635469AC8',
  tx_json:
   { Account: 'j3UbbRX36997CWXqYqLUn28qH55v9Dh37n',
     Fee: '10000',
     Flags: 0,
     Sequence: 13,
     SetFlag: 4,
     SigningPubKey:
      '024A02206AEFF63AF72BF6BE116073DE6D75E8D3404462CC73EC0F35207DF27228',
     TransactionType: 'AccountSet',
     TxnSignature:
      '3044022049877787ECCEFA296A5193BBC5502D6793CE43873B2D2DB797A083F452A61C5302206DBA044629B00940A783824F0E57C2DBA3FB096317E349C784085014A26E5C49',
     hash:
      '78FA2577E70DFB86F8089290B1051F2FBE8529888B293142FAD94F2707A65D7B' } }
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
const jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({ server: "ws://101.200.230.74:5020" })
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

//设置激活主密钥
const tx = remote.buildAccountSetTx({
  account: a.address,
  type: "property",
  clear_flag: 4
})

remote
  .connectPromise()
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
    remote.disconnect()
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
  "Sequence": 14
}
需要设置足够的燃料支持多签交易tx.setFee()
{
  "Flags": 0,
  "Fee": 20000,
  "TransactionType": "AccountSet",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "ClearFlag": 4,
  "Sequence": 14
}
{
  "Flags": 0,
  "Fee": 20000,
  "TransactionType": "AccountSet",
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "ClearFlag": 4,
  "Sequence": 14,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3044022050F3D210088FEE4F65410A5C1EC18A44C2E0F0F63B664650EE521E601BF390DE02200F0C6163676DC05021886B63BF2186DF47C0B3EB2D66DDEA17CAEF92D6EAAD89"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "30440220659DAC178A20CF1CE2A688CBC183CF68E60FF508AA643A129221DBE745E25BB702203155117E8B72A1A3F6DFFC053313900AE6306165E70C83D0AD7E3B9FCBBC0B4B"
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
  "Sequence": 14,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3044022050F3D210088FEE4F65410A5C1EC18A44C2E0F0F63B664650EE521E601BF390DE02200F0C6163676DC05021886B63BF2186DF47C0B3EB2D66DDEA17CAEF92D6EAAD89"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "30440220659DAC178A20CF1CE2A688CBC183CF68E60FF508AA643A129221DBE745E25BB702203155117E8B72A1A3F6DFFC053313900AE6306165E70C83D0AD7E3B9FCBBC0B4B"
      }
    }
  ]
}
{ engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '1200032200000000240000000E202200000004684000000000004E20730081144EFA5550AA0B6A0C06793161C0D2EDC635469AC8FCED7321028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF74463044022050F3D210088FEE4F65410A5C1EC18A44C2E0F0F63B664650EE521E601BF390DE02200F0C6163676DC05021886B63BF2186DF47C0B3EB2D66DDEA17CAEF92D6EAAD89811423A7CE52916DFDE210D371CF8487CFDB790B1DCBE1ED7321022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26744630440220659DAC178A20CF1CE2A688CBC183CF68E60FF508AA643A129221DBE745E25BB702203155117E8B72A1A3F6DFFC053313900AE6306165E70C83D0AD7E3B9FCBBC0B4B811482D518A6A562B198E72BC1B8976F83D996E3CCD5E1F1',
  tx_json:
   { Account: 'j3UbbRX36997CWXqYqLUn28qH55v9Dh37n',
     ClearFlag: 4,
     Fee: '20000',
     Flags: 0,
     Sequence: 14,
     Signers: [ [Object], [Object] ],
     SigningPubKey: '',
     TransactionType: 'AccountSet',
     hash:
      '9AB2652E971EAE3CF0267165B3026EAE56FE4147D8F078BBC69A2C5B9D8567EB' } }
{
  "Account": "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  "ClearFlag": 4,
  "Fee": "20000",
  "Flags": 0,
  "Sequence": 14,
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3044022050F3D210088FEE4F65410A5C1EC18A44C2E0F0F63B664650EE521E601BF390DE02200F0C6163676DC05021886B63BF2186DF47C0B3EB2D66DDEA17CAEF92D6EAAD89"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "30440220659DAC178A20CF1CE2A688CBC183CF68E60FF508AA643A129221DBE745E25BB702203155117E8B72A1A3F6DFFC053313900AE6306165E70C83D0AD7E3B9FCBBC0B4B"
      }
    }
  ],
  "SigningPubKey": "",
  "TransactionType": "AccountSet",
  "hash": "9AB2652E971EAE3CF0267165B3026EAE56FE4147D8F078BBC69A2C5B9D8567EB"
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

::: details 展开

```javascript
const jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({ server: "ws://101.200.230.74:5020" })
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

// 创建支付交易
let tx = remote.buildPaymentTx({
  account: a.address,
  to,
  amount: remote.makeAmount(1)
})
tx.addMemo("multisigned payment test")

remote
  .connectPromise()
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
    remote.disconnect()
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
  "Sequence": 16
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
  "Sequence": 16,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3045022100A473BCCED9D0F5DA32376E65C94099DA6BE44CA0CD51F70F5574ABF42B3574EA02204636AD6C89041C219B754CF37BA6C2EF74A300188F788CF18CAD2E6B849E326C"
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
  "Sequence": 16,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3045022100A473BCCED9D0F5DA32376E65C94099DA6BE44CA0CD51F70F5574ABF42B3574EA02204636AD6C89041C219B754CF37BA6C2EF74A300188F788CF18CAD2E6B849E326C"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "304402202BEDFD9F1EA71A1C28096638B5417388B246890381D555501AE674F6309CFBDF0220638F076520A4B7D6D5557F3F708CCD700805152AEAE1C5571CA04AE4709D40C2"
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
  "Sequence": 16,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3045022100A473BCCED9D0F5DA32376E65C94099DA6BE44CA0CD51F70F5574ABF42B3574EA02204636AD6C89041C219B754CF37BA6C2EF74A300188F788CF18CAD2E6B849E326C"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "304402202BEDFD9F1EA71A1C28096638B5417388B246890381D555501AE674F6309CFBDF0220638F076520A4B7D6D5557F3F708CCD700805152AEAE1C5571CA04AE4709D40C2"
      }
    }
  ]
}
{ engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '120000220000000024000000106140000000000F4240684000000000004E20730081144EFA5550AA0B6A0C06793161C0D2EDC635469AC883141359AA928F4D98FDB3D93E8B690C80D37DED11C3F9EA7D186D756C74697369676E6564207061796D656E742074657374E1F1FCED7321028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF74473045022100A473BCCED9D0F5DA32376E65C94099DA6BE44CA0CD51F70F5574ABF42B3574EA02204636AD6C89041C219B754CF37BA6C2EF74A300188F788CF18CAD2E6B849E326C811423A7CE52916DFDE210D371CF8487CFDB790B1DCBE1ED7321022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C267446304402202BEDFD9F1EA71A1C28096638B5417388B246890381D555501AE674F6309CFBDF0220638F076520A4B7D6D5557F3F708CCD700805152AEAE1C5571CA04AE4709D40C2811482D518A6A562B198E72BC1B8976F83D996E3CCD5E1F1',
  tx_json:
   { Account: 'j3UbbRX36997CWXqYqLUn28qH55v9Dh37n',
     Amount: '1000000',
     Destination: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Fee: '20000',
     Flags: 0,
     Memos: [ [Object] ],
     Sequence: 16,
     Signers: [ [Object], [Object] ],
     SigningPubKey: '',
     TransactionType: 'Payment',
     hash:
      'CD4FD2CB9FDB5003FE8115140D62C7671461C281A516B15275561BA8959412A9' } }
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
  "Sequence": 16,
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3045022100A473BCCED9D0F5DA32376E65C94099DA6BE44CA0CD51F70F5574ABF42B3574EA02204636AD6C89041C219B754CF37BA6C2EF74A300188F788CF18CAD2E6B849E326C"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "304402202BEDFD9F1EA71A1C28096638B5417388B246890381D555501AE674F6309CFBDF0220638F076520A4B7D6D5557F3F708CCD700805152AEAE1C5571CA04AE4709D40C2"
      }
    }
  ],
  "SigningPubKey": "",
  "TransactionType": "Payment",
  "hash": "CD4FD2CB9FDB5003FE8115140D62C7671461C281A516B15275561BA8959412A9"
}
```

:::

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

::: details 展开

```javascript
const jlib = require("@swtc/lib")
var Remote = jlib.Remote
var remote = new Remote({ server: "ws://101.200.230.74:5020" })
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

// 创建支付交易
let tx = remote.buildPaymentTx({
  account: a.address,
  to,
  amount: remote.makeAmount(1)
})
tx.addMemo("multisigned payment test")

remote
  .connectPromise()
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
    remote.disconnect()
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
  "Sequence": 17
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
  "Sequence": 17,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3044022072214F5AD5C48F17701FD3A21689F196894138B2770D0298AC329D851D77B799022055EB9AAF016F55CE8F79BD0DA4063494F802BE3752EEA430678DFADCAF67EA96"
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
  "Sequence": 17,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3044022072214F5AD5C48F17701FD3A21689F196894138B2770D0298AC329D851D77B799022055EB9AAF016F55CE8F79BD0DA4063494F802BE3752EEA430678DFADCAF67EA96"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "3045022100CC2823272E799F3724165154816F5B960B3FC09AB79F87059D2D7CEE256C194002201007958B1DF0D506FEDD1A5CFB00DB26735AD2C18B8C8EEC4481B4DD73A86E89"
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
  "Sequence": 17,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3044022072214F5AD5C48F17701FD3A21689F196894138B2770D0298AC329D851D77B799022055EB9AAF016F55CE8F79BD0DA4063494F802BE3752EEA430678DFADCAF67EA96"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "3045022100CC2823272E799F3724165154816F5B960B3FC09AB79F87059D2D7CEE256C194002201007958B1DF0D506FEDD1A5CFB00DB26735AD2C18B8C8EEC4481B4DD73A86E89"
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
  "Sequence": 17,
  "SigningPubKey": "",
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3044022072214F5AD5C48F17701FD3A21689F196894138B2770D0298AC329D851D77B799022055EB9AAF016F55CE8F79BD0DA4063494F802BE3752EEA430678DFADCAF67EA96"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "3045022100CC2823272E799F3724165154816F5B960B3FC09AB79F87059D2D7CEE256C194002201007958B1DF0D506FEDD1A5CFB00DB26735AD2C18B8C8EEC4481B4DD73A86E89"
      }
    }
  ]
}
{ engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message:
   'The transaction was applied. Only final in a validated ledger.',
  tx_blob:
   '120000220000000024000000116140000000000F4240684000000000004E20730081144EFA5550AA0B6A0C06793161C0D2EDC635469AC883141359AA928F4D98FDB3D93E8B690C80D37DED11C3F9EA7D186D756C74697369676E6564207061796D656E742074657374E1F1FCED7321028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF74463044022072214F5AD5C48F17701FD3A21689F196894138B2770D0298AC329D851D77B799022055EB9AAF016F55CE8F79BD0DA4063494F802BE3752EEA430678DFADCAF67EA96811423A7CE52916DFDE210D371CF8487CFDB790B1DCBE1ED7321022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C2674473045022100CC2823272E799F3724165154816F5B960B3FC09AB79F87059D2D7CEE256C194002201007958B1DF0D506FEDD1A5CFB00DB26735AD2C18B8C8EEC4481B4DD73A86E89811482D518A6A562B198E72BC1B8976F83D996E3CCD5E1F1',
  tx_json:
   { Account: 'j3UbbRX36997CWXqYqLUn28qH55v9Dh37n',
     Amount: '1000000',
     Destination: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
     Fee: '20000',
     Flags: 0,
     Memos: [ [Object] ],
     Sequence: 17,
     Signers: [ [Object], [Object] ],
     SigningPubKey: '',
     TransactionType: 'Payment',
     hash:
      '486AA83D5B487BC8111688A67DC62909B8E32ED49048191DF2828E232724CA2B' } }
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
  "Sequence": 17,
  "Signers": [
    {
      "Signer": {
        "Account": "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        "SigningPubKey": "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        "TxnSignature": "3044022072214F5AD5C48F17701FD3A21689F196894138B2770D0298AC329D851D77B799022055EB9AAF016F55CE8F79BD0DA4063494F802BE3752EEA430678DFADCAF67EA96"
      }
    },
    {
      "Signer": {
        "Account": "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        "SigningPubKey": "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        "TxnSignature": "3045022100CC2823272E799F3724165154816F5B960B3FC09AB79F87059D2D7CEE256C194002201007958B1DF0D506FEDD1A5CFB00DB26735AD2C18B8C8EEC4481B4DD73A86E89"
      }
    }
  ],
  "SigningPubKey": "",
  "TransactionType": "Payment",
  "hash": "486AA83D5B487BC8111688A67DC62909B8E32E"
}
```

:::

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

## 12. ED25519 支持

### 12.0 EDDSA - ed25519

##### 井通默认的签名算法是 ecdsa， 不过同时也支持 eddsa （ed25519）签名

##### ed25519 签名的对象是数据本身， 而其他的(包括 ecdsa)签名对象是数据的哈希

##### 自 wallet 以上，包括 serializer, transaction, lib, 公共方法对 ed25519 的支持是透明的

##### ed25519 的处理发主要在 address-codec 和 keypair 上

### 12.1 生成钱包, 提供算法作为参数

```javascript
const { Wallet } = require("@swtc/wallet")
const data = "1234567890abcdef" // hashed for ecdsa, raw for ed25519

let secret_ecdsa = Wallet.KeyPair.generateSeed()
// or Wallet.generate()
console.log(Wallet.fromSecret(secret_ecdsa))
let wallet_ecdsa = new Wallet(secret_ecdsa)
console.log(wallet_ecdsa)
let signed_ecdsa = wallet_ecdsa.signTx(data)
console.log(`signed_ecdsa = ${signed_ecdsa}`)
let verified_ecdsa = wallet_ecdsa.verifyTx(data, signed_ecdsa)
console.log(`verified_ecdsa = ${verified_ecdsa}`)

let secret_ed25519 = Wallet.KeyPair.generateSeed({ algorithm: "ed25519" })
// or Wallet.generate({algorithm: "ed25519"})
console.log(Wallet.fromSecret(secret_ed25519))
let wallet_ed25519 = new Wallet(secret_ed25519)
console.log(wallet_ed25519)
let signed_ed25519 = wallet_ed25519.signTx(data)
console.log(`signed_ed25519 = ${signed_ed25519}`)
let verified_ed25519 = wallet_ed25519.verifyTx(data, signed_ed25519)
console.log(`verified_ed25519 = ${verified_ed25519}`)
```

输出

```
{ secret: 'spAtA9qTLBZQVKyzANKqmAfdtBgH8',
  address: 'jsxSnYFq4CGrftSEnQohmkDa1dVyNt68hJ' }
Wallet {
  _keypairs:
   { privateKey:
      '00E66A92F53535FBD3E2B95236DF274815BBB1327D76F161EAD73F2B952B87F97C',
     publicKey:
      '02C28400D63F54C7B52792FAC7A5DDB473124C9A01141751C7996818A163F19A88' },
  _secret: 'spAtA9qTLBZQVKyzANKqmAfdtBgH8' }
signed_ecdsa = 30450221009528DC019A4FFA7515A4CA1DD5EF01963B198AA6DE4E2E8F99AFF0739D59DFF7022047385C45304A80E474685A6BC4737C0FB7D100FCAB51EB6863D99113CF755D79
verified_ecdsa = true
{ secret: 'sEd75SswqDV6LNNf23vEKZ51K3KZDQL',
  address: 'jEtV1YRYVyHEhtxzJjEquQsB3HDNpBzgyB' }
Wallet {
  _keypairs:
   { privateKey:
      'ED691B99D463A7D2CD49B6B5C58EDCF9DCA0DE4158D68EC83867D99B754806447A',
     publicKey:
      'EDD0EB6ADBC6CE68D140B44EEC7D3A7C1DB3FD54DD0AE28C2330995CE9C6D66981' },
  _secret: 'sEd75SswqDV6LNNf23vEKZ51K3KZDQL' }
signed_ed25519 = 56404BEE3A1463C9C25C011BBE9C35FE1FF00F255E72B48CE462500CEDCAEF75D853F04F9C5275979C22C0F579D65E461D6E057BAE0ACC031CE3B7484B77980C
verified_ed25519 = true
```

### 12.2 签名透明支持，不需要任何特殊处理

```javascript
xinchuns-mbp:test xcliu$ cat test.js
const sleep = timeout => new Promise(resolve => setTimeout(resolve(), timeout || 1))
const {Remote, Wallet, Transaction} = require('@swtc/lib')
const secret_ed = "sEdTJSpen5J8ZA7H4cVGDF6oSSLLW2Y"
const secret_ec = 'ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C'
const wallet_ec = Wallet.fromSecret(secret_ec)
const wallet_ed = Wallet.fromSecret(secret_ed)
const remote = new Remote({server: "ws://swtcproxy.swtclib.ca:5020"})
const tx = remote.buildPaymentTx({
	account: wallet_ed.address,
	to: wallet_ec.address,
	amount: remote.makeAmount(0.1),
})
let json
sleep(2000).then(async () => {
	await remote.connectPromise()
	console.log(tx.tx_json)
	await tx.signPromise(secret_ed)
	console.log(tx.tx_json)
	console.log(await tx.submitPromise())
})
```

输出

```
{
  Flags: 0,
  Fee: 10000,
  TransactionType: 'Payment',
  Account: 'jfqiMxoT228vp3dMrXKnJXo6V9iYEx94pt',
  Amount: '100000',
  Destination: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz'
}
{
  Flags: 0,
  Fee: 0.01,
  TransactionType: 'Payment',
  Account: 'jfqiMxoT228vp3dMrXKnJXo6V9iYEx94pt',
  Amount: 0.1,
  Destination: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  Sequence: 15,
  SigningPubKey: 'ED68635043BC70DE82272BF5990642400CF79089B2ABCF8EF9D10FFFB96A658763',
  TxnSignature: '92D4855BF6672E072785CBE7DEDCFC0A0BD30F46D74F07661301A844F95DEE7343F3493159DA10B6B46E67F4D050AE96E11F5ED9C4A00B9C758D4E7AF29FB30A',
  blob: '1200002200000000240000000F6140000000000186A06840000000000027107321ED68635043BC70DE82272BF5990642400CF79089B2ABCF8EF9D10FFFB96A658763744092D4855BF6672E072785CBE7DEDCFC0A0BD30F46D74F07661301A844F95DEE7343F3493159DA10B6B46E67F4D050AE96E11F5ED9C4A00B9C758D4E7AF29FB30A81144B0DECFADE9D4170260CD5BA9EC1CF065CA8894683141359AA928F4D98FDB3D93E8B690C80D37DED11C3'
}
{
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  tx_blob: '1200002200000000240000000F6140000000000186A06840000000000027107321ED68635043BC70DE82272BF5990642400CF79089B2ABCF8EF9D10FFFB96A658763744092D4855BF6672E072785CBE7DEDCFC0A0BD30F46D74F07661301A844F95DEE7343F3493159DA10B6B46E67F4D050AE96E11F5ED9C4A00B9C758D4E7AF29FB30A81144B0DECFADE9D4170260CD5BA9EC1CF065CA8894683141359AA928F4D98FDB3D93E8B690C80D37DED11C3',
  tx_json: {
    Account: 'jfqiMxoT228vp3dMrXKnJXo6V9iYEx94pt',
    Amount: '100000',
    Destination: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
    Fee: '10000',
    Flags: 0,
    Sequence: 15,
    SigningPubKey: 'ED68635043BC70DE82272BF5990642400CF79089B2ABCF8EF9D10FFFB96A658763',
    TransactionType: 'Payment',
    TxnSignature: '92D4855BF6672E072785CBE7DEDCFC0A0BD30F46D74F07661301A844F95DEE7343F3493159DA10B6B46E67F4D050AE96E11F5ED9C4A00B9C758D4E7AF29FB30A',
    hash: '26C2D8CB2B90E089CD16681B5390E88B50FA56A58DA8E10A1CC52FC753F7D746'
  }
}
```

### 12.2 多重签名透明支持，不需要任何特殊处理

```javascript
const { Remote, Wallet } = require("@swtc/lib")
const remote = new Remote({ server: "ws://swtcproxy.swtclib.ca:5020" })

const SS = {
  testAddress: "jfdqBEDsbk3eMSXX2t7CGeu2RPkEjHs6ie",
  testSecret: "shVCQFSxkF7DLXkrHY8X2PBKCKxS9",
  address: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  secret: "ssiUDhUpUZ5JDPWZ9Twt27Ckq6k4C",
  address_ed: "jfqiMxoT228vp3dMrXKnJXo6V9iYEx94pt",
  secret_ed: "sEdTJSpen5J8ZA7H4cVGDF6oSSLLW2Y"
}

wallet = Wallet.fromSecret(SS.secret)
wallet_test = Wallet.fromSecret(SS.testSecret)
walleted = Wallet.fromSecret(SS.secret_ed)

options = {
  account: wallet.address,
  threshold: 10,
  lists: [
    { account: wallet_test.address, weight: 6 },
    { account: walleted.address, weight: 6 }
  ]
}

let tx
remote
  .connectPromise()
  .then(async () => {
    // set signerlist
    // tx = remote.buildSignerListTx(options)
    // await tx.signPromise(wallet.secret)
    // console.log(tx.tx_json)
    // console.log(await tx.submitPromise())
    // payment
    tx = remote.buildPaymentTx({
      from: wallet.address,
      to: walleted.address,
      amount: remote.makeAmount()
    })
    await tx._setSequencePromise()
    tx.setFee(20000)
    console.log(tx.tx_json)
    tx.multiSigning(walleted)
    console.log(tx.tx_json)
    tx.multiSigning(wallet_test)
    console.log(tx.tx_json)
    tx.multiSigned()
    console.log(tx.tx_json)
    // console.log(await tx.submitPromise())
    remote.disconnect()
  })
  .catch(console.error)
```

输出

```
{
  Flags: 0,
  Fee: 20000,
  TransactionType: 'Payment',
  Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  Amount: '1000000',
  Destination: 'jfqiMxoT228vp3dMrXKnJXo6V9iYEx94pt',
  Sequence: 31
}
{
  Flags: 0,
  Fee: 20000,
  TransactionType: 'Payment',
  Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  Amount: '1000000',
  Destination: 'jfqiMxoT228vp3dMrXKnJXo6V9iYEx94pt',
  Sequence: 31,
  SigningPubKey: '',
  Signers: [ { Signer: [Object] } ]
}
{
  Flags: 0,
  Fee: 20000,
  TransactionType: 'Payment',
  Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  Amount: '1000000',
  Destination: 'jfqiMxoT228vp3dMrXKnJXo6V9iYEx94pt',
  Sequence: 31,
  SigningPubKey: '',
  Signers: [ { Signer: [Object] }, { Signer: [Object] } ]
}
{
  Flags: 0,
  Fee: 20000,
  TransactionType: 'Payment',
  Account: 'jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz',
  Amount: '1000000',
  Destination: 'jfqiMxoT228vp3dMrXKnJXo6V9iYEx94pt',
  Sequence: 31,
  SigningPubKey: '',
  Signers: [ { Signer: [Object] }, { Signer: [Object] } ]
}
```
