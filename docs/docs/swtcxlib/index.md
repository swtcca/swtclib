# 国密综合 - 国密支持 公链/联盟链/定制链

[[toc]]

## 安装开发库 定义区块链 使用开发库

::: warning
详细操作参看 `钱包` `rpc文档` `lib文档`
:::
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
### 一些例子
#### 默认为井通公链 "jingtum" {}
::: details 代码
```javascript
> .load chains.js
const Wallet_default = require("@swtc/wallet").Factory()
const Wallet_jingtum = require("@swtc/wallet").Factory({})
console.log(`同指向井通公链 ${Wallet_default.config === Wallet_jingtum.config}`)
console.log(Wallet_default.config)
 
同指向井通公链 true
{
  code: 'jingtum',
  currency: 'SWT',
  issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
  CURRENCIES: {
    CNT: 'CNY',
    JCC: 'JJCC',
    SLASH: 'JSLASH',
    MOAC: 'JMOAC',
    CALL: 'JCALL',
    EKT: 'JEKT',
    ETH: 'JETH'
  },
  XLIB: {
    default_ws: 'ws.bcapps.ca:5020',
    default_api: 'api.bcapps.ca:5080',
    default_ws_failover: 'ws-failover.bcapps.ca:5020',
    default_api_failover: 'api-failover.bcapps.ca:5080'
  },
  ACCOUNT_ALPHABET: 'jpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65rkm8oFqi1tuvAxyz',
  SEED_PREFIX: 33,
  ACCOUNT_PREFIX: 0,
  ACCOUNT_ZERO: 'jjjjjjjjjjjjjjjjjjjjjhoLvTp',
  ACCOUNT_ONE: 'jjjjjjjjjjjjjjjjjjjjBZbvri',
  fee: 10000,
  guomi: false,
  ACCOUNT_GENESIS: 'jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh'
}
```
:::
#### 用字符串标识注册的公链 "ripple" "call" "bizain"
::: details 代码
```javascript
> .load registeredchains.js
const Wallet_ripple = require("@swtc/wallet").Factory('ripple')
const Wallet_call = require("@swtc/wallet").Factory("call")
console.log(`瑞波链`)
console.log(Wallet_ripple.config)
console.log(`CALL链`)
console.log(Wallet_call.config)
 
瑞波链
{
  code: 'ripple',
  currency: 'XRP',
  simple: true,
  ACCOUNT_ALPHABET: 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz',
  fee: 10,
  guomi: false,
  ACCOUNT_ZERO: 'rrrrrrrrrrrrrrrrrrrrrhoLvTp',
  ACCOUNT_ONE: 'rrrrrrrrrrrrrrrrrrrrBZbvji',
  ACCOUNT_GENESIS: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
  issuer: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
  CURRENCIES: {},
  XLIB: {}
}
CALL链
{
  code: 'call',
  currency: 'CALL',
  ACCOUNT_ALPHABET: 'cpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2brdeCg65jkm8oFqi1tuvAxyz',
  fee: 10,
  guomi: false,
  ACCOUNT_ZERO: 'ccccccccccccccccccccchoLvTp',
  ACCOUNT_ONE: 'ccccccccccccccccccccBZbvji',
  ACCOUNT_GENESIS: 'cHb9CJAWyB4cj91VRWn96DkukG4bwdtyTh',
  issuer: 'cHb9CJAWyB4cj91VRWn96DkukG4bwdtyTh',
  CURRENCIES: {},
  XLIB: {}
}
```
:::
#### 用对象来标识 联盟链/测试链/国密链 {guomi: true} {fee: 1000}
::: details 代码
```javascript
> .load testchains.js
const Wallet_test = require("@swtc/wallet").Factory({})
const Wallet_test_more = require("@swtc/wallet").Factory({fee: 100, issuer: "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"})
const Wallet_guomi = require("@swtc/wallet").Factory({guomi: true})
const Wallet_guomi_more = require("@swtc/wallet").Factory({guomi: true, fee: 100, issuer: "jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W"})
 
console.log(`测试/联盟链`)
console.log(Wallet_test.config)
console.log(`测试/联盟链 定制`)
console.log(Wallet_test_more.config)
 
console.log(`国密链`)
console.log(Wallet_guomi.config)
console.log(`国密链 定制`)
console.log(Wallet_guomi_more.config)
 
测试/联盟链
{
  code: 'jingtum',
  currency: 'SWT',
  fee: 10,
  guomi: false,
  ACCOUNT_ALPHABET: 'jpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65rkm8oFqi1tuvAxyz',
  ACCOUNT_ZERO: 'jjjjjjjjjjjjjjjjjjjjjhoLvTp',
  ACCOUNT_ONE: 'jjjjjjjjjjjjjjjjjjjjBZbvri',
  ACCOUNT_GENESIS: 'jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh',
  issuer: 'jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh',
  CURRENCIES: {},
  XLIB: {}
}
测试/联盟链 定制
{
  fee: 100,
  issuer: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
  code: 'jingtum',
  currency: 'SWT',
  guomi: false,
  ACCOUNT_ALPHABET: 'jpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65rkm8oFqi1tuvAxyz',
  ACCOUNT_ZERO: 'jjjjjjjjjjjjjjjjjjjjjhoLvTp',
  ACCOUNT_ONE: 'jjjjjjjjjjjjjjjjjjjjBZbvri',
  ACCOUNT_GENESIS: 'jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh',
  CURRENCIES: {},
  XLIB: {}
}
国密链
{
  guomi: true,
  code: 'jingtum',
  currency: 'SWT',
  fee: 10,
  ACCOUNT_ALPHABET: 'jpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65rkm8oFqi1tuvAxyz',
  ACCOUNT_ZERO: 'jjjjjjjjjjjjjjjjjjjjjn1TT5q',
  ACCOUNT_ONE: 'jjjjjjjjjjjjjjjjjjjjwVBfmE',
  ACCOUNT_GENESIS: 'j9syYwWgtmjchcbqhVB18pmFqXUYahZvvg',
  issuer: 'j9syYwWgtmjchcbqhVB18pmFqXUYahZvvg',
  CURRENCIES: {},
  XLIB: {}
}
国密链 定制
{
  guomi: true,
  fee: 100,
  issuer: 'jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W',
  code: 'jingtum',
  currency: 'SWT',
  ACCOUNT_ALPHABET: 'jpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65rkm8oFqi1tuvAxyz',
  ACCOUNT_ZERO: 'jjjjjjjjjjjjjjjjjjjjjn1TT5q',
  ACCOUNT_ONE: 'jjjjjjjjjjjjjjjjjjjjwVBfmE',
  ACCOUNT_GENESIS: 'j9syYwWgtmjchcbqhVB18pmFqXUYahZvvg',
  CURRENCIES: {},
  XLIB: {}
}
```
:::

