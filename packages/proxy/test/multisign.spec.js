import { web, router, state } from "../src"
const request = require("supertest")
const sleep = time => new Promise(res => setTimeout(() => res(), time || 1))
state.config.value.server = "ws://swtcproxy.swtclib.ca:5020"
const tx_json = {
  TransactionType: "Payment",
  Flags: 0,
  Sequence: 53,
  Amount: 1000000,
  Fee: 20000,
  SigningPubKey: "",
  Account: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  Destination: "jfqiMxoT228vp3dMrXKnJXo6V9iYEx94pt",
  Signers: [
    {
      Signer: {
        SigningPubKey:
          "0261DD84455B92BDFD59C1DB2A5BD9CE1A3AF0FD531A08EEB2EE354C3BB230B878",
        TxnSignature:
          "3045022100A77582E4E4404A8E4292C432D49E2912860E039C03358FAB1D48A9F06DEC77630220191EDDA19C20830B719E72CB45F3CAC7F0E9D78D47A267E4FAC6BE98E7900ECE",
        Account: "jfdqBEDsbk3eMSXX2t7CGeu2RPkEjHs6ie"
      }
    },
    {
      Signer: {
        SigningPubKey:
          "ED68635043BC70DE82272BF5990642400CF79089B2ABCF8EF9D10FFFB96A658763",
        TxnSignature:
          "2A6BAA96D7FB66104392C5A930D770073A6159CA3A1635B98F4BADF42E2788129C426719BE69360B3536457366647CE5CD8A149E8245DC3A83FBB74B793E8C0F",
        Account: "jfqiMxoT228vp3dMrXKnJXo6V9iYEx94pt"
      }
    }
  ]
}

describe("Multisign Test", function() {
  let server = web.listen(50080)
  test("proxy information", async function() {
    let result = await request(server)
      .get("/")
      .expect("Content-Type", /application\/json/)
    expect(result.ok).toBeTruthy()
    expect(JSON.parse(result.text)).toHaveProperty("version")
  })
  test("wait for backend", async function() {
    jest.setTimeout(15000)
    await sleep(11000)
    expect(state.remote.value.isConnected()).toBeTruthy()
  })
  test("server information", async function() {
    let result = await request(server)
      .get("/v3/server/info")
      .expect("Content-Type", /application\/json/)
    expect(result.ok).toBeTruthy()
    expect(JSON.parse(result.text)).toHaveProperty("complete_ledgers")
  })
  test("submit multisigned tx_json", async function() {
    let result
    try {
      result = await request(server)
        .post(`/v3/multisign`)
        .send(tx_json)
        .expect("Content-Type", /application\/json/)
    } catch (e) {}
    let result_json = JSON.parse(result.text)
    expect(result_json).toHaveProperty("engine_result")
  })
  test(`clear intervals`, async function() {
    state.funcCleanup()
    state.remote.value.disconnect()
    server.close()
    await sleep(4000)
    expect("cleared").toBe("cleared")
  })
})
