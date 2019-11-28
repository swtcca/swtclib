const PROXY = require("./src/index")

PROXY.state.funcConfig({ server: "ws://101.200.230.74:5020" })

PROXY.web.listen(3000)