## 开发库示意图

<mermaid>
stateDiagram-v2
    direction BT
    LIB --> websocketServiceBLOCKCHAIN : websocket
    RPC --> rpcServiceBLOCKCHAIN : rpc
    LIB: Class Remote
    state LIB {
        LIBFactory: require("@swtc/lib").Factory(chain_or_wallet)
    }
    RPC: Class Remote
    state RPC {
        RPCFactory: require("@swtc/rpc").Factory(chain_or_wallet)
    }
    Transaction: Class Transaction
    Serializer: Class Serializer
    Keypair: Class Keypair
    Wallet: Class Wallet
    state Wallet {
        WalletFactory: require("@swtc/wallet").Factory(chain)
    }
    AddressCodec --> Keypair
    Keypair --> Wallet
    Wallet --> LIB : 依赖
    Wallet --> Utils
    Serializer --> Transaction
    Wallet --> Transaction : 依赖
    Utils --> Transaction
    Wallet --> Serializer
    Wallet --> RPC : 依赖
    Transaction --> LIB : 依赖
    Transaction --> RPC : 依赖
</mermaid>

## 公链 vs 国密链

### 编码解码 `require("@swtc/address-codec").Factory(chain)`

#### 相同的种子编码后的密钥不同，解码后对应同一个种子

#### 都支持 ed25519

::: details 代码

```javascript
> .load seed.js
const addressCodec_jingtum = require("@swtc/address-codec").Factory("jingtum")
const addressCodec_guomi = require("@swtc/address-codec").Factory("guomi")

const seed = Buffer.from(`00000000000000000000000000000000`, "hex")
console.log(`同一个种子编码后的密钥不同`)
const secret_jingtum = addressCodec_jingtum.encodeSeed(seed)
const secret_guomi = addressCodec_guomi.encodeSeed(seed)
console.log(`井通： ${secret_jingtum}`)
console.log(`国密： ${secret_guomi}`)
console.log(`解码显示算法`)
console.log(addressCodec_jingtum.decodeSeed(secret_jingtum))
console.log(addressCodec_guomi.decodeSeed(secret_guomi))

console.log(`都支持ed25519，同样一个种子编码后的密钥不同`)
const secret_ed25519_jingtum = addressCodec_jingtum.encodeSeed(seed, "ed25519")
const secret_ed25519_guomi = addressCodec_guomi.encodeSeed(seed, "ed25519")
console.log(`井通： ${secret_ed25519_jingtum}`)
console.log(`国密： ${secret_ed25519_guomi}`)
console.log(`解码显示算法`)
console.log(addressCodec_jingtum.decodeSeed(secret_ed25519_jingtum))
console.log(addressCodec_guomi.decodeSeed(secret_ed25519_guomi))

同一个种子编码后的密钥不同
井通： sp6JS7f14BuwFY8Mw6bTtLKWauoUs
国密： sp6JS7f14BuwFY8Mw6bTtLKTnTe6w
解码显示算法
{
  version: [ 33 ],
  bytes: <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>,
  type: 'secp256k1'
}
{
  version: [ 33 ],
  bytes: <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>,
  type: 'sm2p256v1'
}
都支持ed25519，同样一个种子编码后的密钥不同
井通： sEdSJHS4oiAdz7w2X2ni1gFiqtbJHqE
国密： sEdSJHS4oiAdz7w2X2ni1gFiqq1RRce
解码显示算法
{
  version: [ 1, 225, 75 ],
  bytes: <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>,
  type: 'ed25519'
}
{
  version: [ 1, 225, 75 ],
  bytes: <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>,
  type: 'ed25519'
}
```

:::

### 私钥/公钥 `require("@swtc/keypairs").Factory(chain)`

#### 同一个私钥生成的公钥不同

#### 同一个种子生成的私钥不同

#### 都支持 ed25519

#### 签名和验证签名

::: details 代码

