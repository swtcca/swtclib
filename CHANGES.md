# swtclib 修改说明

> 本次针对 swtclib monorepo 进行了安全审计、工程环境优化与告警消除三个维度的系统性整改。所有 11 个包测试套件全部通过（`lerna success`，0 failures）。

---

## 一、安全修复

### 1. 消除 `new Function()` 动态代码执行

**文件**：`packages/transaction/tssrc/transaction.ts`（约 L423）

**问题**：原代码用 `new Function(...)` 拼接字符串动态执行，若 `func` 来自不可信输入，存在代码注入风险（OWASP A03）。

**修改**：替换为属性存在性检查 + 类型守卫：

```diff
- new Function("contractInstance", `"use strict"; return contractInstance.${func}`)
+ if (Object.prototype.hasOwnProperty.call(myContractInstance, func) &&
+     typeof myContractInstance[func] === "function") {
+   result = myContractInstance[func]()
+ }
```

### 2. 新增 `npm audit` 脚本

**文件**：`package.json`（根）

```json
"audit": "npm audit --audit-level=moderate"
```

便于 CI 或手动执行安全扫描，拦截中危及以上漏洞。

### 3. HTTP 默认端点（待后续处理）

`packages/rpc/tssrc/factory.ts` 默认端点 `http://bcapps.ca:5050` 本次尝试改为 `https`，但测试断言硬编码了该 URL，改动后测试失败，已回滚。**需修改测试与源码同步进行。**

---

## 二、工程环境优化

### 4. 移除 `postinstall` 自动全量构建

**文件**：`package.json`（根）

**问题**：`postinstall: "npm run lint; npm run compile; npm run build"` 导致任何 `npm install`（本地/CI/Docker）都触发完整构建，严重拖慢安装速度。

**修改**：删除 `postinstall` 字段；将 `compile` 步骤迁移至 `bootstrap` 脚本末尾，显式 bootstrap 时才触发：

```json
"bootstrap": "lerna clean --yes && npm install && npm run lint && npm run compile"
```

### 5. 更新 `lerna.json`

**文件**：`lerna.json`

| 字段 | 说明 |
|------|------|
| `"$schema"` | 添加 JSON Schema 路径，启用编辑器校验 |
| `"npmClient": "npm"` | 显式声明包管理器 |
| `"useNx": false` | 禁用 Nx 集成，消除 Nx 相关警告 |
| `"command.run.stream": true` | 所有 `lerna run` 实时流式输出 |
| `"command.run.sort": true` | 按依赖拓扑顺序执行各包任务 |
| 删除旧 `command.bootstrap` 块 | lerna v7+ 已移除 bootstrap 命令 |

### 6. 修复 Webpack 持久缓存

**文件**：`packages/lib/webpack.config.js`

```diff
- cache: false
+ cache: { type: "filesystem" }
```

Webpack 5 默认支持文件系统缓存，`cache: false` 禁用后每次全量构建，开启后可显著提速。

### 7. 移除子包遗留 ESLint 配置

**删除文件（共 8 个）**：

- `packages/api/.eslintrc.js`
- `packages/lib/.eslintrc.js`
- `packages/rpc/.eslintrc.js`
- `packages/transaction/.eslintrc.js`
- `packages/utils/.eslintrc.js`
- `packages/wallet/.eslintrc.js`
- `packages/common/.eslintrc.js`
- `packages/serializer/.eslintrc.js`

**原因**：ESLint 9 使用根目录 `eslint.config.mjs` 的扁平配置，已覆盖整个 monorepo。子包的遗留 `.eslintrc.js` 文件在新版本中被忽略或产生冲突警告。

---

## 三、Package 元信息规范化

### 8. 全部 10 个库包添加 `types` 字段

**涉及文件**：`packages/*/package.json`（address-codec、api、common、keypairs、lib、rpc、serializer、transaction、utils、wallet）

```json
"types": "cjs/index.d.ts"
```

（`utils` 包例外，入口文件名为 `utils.ts`，故为 `"cjs/utils.d.ts"`）

