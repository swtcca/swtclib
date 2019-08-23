const chai = require("chai")
const expect = chai.expect
const DataCheck = require("../lib/DataCheck").Factory()

describe("test DataCheck", function() {
  it("throw error if wallet factory doesn't have property KeyPair", function() {
    const Factory = require("../lib/DataCheck").Factory
    expect(() => Factory({})).throw()
  })

  describe("test allNumeric", function() {
    it("return true when the parameter is 2", function() {
      let valid = DataCheck.allNumeric(2)
      expect(valid).to.equal(true)
    })

    it('return true when the parameter is "2"', function() {
      let valid = DataCheck.allNumeric("2")
      expect(valid).to.equal(true)
    })

    it("return false when the parameter is null", function() {
      let valid = DataCheck.allNumeric(null)
      expect(valid).to.equal(false)
    })

    it("return false when the parameter is undefined", function() {
      let valid = DataCheck.allNumeric(undefined)
      expect(valid).to.equal(false)
    })

    it("return false when the parameter is -1", function() {
      let valid = DataCheck.allNumeric(-1)
      expect(valid).to.equal(false)
    })
  })

  describe("test isCurrency", function() {
    it("return true when the parameter is swt", function() {
      let valid = DataCheck.isCurrency("swt")
      expect(valid).to.equal(true)
    })

    it("return true when the parameter is moac", function() {
      let valid = DataCheck.isCurrency("moac")
      expect(valid).to.equal(true)
    })

    it('return false when the parameter is ""', function() {
      let valid = DataCheck.isCurrency("")
      expect(valid).to.equal(false)
    })

    it("return false when the parameter length more than 6", function() {
      let valid = DataCheck.isCurrency("swtswts")
      expect(valid).to.equal(false)
    })

    it("return false when the parameter length less than 3", function() {
      let valid = DataCheck.isCurrency("sw")
      expect(valid).to.equal(false)
    })

    it("return false when the parameter is not string", function() {
      let valid = DataCheck.isCurrency(2222)
      expect(valid).to.equal(false)
    })
  })

  describe("test isRelation", function() {
    it("return true when the parameter is freeze", function() {
      let valid = DataCheck.isRelation("freeze")
      expect(valid).to.equal(true)
    })

    it("return true when the parameter is autorize", function() {
      let valid = DataCheck.isRelation("autorize")
      expect(valid).to.equal(true)
    })

    it('return false when the parameter is ""', function() {
      let valid = DataCheck.isRelation("")
      expect(valid).to.equal(false)
    })

    it("return false when the parameter is not string", function() {
      let valid = DataCheck.isRelation(2222)
      expect(valid).to.equal(false)
    })
  })

  describe("test isTumCode", function() {
    it("return true when the parameter is swt", function() {
      let valid = DataCheck.isTumCode("swt")
      expect(valid).to.equal(true)
    })

    it("return true when the parameter is jmoac", function() {
      let valid = DataCheck.isTumCode("jmoac")
      expect(valid).to.equal(true)
    })

    it("return true when the parameter is custom code", function() {
      let valid = DataCheck.isTumCode(
        "123456789QWERTYUIOJANSNHCKKSZXCVBNMKJHGF"
      )
      expect(valid).to.equal(true)
    })

    it('return false when the parameter is ""', function() {
      let valid = DataCheck.isRelation("")
      expect(valid).to.equal(false)
    })

    it("return false when the parameter is null", function() {
      let valid = DataCheck.isRelation(null)
      expect(valid).to.equal(false)
    })
  })

  describe("test isAmount", function() {
    it("return false when the parameter is not object", function() {
      let valid = DataCheck.isAmount(null)
      expect(valid).to.equal(false)
    })

    it("return false when the value is not string", function() {
      let valid = DataCheck.isAmount({
        value: 0
      })
      expect(valid).to.equal(false)
    })

    it("return false when the value is not number", function() {
      let valid = DataCheck.isAmount({
        value: "sss"
      })
      expect(valid).to.equal(false)
    })

    it("return false when the currency is not valid", function() {
      let valid = DataCheck.isAmount({
        currency: "sw",
        value: "111"
      })
      expect(valid).to.equal(false)
    })

    it("return false when the issuer is invalid", function() {
      let valid = DataCheck.isAmount({
        currency: "SWT",
        issuer: "aaaa",
        value: "2222"
      })
      expect(valid).to.equal(false)
    })

    it("return false when the issuer is empty but currency is not swt", function() {
      let valid = DataCheck.isAmount({
        currency: "JMOAC",
        value: "2222"
      })
      expect(valid).to.equal(false)
    })

    it("return true when the parameter is valid", function() {
      let valid = DataCheck.isAmount({
        currency: "SWT",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "2222"
      })
      expect(valid).to.equal(true)
    })

    it("return true when the issuer is undefined", function() {
      let obj = {
        currency: "SWT",
        value: "2222"
      }
      let valid = DataCheck.isAmount(obj)
      expect(obj.issuer).to.equal("")
      expect(valid).to.equal(true)
    })

    it("return true when the chain is bizain and the amount is valid", function() {
      const WalletFactory = require("swtc-wallet").Factory("bizain")
      const DataCheck = require("../lib/DataCheck").Factory(WalletFactory)
      let valid = DataCheck.isAmount({
        currency: "TS1",
        issuer: "bf42S78serP2BeSx7HGtwQR2QASYaHVqyb",
        value: "2222"
      })
      expect(valid).to.true
    })
  })

  describe("test isBalance", function() {
    it("return false when the parameter is not object", function() {
      let valid = DataCheck.isBalance(null)
      expect(valid).to.equal(false)
    })

    it("return false when the freezed is not number", function() {
      let valid = DataCheck.isBalance({
        freezed: "sss"
      })
      expect(valid).to.equal(false)
    })

    it("return false when the value is not number", function() {
      let valid = DataCheck.isBalance({
        freezed: 0,
        value: "sss"
      })
      expect(valid).to.equal(false)
    })

    it("return false when the currency is not valid", function() {
      let valid = DataCheck.isBalance({
        currency: "sw",
        freezed: 0,
        value: 0
      })
      expect(valid).to.equal(false)
    })

    it("return false when the counterparty is not valid", function() {
      let valid = DataCheck.isBalance(
        {
          currency: "swt",
          freezed: 0,
          value: 0,
          counterparty: "aaaaa"
        },
        "swt"
      )
      expect(valid).to.equal(false)
    })

    it("return true when the parameter is valid", function() {
      let valid = DataCheck.isBalance(
        {
          currency: "swt",
          freezed: 0,
          value: 0,
          counterparty: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
        },
        "swt"
      )
      expect(valid).to.equal(true)
    })
  })
})
