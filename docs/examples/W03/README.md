# 使用 webpack 打包

## 准备

1. 进入 playground 目录

```bash
$ cd playground
```

2. (可选)生成一个默认配置文件 package.json

```bash
$ npm init -y
```

3. 创建目录结构

```bash
$ mkdir src dist
$ touch src/index.js dist/main.js
$ tree
.
├── dist
│   └── main.js
├── index.html
├── src
│   └── index.js
└── styles.css
```

4. 安装 swtc-lib 库和 webpack

```bash
$ npm install swtc-lib
$ npm install webpack webpack-cli
```

5. 和常规 web 不同之处
   > - src/index.js, 这是我们的 javascript 代码文件
   > - src/index.js 可以使用 node.js 的方式导入库, 比如 `const Wallet = require('swtc-lib').Wallet`
   >   - 这意味着我们的 [常规终端示例](../C01) 可以不用任何修改打包成 web 应用
   > - 不再需要静态的 swtc-lib.js , webpack 会从 node.js 库中打包进 dist/main.js
   > - index.html 中不需要保留导入库的部分
   > - dist/main.js 由 webpack 自动生成
6. index.html，最终结果

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>浏览器运行时</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    />
    <link rel="stylesheet" href="styles.css" />
    <!-- 装扮一下页面 -->
  </head>
  <body>
    <main>
      <h1>浏览器</h1>
      <h3>钱包</h3>
      <hr />
      <section class="js-wallet"></section>
      <h3>帐本</h3>
      <hr />
      <section class="js-ledger"></section>
      <h3>价格</h3>
      <hr />
      <section class="js-price"></section>
    </main>
    <script src="dist/main.js"></script>
  </body>
</html>
```

7. javascript 文件放到 src/index.js 中， 注意可以直接使用 node.js 的方式引用 swtc-lib 库, webpack 会做出处理

```javascript
const Wallet = require("swtc-lib").Wallet; // node.js方式导入库
import { Remote } from "swtc-lib"; // esm import也可以

const dom_wallet = document.querySelector(".js-wallet");
const dom_ledger = document.querySelector(".js-ledger");
const dom_price = document.querySelector(".js-price");
const remote = new Remote();
const currency_swt = remote.makeCurrency();
const currency_cny = remote.makeCurrency("CNY");
const swt_vs_cny = { limit: 5, gets: currency_swt, pays: currency_cny };

// 收到ROUND次数的帐本后结束程序
const ROUND = 20;
var round = 0;
// 定义查询价格的函数
const query_price = remote =>
  remote
    .requestOrderBook(swt_vs_cny)
    .submitPromise()
    .then(orderbooks => {
      let price_list = "";
      orderbooks.offers.map(offer => {
        let quantity = Math.floor(parseInt(offer.TakerPays) / 1000000);
        let price =
          Math.floor((1000000 * 1000 * 100) / Number(offer.quality)) / 100000;
        price_list += `\n价格: ${price}\t挂单量: ${quantity}\t${offer.Account}`;
      });
      dom_price.innerHTML = `<pre>${price_list}</pre>`;
    })
    .catch(console.error);

// 每十秒钟生成一个钱包并且打印出来
setInterval(() => {
  let wallet = Wallet.generate();
  console.log("\n...新钱包...");
  dom_wallet.innerHTML = `<pre>${JSON.stringify(wallet, "", 2)}</pre>`;
}, 10000);

// 连接到服务器
remote
  .connectPromise()
  .then(server_info => {
    console.log("\n...服务器信息...");
    // 订阅帐本变动
    remote.on("ledger_closed", ledger_data => {
      console.log("\n...最新帐本...");
      dom_ledger.innerHTML = `<pre>${JSON.stringify(ledger_data, "", 2)}</pre>`;
      round += 1;
      if (round >= ROUND) {
        console.log("\n...结束程序...");
        remote.disconnect();
        alert("已断开连接");
      }
    });
    // 每10秒钟查询价格
    setInterval(() => query_price(remote), 10000);
  })
  .catch(console.error);
```

8. 使用 webpack-cli 打包 (使用 -d 可以打包成调试模式， 文件比较大)

```bash
$ node_modules/.bin/webpack -d
Hash: 1dfa8084e0e6338bcad1
Version: webpack 4.29.6
Time: 990ms
Built at: 03/06/2019 5:52:14 PM
  Asset	  Size  Chunks			 Chunk Names
main.js  4.15 MiB	main  [emitted]  main
Entrypoint main = main.js
[0] crypto (ignored) 15 bytes {main} [optional] [built]
[1] buffer (ignored) 15 bytes {main} [optional] [built]
[2] util (ignored) 15 bytes {main} [built]
[3] util (ignored) 15 bytes {main} [built]
[4] buffer (ignored) 15 bytes {main} [optional] [built]
[./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {main} [built]
[./node_modules/webpack/buildin/module.js] (webpack)/buildin/module.js 497 bytes {main} [built]
[./src/index.js] 1.91 KiB {main} [built]
	+ 191 hidden modules
$ ls -lh dist
total 8504
-rw-r--r--  1 xcliu  staff   4.1M  6 Mar 17:52 main.js
```

9. 浏览器中打开 index.html, 应该正常运行了
