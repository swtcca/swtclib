---
home: true
heroText: SWTC公链/联盟链nodejs库
tagline: 专为应用开发者打造
features:
  - title: 安全第一
    details: 本地签名 密钥不出本机
  - title: 完全兼容
    details: 井通接口, websocket | rpc | proxy
  - title: 独享便利
    details: 零配置webpack支持 零配置browserify支持
  - title: 多框架支持
    details: node web mobile   angular vue react
  - title: 模块化
    details: 理顺依赖关系 反馈正式版本
  - title: 现代化
    details: Promise, typescript, rollup, esm
  - title: 扩展性
    details: 增加api/rpc/proxy
  - title: 联盟链支持
    details: 等同支持所有井通联盟链
  - title: CDN可用
    details: web版本直接CDN引用
  - title: 集成生态节点
    details: 支持中型应用
  - title: 代理实现
    details: 标准 REST API
  - title: 未来可用
    details: 国密 多签 合约 EDDSA
---

::: tip 安装
<vue-typed-js :strings="install" :loop="true">

  <p>区块链操作使用 <span class="typing"></span></p>
</vue-typed-js>
:::
::: tip 定义区块链
<vue-typed-js :strings="chainspecs" :loop="true">
  <p>区块链定义举例 <span class="typing"></span></p>
</vue-typed-js>
:::
::: tip 使用
<vue-typed-js :strings="startups" :loop="true">
  <p>区块链操作使用 <span class="typing"></span></p>
</vue-typed-js>
<vue-typed-js :strings="simplified" :loop="true">
  <p>属性静态绑定<span class="typing"></span></p>
</vue-typed-js>
:::
<mermaid>
stateDiagram-v2
    direction BT
    LIB --> BLOCKCHAIN : websocket
    RPC --> BLOCKCHAIN : rpc
    BLOCKCHAIN: 区块链网络服务 The Block Chain Network (defined by chain specification) where Nodes Provide Websocket And RPC Services
    LIB: Class Remote
    state LIB {
        WWallet: Wallet
        --
        LIBFactory: require("@swtc/lib").Factory(chain)
        --
        WTransaction: Transaction
    }
    RPC: Class Remote
    state RPC {
        RTransaction: Transaction
        --
        RPCFactory: require("@swtc/rpc").Factory(chain)
        --
        RWallet: Wallet
    }
    CTransaction: Class Transaction
    CSerializer: Class Serializer
    CKeypair: Class Keypair
    CWallet: Class Wallet
    state CWallet {
        KeyPair
        --
        WalletFactory: require("@swtc/wallet").Factory(chain)
        --
        addressCodec
    }
    AddressCodec --> CKeypair
    CKeypair --> CWallet
    CWallet --> LIB : 依赖
    CWallet --> Utils
    CSerializer --> CTransaction
    CWallet --> CTransaction : 依赖
    Utils --> CTransaction
    CWallet --> CSerializer
    CWallet --> RPC : 依赖
    CTransaction --> LIB : 依赖
    CTransaction --> RPC : 依赖
</mermaid>

<p align="center">
	<a href="https://gitter.im/swtclib/community?utm_source=share-link&utm_medium=link&utm_campaign=share-link"><img alt="Gitter" src="https://img.shields.io/gitter/room/lospringliu/swtclib.svg" /></a>
	<a href="https://lerna.js.org/"><img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" alt="lerna" /></a>
	<a href="https://github.com/ellerbrock/typescript-badges/"><img src="https://badges.frapsoft.com/typescript/code/typescript.svg?v=101" alt="typescript" /></a>
	<br>
	<img src="https://img.shields.io/badge/ecmascript-6-green.svg" alt="es6" />
	<img src="https://img.shields.io/badge/browserify-ready-green.svg" alt="browserify" />
	<img src="https://img.shields.io/badge/webpack-ready-green.svg" alt="webpack" />
</p>

<h2>文档</h2>

<h3><a href="docs/swtcxlib/">国密综合</a> - 国密 公链 联盟链 定制链</h3>
<h3><a href="docs/wallet/">钱包</a></h3>
<h3><a href="docs/swtclib/">编程接口(lib)</a></h3>
<h3><a href="docs/swtcrpc/">编程接口(rpc)</a></h3>
<h3><a href="docs/api/">编程接口(api)</a></h3>
<h3><a href="docs/swtc/">改进提高</a></h3>
<h3><a href="docs/examples/">应用实例</a></h3>
<h3><a href="docs/swtcapi/">公链api扩展</a></h3>

<h2>程序包 (全面支持联盟链)</h2>

