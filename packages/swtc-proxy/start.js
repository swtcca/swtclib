const PROXY = require("./src/index")

// PROXY.state.funcConfig() // 默认基金会测试节点
// PROXY.state.funcConfig({server: 'ws://139.198.19.175:5055'}) // 指定基金会测试节点
PROXY.state.funcConfig({ server: "wss://s.jingtum.com:5020" }) // 指定节点
// PROXY.state.funcConfig({ server: "ws://101.200.230.74:5020" }) // 多签节点
//
// disable debug after 100 seconds
setTimeout(() => (PROXY.state.DEBUG.value = false), 100000)

PROXY.web.listen(5080)