```javascript
> .load keypairs.js
const Keypair_jingtum = require("@swtc/keypairs").Factory("jingtum")
const Keypair_guomi = require("@swtc/keypairs").Factory({guomi: true})
addressCodec_jingtum = Keypair_jingtum.addressCodec
addressCodec_guomi = Keypair_guomi.addressCodec

const PRIVATE_KEY = `002512BBDFDBB77510883B7DCCBEF270B86DEAC8B64AC762873D75A1BEE6298665`
console.log(`同一个私钥生成的公钥不同`)
const pubkey_jingtum = Keypair_jingtum.deriveKeypair(PRIVATE_KEY).publicKey
const pubkey_guomi = Keypair_guomi.deriveKeypair(PRIVATE_KEY).publicKey
console.log(`私    钥: ${PRIVATE_KEY}`)
console.log(`井通公钥: ${pubkey_jingtum}`)
console.log(`国密公钥：${pubkey_guomi}`)

const seed = Buffer.from(`00000000000000000000000000000000`, "hex")
console.log(`同一个种子生成的私钥不同`)
const secret_jingtum = addressCodec_jingtum.encodeSeed(seed)
const secret_guomi = addressCodec_guomi.encodeSeed(seed)
const keypairs_jingtum = Keypair_jingtum.deriveKeypair(secret_jingtum)
const keypairs_guomi = Keypair_guomi.deriveKeypair(secret_guomi)
console.log(`井通:`)
console.log(keypairs_jingtum)
console.log(`国密：`)
console.log(keypairs_guomi)

console.log(`都支持ed25519，同样一个种子生成的私钥不同`)
const secret_ed25519_jingtum = addressCodec_jingtum.encodeSeed(seed, "ed25519")
const secret_ed25519_guomi = addressCodec_guomi.encodeSeed(seed, "ed25519")
const keypairs_ed25519_jingtum = Keypair_jingtum.deriveKeypair(secret_ed25519_jingtum, "ed25519")
const keypairs_ed25519_guomi = Keypair_guomi.deriveKeypair(secret_ed25519_guomi, "ed25519")
console.log(`井通:`)
console.log(keypairs_ed25519_jingtum)
console.log(`国密：`)
console.log(keypairs_ed25519_guomi)

console.log(`签名 和 验证签名`)
const message = "hello how do you do"
console.log(`待签名信息： ${message}`)
const signed_jingtum = Keypair_jingtum.sign(message, keypairs_jingtum.privateKey)
console.log(`井通签名: ${signed_jingtum}`)
console.log(`井通验证: ${Keypair_jingtum.verify(message, signed_jingtum, keypairs_jingtum.publicKey)}`)
const signed_guomi = Keypair_guomi.sign(message, keypairs_guomi.privateKey)
console.log(`国密签名: ${signed_guomi}`)
console.log(`国密验证: ${Keypair_guomi.verify(message, signed_guomi, keypairs_guomi.publicKey)}`)

同一个私钥生成的公钥不同
私    钥: 002512BBDFDBB77510883B7DCCBEF270B86DEAC8B64AC762873D75A1BEE6298665
井通公钥: 0390A196799EE412284A5D80BF78C3E84CBB80E1437A0AECD9ADF94D7FEAAFA284
国密公钥：035A7079DF68641377666464E0B7B6CF4953D4C55741AE6442701BB3ABB069CB14
同一个种子生成的私钥不同
井通:
{
  privateKey: '002512BBDFDBB77510883B7DCCBEF270B86DEAC8B64AC762873D75A1BEE6298665',
  publicKey: '0390A196799EE412284A5D80BF78C3E84CBB80E1437A0AECD9ADF94D7FEAAFA284'
}
国密：
{
  privateKey: '00FD10E5E5A9DD4A35DBF27B931A2D3CA8C6CD4743D74CE4E4C03131DC5A34A9B1',
  publicKey: '024CD9E73D04415C4E0C73C5F7CBF51A6C84871E9746614A345652CDE3F0C09CEB'
}
都支持ed25519，同样一个种子生成的私钥不同
井通:
{
  privateKey: 'ED0B6CBAC838DFE7F47EA1BD0DF00EC282FDF45510C92161072CCFB84035390C4D',
  publicKey: 'ED1A7C082846CFF58FF9A892BA4BA2593151CCF1DBA59F37714CC9ED39824AF85F'
}
国密：
{
  privateKey: 'ED106E34A2B8C7BB13156CFDD0D91379DCC47543DCF9787C68AE5EB582620AE6E8',
  publicKey: 'ED11A47E4CF71B46981ACD0FF7E363278463C4D777453C1982BEEB4E4592768FA8'
}
签名 和 验证签名
待签名信息： hello how do you do
井通签名: 3045022100EBEA129426455020FFDA256084523B8650DF848C2679108C5870F3F9C0B8F13102207122CB117B205D2C7E27EE417999A6C3E60192671AD44C0AF69DA0EF98C4BC3F
井通验证: true
国密签名: 3046022100B8D8AB2332CDADF7DEFD4E7E135A5C1F9D2AD01F47D8BF5AAEF600E70399A235022100A5159AFC93D5BE29B36289D97D27136E20E453E63961D69694398DB45C735386
国密验证: true
```

:::

### 钱包 `require("@swtc/wallet").Factory()`

#### 静态方法 Wallet.generate() Wallet.fromSecret(secret) Wallet.fromPhrase(phrase)

::: details 代码

```javascript
> .load wallet2.js
const Wallet_jingtum = require("@swtc/wallet").Factory("jingtum")
const Wallet_guomi = require("@swtc/wallet").Factory({guomi: true})
const addressCodec_jingtum = Wallet_jingtum.KeyPair.addressCodec
const addressCodec_guomi = Wallet_guomi.KeyPair.addressCodec

const seed = Buffer.from(`00000000000000000000000000000000`, "hex")
const secret_jingtum = addressCodec_jingtum.encodeSeed(seed)
const secret_guomi = addressCodec_guomi.encodeSeed(seed)

console.log(Wallet_jingtum.generate())
console.log(Wallet_guomi.generate())

console.log(Wallet_jingtum.fromSecret(secret_jingtum))
console.log(Wallet_guomi.fromSecret(secret_guomi))

console.log(Wallet_jingtum.fromPhrase('masterpassphrase'))
console.log(Wallet_guomi.fromPhrase('masterpassphrase'))

{
  secret: 'ssKhPpenrKvR96RxEkf96TLffwYZv',
  address: 'jpm59XTLSL6kr8dcg8nxTgk549nJCfdmp9'
}
{
  secret: 'ss2RoG276RxttWVPZh2JKfMTJHRSb',
  address: 'jDyPSXDXVE46h2LnrJQWHneecvqzJGoQbA'
}
{
  secret: 'sp6JS7f14BuwFY8Mw6bTtLKWauoUs',
  address: 'jGCkuB7PBj5tNy68tPEABEtcdno4hE6Y7f'
}
{
  secret: 'sp6JS7f14BuwFY8Mw6bTtLKTnTe6w',
  address: 'jN6pecdxLqs9TbZ1HugLXYQg3qnzseRoiK'
}
{
  secret: 'snoPBjXtMeMyMHUVTgbuqAfg1SUTb',
  address: 'jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh'
}
{
  secret: 'shstwqJpVJbsqFA5uYJJw1YniXcDF',
  address: 'j9syYwWgtmjchcbqhVB18pmFqXUYahZvvg'
}
```

:::

#### 钱包实例 new Wallet(secret)

::: details 代码

