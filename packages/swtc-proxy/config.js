// 设置环境变量控制配置 UPSTREAM->server DEBUG->debug PORT->port
module.exports = {
  server: process.env["UPSTREAM"] || "ws://testws.swtclib.ca:5055",
  port: process.env["PORT"] ? Number(process.env["PORT"]) : 5080,
  rate: process.env["RATE"] ? Number(process.env["RATE"]) : 1000,
  debug: process.env["DEBUG"] ? /true/i.test(process.env["DEBUG"]) : false
}
