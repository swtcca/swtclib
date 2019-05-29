const Wallet = require("../").Wallet
const expect = require("chai").expect
const { chains, data } = require("./config")
describe("Wallet", function() {
  describe("generate", function() {
    it("generate a wallet successfully", function() {
      for (let chain of chains) {
        let wallet = Wallet.generate(chain == "swt" ? undefined : chain)
        expect(wallet.address).to.not.be.null
        expect(wallet.secret).to.not.be.null
      }
    })
  })

  describe("fromSecret", function() {
    it("generate a wallet successfully if the secret is valid", function() {
      for (let chain of chains) {
        let secret = data[chain].validSecret
        let wallet = Wallet.fromSecret(
          secret,
          chain == "swt" ? undefined : chain
        )
        expect(wallet.secret).to.equal(secret)
      }
    })

    it("generate unsuccessfully if the secret is invalid", function() {
      for (let chain of chains) {
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = Wallet.fromSecret(
            secret,
            chain == "swt" ? undefined : chain
          )
          expect(wallet).to.be.null
        }
      }
    })
  })

  describe("isValidSecret", function() {
    it("return true if the secret is valid", function() {
      for (let chain of chains) {
        let secret = data[chain].validSecret
        let isValid = Wallet.isValidSecret(
          secret,
          chain == "swt" ? undefined : chain
        )
        expect(isValid).to.be.true
      }
    })

    it("return false if the secret is invalid", function() {
      for (let chain of chains) {
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let isValid = Wallet.isValidSecret(
            secret,
            chain == "swt" ? undefined : chain
          )
          expect(isValid).to.be.false
        }
      }
    })
  })

  describe("isValidAddress", function() {
    it("return true if the address is valid", function() {
      for (let chain of chains) {
        let address = data[chain].validAddress
        let isValid = Wallet.isValidAddress(
          address,
          chain == "swt" ? undefined : chain
        )
        expect(isValid).to.be.true
      }
    })

    it("return false if the address is invalid", function() {
      for (let chain of chains) {
        let addresses = data[chain].invalidAddresses
        for (let address of addresses) {
          let isValid = Wallet.isValidAddress(
            address,
            chain == "swt" ? undefined : chain
          )
          expect(isValid).to.be.false
        }
      }
    })
  })

  describe("init", function() {
    it("init successfully if the secret is valid", function() {
      for (let chain of chains) {
        let secret = data[chain].validSecret
        let wallet = new Wallet(secret, chain == "swt" ? undefined : chain)
        expect(wallet.secret()).to.be.equal(secret)
      }
    })

    it("init unsuccessfully if the secret is invalid", function() {
      for (let chain of chains) {
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = new Wallet(secret, chain == "swt" ? undefined : chain)
          expect(wallet.secret()).to.be.equal(null)
        }
      }
    })
  })

  describe("sign and verify", function() {
    it("sign successfully if the secret and message is valid", function() {
      for (let chain of chains) {
        let messages = data[chain].validMsgs
        let secret = data[chain].validSecret
        for (let message of messages) {
          let wallet = new Wallet(secret, chain == "swt" ? undefined : chain)
          expect(wallet.sign(message.msg)).to.be.equal(message.sign)
        }
      }
    })

    it("sign unsuccessfully if the message is invalid", function() {
      for (let chain of chains) {
        let messages = data[chain].invalidMsgs
        let secret = data[chain].validSecret
        for (let message of messages) {
          let wallet = new Wallet(secret, chain == "swt" ? undefined : chain)
          expect(wallet.sign(message)).to.be.equal(null)
        }
      }
    })

    it("sign unsuccessfully if the secret is invalid", function() {
      for (let chain of chains) {
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = new Wallet(secret, chain == "swt" ? undefined : chain)
          expect(wallet.sign("test")).to.be.equal(null)
        }
      }
    })

    it("return true if the sign data is related to the message when verify", function() {
      for (let chain of chains) {
        let secret = data[chain].validSecret
        let sdata = "test"
        let wt = new Wallet(secret, chain == "swt" ? undefined : chain)
        let sign = wt.sign(sdata)
        let verified = wt.verify(sdata, sign)
        expect(verified).to.equal(true)
      }
    })

    it("return null if the secret is invalid when verify", function() {
      for (let chain of chains) {
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = new Wallet(secret, chain == "swt" ? undefined : chain)
          let sign = ""
          let verified = wallet.verify("test", sign)
          expect(verified).to.equal(null)
        }
      }
    })

    it("return false if the sign data is not related to the message when verify", function() {
      for (let chain of chains) {
        let secret = data[chain].validSecret
        let sdata = "test"
        let wt = new Wallet(secret, chain == "swt" ? undefined : chain)
        let sign = wt.sign(sdata)
        let verified = wt.verify(sdata + "t", sign)
        expect(verified).to.equal(false)
      }
    })
  })

  describe("verifyTx and signTx", function() {
    it("sign unsuccessfully if the message is invalid", function() {
      for (let chain of chains) {
        let messages = data[chain].invalidMsgs
        let secret = data[chain].validSecret
        for (let message of messages) {
          let wallet = new Wallet(secret, chain == "swt" ? undefined : chain)
          expect(wallet.signTx(message)).to.be.equal(null)
        }
      }
    })

    it("sign unsuccessfully if the secret is invalid", function() {
      for (let chain of chains) {
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = new Wallet(secret, chain == "swt" ? undefined : chain)
          expect(wallet.signTx("test")).to.be.equal(null)
        }
      }
    })

    it("return true if the sign data is related to the message when verify", function() {
      for (let chain of chains) {
        let secret = data[chain].validSecret
        let sdata = "test"
        let wt = new Wallet(secret, chain == "swt" ? undefined : chain)
        let sign = wt.signTx(sdata)
        let verified = wt.verifyTx(sdata, sign)
        expect(verified).to.equal(true)
      }
    })

    it("return null if the secret is invalid when verify", function() {
      for (let chain of chains) {
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = new Wallet(secret, chain == "swt" ? undefined : chain)
          let sign = ""
          let verified = wallet.verifyTx("test", sign)
          expect(verified).to.equal(null)
        }
      }
    })

    it("return false if the sign data is not related to the message when verify", function() {
      for (let chain of chains) {
        let secret = data[chain].validSecret
        let sdata = "test"
        let wt = new Wallet(secret, chain == "swt" ? undefined : chain)
        let sign = wt.signTx(sdata)
        let verified = wt.verifyTx(sdata + "t", sign)
        expect(verified).to.equal(false)
      }
    })
  })

  describe("toJson", function() {
    it("return address and secret successfully", function() {
      for (let chain of chains) {
        let secret = data[chain].validSecret
        let address = data[chain].validAddress
        let wallet = new Wallet(secret, chain == "swt" ? undefined : chain)
        expect(wallet.toJson()).to.deep.equal({
          address,
          secret
        })
      }
    })

    it("return null if the secret is invalid", function() {
      for (let chain of chains) {
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = new Wallet(secret, chain == "swt" ? undefined : chain)
          expect(wallet.toJson()).to.be.equal(null)
        }
      }
    })
  })

  describe("address", function() {
    it("return null if the secret is invalid", function() {
      for (let chain of chains) {
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = new Wallet(secret, chain == "swt" ? undefined : chain)
          expect(wallet.address()).to.be.equal(null)
        }
      }
    })
  })

  describe("getPublicKey", function() {
    it("return null if the secret is invalid", function() {
      for (let chain of chains) {
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = new Wallet(secret, chain == "swt" ? undefined : chain)
          expect(wallet.getPublicKey()).to.be.equal(null)
        }
      }
    })
  })
})