```javascript
> .load wallet3.js
const Wallet_jingtum = require("@swtc/wallet").Factory("jingtum")
const Wallet_guomi = require("@swtc/wallet").Factory({guomi: true})
const Keypair_jingtum = Wallet_jingtum.KeyPair
const Keypair_guomi = Wallet_guomi.KeyPair
addressCodec_jingtum = Keypair_jingtum.addressCodec
addressCodec_guomi = Keypair_guomi.addressCodec

const seed = Buffer.from(`00000000000000000000000000000000`, "hex")
const secret_jingtum = addressCodec_jingtum.encodeSeed(seed)
const secret_guomi = addressCodec_guomi.encodeSeed(seed)

console.log(`井通：`)
console.log(new Wallet_jingtum(secret_jingtum))
console.log(`国密：`)
console.log(new Wallet_guomi(secret_guomi))

console.log(`都支持ed25519`)
const secret_ed25519_jingtum = addressCodec_jingtum.encodeSeed(seed, "ed25519")
const secret_ed25519_guomi = addressCodec_guomi.encodeSeed(seed, "ed25519")
console.log(`井通：`)
console.log(new Wallet_jingtum(secret_ed25519_jingtum))
console.log(`国密：`)
console.log(new Wallet_guomi(secret_ed25519_guomi))



井通：
Wallet {
  _keypairs: {
    privateKey: '002512BBDFDBB77510883B7DCCBEF270B86DEAC8B64AC762873D75A1BEE6298665',
    publicKey: '0390A196799EE412284A5D80BF78C3E84CBB80E1437A0AECD9ADF94D7FEAAFA284'
  },
  _secret: 'sp6JS7f14BuwFY8Mw6bTtLKWauoUs'
}
国密：
Wallet {
  _keypairs: {
    privateKey: '00FD10E5E5A9DD4A35DBF27B931A2D3CA8C6CD4743D74CE4E4C03131DC5A34A9B1',
    publicKey: '024CD9E73D04415C4E0C73C5F7CBF51A6C84871E9746614A345652CDE3F0C09CEB'
  },
  _secret: 'sp6JS7f14BuwFY8Mw6bTtLKTnTe6w'
}
都支持ed25519
井通：
Wallet {
  _keypairs: {
    privateKey: 'ED0B6CBAC838DFE7F47EA1BD0DF00EC282FDF45510C92161072CCFB84035390C4D',
    publicKey: 'ED1A7C082846CFF58FF9A892BA4BA2593151CCF1DBA59F37714CC9ED39824AF85F'
  },
  _secret: 'sEdSJHS4oiAdz7w2X2ni1gFiqtbJHqE'
}
国密：
Wallet {
  _keypairs: {
    privateKey: 'ED106E34A2B8C7BB13156CFDD0D91379DCC47543DCF9787C68AE5EB582620AE6E8',
    publicKey: 'ED11A47E4CF71B46981ACD0FF7E363278463C4D777453C1982BEEB4E4592768FA8'
  },
  _secret: 'sEdSJHS4oiAdz7w2X2ni1gFiqq1RRce'
}
```

:::

#### 钱包主要包装上面的 Keypairs 和 addressCodec

::: details 代码

```javascript
> .load wallet.js
const Wallet_jingtum = require("@swtc/wallet").Factory("jingtum")
const Wallet_guomi = require("@swtc/wallet").Factory({guomi: true})
const Keypair_jingtum = Wallet_jingtum.KeyPair
const Keypair_guomi = Wallet_guomi.KeyPair
addressCodec_jingtum = Keypair_jingtum.addressCodec
addressCodec_guomi = Keypair_guomi.addressCodec

const seed = Buffer.from(`00000000000000000000000000000000`, "hex")
console.log(`同一个种子编码后的地址不同`)
const secret_jingtum = addressCodec_jingtum.encodeSeed(seed)
const secret_guomi = addressCodec_guomi.encodeSeed(seed)
const address_jingtum = Wallet_jingtum.fromSecret(secret_jingtum).address
const address_guomi = Wallet_guomi.fromSecret(secret_guomi).address
console.log(`井通： ${address_jingtum}`)
console.log(`国密： ${address_guomi}`)

console.log(`都支持ed25519，同样一个种子编码后的地址不同`)
const secret_ed25519_jingtum = addressCodec_jingtum.encodeSeed(seed, "ed25519")
const secret_ed25519_guomi = addressCodec_guomi.encodeSeed(seed, "ed25519")
const address_ed25519_jingtum = Wallet_jingtum.fromSecret(secret_ed25519_jingtum).address
const address_ed25519_guomi = Wallet_guomi.fromSecret(secret_ed25519_guomi).address
console.log(`井通： ${address_ed25519_jingtum}`)
console.log(`国密： ${address_ed25519_guomi}`)



同一个种子编码后的地址不同
井通： jGCkuB7PBj5tNy68tPEABEtcdno4hE6Y7f
国密： jN6pecdxLqs9TbZ1HugLXYQg3qnzseRoiK
都支持ed25519，同样一个种子编码后的地址不同
井通： j9zRhGj7b6xPekLvT6wP4qNdWMjyaumZS7
国密： jnjgyTG6heEC1Exza68mCJQbTyNPC8uTsE
```

:::

#### 签名 / 验证 交易 wallet.signTx() wallet.verifyTx()

::: details 代码

```javascript
> .load wallet4.js
const Wallet_guomi = require("@swtc/wallet").Factory({guomi: true})
const Serializer_guomi = require("@swtc/serializer").Factory(Wallet_guomi)
const FROM = Wallet_guomi.generate()

const tx_json_guomi = {
  TransactionType: "Payment",
    Sequence: 100,
      Account: FROM.address,
        Destination: Wallet_guomi.generate().address,
          Amount: Wallet_guomi.makeAmount()
          }

          console.log(`签名/验证 交易是对 交易的哈希操作`)

          const hash_guomi = Serializer_guomi.from_json(tx_json_guomi).hash(0x1234)
          console.log(`哈希 国密 ${hash_guomi}`)

          console.log(`签名`)
          const wallet = new Wallet_guomi(FROM.secret)
          const signature = wallet.signTx(hash_guomi)
          console.log(signature)

          console.log(`验证 ${wallet.verifyTx(hash_guomi, signature)}`)

签名/验证 交易是对 交易的哈希操作
哈希 国密 A2BB1966425E21986A23E50CBE892A550A4382C1700EA4159AB5EA5C143803BF
签名
3045022100A0B1105D82B56DBD7C923143EDEF1964DBB326AF9E7A6F517F2F1B1787B4D27F02203974B9B1120EC9FCC11986FEAE12A3894174710E221AC8F2DB9A9CAD4A92587B
验证 true
```

:::

### 操作区块链

#### 通过 WEBSOCKET `require("@swtc/lib").Factory(chain)`

::: details 代码

```javascript
> .load remote.js
const Remote_jingtum = require("@swtc/lib").Factory("jingtum")
const remote_jingtum = new Remote_jingtum({server: `ws://ws.bcapps.ca:5020`})
remote_jingtum.connect(console.log)
const Remote_guomi = require("@swtc/lib").Factory("guomi")
const remote_guomi = new Remote_guomi({server: `ws://139.198.19.157:4920`})
remote_guomi.connect(console.log)

