const PROXY = require("./src/index")

// PROXY.state.funcConfig() // 默认基金会测试节点
// PROXY.state.funcConfig({server: 'ws://139.198.19.175:5055'}) // 指定基金会测试节点
PROXY.state.funcConfig({
  server: "ws://swtcproxy.swtclib.ca:5020",
  debug: true
}) // 指定节点
// PROXY.state.funcConfig({ server: "wss://s.jingtum.com:5020" }) // 指定节点
// PROXY.state.funcConfig({ debug: true }) // 调试
// PROXY.state.funcConfig({ port: 5080 }) // 端口
// 设置环境变量控制配置 UPSTREAM->server DEBUG->debug PORT->port

PROXY.web.listen(PROXY.state.config.value.port || 5080)
