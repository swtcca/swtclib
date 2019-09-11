# Vue.js Web 应用

## 准备

1. 进入 playground 目录

```bash
$ cd playground
```

2. 全局安装 yarn

```bash
$ npm install -g yarn
```

3. 创建 react 工程

```bash
$ npx create-react-app myreactweb
$ cd myreactweb
```

4. 安装 swtc-lib

```bash
$ yarn add swtc-lib
```

5. 启动开发服务器

```bash
$ yarn start
```

6. 浏览器访问
7. 默认页面内容文件 src/App.js 如下

```javascript
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}
```

8. 修改为如下示例内容

```javascript
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { wallet: {}, ledger: {}, price: [], state: "" };
  }
  componentDidMount() {
    this.Wallet = require("swtc-lib").Wallet;
    const Remote = require("swtc-lib").Remote;
    const currency_swt = remote.makeCurrency();
    const currency_cny = remote.makeCurrency("CNY");
    const swt_vs_cny = { limit: 5, gets: currency_swt, pays: currency_cny };
    this.remote = new Remote();
    this.remote.connect((error, server_info) => {
      if (error) {
        console.log(error);
      } else {
        // 订阅帐本
        this.remote.on("ledger_closed", ledger => {
          this.setState({ ledger: ledger });
        });
        // 十秒钟查价格
        setInterval(() => {
          this.remote
            .requestOrderBook(swt_vs_cny)
            .submit((error, orderbooks) => {
              if (error) {
                this.setState({ state: "查询挂单出错了" });
              } else {
                orderbooks.offers.map(offer => {
                  let prices = [];
                  let quantity = Math.floor(
                    parseInt(offer.TakerPays) / 1000000
                  );
                  let price =
                    Math.floor((1000000 * 1000 * 100) / Number(offer.quality)) /
                    100000;
                  prices.unshift(
                    `价格: ${price}\t挂单量: ${quantity}\t${offer.Account}`
                  );
                  this.setState({ price: prices.slice() });
                });
              }
            });
        }, 10000);
      }
    });
    this.setState({ wallet: this.Wallet.generate() });
    this.timer_wallet = setTimeout(
      () => this.setState({ wallet: this.Wallet.generate() }),
      10000
    );
  }
  componentWillUnmount() {
    clearTimeout(this.timer_wallet);
    this.remote.disconnect();
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
            <h3>钱包</h3>
            <hr />
            <pre>{JSON.stringify(this.state.wallet, "", 2)}</pre>
            <h3>帐本</h3>
            <hr />
            <pre>{JSON.stringify(this.state.ledger, "", 2)}</pre>
            <h3>价格</h3>
            <hr />
            <pre>{this.state.price.join("\n")}</pre>
          </div>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
```

9. 添加一小段 css 美化页面 src/App.css

```css
pre {
  width: 50%;
  margin: auto;
  text-align: left;
}
```