undefined
> null {
  fee_base: 10,
  fee_ref: 10,
  hostid: 'WAIL',
  ledger_hash: '61A2F78974D6399BEB317E69929521A9F884B07A2A25B6F87AB95585DB21EC73',
  ledger_index: 20075004,
  ledger_time: 683913950,
  load_base: 256,
  load_factor: 256,
  pubkey_node: 'n94s6NHwTqc7HQBSDeuVaJCHaS2oPzc9c2YuHNtASaMhFamLAFv4',
  random: 'A0384453EB248BB4B800D3E0DACA7D94CCB36C3378F0419FFC0B5BA0820B10C3',
  reserve_base: 20000000,
  reserve_inc: 5000000,
  server_status: 'full',
  validated_ledgers: '18425982-20075004'
}
null {
  fee_base: 10,
  fee_ref: 10,
  hostid: 'NEAT',
  ledger_hash: 'D240C08BAD732F0941E391AB622709E938B293BA450AC8237B325E6C377D07A7',
  ledger_index: 132034,
  ledger_time: 683913950,
  load_base: 256,
  load_factor: 256,
  pubkey_node: 'n94NVNatnNRg22ARFM8pihEg78rUcjoamtAFSa4CSa2AzSXCDoTe',
  random: 'B3CBA425112F98DB24CF8D0EA858A726C4E4363C97C8441496B41BA1C31D80CC',
  reserve_base: 20000000,
  reserve_inc: 5000000,
  server_status: 'proposing',
  validated_ledgers: '1,3-132034'
}
```

:::

#### 通过 RPC `require("@swtc/rpc").Factory(chain)`

::: details 代码

```javascript
> .load remote2.js
const Remote_jingtum = require("@swtc/rpc").Factory("jingtum")
const remote_jingtum = new Remote_jingtum({server: `http://rpc.bcapps.ca:5050`})
remote_jingtum.getServerInfo().then(console.log)
const Remote_guomi = require("@swtc/rpc").Factory("guomi")
const remote_guomi = new Remote_guomi({server: `http://139.198.19.157:4950`})
remote_guomi.getServerInfo().then(console.log)

Promise { <pending> }
> {
  info: {
    build_version: '0.28.1',
    complete_ledgers: '18425885-20075031',
    fetch_pack: 1564,
    hostid: 'WAIL',
    io_latency_ms: 1,
    last_close: { converge_time_s: 2.001, proposers: 8 },
    load_factor: 1,
    peers: 7,
    pubkey_node: 'n94s6NHwTqc7HQBSDeuVaJCHaS2oPzc9c2YuHNtASaMhFamLAFv4',
    server_state: 'full   01:22:03',
    startup_time: '2021-Aug-12 17:39:32',
    validated_ledger: {
      age: 1,
      base_fee_swt: 0.00001,
      fee_account_swt: 'jEoSyfChhUMzpRDttAJXuie8XhqyoPBYvV',
      hash: '7DB0F1E12B017C51B62A08E92ED749E42883D13D0DCB2BE73044DEDF2EFE63EC',
      issuerop_account: 'j4TVCesxU2s6tjYpsDoH4Pc81c4WMvNHPo',
      manager_account: 'jHZhYWj3kLvitkmqZan46FPkzbQYszuhvF',
      reserve_base_swt: 20,
      reserve_inc_swt: 5,
      seq: 20075031
    },
    validation_quorum: 5
  },
  status: 'success'
}
{
  info: {
    build_version: '0.28.1',
    complete_ledgers: '1,3-132061',
    hostid: 'stest-vs1',
    io_latency_ms: 1,
    last_close: { converge_time_s: 3, proposers: 4 },
    load: { job_types: [Array], threads: 3 },
    load_factor: 1,
    peers: 4,
    pubkey_node: 'n94NVNatnNRg22ARFM8pihEg78rUcjoamtAFSa4CSa2AzSXCDoTe',
    pubkey_validator: 'n9Mb3r9p8VYK9TA4ULgMtjoV3k3gLQzt9B9sWsZRP9tQVicnSpKJ',
    server_state: 'proposing   343:35:52',
    startup_time: '2021-Aug-19 16:34:25',
    validated_ledger: {
      age: 1,
      base_fee_swt: 0.00001,
      fee_account_swt: 'jnzVi7QddLE9vWpL4HvV9xQRTBr8ZPZQYS',
      hash: '4EF7EAE9FDD4CE520643D9FFD71CEB6F97FCC892012079CE008C833688800DEB',
      issuerop_account: 'jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W',
      manager_account: 'jUuGfWDcUgHL5sToaYjJVZkbkw9nhYY4x1',
      reserve_base_swt: 20,
      reserve_inc_swt: 5,
      seq: 132061
    },
    validation_quorum: 3
  },
  status: 'success'
}
```

:::

## 国密测试链上验证

::: tip

```javascript
// 这里以rpc操作为例，使用如下配置
const Remote = require("@swtc/rpc").Factory({ guomi: true })
const DATA = {
  rpc_server: "http://139.198.19.157:4950", // 节点服务
  address: "j3TbonCBTcorBu7TeK57aDGTidqkuRMAsi", // 测试账户 sm2p256v1
  secret: "sndZWd9nbsHR34om4eS3B6zM7CeHe",
  addressEd: "ja48NQV8n4ymru8ZrzG2Gs2G5TjjBSfDPF", // 测试账户 ed25519
  secretEd: "sEdT6GjwtHJ86zSrj474iPpgNVUiX2r",
  issuer: "jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W" // 默认通证发行方
}
const remote = new Remote({ server: DATA.rpc_server, issuer: DATA.issuer })
```

:::

### 查询 remote.getAccountInfo() / remote.getAccountBalances()

::: details 代码

```javascript
> remote.getAccountInfo(DATA.address).then(console.log)
Promise { <pending> }
> {
  account_data: {
    Account: 'j3TbonCBTcorBu7TeK57aDGTidqkuRMAsi',
    Balance: '9990249870',
    Flags: 0,
    LedgerEntryType: 'AccountRoot',
    OwnerCount: 0,
    PreviousTxnID: '33D0D3E857229B93B3E63D0B99FD08173E179A9D39D006186024E887B8EE5465',
    PreviousTxnLgrSeq: 100913,
    Sequence: 60,
    index: '9C1F8044F79AA657C8FC53D647D192C8166EE662E15FB3419DFB4689A1A055DA'
  },
  ledger_current_index: 132132,
  status: 'success',
  validated: false
}
> remote.getAccountBalances(DATA.addressEd).then(console.log)
Promise { <pending> }
> {
  balances: [ { value: 4008.18998, currency: 'SWT', issuer: '', freezed: 20 } ],
  sequence: 4
}
```

:::

### 支付 remote.buildPaymentTx() (支持 ed25519)

::: details 代码

```javascript
> let tx = remote.buildPaymentTx({from: DATA.address, to: DATA.addressEd, amount: remote.makeAmount()})
undefined
> tx.submitPromise(DATA.secret).then(console.log)
Promise { <pending> }
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  status: 'success',
  tx_blob: '1200002200000000240000003C6140000000000F424068400000000000000A7321024638004F4A000F55E188A4D2DA4A9D3D3C88C9E261B5EC996029FFE8C14F90C974473045022100FBA58857A966AE37B78F4260D7DB45C449923C5D490FE3ED38FA94AB28BB5CE4022064DF22808A1F8EB8B4902A963ED0CC5D2B3B239BC060CD6C159520B734E665BD811451D0BD8F60934B17D6D015D3D3047C42CAED9EBB83143AF71F0416405F20DBB60F4C64D7AB4D9A02DA94',
  tx_json: {
    Account: 'j3TbonCBTcorBu7TeK57aDGTidqkuRMAsi',
    Amount: '1000000',
    Destination: 'ja48NQV8n4ymru8ZrzG2Gs2G5TjjBSfDPF',
    Fee: '10',
    Flags: 0,
    Sequence: 60,
    SigningPubKey: '024638004F4A000F55E188A4D2DA4A9D3D3C88C9E261B5EC996029FFE8C14F90C9',
    TransactionType: 'Payment',
    TxnSignature: '3045022100FBA58857A966AE37B78F4260D7DB45C449923C5D490FE3ED38FA94AB28BB5CE4022064DF22808A1F8EB8B4902A963ED0CC5D2B3B239BC060CD6C159520B734E665BD',
    hash: '29270578A9F0087B5735FF279D78EBB815C2B451B8D56EE61BFA5699CF266C59'
  }
}
> remote.getAccountBalances(DATA.addressEd).then(console.log)
Promise { <pending> }
> {
  balances: [ { value: 4009.18998, currency: 'SWT', issuer: '', freezed: 20 } ],
  sequence: 4
}
> let tx_back = remote.buildPaymentTx({from: DATA.addressEd, to: DATA.address, amount: remote.makeAmount()})
undefined
> tx_back.submitPromise(DATA.secretEd).then(console.log)
Promise { <pending> }
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  status: 'success',
  tx_blob: '120000220000000024000000046140000000000F424068400000000000000A7321ED7F7BAFBA4E123F2B3F43295EDAC06F95CAE8C47132B31CBA8B4BD173F94C1C35744009BD89AE2585344F0DF00D1DE0252AF878E62E329E8C2FFD2A1719B5F6D552CA1C51F7889E1FBDBCE6B25955DAAF719B995CE750DD801F5C6E4C0B58AA0AC80481143AF71F0416405F20DBB60F4C64D7AB4D9A02DA94831451D0BD8F60934B17D6D015D3D3047C42CAED9EBB',
  tx_json: {
    Account: 'ja48NQV8n4ymru8ZrzG2Gs2G5TjjBSfDPF',
    Amount: '1000000',
    Destination: 'j3TbonCBTcorBu7TeK57aDGTidqkuRMAsi',
    Fee: '10',
    Flags: 0,
    Sequence: 4,
    SigningPubKey: 'ED7F7BAFBA4E123F2B3F43295EDAC06F95CAE8C47132B31CBA8B4BD173F94C1C35',
    TransactionType: 'Payment',
    TxnSignature: '09BD89AE2585344F0DF00D1DE0252AF878E62E329E8C2FFD2A1719B5F6D552CA1C51F7889E1FBDBCE6B25955DAAF719B995CE750DD801F5C6E4C0B58AA0AC804',
    hash: '16C4D1E5C642F4DA48D3E06A8312E31C03B225CACF9F22D3A36AF49E2A16C171'
  }
}

