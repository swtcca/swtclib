# Promise 和 Promisify

### swtc-lib的Promise皆以Promise结尾，比如
- connectPromise()
- signPromise()
- submitPromise()
- txSetSequencePromise()
- txSignPromise()
- txSubmitPromise()

### jingtum-lib 没有提供原生的Promise支持, swtc-lib支持
0. 可以使用工具 **bluebird** 为jingtum-lib提供Promise
1. 工作于 playground 目录
2. 安装 swtc-lib
```bash
$ npm install swtc-lib
```
3. promisify
```javascript

const Remote = SWTCLIB.Remote
const remote = new Remote({server: 'ws://swtclib.daszichan.com:5020'})
remote.connectPromise()
	.then( server_info => {
			console.log(server_info)
			remote.disconnect()
		}
	)
	.catch (error => console.log(error))
```
