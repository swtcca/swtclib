const assert = require("assert")
const Wallet = require("..").Factory("guomi")
const expect = require("chai").expect

const VALID_SECRET = "snvdjvSszL1o1w76a7pXqt9AZQKk7"
const INVALID_SECRET1 = null
const INVALID_SECRET2 = undefined
const INVALID_SECRET3 = ""
const INVALID_SECRET4 = "xxxx"
const INVALID_SECRET5 = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
const INVALID_SECRET6 = "sszWqvtbDzzMQEVWqGDSA5DbMYDBNxx"
const INVALID_SECRET7 = "zWqvtbDzzMQEVWqGDSA5DbMYDBN"
const INVALID_SECRET8 =
  "sszWqvtbDzzMQEVWqGDSA5DbMYDBNsszWqvtbDzzMQEVWqGDSA5DbMYDBN"

const VALID_ADDRESS = "j3qedZEV7cKSqGnoE28Ue46LuUDogK2s7"
const INVALID_ADDRESS1 = null
const INVALID_ADDRESS2 = undefined
const INVALID_ADDRESS3 = ""
const INVALID_ADDRESS4 = "xxxx"
const INVALID_ADDRESS5 = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
const INVALID_ADDRESS6 = "jahbmVT3T9yf5D4Ykw8x6nRUtUfAAMzBRVxxx"
const INVALID_ADDRESS7 = "ahbmVT3T9yf5D4Ykw8x6nRUtUfAAMzBRV"
const INVALID_ADDRESS8 =
  "jahbmVT3T9yf5D4Ykw8x6nRUtUfAAMzBRVjahbmVT3T9yf5D4Ykw8x6nRUtUfAAMzBRV"

