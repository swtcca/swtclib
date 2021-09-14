## 模块支持

1. node.js 长期以来支持的是 commonjs 模块系统，使用 require 导入

```bash
$ node
```

```javascript
> var Wallet = require('@swtc/lib').Wallet
> var Remote = require('@swtc/lib').Remote
```

2. node.js 目前对于 ES 标准的 esm 模块原生支持还不好，最方便的是通过 esm 模块来使用

```bash
$ node -r esm
```

```javascript
import { Wallet, Remote } from "@swtc/lib"
```
