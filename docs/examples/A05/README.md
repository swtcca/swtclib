# KOA example

1. 工作于 **playground** 目录
2. 安装 npm install koa swtc-lib swtc-api
3. 创建 koa 文件 koaweb.js

```javascript
const Koa = require("koa");
const app = new Koa();
const RemoteLib = require("swtc-lib").Remote;
const RemoteApi = require("swtc-api").Remote;
const remotelib = new RemoteLib();
const remoteapi = new RemoteApi({});

// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

// response

app.use(async ctx => {
  if (!remotelib.isConnected()) {
    try {
      await remotelib.connectPromise();
      console.log("remote connected");
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("remote was connected");
  }
  ctx.body = "<div>Hello World</div>";
  let result_api = await remoteapi.getOrderBooks(
    "SWT",
    `CNY+${remotelib._token}`,
    { results_per_page: 10 }
  );
  ctx.body += `
  <div>
  	<h1>using api remote</h1>
	<pre>
	  ${JSON.stringify(result_api, "", 4)}
	</pre>
  </div>
  `;
  let result_lib = await remotelib
    .requestOrderBook({
      gets: remotelib.makeCurrency(),
      pays: remotelib.makeCurrency("CNY"),
      limit: 10
    })
    .submitPromise();
  ctx.body += `
  <div>
  	<h1>using lib remote</h1>
	<pre>
	  ${JSON.stringify(result_lib, "", 4)}
	</pre>
  </div>
  `;
});

console.log("starting server on port 3000");
app.listen(3000);
```

4. 脚本式运行

```bash
$ node koaweb.js
```

5. 输出

```bash
starting server on port 3000
remote connected
GET / - 4731ms
remote was connected
GET /favicon.ico - 1441ms
remote was connected
GET / - 1672ms
remote was connected
GET /favicon.ico - 1521ms
```
