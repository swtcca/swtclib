# Promise 和 Promisify

### swtc-lib 的 Promise 皆以 Promise 结尾，比如

- connectPromise()
- signPromise()
- submitPromise()
- txSetSequencePromise()
- txSignPromise()
- txSubmitPromise()

### jingtum-lib 没有提供原生的 Promise 支持, swtc-lib 支持

0. 可以使用工具 **bluebird** 为 jingtum-lib 提供 Promise
1. 工作于 playground 目录
1. 安装 swtc-lib

```bash
$ npm install swtc-lib
```

3. promisify

```javascript
const Remote = SWTCLIB.Remote;
const remote = new Remote();
remote
  .connectPromise()
  .then(server_info => {
    console.log(server_info);
    remote.disconnect();
  })
  .catch(error => console.log(error));
```
