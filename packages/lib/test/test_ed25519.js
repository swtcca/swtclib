const chai = require("chai")
const expect = chai.expect
const { Remote, Transaction, Wallet } = require("../")
const Serializer = Transaction.Serializer
const config = require("../../.conf/config")
const remote = new Remote()
let {
  JT_NODE,
  address,
  secret,
  address_ed,
  secret_ed,
  address2,
  testSecret,
  testAddress,
  testDestinationAddress,
  hash_blob_sign_ed25519,
  blob_sign_ed25519,
  hash_blob_multisign_ed25519,
  blob_multisign_ed25519
} = config

const wallet = Wallet.fromSecret(secret)
const wallet_test = Wallet.fromSecret(testSecret)
const wallet_ed = Wallet.fromSecret(secret_ed)

const TX_PAY_SIGN = {
  Flags: 0,
  Fee: 10000,
  TransactionType: "Payment",
  Account: wallet_ed.address,
  Amount: "100000",
  Sequence: 14,
  Destination: wallet.address
}

const TX_PAY_MULTISIGN = {
  Flags: 0,
  Fee: 20000,
  TransactionType: "Payment",
  Account: wallet.address,
  Amount: "1000000",
  Sequence: 30,
  Destination: wallet_ed.address,
  SigningPubKey: ""
}

const so_sign = new Serializer(blob_sign_ed25519)
const so_multisign = new Serializer(blob_multisign_ed25519)

describe("sign swith ed25519, serializer", function() {
  let tx = remote.buildPaymentTx({
    from: wallet_ed.address,
    to: wallet.address,
    amount: remote.makeAmount()
  })
  tx.tx_json = Object.assign({}, TX_PAY_SIGN)

  describe("test signing ed25519 hash", function() {
    it("should match tx hash", function() {
      expect(so_sign.hash(0x54584e00)).to.equal(hash_blob_sign_ed25519)
    })
  })

  describe("test sign with ed25519", function() {
    it("should match blob", async function() {
      await tx.signPromise(secret_ed)
      expect(tx.tx_json.blob).to.equal(blob_sign_ed25519)
    })
  })

  describe("test sign with ed25519", function() {
    it("should match signature", async function() {
      await tx.signPromise(secret_ed)
      expect(tx.tx_json.blob).to.equal(blob_sign_ed25519)
      expect(tx.tx_json.TxnSignature).to.equal(so_sign.to_json().TxnSignature)
    })
  })
})

describe("multisign swith ecdsa / eddsa, serializer", function() {
  let tx = remote.buildPaymentTx({
    from: wallet.address,
    to: wallet_ed.address,
    amount: remote.makeAmount()
  })
  tx.tx_json = Object.assign({}, TX_PAY_MULTISIGN)

  describe("test multiSigning ed25519 hash", function() {
    it("should match multisign tx hash", function() {
      expect(so_multisign.hash(0x54584e00)).to.equal(
        hash_blob_multisign_ed25519
      )
    })
  })

  describe("test multisign with ed25519", function() {
    it("should match multisign ed25519 signature", function() {
      // tx.multiSigning(wallet_ed)
      remote.buildSignFirstTx({
        tx,
        account: wallet_ed.address,
        secret: wallet_ed.secret
      })
      expect(tx.tx_json.Signers[0].TxnSignature).to.equal(
        so_multisign.to_json().Signers[1].TxnSignature
      )
    })
  })

  describe("test multisign with ecdsa", function() {
    it("should match multisign ecdsa signature", function() {
      tx = remote.buildSignOtherTx({
        tx_json: tx.tx_json,
        account: wallet_test.address,
        secret: wallet_test.secret
      })
      expect(tx.tx_json.Signers[1].TxnSignature).to.equal(
        so_multisign.to_json().Signers[0].TxnSignature
      )
    })
  })
})
