# Vue.js Web 应用

## 准备

1. 进入 playground 目录

```bash
$ cd playground
```

2. 全局安装 vue-cli

```bash
$ npm install -g @vue/cli
```

3. 创建 vue 工程, 选择用 npm 作为包管理

```bash
$ vue create vuewebproject
$ cd vuewebproject
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
7. Vue 的默认页面内容文件 src/components/HelloWorld.vue 如下

```vue
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br />
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener"
        >vue-cli documentation</a
      >.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel"
          target="_blank"
          rel="noopener"
          >babel</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint"
          target="_blank"
          rel="noopener"
          >eslint</a
        >
      </li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li>
        <a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a>
      </li>
      <li>
        <a href="https://forum.vuejs.org" target="_blank" rel="noopener"
          >Forum</a
        >
      </li>
      <li>
        <a href="https://chat.vuejs.org" target="_blank" rel="noopener"
          >Community Chat</a
        >
      </li>
      <li>
        <a href="https://twitter.com/vuejs" target="_blank" rel="noopener"
          >Twitter</a
        >
      </li>
      <li>
        <a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a>
      </li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li>
        <a href="https://router.vuejs.org" target="_blank" rel="noopener"
          >vue-router</a
        >
      </li>
      <li>
        <a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-devtools#vue-devtools"
          target="_blank"
          rel="noopener"
          >vue-devtools</a
        >
      </li>
      <li>
        <a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener"
          >vue-loader</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
          rel="noopener"
          >awesome-vue</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
```

7. 修改为如下示例内容

```vue
<template>
  <div class="hello">
    <h1>SWTC-LIB示例</h1>
    <div>
      <h3>钱包</h3>
      <hr />
      <pre>{{ wallet_text }}</pre>
    </div>
    <div>
      <h3>帐本</h3>
      <hr />
      <pre>{{ ledger_text }}</pre>
    </div>
    <div>
      <h3>价格</h3>
      <hr />
      <pre>{{ price_text }}</pre>
    </div>
  </div>
</template>

<script>
const SwtcLib = require("swtc-lib");
const Wallet = SwtcLib.Wallet;
const Remote = SwtcLib.Remote;
const remote = new Remote();
const currency_swt = remote.makeCurrency();
const currency_cny = remote.makeCurrency("CNY");
const swt_vs_cny = { limit: 5, gets: currency_swt, pays: currency_cny };

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      wallet: {},
      ledger: {},
      price: [],
      state: ""
    };
  },
  computed: {
    wallet_text() {
      return JSON.stringify(this.wallet, "", 2);
    },
    ledger_text() {
      return JSON.stringify(this.ledger, "", 2);
    },
    price_text() {
      return this.price.join("\n");
    }
  },
  created() {
    this.wallet = Wallet.generate();
  },
  async mounted() {
    try {
      // 同步连接
      await remote.connectPromise();
      // 订阅帐本
      remote.on("ledger_closed", ledger_data => {
        this.ledger = ledger_data;
      });
      // 十秒钟一个钱包
      setInterval(() => (this.wallet = Wallet.generate()), 10000);
      // 十秒钟查价格
      setInterval(async () => {
        try {
          let orderbooks = await remote
            .requestOrderBook(swt_vs_cny)
            .submitPromise();
          orderbooks.offers.map(offer => {
            let quantity = Math.floor(parseInt(offer.TakerPays) / 1000000);
            let price =
              Math.floor((1000000 * 1000 * 100) / Number(offer.quality)) /
              100000;
            this.price.unshift(
              `价格: ${price}\t挂单量: ${quantity}\t${offer.Account}`
            );
            this.price.splice(5);
          });
        } catch (error) {
          this.state = "查询挂单出错了";
        }
      }, 10000);
    } catch (error) {
      this.state = "连接不上";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  width: 70%;
  margin: auto;
  text-align: left;
}
h1 {
  text-align: center;
}
</style>
```
