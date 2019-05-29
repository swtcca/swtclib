const Keypairs = require("swtc-keypairs")
const expect = require("chai").expect
const { chains, data } = require("./config")

describe("test keypairs", function() {
  describe("create instance", function() {
    it("throw error if the config of given token is empty", function() {
      expect(() => new Keypairs("moac")).throw(
        "the chain you specified is not available yet"
      )
    })
  })

  describe("convertAddressToBytes and convertBytesToAddress", function() {
    it("convert address to bytes successfully", function() {
      for (let chain of chains) {
        let validAddress = data[chain].validAddress
        let inst = Keypairs(chain)
        let bytes = inst.convertAddressToBytes(validAddress)
        let address = inst.convertBytesToAddress(Buffer.from(bytes))
        expect(address).to.equal(validAddress)
      }
    })

    it("convertAddressToBytes in error if the address is invalid", function() {
      for (let chain of chains) {
        let inst = Keypairs(chain)
        expect(() => inst.convertAddressToBytes(undefined)).throw(
          "Cannot read property 'length' of undefined"
        )
      }
    })

    it("convertBytesToAddress in error if bytes is invalid", function() {
      for (let chain of chains) {
        let inst = Keypairs(chain)
        expect(() => inst.convertBytesToAddress("")).throw(
          "unexpected_payload_length"
        )
      }
    })
  })
})
