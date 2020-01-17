import { web, router, state } from "../src"
const request = require("supertest")
const sleep = time => new Promise(res => setTimeout(() => res(), time || 1))
state.config.value.server = "ws://swtcproxy.swtclib.ca:5020"
const tx_json = {
  Account: "j3UbbRX36997CWXqYqLUn28qH55v9Dh37n",
  Amount: 1000000,
  Destination: "jpmKEm2sUevfpFjS7QHdT8Sx7ZGoEXTJAz",
  Fee: 20000,
  Flags: 0,
  Memos: [
    {
      Memo: {
        MemoData: "6D756C74697369676E6564207061796D656E742074657374"
      }
    }
  ],
  Sequence: 24,
  Signers: [
    {
      Signer: {
        Account: "jhEXgnPdLijQ8Gaqz4FCxUFAQE31LqoNMq",
        SigningPubKey:
          "028749EB830410A57E89EC765DF551F7006CA19CFEBF4C43EFD87CDDA52976D2FF",
        TxnSignature:
          "3044022023CCB793A4AC5912B4CD7BEFD769B30DED870634E94C2C127DCA7572C6B62A060220790AC05A5D2B9CB5BBFCCBCECC0F18A4B6202FBB8E2B4F82D14353A32F16F5DA"
      }
    },
    {
      Signer: {
        Account: "jUv833RRTAZhbUyRzSsAutM9GwbprregiE",
        SigningPubKey:
          "022EB4FEDEAA5EC1584B673A0B2C4425D0A98A4909EB39C10EC1C40631B0FB9C26",
        TxnSignature:
          "304402204DEA0D84FCCA5D3181D2535B9297879547B54C898BDA2C55C05B07C34609521F022013496CE02FFA94890364FE7BDA3BD4A0CEFED5CF9DD458B072F003C153BCEA92"
      }
    }
  ],
  SigningPubKey: "",
  TransactionType: "Payment",
  hash: "7FA74E186AA850773A40E8E591F8E3AEB78777D4E0D9F38974E33441FE55E92E"
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
