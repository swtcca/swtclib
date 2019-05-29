const Wallet = require("../").Wallet
const KeyPair = require("../").KeyPair
const expect = require("chai").expect
const { chains, data } = require("./config")
describe("Wallet", function() {
  describe("seeding", function() {
    it("generate a ed25519 seed successfully", function() {
      for (let chain of chains) {
        let Keypair = new KeyPair(chain)
        let seed = Keypair.generateSeed({ algorithm: "ed25519" })
        let ed = seed.substr(1, 2)
        expect(ed).to.equal("Ed")
      }
    })
  })

  describe("walleting", function() {
    it("generate a wallet using ed25519 option successfully", function() {
      for (let chain of chains) {
        let wallet = Wallet.generate(chain, { algorithm: "ed25519" })
        let ed = wallet.secret.substr(1, 2)
        expect(ed).to.equal("Ed")
        expect(Wallet.isValidAddress(wallet.address, chain)).to.be.true
      }
    })
  })
})
