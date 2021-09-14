# `swtc-proxy API`服务 - 代理至井通节点

## 在线文档

- [http://swtcproxy.swtclib.ca:5080/swagger](http://swtcproxy.swtclib.ca:5080/swagger)
- [https://app.swaggerhub.com/apis/lospringliu/swtc-proxy/v3](https://app.swaggerhub.com/apis/lospringliu/swtc-proxy/v3)
- [https://swtcdoc.netlify.com](https://swtcdoc.netlify.com)
- [docker image](https://hub.docker.com/repository/docker/lospringliu/swtcproxy)

## 描述

### `@swtc/lib`使用`websocket`，兼容性和规模化有一定的问题

### `swtc-proxy`提供`REST`服务，代理到井通节点解决上述问题

## 约定

0. 安全第一， 确保密钥不出本机
1. 尽量保持数据结构 和 `@swtc/lib` 对应一致
2. 所有 API 应答均为 json object， 包括数据和错误
3. 尽量支持可选参数， 几乎所有`@swtc/lib`支持的参数都可以通过 query 获得支持
4. 集成至 `@swtc/transaction` 和 `@swtc/api`
5. 精简为主， 面向所有用户。 提供缺省配置和 docker image
6. swagger-ui 标准文档

## 使用

### kubernetes (通过环境变量设置上游/调试/基于 IP 的访问限制)

0. `kubectl create -f https://raw.githubusercontent.com/swtcca/swtcproxy/master/kubernetes.yaml`

### docker (通过环境变量设置上游/调试/基于 IP 的访问限制)

1. `docker run --rm -e UPSTREAM=wss://s.jingtum.com:5020 -e DEBUG=true -e RATE=100 -d -p 5080:5080 lospringliu/swtcproxy`

### 源代码

1. `git clone https://github.com/swtcca/swtcproxy.git`
2. `cd swtcproxy`
3. `npm install`
4. `npm run test`
5. `env UPSTREAM=wss://s.jingtum.com:5020 RATE=100 npm run start`
6. 本地文档： http://localhost:5080/swagger
   > - 相应修改 `static/swagger.json` 的`server.url`

- 配合[@swtc/api](../api/)使用，提供和`@swtc/lib`相似的接口
  - 避免 websocket
  - 完整接口

## 定制

### 源代码

1. `git clone https://github.com/swtcca/swtclib.git`
2. `cd swtclib/packages/swtc-proxy`
3. `npm install`
4. `npm run test`
5. `npm run start`
6. 本地文档： http://localhost:5080/swagger
   > - 相应修改 `static/swagger.json` 的`server.url`

### 修改 start.js

- 配置
- 中间件
- 后端
- 日志
- 扩展

### 修改源文件 tssrc/
