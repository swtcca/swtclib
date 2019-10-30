const chai = require("chai")
const expect = chai.expect
const Event = require("events").EventEmitter
const Remote = require("../").Remote
const Transaction = Remote.Transaction
const config = require("../../.conf/config")
const Request = Remote.Request
const sinon = require("sinon")
let {
  JT_NODE,
  address,
  secret,
  address2,
  testSecret,
  testAddress,
  testDestinationAddress
} = config

const TX_PAY = {
  Flags: 0,
  Fee: 10000,
  TransactionType: "Payment",
  Account: address2,
  Amount: "1000000",
  Destination: testDestinationAddress
}

const MULTISIGN = {
  Signers: [
    {
      Signer: {
        Account: address,
        SigningPubKey: `${new Transaction.Wallet(secret).getPublicKey()}`,
        TxnSignature:
          "3045022100D788CFBD76BB183D43E175191BD37965D01EFDD9D7F978B4DC7AED1F6421CA5B0220334448FEAF2A153EEF24FDFB7E4BC90BFFB29EBEB32342CEA3234F4737E9C967"
      }
    },
    {
      Signer: {
        Account: testAddress,
        SigningPubKey: `${new Transaction.Wallet(testSecret).getPublicKey()}`,
        TxnSignature:
          "3045022100FC692AF1374D347C7E53205F165EF7F9AD3F96F558A2BE339947E277AB74447102204B8103DCA38AEC05A1EFD65C4E635242E882449B98328EAF13DC0DD2AFC0F239"
      }
    }
  ],
  SigningPubKey: ""
}

const Sequence = 11

describe("test multisign", function() {
  describe("test multiSigning", function() {
    it("should match result", function() {
      let remote = new Remote({ server: JT_NODE })
      let inst = Transaction.buildPaymentTx(
        {
          from: address2,
          to: testDestinationAddress,
          amount: {
            value: 1,
            currency: "SWT",
            issuer: ""
          }
        },
        remote
      )
      inst.setSequence(Sequence)
      inst.setFee(20000)
      inst.multiSigning({ address, secret })
      inst.multiSigning({ address: testAddress, secret: testSecret })
      inst.multiSigned()
      expect(inst.command).to.equal("submit_multisigned")
      expect(inst.tx_json).to.deep.equal({
        ...TX_PAY,
        Sequence,
        Fee: 20000,
        ...MULTISIGN
      })
    })
  })

  describe("test buildMultisignedTx", function() {
    it("should match result", function() {
      let remote = new Remote({ server: JT_NODE })
      let inst = Transaction.buildPaymentTx(
        {
          from: address2,
          to: testDestinationAddress,
          amount: {
            value: 1,
            currency: "SWT",
            issuer: ""
          }
        },
        remote
      )
      inst.setSequence(Sequence)
      inst.setFee(20000)
      Transaction.buildSignFirstTx({ address, secret, tx: inst })
      inst = Transaction.buildSignOtherTx({
        address: testAddress,
        secret: testSecret,
        tx_json: inst.tx_json
      })
      inst = Transaction.buildMultisignedTx(inst.tx_json)
      expect(inst.command).to.equal("submit_multisigned")
      expect(inst.tx_json).to.deep.equal({
        ...TX_PAY,
        Sequence,
        Fee: 20000,
        ...MULTISIGN
      })
    })
  })
})