describe("Wallet", function () {
  describe("generate", function () {
    it("should generate one wallet", function () {
      var wallet = Wallet.generate()
      expect(wallet.address).to.not.be.null
      expect(wallet.secret).to.not.be.null
    })
  })

  describe("fromPhrase", function () {
    it("generate a wallet from phrase", function () {
      let phrase = "masterpassphrase"
      let wallet = Wallet.fromPhrase(phrase)
      expect(wallet.address).to.equal(Wallet.config.ACCOUNT_GENESIS)
    })
  })
  describe("fromSecret", function () {
    it("should generate one from secret", function () {
      var wallet = Wallet.fromSecret(VALID_SECRET)
      expect(wallet).to.not.be.null
    })

    it("should fail when null secret", function () {
      var wallet = Wallet.fromSecret(INVALID_SECRET1)
      expect(wallet).to.be.null
    })

    it("should fail when undefined secret", function () {
      var wallet = Wallet.fromSecret(INVALID_SECRET2)
      expect(wallet).to.be.null
    })

    it("should fail when empty secret", function () {
      var wallet = Wallet.fromSecret(INVALID_SECRET3)
      expect(wallet).to.be.null
    })

    it("should fail when too short secret", function () {
      var wallet = Wallet.fromSecret(INVALID_SECRET4)
      expect(wallet).to.be.null
    })

    it("should fail when too long secret", function () {
      var wallet = Wallet.fromSecret(INVALID_SECRET5)
      expect(wallet).to.be.null
    })

    it("should fail when tail string", function () {
      var wallet = Wallet.fromSecret(INVALID_SECRET6)
      expect(wallet).to.be.null
    })

    it("should fail when not start with s", function () {
      var wallet = Wallet.fromSecret(INVALID_SECRET7)
      expect(wallet).to.be.null
    })

    it("should fail when double secret", function () {
      var wallet = Wallet.fromSecret(INVALID_SECRET8)
      expect(wallet).to.be.null
    })
  })

  describe("isValidSecret", function () {
    it("should generate one from secret", function () {
      var ret = Wallet.isValidSecret(VALID_SECRET)
      expect(ret).to.be.true
    })

    it("should fail when null secret", function () {
      var ret = Wallet.isValidSecret(INVALID_SECRET1)
      expect(ret).to.be.false
    })

    it("should fail when undefined secret", function () {
      var ret = Wallet.isValidSecret(INVALID_SECRET2)
      expect(ret).to.be.false
    })

    it("should fail when empty secret", function () {
      var ret = Wallet.isValidSecret(INVALID_SECRET3)
      expect(ret).to.be.false
    })

    it("should fail when too short secret", function () {
      var ret = Wallet.isValidSecret(INVALID_SECRET4)
      expect(ret).to.be.false
    })

    it("should fail when too long secret", function () {
      var ret = Wallet.isValidSecret(INVALID_SECRET5)
      expect(ret).to.be.false
    })

    it("should fail when tail string", function () {
      var ret = Wallet.isValidSecret(INVALID_SECRET6)
      expect(ret).to.be.false
    })

    it("should fail when not start with s", function () {
      var ret = Wallet.isValidSecret(INVALID_SECRET7)
      expect(ret).to.be.false
    })

    it("should fail when double secret", function () {
      var ret = Wallet.isValidSecret(INVALID_SECRET8)
      expect(ret).to.be.false
    })
  })

  describe("isValidAddress", function () {
    it("should success when valid address", function () {
      var ret = Wallet.isValidAddress(VALID_ADDRESS)
      expect(ret).to.be.true
    })

    it("should fail when null address", function () {
      var ret = Wallet.isValidAddress(INVALID_ADDRESS1)
      expect(ret).to.be.false
    })

    it("should fail when undefined address", function () {
      var ret = Wallet.isValidAddress(INVALID_ADDRESS2)
      expect(ret).to.be.false
    })

    it("should fail when empty address", function () {
      var ret = Wallet.isValidAddress(INVALID_ADDRESS3)
      expect(ret).to.be.false
    })

    it("should fail when too short address", function () {
      var ret = Wallet.isValidAddress(INVALID_ADDRESS4)
      expect(ret).to.be.false
    })

    it("should fail when too long address", function () {
      var ret = Wallet.isValidAddress(INVALID_ADDRESS5)
      expect(ret).to.be.false
    })

    it("should fail when tail string address", function () {
      var ret = Wallet.isValidAddress(INVALID_ADDRESS6)
      expect(ret).to.be.false
    })

    it("should fail when not start with j", function () {
      var ret = Wallet.isValidAddress(INVALID_ADDRESS7)
      expect(ret).to.be.false
    })

    it("should fail when double address", function () {
      var ret = Wallet.isValidAddress(INVALID_ADDRESS8)
      expect(ret).to.be.false
    })
  })

  describe("init", function () {
    it("init with valid secret", function () {
      var wallet = new Wallet(VALID_SECRET)
      expect(wallet.secret()).to.be.equal(VALID_SECRET)
    })
    it("init with null secret", function () {
      var wallet = new Wallet(INVALID_SECRET1)
      expect(wallet.secret()).to.be.equal(null)
    })
    it("init with undefined secret", function () {
      var wallet = new Wallet(INVALID_SECRET2)
      expect(wallet.secret()).to.be.equal(null)
    })
    it("init with empty secret", function () {
      var wallet = new Wallet(INVALID_SECRET3)
      expect(wallet.secret()).to.be.equal(null)
    })
    it("init with too short secret", function () {
      var wallet = new Wallet(INVALID_SECRET4)
      expect(wallet.secret()).to.be.equal(null)
    })
    it("init with too long secret", function () {
      var wallet = new Wallet(INVALID_SECRET5)
      expect(wallet.secret()).to.be.equal(null)
    })
    it("init with tail string secret", function () {
      var wallet = new Wallet(INVALID_SECRET6)
      expect(wallet.secret()).to.be.equal(null)
    })
    it("init with secret without start s", function () {
      var wallet = new Wallet(INVALID_SECRET7)
      expect(wallet.secret()).to.be.equal(null)
    })
    it("init with double secret", function () {
      var wallet = new Wallet(INVALID_SECRET8)
      expect(wallet.secret()).to.be.equal(null)
    })
  })
})
