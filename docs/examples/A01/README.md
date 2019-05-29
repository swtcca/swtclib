
## 模块支持

1. node.js长期以来支持的是commonjs模块系统，使用require导入
```bash
$ node
```
```javascript
> var Wallet = require('swtc-lib').Wallet
> var Remote = require('swtc-lib').Remote
```
2. node.js目前对于ES标准的esm模块原生支持还不好，最方便的是通过esm模块来使用
```bash
$ node -r esm
```
```javascript
import { Wallet, Remote } from 'swtc-lib'
```