TypeScript 消费者无需额外配置 `typeRoots` 即可获得类型提示。

### 9. 补充 `files` 字段

**涉及文件**：`packages/{api,lib,rpc,transaction,wallet}/package.json`

```json
"files": ["cjs", "esm", "dist"]
```

防止 `npm publish` 将源码、测试、配置文件等一并发布，精确控制发布内容。

### 10. 移除 `serializer` 的无效字段

**文件**：`packages/serializer/package.json`

删除 `"deprecated": false`（npm 仅识别字符串形式的 deprecation 消息，布尔值无实际语义）。

### 11. 修复 ESM 构建产生重复类型声明文件

**涉及文件**：全部 10 个库包的 `tsconfig.esm.json`

```json
"declaration": false,
"declarationMap": false
```

类型声明（`.d.ts`）应由 CJS 构建（`tsconfig.cjs.json`）统一生成，ESM 构建无需重复输出，避免 `esm/` 目录下产生冗余的 `.d.ts` 文件。

---

## 四、测试配置修复

### 12. 修复 Jest 覆盖率扫描路径

**文件**：
- `packages/address-codec/jest.config.js`
- `packages/keypairs/jest.config.js`

```diff
- collectCoverageFrom: ["src/**/*.ts"]
+ collectCoverageFrom: ["tssrc/**/*.ts"]
```

两个包的 TypeScript 源码位于 `tssrc/`，原配置指向不存在的 `src/`，导致覆盖率始终为 0%。

### 13. 简化 proxy 测试脚本

**文件**：`packages/proxy/package.json`

```diff
- "test": "jest -i test/function.spec.js test/store.spec.js; jest test/koa.spec.js; jest test/multisign.spec.js"
+ "test": "jest --runInBand"
```

`--runInBand` 等价于 `-i`（串行执行），自动发现所有测试文件，无需手动枚举。

---

## 五、预存未提交变更（非本次新增，经审查确认合理）

以下变更在本次工作开始前已存在于工作区，经逐一审查后确认合理，一并提交。

### 5.1 `packages/api/tsconfig.cjs.json`

新增 `"skipLibCheck": true`，跳过第三方 `.d.ts` 的类型错误，解决依赖链类型兼容问题。

### 5.2 `packages/api/webpack.config.js`

新增 `resolve.fallback` 配置，为 Node.js 内置模块（`crypto`、`stream` 等）提供浏览器环境 polyfill，支持浏览器端打包。

### 5.3 `packages/lib/tssrc/remote.ts`

将 `lru-cache` API 从 v6 迁移至 v10+：

| 旧 | 新 |
|----|----|
| `import LRU from "lru-cache"` | `import { LRUCache } from "lru-cache"` |
| `new LRU(...)` | `new LRUCache(...)` |
| `maxAge` 选项 | `ttl` 选项 |
| `sha1(...)` | `createHash("sha256")(...)` |

### 5.4 `packages/proxy/tssrc/store/index.ts`

用 `markRaw(new Remote())` 包裹 Remote 实例，防止 Vue 3 的响应式系统对非普通对象做深度代理，避免潜在的性能问题和运行时错误。

### 5.5 `packages/proxy/tssrc/web/static-files.ts`

用 `koa-static`（Koa 官方生态，活跃维护）替换无人维护的 `static-koa-router` + `koa-router`。手动实现 URL 前缀剥离逻辑，返回 `{ routes: () => middleware }` 保持调用接口兼容，上层无需修改。

### 5.6 `packages/proxy/tssrc/functions/v2.ts`

修正路由参数取用错误：`ctx.params.address` → `ctx.params.account`，与路由定义的参数命名一致。

### 5.7 `packages/address-codec/tslint.json`（已删除）

tslint 于 2019 年停止维护，该配置文件无实际效果，已删除。

---

## 六、验证结果

全部 11 个包（address-codec、api、common、keypairs、lib、proxy、rpc、serializer、transaction、utils、wallet）测试套件通过，`lerna run test` 以 `lerna success` 结束，0 failures。
