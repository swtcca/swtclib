# 浏览器交互运行

## 准备

1. 进入 playground 目录

```bash
$ cd playground
```

2. (可选)生成一个默认配置文件 package.json

```bash
$ npm init -y
```

3. 生成网页文件

```bash
# 拷贝风格文件
$ cp ../../styles.css .
# 目录结构
$ tree
.
├── index.html
├── styles.css
```

4. index.html， 简单的内容如下

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
    <script src="https://unpkg.com/swtc-lib"></script>
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
  </body>
</html>
```

## 运行方式

1. 交互式运行

- 浏览器中打开 index.html
- 打开 Javascript Console, 处于浏览器运行时的交互模式
- 类似于 node.js 交互式运行，每个命令都有即时反馈
- 不同于 node.js 运行，导入 swtc-lib 是在 html 文件中指定了
- [除了导入库不同外其他代码和 node.js 完全不变](../C01)

```javascript
> const Wallet = swtc_lib.Wallet
  const Remote = swtc_lib.Remote
undefined
```

2. javascript 除了在终端中显示信息外，更可以直接操纵网页元素

```javascript
> const dom_wallet = document.querySelector('.js-wallet')
  const dom_ledger = document.querySelector('.js-ledger')
  const dom_price = document.querySelector('.js-price')
undefined
> dom_wallet.innerHTML = `<h3>钱包</h3>`
  alert("alert可以代替console.log")
undefined
```

## 这样我们就可以得到如下的运行于浏览器终端中的版本，直接更新信息到网页上

```javascript
> const Wallet = swtc_lib.Wallet
  const Remote = swtc_lib.Remote
  const dom_wallet = document.querySelector('.js-wallet')
  const dom_ledger = document.querySelector('.js-ledger')
  const dom_price = document.querySelector('.js-price')
  const remote = new Remote()
  const currency_swt = remote.makeCurrency()
  const currency_cny = remote.makeCurrency('CNY')
  const swt_vs_cny = { limit: 5, gets: currency_swt, pays: currency_cny }

  // 收到ROUND次数的帐本后结束程序
  const ROUND = 20
  var round = 0
  // 定义查询价格的函数
  const query_price = (remote) =>  remote.requestOrderBook(swt_vs_cny).submitPromise()
      .then(orderbooks => {
      let price_list = ''
        orderbooks.offers.map( offer => {
          let quantity = Math.floor(parseInt(offer.TakerPays ) / 1000000)
          let price = Math.floor(1000000 * 1000 * 100 / Number(offer.quality)) / 100000
          price_list += `\n价格: ${price}\t挂单量: ${quantity}\t${offer.Account}`
        })
      dom_price.innerHTML = `<pre>${price_list}</pre>`

    })
    .catch(console.error)

  // 每十秒钟生成一个钱包并且打印出来
  setInterval( () => {
      let wallet = Wallet.generate()
      console.log("\n...新钱包...")
      dom_wallet.innerHTML = `<pre>${JSON.stringify(wallet, '', 2)}</pre>`
    }, 10000
  )

  // 连接到服务器
  remote.connectPromise()
  .then(server_info => {
      console.log("\n...服务器信息...")
      // 订阅帐本变动
      remote.on('ledger_closed', (ledger_data) => {
          console.log("\n...最新帐本...")
          dom_ledger.innerHTML = `<pre>${JSON.stringify(ledger_data, '', 2)}</pre>`
          round += 1
          if ( round >= ROUND ) {
            console.log("\n...结束程序...")
            remote.disconnect()
            alert("已断开连接")
          }
        }
      )
      // 每10秒钟查询价格
      setInterval( () => query_price(remote), 10000)
  })
  .catch(console.error)

  undefined

...服务器信息...
VM30787:34
...新钱包...
VM30787:49
...最新帐本...
VM30787:20
...出价...
VM30787:34
...新钱包...
VM30787:49
...最新帐本...
VM30787:20
...出价...
```
