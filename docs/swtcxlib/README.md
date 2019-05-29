# swtc-x-lib 无差别联盟链开发库

## 无差别联盟链支持
- 井通
- 商链
- CALL
- STM
- ...
## 应用开发者专用库
- 统一实例
- 统一文档
- 体验
- 共享
- 无障碍沟通

## [对井通库的改进](../swtc)
> ### 安全提升
> ### 强兼容
> ### 现代性
> ### class实现
> ### typescript实现
> ### 格式化代码
> ### 模块化
> ### travis集成
> ### 完善测试

## 改进内容
### 安全提升
  - 强制本地签名
  - 密钥不出本机
### 强兼容
  - 所有包确保零配置webpack和browserify兼容
  - 可以用于网络应用 桌面应用 终端应用 移动应用
### 现代性
  - 原生Promise支持, 支持现代javascript标准特性 promise, async/await
  - Remote.connectPromise()
  - Request.submitPromise()
  - Transaction.signPromise()
  - Transaction.submitPromise()
### class实现
  - x-lib
  - Server
  - Remote
  - Request
  - Transaction - 独立成包，可以单独使用， 技术上轻松对接交易所
    - 签名实现
	- 提交实现
  - Wallet
    - 支持swtc bitcoin ripple bwt call stm
### typescript实现
  - x-lib
  - 编辑器帮助提示
  - Server
  - Remote
  - Request
  - Transaction
  - Wallet
### 格式化代码
  - prettier格式化
  - eslint / tslint
### 模块化
```bash
$ npm list | grep -i swtc
└─┬ swtc-x-lib@1.0.3
| ├── swtc-nativescript@1.0.0
│ └─┬ swtc-transaction@1.2.9
│   ├─┬ swtc-serializer@2.1.2
│   │ └─┬ swtc-wallet@1.1.11
│   │   └─┬ swtc-keypairs@0.11.15
│   │     └─┬ swtc-address-codec@2.0.7
│   │       ├── swtc-chains@1.0.6
│   ├─┬ swtc-utils@1.1.6
│   │ ├── swtc-wallet@1.1.11 deduped
```
### travis集成
  - 代码提交自动测试
## 安装
```bash
# npm install swtc-x-lib
```

## 使用 (web)
- located at `./node_modules/swtc-x-lib/dist`
- the global name is `swtc_x_lib`

## 使用 (nodejs)
```javascript
const Factory = require('swtc-x-lib').Factory  // or import { Factory } from 'swtc-x-lib'
// 井通库
const RemoteJ = Factory('jingtum')  // or const RemoteJ = Factory('swt')
const remoteJ = new RemoteJ({server: 'ws://ts5.jingtum.com:5020', issuer: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS'})
// 相应组件
// const WalletJ = RemoteJ.Wallet
// const TransactionJ = RemoteJ.Transaction
// const RequestJ = RemoteJ.Request
// const AccountJ = RemoteJ.Account
// const OrderBookJ = RemoteJ.OrderBook
// const utilsJ = RemoteJ.utils
// 商链库
const RemoteB = Factory('bizain')   // or const RemoteB = Factory('bwt')
const remoteB = new RemoteB({server: 'ws://123.207.226.229:5020'})
// 相应组件
// const WalletB = RemoteB.Wallet
// const TransactionB = RemoteB.Transaction
// const RequestB = RemoteB.Request
// const AccountB = RemoteB.Account
// const OrderBookB = RemoteB.OrderBook
// const utilsB = RemoteB.utils
```

## 文档和实例
### 按照如上方式引用后可以直接使用井通的文档和实例
#### [实例](../examples/)
#### [接口](../swtclib/)

## 改进
1. swtc-api, jingtum-api 尚未支持联盟链
2. solidity 尚未支持联盟链

## 赞助方
### 井畅
![jccdex](./jccdex.png)
### SWTC基金会
![swtc](./swtcfdt.png)
### 商链
![bizain](./bizain.png)

