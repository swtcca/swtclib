const chai = require("chai")
const expect = chai.expect
const config = require("./config")
const { testAddress, testCreateHash } = config
let utils = require("../src/utils")
let txData = require("./tx_data")
describe("test utils", function() {
  describe("test hexToString", function() {
    it('return "	" if the str is 09', function() {
      let res = utils.hexToString("09")
      expect(res).to.equal("	")
    })

    it('return "	" if the str is 09111', function() {
      let res = utils.hexToString("17111")
      expect(res).to.equal("\u0001q\u0011")
    })
  })

  describe("test stringToHex", function() {
    it("return 09 if the str is tab", function() {
      let res = utils.stringToHex("	")
      expect(res).to.equal("09")
    })

    it("return 31 if the str is 1", function() {
      let res = utils.stringToHex("1")
      expect(res).to.equal("31")
    })
  })

  describe("test isValidAmount", function() {
    it("return false if the amount is null", function() {
      let valid = utils.isValidAmount(null)
      expect(valid).to.equal(false)
    })

    it("return false if the amount is undefined", function() {
      let valid = utils.isValidAmount(undefined)
      expect(valid).to.equal(false)
    })

    it('return false if the amount is ""', function() {
      let valid = utils.isValidAmount("")
      expect(valid).to.equal(false)
    })

    it("return false if the amount is empty object", function() {
      let valid = utils.isValidAmount({})
      expect(valid).to.equal(false)
    })

    it("return false if the value is not number", function() {
      let valid = utils.isValidAmount({
        value: "ststt"
      })
      expect(valid).to.equal(false)
    })

    it("return false if the currency is invalid", function() {
      let valid = utils.isValidAmount({
        value: "0",
        currency: "sw"
      })
      expect(valid).to.equal(false)
    })

    it("return false if the currency is swt and the issuer is not empty string", function() {
      let valid = utils.isValidAmount({
        value: "0",
        currency: "SWT",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
      })
      expect(valid).to.equal(false)
    })

    it("return false if the currency is not swt and the issuer is invalid", function() {
      let valid = utils.isValidAmount({
        value: "0",
        currency: "JMOAC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9o"
      })
      expect(valid).to.equal(false)
    })

    it("return true if the parameter is valid", function() {
      let valid = utils.isValidAmount({
        value: "0",
        currency: "JMOAC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
      })
      expect(valid).to.equal(true)
    })
  })

  describe("test isValidAmount0", function() {
    it("return false if the amount is null", function() {
      let valid = utils.isValidAmount0(null)
      expect(valid).to.equal(false)
    })

    it("return false if the amount is undefined", function() {
      let valid = utils.isValidAmount0(undefined)
      expect(valid).to.equal(false)
    })

    it('return false if the amount is ""', function() {
      let valid = utils.isValidAmount0("")
      expect(valid).to.equal(false)
    })

    it("return false if the amount is empty object", function() {
      let valid = utils.isValidAmount0({})
      expect(valid).to.equal(false)
    })

    it("return false if the currency is invalid", function() {
      let valid = utils.isValidAmount({
        currency: "sw"
      })
      expect(valid).to.equal(false)
    })

    it("return false if the currency is swt and the issuer is not empty string", function() {
      let valid = utils.isValidAmount0({
        currency: "SWT",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
      })
      expect(valid).to.equal(false)
    })

    it("return false if the currency is not swt and the issuer is invalid", function() {
      let valid = utils.isValidAmount0({
        currency: "JMOAC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9o"
      })
      expect(valid).to.equal(false)
    })

    it("return true if the parameter is valid", function() {
      let valid = utils.isValidAmount0({
        currency: "JMOAC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
      })
      expect(valid).to.equal(true)
    })
  })

  describe("test parseAmount", function() {
    it("return object if the amount is string", function() {
      let amout = utils.parseAmount("1000000")
      expect(amout).to.deep.equal({
        value: "1",
        currency: "SWT",
        issuer: ""
      })
    })

    it("return object if the amount is object and valid", function() {
      let amout = utils.parseAmount({
        value: "100",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        currency: "JMOAC"
      })
      expect(amout).to.deep.equal({
        value: "100",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        currency: "JMOAC"
      })
    })

    it("return null if the amount is invalid", function() {
      let amout = utils.parseAmount({})
      expect(amout).to.equal(null)
    })
  })

  describe("test isValidCurrency", function() {
    it("return false if the currency is null", function() {
      let valid = utils.isValidCurrency(null)
      expect(valid).to.equal(false)
    })

    it('return false if the currency is ""', function() {
      let valid = utils.isValidCurrency("")
      expect(valid).to.equal(false)
    })

    it("return false if the currency is undefined", function() {
      let valid = utils.isValidCurrency(undefined)
      expect(valid).to.equal(false)
    })

    it("return false if the currency is not string", function() {
      let valid = utils.isValidCurrency({})
      expect(valid).to.equal(false)
    })

    it("return true if the currency is swt", function() {
      let valid = utils.isValidCurrency("swt")
      expect(valid).to.equal(true)
    })
  })

  describe("test isValidHash", function() {
    it("return false if the hash is null", function() {
      let valid = utils.isValidHash(null)
      expect(valid).to.equal(false)
    })

    it('return false if the hash is ""', function() {
      let valid = utils.isValidHash("")
      expect(valid).to.equal(false)
    })

    it("return false if the hash is undefined", function() {
      let valid = utils.isValidHash(undefined)
      expect(valid).to.equal(false)
    })

    it("return false if the hash is not string", function() {
      let valid = utils.isValidHash({})
      expect(valid).to.equal(false)
    })

    it("return true if the hash is valid", function() {
      let valid = utils.isValidHash(testCreateHash)
      expect(valid).to.equal(true)
    })
  })

  describe("test arraySet", function() {
    it("return correct value", function() {
      let res = utils.arraySet(8, 0)
      expect(res).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0])
    })
  })

  describe("test getCurrency", function() {
    it("return default value if the config is empty", function() {
      let currency = utils.getCurrency("moac")
      expect(currency).to.equal("SWT")
    })

    it("return SWT if the token is swt", function() {
      let currency = utils.getCurrency("swt")
      expect(currency).to.equal("SWT")
    })

    xit("return BWT if the token is bwt", function() {
      let currency = utils.getCurrency("bwt")
      expect(currency).to.equal("BWT")
    })
  })

  describe("test getFee", function() {
    it("return default value if the config is empty", function() {
      let fee = utils.getFee("moac")
      expect(fee).to.equal(10000)
    })

    xit("return 10 if the token is bwt", function() {
      let fee = utils.getFee("bwt")
      expect(fee).to.equal(10)
    })

    it("return 10000 if the token is swt", function() {
      let fee = utils.getFee("swt")
      expect(fee).to.equal(10000)
    })
  })

  describe("test getAccountZero", function() {
    it("return default value if the config is empty", function() {
      let fee = utils.getAccountZero("moac")
      expect(fee).to.equal("jjjjjjjjjjjjjjjjjjjjjhoLvTp")
    })

    xit("return bbbbbbbbbbbbbbbbbbbbbhoLvTp if the token is bwt", function() {
      let fee = utils.getAccountZero("bwt")
      expect(fee).to.equal("bbbbbbbbbbbbbbbbbbbbbhoLvTp")
    })

    it("return jjjjjjjjjjjjjjjjjjjjjhoLvTp if the token is swt", function() {
      let fee = utils.getAccountZero("swt")
      expect(fee).to.equal("jjjjjjjjjjjjjjjjjjjjjhoLvTp")
    })
  })

  describe("test getAccountOne", function() {
    it("return default value if the config is empty", function() {
      let fee = utils.getAccountOne("moac")
      expect(fee).to.equal("jjjjjjjjjjjjjjjjjjjjBZbvri")
    })

    xit("return bbbbbbbbbbbbbbbbbbbbBZjvri if the token is bwt", function() {
      let fee = utils.getAccountOne("bwt")
      expect(fee).to.equal("bbbbbbbbbbbbbbbbbbbbBZjvri")
    })

    it("return jjjjjjjjjjjjjjjjjjjjBZbvri if the token is swt", function() {
      let fee = utils.getAccountOne("swt")
      expect(fee).to.equal("jjjjjjjjjjjjjjjjjjjjBZbvri")
    })
  })

  describe("test affectedAccounts", function() {
    it("only have Account", function() {
      let data = utils.affectedAccounts(txData.input24)
      expect(data).to.deep.equal(txData.output24)
    })

    it("include all cases", function() {
      let data = utils.affectedAccounts(txData.input25)
      expect(data).to.deep.equal(txData.output25)
    })
  })

  describe("test affectedBooks", function() {
    it("if the parameter is not object", function() {
      let data = utils.affectedBooks({})
      expect(data).to.deep.equal([])
    })

    it("if the AffectedNodes is not array", function() {
      let data = utils.affectedBooks({
        meta: {}
      })
      expect(data).to.deep.equal([])
    })

    it("if is buy", function() {
      let data = utils.affectedBooks(txData.input26)
      expect(data).to.deep.equal(txData.output26)
    })

    it("if is sell", function() {
      let data = utils.affectedBooks(txData.input27)
      expect(data).to.deep.equal(txData.output27)
    })
  })

  describe("test processTx", function() {
    it("check sent", function() {
      let res = utils.processTx(txData.input1, testAddress)
      expect(res).to.deep.equal(txData.output1)
    })

    it("check convert", function() {
      let res = utils.processTx(txData.input2, testAddress)
      expect(res).to.deep.equal(txData.output2)
    })

    it("check received", function() {
      let res = utils.processTx(txData.input3, testAddress)
      expect(res).to.deep.equal(txData.output3)
    })

    it("check trusted", function() {
      let res = utils.processTx(txData.input4, testAddress)
      expect(res).to.deep.equal(txData.output4)
    })

    it("check trusting", function() {
      let res = utils.processTx(txData.input5, testAddress)
      expect(res).to.deep.equal(txData.output5)
    })

    it("check offercancel", function() {
      let res = utils.processTx(txData.input6, testAddress)
      expect(res).to.deep.equal(txData.output6)
    })

    it("check offernew: buy", function() {
      let res = utils.processTx(txData.input7, testAddress)
      expect(res).to.deep.equal(txData.output7)
    })

    it("check offernew: sell", function() {
      let res = utils.processTx(txData.input8, testAddress)
      expect(res).to.deep.equal(txData.output8)
    })

    it("check relationset: freeze", function() {
      let res = utils.processTx(txData.input9, testAddress)
      expect(res).to.deep.equal(txData.output9)
    })

    it("check relationset: authorize", function() {
      let res = utils.processTx(txData.input10, testAddress)
      expect(res).to.deep.equal(txData.output10)
    })

    it("check relationdel: unfreeze", function() {
      let res = utils.processTx(txData.input11, testAddress)
      expect(res).to.deep.equal(txData.output11)
    })

    it("check relationset: unknown", function() {
      let res = utils.processTx(txData.input12, testAddress)
      expect(res).to.deep.equal(txData.output12)
    })

    it("check unknown", function() {
      let res = utils.processTx(txData.input13, testAddress)
      expect(res).to.deep.equal(txData.output13)
    })

    it("check configcontract: deploy", function() {
      let res = utils.processTx(txData.input14, testAddress)
      expect(res).to.deep.equal(txData.output14)
    })

    it("check configcontract: call", function() {
      let res = utils.processTx(txData.input15, testAddress)
      expect(res).to.deep.equal(txData.output15)
    })

    it("check configcontract: method is not 0 or 1", function() {
      let res = utils.processTx(txData.input16, testAddress)
      expect(res).to.deep.equal(txData.output16)
    })

    it("check offereffect: effect is offer_partially_funded", function() {
      let res = utils.processTx(txData.input17, testAddress)
      expect(res).to.deep.equal(txData.output17)
    })

    it("check offereffect: effect is offer_created", function() {
      let res = utils.processTx(txData.input18, testAddress)
      expect(res).to.deep.equal(txData.output18)
    })

    it("check offereffect: effect is offer_funded", function() {
      let res = utils.processTx(txData.input19, testAddress)
      expect(res).to.deep.equal(txData.output19)
    })

    it("check offereffect: effect is offer_cancelled", function() {
      let res = utils.processTx(txData.input20, testAddress)
      expect(res).to.deep.equal(txData.output20)
    })

    it("check offereffect: effect is offer_cancelled and type is offercancel", function() {
      let res = utils.processTx(txData.input21, testAddress)
      expect(res).to.deep.equal(txData.output21)
    })

    it("check offereffect: effect is offer_bought", function() {
      let res = utils.processTx(txData.input22, testAddress)
      expect(res).to.deep.equal(txData.output22)
    })

    it("check offereffect: effect is set_regular_key", function() {
      let res = utils.processTx(txData.input23, testAddress)
      expect(res).to.deep.equal(txData.output23)
    })
  })

  describe("test parseKey", function() {
    it('return null if the length of parts is not 2 which key splites ":"', function() {
      let key = utils.parseKey("aaa", "swt")
      expect(key).to.equal(null)
    })
    it('return null if the length of part is not 2 which part splites "/"', function() {
      let key = utils.parseKey("aaa:aaaa", "swt")
      expect(key).to.equal(null)
    })

    it("return correct result if key is valid", function() {
      let key = utils.parseKey(
        "CNY/jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or:JJCC/jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        "swt"
      )
      expect(key).to.deep.equal({
        gets: {
          currency: "CNY",
          issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
        },
        pays: {
          currency: "JJCC",
          issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
        }
      })
    })

    it("return correct result if part is swt", function() {
      let key = utils.parseKey(
        "SWT:JJCC/jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        "swt"
      )
      expect(key).to.deep.equal({
        gets: {
          currency: "SWT",
          issuer: ""
        },
        pays: {
          currency: "JJCC",
          issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
        }
      })
    })

    it("return null if currency is invalid", function() {
      let key = utils.parseKey(
        "SW/jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or:JJCC/jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        "swt"
      )
      expect(key).to.equal(null)
    })

    it("return null if address is invalid", function() {
      let key = utils.parseKey(
        "SWT/jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9o:JJCC/jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        "swt"
      )
      expect(key).to.equal(null)
    })
  })
})
