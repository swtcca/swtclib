const chai = require("chai")
const expect = chai.expect
const extend = require("extend")
const Serializer = require("../lib/Serializer").Factory()
const STAccount = require("../lib/types/STAccount").default
const Wallet = require("swtc-wallet").Factory()

describe("test STAccount", function() {
  it("parse correctly", function() {
    const KeyPair = Wallet.KeyPair
    extend(STAccount, { KeyPair })
    let so = new Serializer([])
    STAccount.serialize(so, "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or")
    expect(so.buffer).to.deep.equal([
      20,
      165,
      130,
      228,
      50,
      191,
      196,
      142,
      237,
      239,
      133,
      44,
      129,
      78,
      197,
      127,
      60,
      210,
      212,
      21,
      150
    ])
    so.resetPointer()
    const result = STAccount.parse(so)
    expect(result).to.equal("jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or")
  })

  it("throw error if len is not 20", function() {
    let so = new Serializer([1])
    STAccount.serialize(so, "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or")
    so.resetPointer()
    expect(() => STAccount.parse(so)).throws("Non-standard-length account ID")
  })
})
