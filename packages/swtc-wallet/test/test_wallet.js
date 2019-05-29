const WalletFactory = require("../").Factory
const expect = require("chai").expect
const { chains, data } = require("./config")

describe("Wallet", function() {
  let Wallet = WalletFactory()
  describe("getCurrency", function() {
    it("get correct currency", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        expect(Wallet.token).to.be.equal(chain.toUpperCase())
        expect(Wallet.getCurrency()).to.be.equal(chain.toUpperCase())
      }
    })
  })
  describe("getFee", function() {
    it("get correct fee", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        expect(Wallet.config.fee).to.be.a("number")
        expect(Wallet.getFee()).to.be.equal(Wallet.config.fee)
      }
    })
  })
  describe("makeAmount", function() {
    it("make correct amount", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let amount = Wallet.makeAmount(1)
        expect(amount).to.be.a("object")
        expect(amount.currency).to.be.equal(chain.toUpperCase())
        amount = Wallet.makeAmount(1, "coin")
        expect(amount).to.be.a("object")
        expect(amount.currency).to.be.equal("COIN")
        amount = Wallet.makeAmount(1, "coin", "issuer")
        expect(amount).to.be.a("object")
        expect(amount.issuer).to.be.equal("issuer")
      }
    })
  })
  describe("generate", function() {
    it("generate a wallet successfully", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let wallet = Wallet.generate()
        expect(wallet.address).to.not.be.null
        expect(wallet.secret).to.not.be.null
      }
    })
  })

  describe("fromSecret", function() {
    it("generate a wallet successfully if the secret is valid", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secret = data[chain].validSecret
        let wallet = Wallet.fromSecret(secret)
        expect(wallet.secret).to.equal(secret)
      }
    })

    it("generate unsuccessfully if the secret is invalid", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = Wallet.fromSecret(secret)
          expect(wallet).to.be.null
        }
      }
    })
  })

  describe("isValidSecret", function() {
    it("return true if the secret is valid", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secret = data[chain].validSecret
        let isValid = Wallet.isValidSecret(secret)
        expect(isValid).to.be.true
      }
    })

    it("return false if the secret is invalid", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let isValid = Wallet.isValidSecret(secret)
          expect(isValid).to.be.false
        }
      }
    })
  })

  describe("isValidAddress", function() {
    it("return true if the address is valid", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let address = data[chain].validAddress
        let isValid = Wallet.isValidAddress(address)
        expect(isValid).to.be.true
      }
    })

    it("return false if the address is invalid", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let addresses = data[chain].invalidAddresses
        for (let address of addresses) {
          let isValid = Wallet.isValidAddress(address)
          expect(isValid).to.be.false
        }
      }
    })
  })

  describe("init", function() {
    it("init successfully if the secret is valid", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secret = data[chain].validSecret
        let wallet = new Wallet(secret)
        expect(wallet.secret()).to.be.equal(secret)
      }
    })

    it("init unsuccessfully if the secret is invalid", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = new Wallet(secret)
          expect(wallet.secret()).to.be.equal(null)
        }
      }
    })
  })

  describe("sign and verify", function() {
    it("sign successfully if the secret and message is valid", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let messages = data[chain].validMsgs
        let secret = data[chain].validSecret
        for (let message of messages) {
          let wallet = new Wallet(secret)
          expect(wallet.sign(message.msg)).to.be.equal(message.sign)
        }
      }
    })

    it("sign unsuccessfully if the message is invalid", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let messages = data[chain].invalidMsgs
        let secret = data[chain].validSecret
        for (let message of messages) {
          let wallet = new Wallet(secret)
          expect(wallet.sign(message)).to.be.equal(null)
        }
      }
    })

    it("sign unsuccessfully if the secret is invalid", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = new Wallet(secret)
          expect(wallet.sign("test")).to.be.equal(null)
        }
      }
    })

    it("return true if the sign data is related to the message when verify", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secret = data[chain].validSecret
        let sdata = "test"
        let wt = new Wallet(secret)
        let sign = wt.sign(sdata)
        let verified = wt.verify(sdata, sign)
        expect(verified).to.equal(true)
      }
    })

    it("return null if the secret is invalid when verify", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = new Wallet(secret)
          let sign = ""
          let verified = wallet.verify("test", sign)
          expect(verified).to.equal(null)
        }
      }
    })

    it("return false if the sign data is not related to the message when verify", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secret = data[chain].validSecret
        let sdata = "test"
        let wt = new Wallet(secret)
        let sign = wt.sign(sdata)
        let verified = wt.verify(sdata + "t", sign)
        expect(verified).to.equal(false)
      }
    })
  })

  describe("verifyTx and signTx", function() {
    it("sign unsuccessfully if the message is invalid", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let messages = data[chain].invalidMsgs
        let secret = data[chain].validSecret
        for (let message of messages) {
          let wallet = new Wallet(secret)
          expect(wallet.signTx(message)).to.be.equal(null)
        }
      }
    })

    it("sign unsuccessfully if the secret is invalid", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = new Wallet(secret)
          expect(wallet.signTx("test")).to.be.equal(null)
        }
      }
    })

    it("return true if the sign data is related to the message when verify", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secret = data[chain].validSecret
        let sdata = "test"
        let wt = new Wallet(secret)
        let sign = wt.signTx(sdata)
        let verified = wt.verifyTx(sdata, sign)
        expect(verified).to.equal(true)
      }
    })

    it("return null if the secret is invalid when verify", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = new Wallet(secret)
          let sign = ""
          let verified = wallet.verifyTx("test", sign)
          expect(verified).to.equal(null)
        }
      }
    })

    it("return false if the sign data is not related to the message when verify", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secret = data[chain].validSecret
        let sdata = "test"
        let wt = new Wallet(secret)
        let sign = wt.signTx(sdata)
        let verified = wt.verifyTx(sdata + "t", sign)
        expect(verified).to.equal(false)
      }
    })
  })

  describe("toJson", function() {
    it("return address and secret successfully", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secret = data[chain].validSecret
        let address = data[chain].validAddress
        let wallet = new Wallet(secret)
        expect(wallet.toJson()).to.deep.equal({
          address,
          secret
        })
      }
    })

    it("return null if the secret is invalid", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = new Wallet(secret)
          expect(wallet.toJson()).to.be.equal(null)
        }
      }
    })
  })

  describe("address", function() {
    it("return null if the secret is invalid", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = new Wallet(secret)
          expect(wallet.address()).to.be.equal(null)
        }
      }
    })
  })

  describe("getPublicKey", function() {
    it("return null if the secret is invalid", function() {
      for (let chain of chains) {
        let Wallet = WalletFactory(chain)
        let secrets = data[chain].invalidSecrets
        for (let secret of secrets) {
          let wallet = new Wallet(secret)
          expect(wallet.getPublicKey()).to.be.equal(null)
        }
      }
    })
  })
})
