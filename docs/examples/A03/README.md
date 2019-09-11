# Async/Await 是对 Promise 的进一步简化，让程序看起来像是同步运行一样

1. 工作于 playground 目录
2. 安装 swtc-lib 和 bluebird

```bash
$ npm install swtc-lib
$ npm install bluebird
```

3. async/await

```javascript
const SWTCLIB = require("swtc-lib");
const BLUEBIRD = require("bluebird");
BLUEBIRD.promisifyAll(SWTCLIB);

const Remote = SWTCLIB.Remote;
const remote = new Remote();
// 我们现在对于每个有回调的函数就拥有相应的Async函数, 最常见
// await必须运行于async函数中
var someFunction = async () => {
  try {
    let server_info = await remote.connectAsync();
    // 此处等待返回结果，看起来像是同步，但不阻塞
    console.log(server_info);
    // 此时已经连接到服务器了
    let ledger_data = await remote.requestLedger({}).submitAsync();
    // 此处等待返回结果
    console.log(ledger_data);
    remote.disconnect();
  } catch (error) {
    console.log(error);
  }
};
// 运行
someFunction();
```