| 程序包名称                        | CDN                                                                                                                                    | 功能描述                            |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [@swtc/rpc](docs/swtcrpc/)        | name: swtc_rpc<br>[unpkg](https://unpkg.com/@swtc/rpc)<br>[jsdelivery](https://cdn.jsdelivr.net/npm/@swtc/rpc)                         | SWTC 公链/联盟链库, 基于 rpc        |
| [@swtc/lib](docs/swtclib/)        | name: swtc_lib<br>[unpkg](https://unpkg.com/@swtc/lib)<br>[jsdelivery](https://cdn.jsdelivr.net/npm/@swtc/lib)                         | SWTC 公链/联盟链库, 基于 websocket  |
| [@swtc/proxy](docs/swtcproxy/)    |                                                                                                                                        | 节点代理, 提供标准 API 接口         |
| [@swtc/api](docs/swtcapi/)        | name: swtc_api<br>[unpkg](https://unpkg.com/@swtc/api)<br>[jsdelivery](https://cdn.jsdelivr.net/npm/@swtc/api)                         | SWTC 公链库, 基于 restapi           |
| [@swtc/transaction](docs/swtctx/) | name: swtc_transaction<br>[unpkg](https://unpkg.com/@swtc/transaction)<br>[jsdelivery](https://cdn.jsdelivr.net/npm/@swtc/transaction) | 井通公链交易库, 支付/挂单/关系/合约 |
| @swtc/serializer                  |                                                                                                                                        | 井通公链交易序列化库, 基于钱包      |
| @swtc/utils                       |                                                                                                                                        | 井通公链 utility 库，基于钱包       |
| [@swtc/wallet](docs/swtcwallet/)  | name: swtc_wallet<br>[unpkg](https://unpkg.com/@swtc/wallet)<br>[jsdelivery](https://cdn.jsdelivr.net/npm/@swtc/wallet)                | 井通公链钱包库, 支持所有联盟链      |
| @swtc/keypairs                    |                                                                                                                                        | 公钥私钥                            |
| @swtc/address-codec               |                                                                                                                                        | 编码解码                            |
| @swtc/common                      |                                                                                                                                        | 基础信息                            |

<h2 align="center">支持开源SWTCLIB 支持公链生态</h2>

<p align="center"> **金主** 经济支援单位。可以参与影响库规划, 享受专业支持</p>
<p align="center"> **赞助** 欢迎喜欢项目的个人捐助</p>
<p align="center"> **用户** 列出公司或者个人也是对项目的支持</p>

<a name="sponsors"></a>

<h3 align="center">
	金主
</h3>
<p align="center">
	<img align="center" src="/swtcfdt.png" alt="SWTC基金会" height="100" />
	<img align="center" src="/bizain.png" alt="商链" height="100" />
</p>

<a name="donate"></a>

<h3 align="center">
	赞助
</h3>
<p align="center">
	<img valign="middle" src="https://img.shields.io/badge/swtc-donate-blue.svg" alt="swtc-donate" /> jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG
	<br><img align="center" src="/donate.png" alt="捐助" />
</p>

<a name="users"></a>

<h3 align="center">
	用户
</h3>
<p align="center">
	CA节点 | 畅节点 | 至尚节点 | JSKY节点 <br>
	<img align="center" src="/jccdex.png" alt="井畅" height="100" />
</p>

<script>
export default {
  data () {
      return {
          install: [
            ' websocket接口 npm install @swtc/lib ',
            '       rpc接口 npm install @swtc/rpc ',
            ' 只使用    钱包 npm install @swtc/wallet '
					],
          simplified: [
            ' const {Transaction, Wallet, Serializer, utils} = Remote ',
            ' const {KeyPair, addressCodec, config} = Wallet '
					],
          startups: [
            ' websocket接口 const Remote = require("@swtc/lib").Factory(chain_spec)',
            '       rpc接口 const Remote = require("@swtc/rpc").Factory(chain_spec)',
            ' 只使用    钱包 const Wallet = require("@swtc/wallet").Factory(chain_spec)'
          ],
					chainspecs: [
            '缺省为井通公链',
						'用字串指定预定义的链  "jingtum" 对应 井通公链',
						'用字串指定预定义的链  "ripple" 对应 瑞波公链',
						'用字串指定预定义的链  "bizain" 对应 商链',
						'用对象定制链  {fee: 1000} 定制转账费用的 井通链',
						'用对象定制链  {guomi: true} 定制符合国密标准的 井通链',
						'用对象定制链  {fee: 1000000, currency: "BWT", ACCOUNT_ALPHABET: "bpsh...Axyz"} 定制转账费用的 商链',
						'用对象定制链  还可以定制默认issuer/通证别名/默认节点等'
					]
      }
  },
}
</script>