> remote.getAccountBalances(DATA.addressEd).then(console.log)
Promise { <pending> }
> {
  balances: [ { value: 4008.18997, currency: 'SWT', issuer: '', freezed: 20 } ],
  sequence: 5
}
```

:::

### 买卖 remote.getBookOffers() / remote.buildOfferCreateTx()

::: details 代码

```javascript
> remote.getBookOffers(remote.makeCurrency("test"), remote.makeCurrency(), {limit: 2}).then(result => console.log(result.offers))
Promise { <pending> }
> [
  {
    Account: 'jJFMRsG1uRvZRgYsMsRc9ZcArJ4kGNhFis',
    BookDirectory: '6A805E9173207D804BB48CD5A53DC68D39FD4D14AEEF66EB5611C37937E08000',
    BookNode: '0000000000000000',
    Flags: 0,
    LedgerEntryType: 'Offer',
    OwnerNode: '0000000000000000',
    PreviousTxnID: 'A86EC41AA3BEE29A4C78905F0C12D2E86FCF327C5D9618AC9404F48251C0700A',
    PreviousTxnLgrSeq: 8699,
    Sequence: 2,
    TakerGets: {
      currency: 'TEST',
      issuer: 'jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W',
      value: '2'
    },
    TakerPays: '100',
    index: '54857DDC7A316991B9EBC36EE3B90DAD8E066E7CA83504BF517A9787B1B33EAE',
    owner_funds: '1000000000',
    quality: '50'
  },
  {
    Account: 'jJFMRsG1uRvZRgYsMsRc9ZcArJ4kGNhFis',
    BookDirectory: '6A805E9173207D804BB48CD5A53DC68D39FD4D14AEEF66EB5611C37937E08000',
    BookNode: '0000000000000000',
    Flags: 65536,
    LedgerEntryType: 'Offer',
    OwnerNode: '0000000000000000',
    PreviousTxnID: 'D4E85039C7CD128A6E5573F54092AD9DF7A7ED9EAAA8280327417FCF98037E7C',
    PreviousTxnLgrSeq: 8699,
    Sequence: 5,
    TakerGets: {
      currency: 'TEST',
      issuer: 'jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W',
      value: '2'
    },
    TakerPays: '100',
    index: '46EAEBB9F96A4E3C36D141E1D23F2DC7FCFBED218EED86A88460BF174274A083',
    quality: '50'
  }
]

