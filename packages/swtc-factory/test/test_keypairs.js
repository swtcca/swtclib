const Keypairs = require("../").KeyPair
const expect = require("chai").expect
const { chains, data } = require("./config")

describe("test keypairs", function() {
  describe("static property", function() {
    it("should include supported chains", function() {
      let chains = Object.keys(Keypairs.KEYPAIRS)
      expect(chains).to.include("jingtum")
      expect(chains).to.include("swt")
      expect(chains).to.include("bizain")
      expect(chains).to.include("bwt")
      expect(chains).to.include("ripple")
      expect(chains).to.include("xrp")
      expect(chains).to.include("bitcoin")
      expect(chains).to.include("btc")
      expect(chains).to.include("call")
      expect(chains).to.include("stream")
      expect(chains).to.include("stm")
    })
  })

  describe("create instance", function() {
    it("throw error if the config of given token is empty", function() {
      expect(() => new Keypairs("moac")).throw("config of moac is empty")
    })
  })

  describe("convertAddressToBytes and convertBytesToAddress", function() {
    it("convert address to bytes successfully", function() {
      for (let chain of chains) {
        let validAddress = data[chain].validAddress
        let inst = new Keypairs(chain == "swt" ? undefined : chain)
        let bytes = inst.convertAddressToBytes(validAddress)
        let address = inst.convertBytesToAddress(Buffer.from(bytes))
        expect(address).to.equal(validAddress)
      }
    })

    it("convertAddressToBytes in error if the address is invalid", function() {
      for (let chain of chains) {
        let inst = new Keypairs(chain == "swt" ? undefined : chain)
        expect(() => inst.convertAddressToBytes(undefined)).throw(
          "convert address to bytes in error"
        )
      }
    })

    it("convertBytesToAddress in error if bytes is invalid", function() {
      for (let chain of chains) {
        let inst = new Keypairs(chain == "swt" ? undefined : chain)
        expect(() => inst.convertBytesToAddress("")).throw(
          "convert bytes to address in error"
        )
      }
    })
  })
})
