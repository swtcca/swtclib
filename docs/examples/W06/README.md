# Angular Web 应用

## 准备

1. 进入 playground 目录.

```bash
$ cd playground
```

2. 由于 angular-cli 创建纯粹的 web 应用，没有使用 webpack，我们找一个模版

```bash
$ git clone git@github.com:muweigg/ng7.git
```

3. 进入目录，该模版使用 webpack

```bash
$ cd ng7
```

4. 安装 swtc-lib

```bash
$ npm install swtc-lib
```

5. 启动开发服务器

```bash
$ npm run serv
```

6. 浏览器访问
7. 默认页面内容文件 `src/app/modules/home/home.component.html` 如下

```html
<div class="box">
  <img src="../../../assets/images/angular.png" />
  <h1>
    {{ title }}
    <br />
    this is a lazy load module.
  </h1>
</div>
```

修改为如下示例内容

```html
<div class="box">
  <img src="../../../assets/images/angular.png" />
  <div>
    <h3>钱包</h3>
    <hr />
    <div><pre>{{ wallet_text }}</pre></div>
    <h3>帐本</h3>
    <hr />
    <div><pre>{{ ledger_text }}</pre></div>
    <h3>价格</h3>
    <hr />
    <div><pre>{{ price_text }}</pre></div>
  </div>
</div>
```

8. 对应 typescript 脚本为 `src/app/modules/home/home.component.ts`, 内容

```typescript
import { Component, OnInit } from "@angular/core";
@Component({
  selector: "home",
  templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
  title: String = "app works!";
  constructor() {}
  ngOnInit() {}
}
```

修改为

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  title: String = "app works!";

  constructor() {
    this.wallet = {}
    this.ledger = {}
    this.price = []
    this.wallet_text = ''
    this.ledger_text = ''
    this.price_text = ''
  }

  ngOnInit() {
    const SwtcLib = require('swtc-lib')
    const Wallet = SwtcLib.Wallet
    const Remote = SwtcLib.Remote
    const remote = new Remote()
    const currency_swt = remote.makeCurrency()
    const currency_cny = remote.makeAmount('CNY')
    const swt_vs_cny = { limit: 5, gets: currency_swt, pays: currency_cny }
    // 收到ROUND次数的帐本后结束程序
    const ROUND = 20
    var round = 0
    // 定义查询价格的函数
    const query_price = (remote) =>  remote.requestOrderBook(swt_vs_cny).submitPromise()
        .then(orderbooks -=> {
           console.log("\n...出价...")
           orderbooks.offers.map( offer => {
             let quantity = Math.floor(parseInt(offer.TakerPays ) / 1000000)
             let price = Math.floor(1000000 * 1000 * 100 / Number(offer.quality)) / 100000
             this.price.unshift(`\n价格: ${price}\t挂单量: ${quantity}\t${offer.Account}`)
           })
           this.price.splice(5)
           this.price_text = this.price.join('\n')
        })
        .catch(console.error)
    // 生成一个钱包并且之后每十秒更新
    this.wallet = Wallet.generate()
    this.wallet_text = JSON.stringify(this.wallet, '', 2)
    setInterval( () => {
        this.wallet = Wallet.generate()
        console.log("\n...新钱包...")
        this.wallet_text = JSON.stringify(this.wallet, '', 2)
      }, 10000
    )
    // 连接到服务器
    remote.connect( (error, server_info) => {
        // 连接出错
        if (error) {
          console.log(error)
        } else {
        // 连接成功
          console.log("\n...服务器信息...")
          // 订阅帐本变动
          remote.on('ledger_closed', (ledger_data) => {
              console.log("\n...最新帐本...")
              this.ledger = ledger_data
              this.ledger_text = JSON.stringify(this.ledger, '', 2)
              round += 1
              if ( round >= ROUND ) {
                console.log("\n...结束程序...")
                remote.disconnect()
                alert("已断开连接")
              }
            }
          )
          // 查询价格每10秒钟更新
          query_price(remote)
          setInterval( () => query_price(remote), 10000)
        }
      })
      }
}
9. 页面应该正常了
```