> tx_options = {
... type: "Buy",
... account: DATA.address,
... pays: remote.makeAmount(100),
... gets: remote.makeAmount(2, "test")
... }
{
  type: 'Buy',
  account: 'j3TbonCBTcorBu7TeK57aDGTidqkuRMAsi',
  pays: { currency: 'SWT', issuer: '', value: '100' },
  gets: {
    currency: 'TEST',
    issuer: 'jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W',
    value: '2'
  }
}
> tx = remote.buildOfferCreateTx(tx_options)
Transaction {
  _remote: Remote {
    _token: 'SWT',
    AbiCoder: null,
    Tum3: null,
    _timeout: 50000,
    _issuer: 'jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W',
    _backend: 'rpc',
    _solidity: false,
    _server: 'http://139.198.19.157:4950',
    _axios: [Function: wrap] {
      request: [Function: wrap],
      getUri: [Function: wrap],
      delete: [Function: wrap],
      get: [Function: wrap],
      head: [Function: wrap],
      options: [Function: wrap],
      post: [Function: wrap],
      put: [Function: wrap],
      patch: [Function: wrap],
      defaults: [Object],
      interceptors: [Object]
    }
  },
  _token: 'SWT',
  tx_json: {
    Flags: 0,
    Fee: 10,
    TransactionType: 'OfferCreate',
    Account: 'j3TbonCBTcorBu7TeK57aDGTidqkuRMAsi',
    TakerPays: {
      currency: 'TEST',
      issuer: 'jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W',
      value: '2'
    },
    TakerGets: '100000000'
  },
  _filter: [Function: filter],
  command: 'submit'
}
> tx.submitPromise(DATA.secret).then(console.log)
Promise { <pending> }
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  status: 'success',
  tx_blob: '1200072200000000240000003D64D4871AFD498D00000000000000000000000000544553540000000000B6F1B48F28BF2F15FCC73DA41C3FB81FCE8241D1654000000005F5E10068400000000000000A7321024638004F4A000F55E188A4D2DA4A9D3D3C88C9E261B5EC996029FFE8C14F90C974473045022100D497C0B57C0EA69EE6B4ABC1E7121B156C6688103CE306966CB1FE3E3C62D7FF022048705CB480533DA60B1EA670414EB89F78437D7D6D905E82EA4FDE7CDE0BC13C811451D0BD8F60934B17D6D015D3D3047C42CAED9EBB',
  tx_json: {
    Account: 'j3TbonCBTcorBu7TeK57aDGTidqkuRMAsi',
    Fee: '10',
    Flags: 0,
    Sequence: 61,
    SigningPubKey: '024638004F4A000F55E188A4D2DA4A9D3D3C88C9E261B5EC996029FFE8C14F90C9',
    TakerGets: '100000000',
    TakerPays: {
      currency: 'TEST',
      issuer: 'jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W',
      value: '2'
    },
    TransactionType: 'OfferCreate',
    TxnSignature: '3045022100D497C0B57C0EA69EE6B4ABC1E7121B156C6688103CE306966CB1FE3E3C62D7FF022048705CB480533DA60B1EA670414EB89F78437D7D6D905E82EA4FDE7CDE0BC13C',
    hash: '94CE27BAA3C7507C0F287E58AAED05FA46D7974DBC87519E359C2A9E515D4CEB'
  }
}

> remote.getAccountBalances(DATA.address).then(console.log)
Promise { <pending> }
> {
  balances: [
    { value: 9990.24975, currency: 'SWT', issuer: '', freezed: 25 },
    {
      value: '2',
      currency: 'TEST',
      issuer: 'jHgKXtmDXGJLupHWoeJyisirpZnrvnAA9W',
      freezed: 0
    }
  ],
  sequence: 62
}
```

:::

### 多签

#### 给账户设置签名列表

::: details 代码 - 设置账户

```javascript
> remote.getAccountSignerList(DATA.address).then(console.log)
Promise { <pending> }
> {
  account: 'j3TbonCBTcorBu7TeK57aDGTidqkuRMAsi',
  account_objects: null,
  ledger_current_index: 142994,
  status: 'success',
  validated: false
}
> const tx = remote.buildSignerListTx({
...   account: DATA.address,
...   threshold: 5,
...   lists: [
...     { account: DATA.addressEd, weight: 3},
...     { account: 'j9syYwWgtmjchcbqhVB18pmFqXUYahZvvg', weight: 3 }
...   ]
... })
undefined
> tx.submitPromise(DATA.secret).then(console.log)
Promise { <pending> }
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  status: 'success',
  tx_blob: '1200CF2200000000240000004220260000000568400000000000000A7321024638004F4A000F55E188A4D2DA4A9D3D3C88C9E261B5EC996029FFE8C14F90C97448304602210098ABDB3E5861CA54048C5BA7509EF11C89CCAC99F15105B543A5DEDFC37D06F8022100DD083D8D23A25EA201804751E9FE3D299183449A98375FC6E98990F2EEC1B74E811451D0BD8F60934B17D6D015D3D3047C42CAED9EBBFBEC13000381143AF71F0416405F20DBB60F4C64D7AB4D9A02DA94E1EC13000381145851087D6ADD52AA35ED9D9AA1B57D3D96D26EA8E1F1',
  tx_json: {
    Account: 'j3TbonCBTcorBu7TeK57aDGTidqkuRMAsi',
    Fee: '10',
    Flags: 0,
    Sequence: 66,
    SignerEntries: [ [Object], [Object] ],
    SignerQuorum: 5,
    SigningPubKey: '024638004F4A000F55E188A4D2DA4A9D3D3C88C9E261B5EC996029FFE8C14F90C9',
    TransactionType: 'SignerListSet',
    TxnSignature: '304602210098ABDB3E5861CA54048C5BA7509EF11C89CCAC99F15105B543A5DEDFC37D06F8022100DD083D8D23A25EA201804751E9FE3D299183449A98375FC6E98990F2EEC1B74E',
    hash: '17D2E01161ACB77A8A755ED8212077D937308474A9EDCEB556884E3848373720'
  }
}

