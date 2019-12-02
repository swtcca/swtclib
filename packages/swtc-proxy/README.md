# `swtc-proxy API`服务 - 代理至井通节点

## 描述

### `swtc-lib`使用`websocket`，兼容性和规模化有一定的问题

### `swtc-proxy`提供`REST`服务，代理到井通节点解决上述问题

## 使用

1. `git clone https://github.com/swtcca/swtclib.git`
2. `cd swtclib/packages/swtc-proxy`
3. `npm install`
4. `npm run start`
5. 本地文档： http://localhost:5080/swagger

- 如果不使用 `localhost`, 需相应修改 `static/swagger.json` 的`server.url`

## 定制

- 修改 start.js
  - 配置
  - 中间件
  - 后端
  - 日志
  - 扩展

## 文档

- http://swtcproxy.swtclib.ca:5080/swagger
- https://app.swaggerhub.com/apis/lospringliu/swtc-proxy/v3
- https://swtcdoc.netlify.com
