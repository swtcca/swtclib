# DAPP Examples Using Javascript and SWTC-LIB

## 使用 swtc-lib

- 正常情况下，所有实例使用的 node.js 为最新的 LTS 版本
- 正常情况下，所有显式安装的包使用缺省的最新版本
- 正常情况下，我们使用[脚本方式运行](C00)
- 用 npm 安装

```bash
$ npm install swtc-lib # jingtum-lib接口, 版本为1.6.x, typescript promise
$ npm install swtc-lib@jcc # jcc_jingtum_lib接口， 版本为1.5.x
```

- 浏览器直接引用
  - CDN 直接引用
    - `<script src='https://unpkg.com/swtc-lib'></script>`
    - 或者 `<script src='https://cdn.jsdelivr.net/npm/swtc-lib'></script>`
  - 或者当前目录下包含一份调试版本 swtc-lib.js
  - 可以 [自行编译](https://github.com/swtca/swtclib)
  - 不建议使用此方式
  - 建议使用 [webpack 打包](W03) 方式替代
- 常规导入

```javascript
const Wallet = require("swtc-lib").Wallet;
const Remote = require("swtc-lib").Remote;
```

## 单行代码操作

0. 导入钱包/库
   > - `const Remote = require('swtc-lib').Remote`
   > - `import { Remote } from 'swtc-lib'`
1. 创建 remote 对象
   > `const remote = new (require('swtc-lib').Remote)({server: 'ws://ts5.jingtum.com:5020', issuer: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS'})`
1. 连接服务器
   > `remote.connectPromise().then(console.log).catch(console.error)`
1. 获取帐本
   > `remote.requestLedgerClosed().submitPromise().then(console.log)`
1. 获取交易
   > `remote.requestTx({hash: 'hash'}).submitPromise().then(console.log)`
1. 获取帐号信息
   > `remote.requestAccountInfo({account: 'address'}).submitPromise().then(console.log)`
1. 获得账号可接收和发送的货币
   > `remote.requestAccountTums({account: 'address'}).submitPromise().then(console.log)`
1. 支付
   > `remote.buildPaymentTx({source: 'address1', to: 'address2', amount: remote.makeAmount(1)}).submitPromise('secret', 'memo').then(console.log)`
1. 挂单
   > `remote.buildOfferCreateTx({type: 'Sell', account: 'address', taker_gets: remote.makeAmount(1), taker_pays: remote.makeAmount(0.01, 'cnt')}).submitPromise('secret', 'memo').then(console.log).catch(console.error)`
1. 查询挂单
   > `remote.requestAccountOffers({account: DATA.address}).submitPromise().then(console.log)`
1. 撤单
   > `remote.buildOfferCancelTx({ account: 'address', sequence: offerSequence}).submitPromise('secret', 'memo').then(console.log)`
1. 获取信任
   > `remote.requestAccountRelations({type: 'trust', account: 'address'}).submitPromise().then(console.log)`
1. 获取授权
   > `remote.requestAccountRelations({type: 'authorize', account: 'address'}).submitPromise().then(console.log)`
1. 设置信任
   > `remote.buildRelationTx({type: 'trust', account: 'address', target; 'issuer', limit: remote.makeAmount(10000, 'CNY')}).submitPromise('secret', 'memo').then(console.log)`
1. 设置授权
   > `remote.buildRelationTx({type: 'authorize', account: 'address', target; 'address2', limit: remote.makeAmunt(1000, 'CNY')}).submitPromise('secret', 'memo').then(console.log)`
1. 获得市场挂单列表
   > `remote.requestOrderBook({gets: remote.makeCurrency(), pays: remote.makeCurrency('cnt')}).submitPromise().then(console.log).catch(console.error)`

## 示例内容

- [x] 展示 wallet 的创建
- [x] 展示最新的帐本信息
- [x] 查询价格
- [-] 查询余额
- [-] 赞助支付

## CONSOLE 应用

> - node.js 运行时环境
> - 常运行于服务器
> - 常运行于终端中

- [C00 相关说明](C00)
- [C01 常规终端示例](C01)

## WEB 应用

> - 浏览器运行时环境
> - 常运行于客户端
> - 常运行于浏览器中

- [W00 相关说明](W00)
- [W01 浏览器终端示例](W01)
- [W02 常规 WEB 示例](W02)
- [W03 打包 WEB 示例](W03)
- [W04 React Web 示例](W04)
- [W05 Vue Web 示例](W05)
- [W06 Angular Web 示例](W06)
- W07 weex Web 示例
- W08 nuxt 示例

## DESKTOP 应用

> - 通常浏览器运行时环境
> - 通常将 web 应用打包成桌面应用
> - 通常跨平台兼容

- [D00 相关说明](D00)
- [D01 Electron 示例](D01)

## MOBILE 应用

> - 通常翻译成移动设备自身运行时环境
> - react native | Facebook
> - flutter | Google
> - nativescript | Telerik
> - weex | Apache

- [M00 相关说明](M00)
- Nativescript 示例
- [M02 Nativescript Vue 示例](M02)
- Nativescript Angular 示例
- React Native 示例
- Flutter 示例
- Weex 示例

## 时髦使用方式

> - [A00 相关说明](A00)
> - [A01 esm 方式导入](A01)
> - [A02 承诺 promisify](A02)
> - [A03 同步 async/await](A03)
> - [A04 Typescript](A04)
> - [A05 KOA](A05)
> - 终端图形界面

## 相关知识

> #### 终端 包括 Windows 的命令行窗口和 Unix 的命令行终端
>
> #### 浏览器 和浏览器的 javascript console
>
> #### 移动设备 安卓和苹果的手机以及应用
>
> #### HTML 和 CSS
>
> #### Node.js 以及 npm 包管理程序
>
> #### Javascript 的运行环境 包括 node.js 和浏览器
>
> #### 打包(bundle)工具 webpack
>
> #### Javascript 标准和流行的方便的新特性
>
> #### 转换(transpile)工具 babel
>
> #### 桌面应用 electron
>
> #### 前端框架 angular, react, vue.js
>
> #### 移动应用 nativescript, react, flutter

#### 强烈推荐 [廖雪峰的零基础 Javascript 全栈教程](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000)
