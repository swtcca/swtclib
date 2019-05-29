const Factory = require("../").Factory
const expect = require("chai").expect
const { chains, data } = require("./config")
describe("Wallet", function() {
  describe("seeding", function() {
    it("generate a ed25519 seed successfully", function() {
      for (let chain of chains) {
        let Wallet = Factory(chain)
        let Keypair = Wallet.KeyPair
        let seed = Keypair.generateSeed({ algorithm: "ed25519" })
        let ed = seed.substr(1, 2)
        expect(ed).to.equal("Ed")
      }
    })
  })

  describe("walleting", function() {
    it("generate a wallet using ed25519 option successfully", function() {
      for (let chain of chains) {
        let Wallet = Factory(chain)
        let wallet = Wallet.generate({ algorithm: "ed25519" })
        let ed = wallet.secret.substr(1, 2)
        expect(ed).to.equal("Ed")
        expect(Wallet.isValidAddress(wallet.address, chain)).to.be.true
      }
    })
  })
})
