# NativeScript Vue 移动应用

## 准备

1. 进入 playground 目录

```bash
$ cd playground
```

2. 全局安装 [nativescript cli](https://docs.nativescript.org/start/quick-setup)

```bash
$ npm install -g nativescript
#  运行tns doctor来确认开发环境
$ tns doctor
```

3. 创建 vue 工程, 选择用 npm 作为包管理

```bash
$ tns create vuemobapp --vue
$ cd vuemobapp
```

4. 安装 swtc-lib@nativescript 定制版本

```bash
$ npm install swtc-lib
```

5. 更新 webpack 配置文件，应该只要添加/修改几行就可以了
   > - 编辑 webpack.config.js
   > - 修改 env.config.resolve.alias, 在`vue: 'nativescript-vue'` 上面添加添加 `...require('swtc-nativescript').aliases,`
   > - 修改 env.config.resolve.symlink, `false`
   > - 修改 env.config.plugins, 注释掉`"process": "global.process"`
6. 启动模拟器或者连接手机，调试

```bash
# tns preview 这里不能使用
$ tns run ios
$ tns run android
```

7. Vue 的默认页面内容文件 app/components/Home.vue 如下

```vue
<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <Label class="action-bar-title" text="Home"></Label>
    </ActionBar>

    <GridLayout>
      <Label
        class="info"
        horizontalAlignment="center"
        verticalAlignment="center"
      >
        <FormattedString>
          <Span class="fa" text.decode="&#xf135; " />
          <Span :text="message" />
        </FormattedString>
      </Label>
    </GridLayout>
  </Page>
</template>

<script>
export default {
  computed: {
    message() {
      return "Blank {N}-Vue app";
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../app-variables";
// End custom common variables

// Custom styles
.fa {
  color: $accent-dark;
}

.info {
  font-size: 20;
}
</style>
```

7. 修改为如下示例内容

```vue
<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <Label class="action-bar-title" text="Home"></Label>
    </ActionBar>

    <GridLayout rows="auto,*,auto">
      <StackLayout row="0">
        <Label class="info" horizontalAlignment="center">钱包</Label>
        <TextView :text="wallet_text" editable="false"></TextView>
      </StackLayout>
      <StackLayout row="1" verticalAlignment="middle">
        <Label class="info" horizontalAlignment="center">帐本</Label>
        <TextView :text="ledger_text" editable="false"></TextView>
      </StackLayout>
      <StackLayout row="2">
        <Button class="btn btn-primary full" horizontalAlignment="center"
          >价格</Button
        >
        <TextView :text="price_text" editable="false"></TextView>
      </StackLayout>
    </GridLayout>
  </Page>
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
    } catch (error) {
      this.state = "连接不上";
    }
    // 十秒钟一个钱包
    setInterval(() => {
      this.wallet = Wallet.generate();
      console.log(this.wallet);
    }, 10000);
    // 十秒钟查价格
    setInterval(() => {
      remote.requestOrderBook(swt_vs_cny).submit((error, orderbooks) => {
        if (error) {
          this.state = "查询挂单出错了";
        } else {
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
        }
      });
    }, 10000);
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../app-variables";
// End custom common variables

// Custom styles
.info {
  font-size: 20;
}
</style>
```