> remote.getAccountSignerList(DATA.address).then(console.log)
Promise { <pending> }
> {
  account: 'j3TbonCBTcorBu7TeK57aDGTidqkuRMAsi',
  account_objects: [
    {
      Flags: 0,
      LedgerEntryType: 'SignerList',
      OwnerNode: '0000000000000000',
      PreviousTxnID: '17D2E01161ACB77A8A755ED8212077D937308474A9EDCEB556884E3848373720',
      PreviousTxnLgrSeq: 143666,
      SignerEntries: [Array],
      SignerQuorum: 5,
      index: '0E636BDE9E30E1650106F1DF41E906A70F95F341FEF1F39480256B4764493F4A'
    }
  ],
  ledger_current_index: 143667,
  status: 'success',
  validated: false
}
> remote.getAccountSignerList(DATA.address).then(result => console.log(result.account_objects[0]))
Promise { <pending> }
> {
  Flags: 0,
  LedgerEntryType: 'SignerList',
  OwnerNode: '0000000000000000',
  PreviousTxnID: '17D2E01161ACB77A8A755ED8212077D937308474A9EDCEB556884E3848373720',
  PreviousTxnLgrSeq: 143666,
  SignerEntries: [ { SignerEntry: [Object] }, { SignerEntry: [Object] } ],
  SignerQuorum: 5,
  index: '0E636BDE9E30E1650106F1DF41E906A70F95F341FEF1F39480256B4764493F4A'
}
> remote.getAccountSignerList(DATA.address).then(result => console.log(result.account_objects[0].SignerEntries))
Promise { <pending> }
> [
  {
    SignerEntry: { Account: 'ja48NQV8n4ymru8ZrzG2Gs2G5TjjBSfDPF', SignerWeight: 3 }
  },
  {
    SignerEntry: { Account: 'j9syYwWgtmjchcbqhVB18pmFqXUYahZvvg', SignerWeight: 3 }
  }
]
```

:::

#### 多签流程

1. 创建常规交易
2. 设置 Sequence / memo / fee
3. 第一个钱包签名
4. 第二...个钱包签名
5. 标记签名结束
6. 提交到链
   ::: details 代码

```javascript
> const tx_mult = remote.buildPaymentTx({
... from: DATA.address,
... to: `jJFMRsG1uRvZRgYsMsRc9ZcArJ4kGNhFis`,
... amount: remote.makeAmount(2),
... memo: "multi signed payment"
... })
undefined
> tx_mult._setSequencePromise().then(() => {})
Promise { <pending> }
> console.log(tx_mult.tx_json)
{
  Flags: 0,
  Fee: 10,
  TransactionType: 'Payment',
  Account: 'j3TbonCBTcorBu7TeK57aDGTidqkuRMAsi',
  Amount: '2000000',
  Destination: 'jJFMRsG1uRvZRgYsMsRc9ZcArJ4kGNhFis',
  Memos: [ { Memo: [Object] } ],
  Sequence: 67
}
undefined
> tx_mult.setFee(30000)
undefined
> console.log(tx_mult.tx_json)
{
  Flags: 0,
  Fee: 30000,
  TransactionType: 'Payment',
  Account: 'j3TbonCBTcorBu7TeK57aDGTidqkuRMAsi',
  Amount: '2000000',
  Destination: 'jJFMRsG1uRvZRgYsMsRc9ZcArJ4kGNhFis',
  Memos: [ { Memo: [Object] } ],
  Sequence: 67
}

> const wallet_first = Remote.Wallet.fromSecret(DATA.secretEd)
undefined
> tx_mult.multiSigning(wallet_first)
> console.log(tx_mult.tx_json)
{
  Flags: 0,
  Fee: 0.03,
  TransactionType: 'Payment',
  Account: 'j3TbonCBTcorBu7TeK57aDGTidqkuRMAsi',
  Amount: '2',
  Destination: 'jJFMRsG1uRvZRgYsMsRc9ZcArJ4kGNhFis',
  Memos: [ { Memo: [Object] } ],
  Sequence: 67,
  SigningPubKey: '',
  Signers: [ { Signer: [Object] } ]
}

> const wallet_second = Remote.Wallet.fromPhrase('masterpassphrase')
undefined
> tx_mult.multiSigning(wallet_second)

> console.log(tx_mult.tx_json)
{
  Flags: 0,
  Fee: 0.03,
  TransactionType: 'Payment',
  Account: 'j3TbonCBTcorBu7TeK57aDGTidqkuRMAsi',
  Amount: '2',
  Destination: 'jJFMRsG1uRvZRgYsMsRc9ZcArJ4kGNhFis',
  Memos: [ { Memo: [Object] } ],
  Sequence: 67,
  SigningPubKey: '',
  Signers: [ { Signer: [Object] }, { Signer: [Object] } ]
}
undefined
> console.log(tx_mult.tx_json.Signers)
[
  {
    Signer: {
      Account: 'ja48NQV8n4ymru8ZrzG2Gs2G5TjjBSfDPF',
      SigningPubKey: 'ED7F7BAFBA4E123F2B3F43295EDAC06F95CAE8C47132B31CBA8B4BD173F94C1C35',
      TxnSignature: '7816698D4454ACDE2D6F3D1DF72685880968E790CAC63D53457AF75240B726EE15FC8AC953A5A4810EBD302F50DFEED62F58A7DCA785342474CA56D561895900'
    }
  },
  {
    Signer: {
      Account: 'j9syYwWgtmjchcbqhVB18pmFqXUYahZvvg',
      SigningPubKey: '03CE9FFB99A4125592C43FFCC47959641B4DE59C5B093F1BE5BCDEC49DA9B1C526',
      TxnSignature: '3046022100E879557D787A285225CAECBEE0BB5650A65055BC435BFC6E1CE0B2808EC90EFF022100D704A67314F8E980DCE518BDCFCC3DD2AE672152BBDE9A8915868D5EDE3CF8D4'
    }
  }
]

> tx_mult.multiSigned()

> tx_mult.submitPromise().then(console.log)
Promise { <pending> }
> {
  engine_result: 'tesSUCCESS',
  engine_result_code: 0,
  engine_result_message: 'The transaction was applied. Only final in a validated ledger.',
  status: 'success',
  tx_blob: '120000220000000024000000436140000000001E84806840000000000075307300811451D0BD8F60934B17D6D015D3D3047C42CAED9EBB8314C36EBACB941125E759FE6D52084493CDDDE86EB4F9EA7D146D756C7469207369676E6564207061796D656E74E1F1FCED7321ED7F7BAFBA4E123F2B3F43295EDAC06F95CAE8C47132B31CBA8B4BD173F94C1C3574407816698D4454ACDE2D6F3D1DF72685880968E790CAC63D53457AF75240B726EE15FC8AC953A5A4810EBD302F50DFEED62F58A7DCA785342474CA56D56189590081143AF71F0416405F20DBB60F4C64D7AB4D9A02DA94E1ED732103CE9FFB99A4125592C43FFCC47959641B4DE59C5B093F1BE5BCDEC49DA9B1C52674483046022100E879557D787A285225CAECBEE0BB5650A65055BC435BFC6E1CE0B2808EC90EFF022100D704A67314F8E980DCE518BDCFCC3DD2AE672152BBDE9A8915868D5EDE3CF8D481145851087D6ADD52AA35ED9D9AA1B57D3D96D26EA8E1F1',
  tx_json: {
    Account: 'j3TbonCBTcorBu7TeK57aDGTidqkuRMAsi',
    Amount: '2000000',
    Destination: 'jJFMRsG1uRvZRgYsMsRc9ZcArJ4kGNhFis',
    Fee: '30000',
    Flags: 0,
    Memos: [ [Object] ],
    Sequence: 67,
    Signers: [ [Object], [Object] ],
    SigningPubKey: '',
    TransactionType: 'Payment',
    hash: '0296A8F8A2DEC17F37F89CD72D58EEDE8F6B905045E655496D7AF7A929E8D55A'
  }
}
```

:::

## 遗留

### contract

### erc721

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
