# 终端程序

1. 工作于 **playground** 目录
2. 安装 swtc-lib
3. 生成文件 **index.js** , 目录结构和内容如下

```bash
$ tree
.
└── index.js
```

```javascript
"use strict";

// 引用swtc-lib库
const Wallet = require("swtc-lib").Wallet;
const Remote = require("swtc-lib").Remote;

const remote = new Remote();
const currency_swt = remote.makeCurrency();
const currency_cny = remote.makeCurrency("CNY");
const swt_vs_cny = { limit: 5, gets: currency_swt, pays: currency_cny };

// 收到ROUND次数的帐本后结束程序
const ROUND = 20;
var round = 0;
// 定义查询价格的函数
const query_price = remote => {
  remote
    .requestOrderBook(swt_vs_cny)
    .submitPromise()
    .then(orderbooks => {
      orderbooks.offers.forEach(offer => {
        let quantity = Math.floor(parseInt(offer.TakerPays) / 1000000);
        let price =
          Math.floor((1000000 * 1000 * 100) / Number(offer.quality)) / 100000;
        console.log(`价格: ${price}\t挂单量: ${quantity}\t${offer.Account}`);
      });
    })
    .catch(error => console.log(`\n查询挂单出错了 ${error}`));
};

// 每十秒钟生成一个钱包并且打印出来
setInterval(() => {
  let wallet = Wallet.generate();
  console.log("\n...新钱包...");
  console.log(wallet);
}, 10000);

// 连接到服务器
remote
  .connectPromise()
  .then(server_info => {
    // 连接成功
    console.log("\n...服务器信息...");
    console.log(server_info);
    // 订阅帐本变动
    remote.on("ledger_closed", ledger_data => {
      console.log("\n...最新帐本...");
      console.log(ledger_data);
      round++;
      if (round >= ROUND) {
        console.log("\n...结束程序...");
        remote.disconnect();
        console.log("已断开连接");
      }
    });
    // 每10秒钟查询价格
    setInterval(() => query_price(remote), 10000);
  })
  .catch(error => console.log(error));
```

4. 脚本式运行

```bash
$ node index.js
```
