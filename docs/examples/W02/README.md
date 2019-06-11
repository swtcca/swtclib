# 浏览器常规运行

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
# 符合webpack默认行为的结构
├── dist
│   └── main.js
├── index.html
├── styles.css
└── swtc-lib.js
$ mkdir dist; touch dist/main.js
```

4. index.html， 内容如下, 改变的是把 javascript 拷贝到文件中，用 `<script></script>`包裹起来

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
    <script src="swtc-lib.js"></script>
    <!-- 导入库 -->
    <!-- or use CDN <script src="https://unpkg.com/swtc-lib"></script> -->
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
    <script>
      const Wallet = swtc_lib.Wallet;
      const Remote = swtc_lib.Remote;
      const dom_wallet = document.querySelector(".js-wallet");
      const dom_ledger = document.querySelector(".js-ledger");
      const dom_price = document.querySelector(".js-price");
      const remote = new Remote({ server: "ws://swtclib.daszichan.com:5020" });
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
                Math.floor((1000000 * 1000 * 100) / Number(offer.quality)) /
                100000;
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
            dom_ledger.innerHTML = `<pre>${JSON.stringify(
              ledger_data,
              "",
              2
            )}</pre>`;
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
    </script>
  </body>
</html>
```

## 运行方式

2. 脚本引用式运行

- 象上面这样直接把 javascript 写到网页文件中是很不方便的
- 更好的方式是把它们写到一个单独的文件中，然后用`<script src="url-to-the-js-file"></script>`引用
- 我们准备的 dist/main.js 就是合适的地方，选择这个文件是因为 webpack 默认使用它
- 将 javascript 写到 dist/main.js
- 最终的 index.html 完成，是这样的. 后面我们[用 webpack 连同库一起打包进来](../W03), 导入库的部分可以省掉

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
    <script src="swtc-lib.js"></script>
    <!-- 导入库 -->
    <!-- or use CDN <script src="https://unpkg.com/swtc-lib"></script> -->
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

- dist/main.js

```javascript
const Wallet = swtc_lib.Wallet;
const Remote = swtc_lib.Remote;
const dom_wallet = document.querySelector(".js-wallet");
const dom_ledger = document.querySelector(".js-ledger");
const dom_price = document.querySelector(".js-price");
const remote = new Remote({ server: "ws://swtclib.daszichan.com:5020" });
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
