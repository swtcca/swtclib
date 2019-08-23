const chai = require("chai")
const expect = chai.expect
const Amount = require("../lib/TumAmount").Factory()
const Factory = require("swtc-wallet").Factory
const BN = require("bn-plus.js")
const testData = {
  value: "1",
  currency: "CNY",
  issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
}
describe("test TumAmount", function() {
  describe("test from_json", function() {
    let data = Amount.from_json(testData)
    expect(data.currency()).to.equal("CNY")
    expect(data.is_valid()).to.equal(true)
    expect(data.is_native()).to.equal(false)
    expect(data.is_negative()).to.equal(false)
    expect(data.issuer()).to.equal(testData.issuer)
    expect(data.is_zero()).to.equal(false)
    expect(data.is_positive()).to.equal(true)
  })

  describe("test parse_issuer", function() {
    it("if the issuer is valid", function() {
      let inst = new Amount()
      inst.parse_issuer(testData.issuer)
      expect(inst.issuer()).to.equal(testData.issuer)
      expect(inst.offset()).to.equal(0)
    })

    it("if the issuer is invalid", function() {
      let inst = new Amount()
      inst.parse_issuer(testData.issuer.substring(1))
      expect(inst.issuer()).to.equal(null)
    })
  })

  describe("test parse_swt_value", function() {
    it("the value is NaN if the parameter is not string", function() {
      let inst = new Amount()
      inst.parse_swt_value(1)
      expect(inst._value).to.be.NaN
    })

    it('the value is 1000000 if the parameter is "1"', function() {
      let inst = new Amount()
      inst.parse_swt_value("1")
      expect(inst._value).to.equal(1000000)
      expect(inst.is_negative()).to.be.equal(false)
    })

    it("the value is NaN if the parameter more than 9e18", function() {
      let inst = new Amount()
      inst.parse_swt_value("1200000000000000000000000000")
      expect(inst._value).to.be.NaN
    })

    it("the value is 111000000 if the parametr is -111", function() {
      let inst = new Amount()
      inst.parse_swt_value("-111")
      expect(inst._value).to.be.equal(111000000)
      expect(inst.is_negative()).to.be.equal(true)
    })

    it("the value is 1000 if the parametr is -0.001", function() {
      let inst = new Amount()
      inst.parse_swt_value("-0.001")
      expect(inst._value).to.be.equal(1000)
      expect(inst.is_negative()).to.be.equal(true)
    })
  })

  describe("test parse_json", function() {
    it("if the parameter is number", function() {
      let inst = new Amount()
      inst.parse_json(1)
      expect(inst._value).to.equal(1000000)
      expect(inst.is_negative()).to.be.equal(false)
    })

    it("if the parameter is string", function() {
      let inst = new Amount()
      inst.parse_json("1")
      expect(inst._value).to.equal(1000000)
      expect(inst.is_negative()).to.be.equal(false)
    })

    it("if the parameter is invalid", function() {
      let inst = new Amount()
      expect(() => inst.parse_json(undefined)).to.throw(
        "Amount.parse_json: Unsupported JSON type!"
      )
    })

    it("if the currency is invalid", function() {
      testData.currency = "sw"
      let inst = new Amount()
      expect(() => inst.parse_json(testData)).to.throw(
        "Amount.parse_json: Input JSON has invalid Tum info!"
      )
    })

    it("if the currency is not swt", function() {
      let inst = new Amount()
      testData.currency = "CNY"
      inst.parse_json(testData)
      expect(inst._value instanceof BN).to.equal(true)
      expect(inst._offset).to.equal(-15)
      expect(inst.is_negative()).to.be.equal(false)
    })

    it("if the currency is swt", function() {
      let inst = new Amount()
      testData.currency = "SWT"
      inst.parse_json(testData)
      expect(inst._offset).to.equal(0)
      expect(inst.is_negative()).to.be.equal(false)
    })

    it("if the issuer is undefined", function() {
      let inst = new Amount()
      testData.currency = "CNY"
      testData.issuer = undefined
      expect(() => inst.parse_json(testData)).to.throw(
        "Amount.parse_json: Input JSON has invalid issuer info!"
      )
    })

    it("if the issuer is invalid", function() {
      let inst = new Amount()
      testData.currency = "CNY"
      testData.issuer = "sssss"
      expect(() => inst.parse_json(testData)).to.throw(
        "Amount.parse_json: Input JSON has invalid issuer info!"
      )
    })
  })

  describe("test tum_to_bytes", function() {
    it("if the currency is bwt", function() {
      let inst = new Amount("bwt")
      inst._currency = "BWT"
      let data = inst.tum_to_bytes()
      expect(data).to.deep.equal([
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        66,
        87,
        84,
        0,
        0,
        0,
        0,
        0
      ])
    })

    it("if the currency length is 40 and hex code", function() {
      let inst = new Amount()
      inst._currency = "1qaz2wsx3edc4rfv5tgb6yhn7ujm8ikjhgfdsert"
      let data = inst.tum_to_bytes()
      expect(data).to.deep.equal([
        17,
        170,
        39,
        56,
        62,
        220,
        66,
        246,
        84,
        123,
        105,
        142,
        117,
        173,
        137,
        186,
        135,
        253,
        62,
        36
      ])
    })

    it("if the currency length is 40 but not hex code", function() {
      let inst = new Amount()
      inst._currency = ">1qaz2wsx3edc4rfv5tgb6yhn7ujm8ikjhgfdset"
      expect(() => inst.tum_to_bytes()).to.throw(
        "Incorrect currency code length."
      )
    })

    it("if the currency length is not 40", function() {
      let inst = new Amount()
      inst._currency = "1qaz2wsx3edc4rfv5tgb6yhn7ujm8ikjhgfdst"
      expect(() => inst.tum_to_bytes()).to.throw(
        "Incorrect currency code length."
      )
    })
  })

  describe("test parse_tum_value", function() {
    it("if the parameter is number", function() {
      let inst = new Amount()
      inst.parse_tum_value(1)
      expect(inst._is_negative).to.equal(false)
      expect(inst._offset).to.equal(0)
      expect(inst._value instanceof BN).to.equal(true)
    })

    it("if the parameter is not number or string", function() {
      let inst = new Amount()
      inst.parse_tum_value(null)
      expect(inst._value).to.be.NaN
    })

    it('if the parameter is "1"', function() {
      let inst = new Amount()
      inst.parse_tum_value("1")
      expect(inst._value).to.equal("1")
      expect(inst._offset).to.equal(0)
      expect(inst._is_negative).to.equal(false)
    })

    it('if the parameter is "sss"', function() {
      let inst = new Amount()
      inst.parse_tum_value("sss")
      expect(inst._value).to.be.NaN
    })

    it("if the parameter is 1.1", function() {
      let inst = new Amount()
      inst.parse_tum_value("1.1")
      expect(inst._value).to.equal(-1)
      expect(inst._offset).to.equal(-1)
      expect(inst._is_negative).to.equal(false)
    })
    it("if the parameter is 1e8", function() {
      let inst = new Amount()
      inst.parse_tum_value("1e8")
      expect(inst._value).to.equal("1")
      expect(inst._offset).to.equal(8)
      expect(inst._is_negative).to.equal(false)
    })
  })

  describe("test to_json", function() {
    it("if _is_native is false & issuer is valid", function() {
      let inst = new Amount()
      inst._value = 1
      inst._currency = "SWT"
      inst._is_native = false
      inst._issuer = "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
      expect(inst.to_json()).to.deep.equal({
        value: "1",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        currency: "SWT"
      })
    })

    it("if _is_native is false & issuer is invalid", function() {
      const Amount = require("../lib/TumAmount").Factory(Factory())
      let inst = new Amount()
      inst._value = 1
      inst._currency = "BWT"
      inst._is_native = false
      inst._issuer = ""
      expect(inst.to_json()).to.deep.equal({
        value: "1",
        currency: "BWT"
      })
    })

    it("if _is_native is true", function() {
      let inst = new Amount()
      inst._value = 1
      inst._currency = "SWT"
      inst._is_native = true
      inst._issuer = ""
      expect(inst.to_json()).to.deep.equal("0.000001")
    })
  })
})
