const chai = require("chai")
const expect = chai.expect
const tu = require("../lib/TypesUtils").Factory()
const Serializer = require("../lib/Serializer").Factory()
const sinon = require("sinon")
const BigInteger = require("jsbn").BigInteger
describe("test TypesUtils", function() {
  describe("test get_transaction_type api", function() {
    it("return Payment if the structure is 0", function() {
      let out = tu.get_transaction_type(0)
      expect(out).to.equal("Payment")
    })
    it("return AccountSet if the structure is 3", function() {
      let out = tu.get_transaction_type(3)
      expect(out).to.equal("AccountSet")
    })
    it("return SetRegularKey if the structure is 5", function() {
      let out = tu.get_transaction_type(5)
      expect(out).to.equal("SetRegularKey")
    })

    it("return OfferCreate if the structure is 7", function() {
      let out = tu.get_transaction_type(7)
      expect(out).to.equal("OfferCreate")
    })

    it("return OfferCancel if the structure is 8", function() {
      let out = tu.get_transaction_type(8)
      expect(out).to.equal("OfferCancel")
    })
    it("return Contract if the structure is 9", function() {
      let out = tu.get_transaction_type(9)
      expect(out).to.equal("Contract")
    })
    it("return RemoveContract if the structure is 10", function() {
      let out = tu.get_transaction_type(10)
      expect(out).to.equal("RemoveContract")
    })
    it("return TrustSet if the structure is 20", function() {
      let out = tu.get_transaction_type(20)
      expect(out).to.equal("TrustSet")
    })
    it("return RelationSet if the structure is 21", function() {
      let out = tu.get_transaction_type(21)
      expect(out).to.equal("RelationSet")
    })
    it("return RelationDel if the structure is 22", function() {
      let out = tu.get_transaction_type(22)
      expect(out).to.equal("RelationDel")
    })
    it("return ConfigContract if the structure is 30", function() {
      let out = tu.get_transaction_type(30)
      expect(out).to.equal("ConfigContract")
    })
    it("return EnableFeature if the structure is 100", function() {
      let out = tu.get_transaction_type(100)
      expect(out).to.equal("EnableFeature")
    })
    it("return SetFee if the structure is 101", function() {
      let out = tu.get_transaction_type(101)
      expect(out).to.equal("SetFee")
    })
    it("throw error if the structure is number but invalid", function() {
      expect(() => tu.get_transaction_type(102)).to.throw(
        "Invalid transaction type!"
      )
    })

    it("return 0 if the structure is Payment", function() {
      let out = tu.get_transaction_type("Payment")
      expect(out).to.equal(0)
    })
    it("return 3 if the structure is AccountSet", function() {
      let out = tu.get_transaction_type("AccountSet")
      expect(out).to.equal(3)
    })
    it("return 5 if the structure is SetRegularKey", function() {
      let out = tu.get_transaction_type("SetRegularKey")
      expect(out).to.equal(5)
    })

    it("return 7 if the structure is OfferCreate", function() {
      let out = tu.get_transaction_type("OfferCreate")
      expect(out).to.equal(7)
    })

    it("return 8 if the structure is OfferCancel", function() {
      let out = tu.get_transaction_type("OfferCancel")
      expect(out).to.equal(8)
    })
    it("return 9 if the structure is Contract", function() {
      let out = tu.get_transaction_type("Contract")
      expect(out).to.equal(9)
    })
    it("return 10 if the structure is RemoveContract", function() {
      let out = tu.get_transaction_type("RemoveContract")
      expect(out).to.equal(10)
    })
    it("return 20 if the structure is TrustSet", function() {
      let out = tu.get_transaction_type("TrustSet")
      expect(out).to.equal(20)
    })
    it("return 21 if the structure is RelationSet", function() {
      let out = tu.get_transaction_type("RelationSet")
      expect(out).to.equal(21)
    })
    it("return 22 if the structure is RelationDel", function() {
      let out = tu.get_transaction_type("RelationDel")
      expect(out).to.equal(22)
    })
    it("return 30 if the structure is ConfigContract", function() {
      let out = tu.get_transaction_type("ConfigContract")
      expect(out).to.equal(30)
    })
    it("return 100 if the structure is EnableFeature", function() {
      let out = tu.get_transaction_type("EnableFeature")
      expect(out).to.equal(100)
    })
    it("return 101 if the structure is SetFee", function() {
      let out = tu.get_transaction_type("SetFee")
      expect(out).to.equal(101)
    })
    it("throw error if the structure is string but invalid", function() {
      expect(() => tu.get_transaction_type("SetFees")).to.throw(
        "Invalid transaction type!"
      )
    })

    it("throw error if the structure is not string and number", function() {
      expect(() => tu.get_transaction_type(null)).to.throw(
        "Invalid input type for transaction type!"
      )
    })
  })

  describe("test get_transaction_result api", function() {
    it("return tesSUCCESS if the structure is 0", function() {
      let out = tu.get_transaction_result(0)
      expect(out).to.equal("tesSUCCESS")
    })
    it("return tecCLAIM if the structure is 100", function() {
      let out = tu.get_transaction_result(100)
      expect(out).to.equal("tecCLAIM")
    })
    it("return tecPATH_PARTIAL if the structure is 101", function() {
      let out = tu.get_transaction_result(101)
      expect(out).to.equal("tecPATH_PARTIAL")
    })
    it("return tecUNFUNDED_ADD if the structure is 102", function() {
      let out = tu.get_transaction_result(102)
      expect(out).to.equal("tecUNFUNDED_ADD")
    })
    it("return tecUNFUNDED_OFFER if the structure is 103", function() {
      let out = tu.get_transaction_result(103)
      expect(out).to.equal("tecUNFUNDED_OFFER")
    })
    it("return tecUNFUNDED_PAYMENT if the structure is 104", function() {
      let out = tu.get_transaction_result(104)
      expect(out).to.equal("tecUNFUNDED_PAYMENT")
    })
    it("return tecFAILED_PROCESSING if the structure is 105", function() {
      let out = tu.get_transaction_result(105)
      expect(out).to.equal("tecFAILED_PROCESSING")
    })
    it("return tecDIR_FULL if the structure is 121", function() {
      let out = tu.get_transaction_result(121)
      expect(out).to.equal("tecDIR_FULL")
    })
    it("return tecINSUF_RESERVE_LINE if the structure is 122", function() {
      let out = tu.get_transaction_result(122)
      expect(out).to.equal("tecINSUF_RESERVE_LINE")
    })
    it("return tecINSUFFICIENT_RESERVE if the structure is 141", function() {
      let out = tu.get_transaction_result(141)
      expect(out).to.equal("tecINSUFFICIENT_RESERVE")
    })
    it("throw error if the structure is number but invalid", function() {
      expect(() => tu.get_transaction_result(142)).to.throw(
        "Invalid transaction result!"
      )
    })

    it("return 0 if the structure is tesSUCCESS", function() {
      let out = tu.get_transaction_result("tesSUCCESS")
      expect(out).to.equal(0)
    })
    it("return 100 if the structure is tecCLAIM", function() {
      let out = tu.get_transaction_result("tecCLAIM")
      expect(out).to.equal(100)
    })
    it("return 101 if the structure is tecPATH_PARTIAL", function() {
      let out = tu.get_transaction_result("tecPATH_PARTIAL")
      expect(out).to.equal(101)
    })
    it("return 102 if the structure is tecUNFUNDED_ADD", function() {
      let out = tu.get_transaction_result("tecUNFUNDED_ADD")
      expect(out).to.equal(102)
    })
    it("return 103 if the structure is tecUNFUNDED_OFFER", function() {
      let out = tu.get_transaction_result("tecUNFUNDED_OFFER")
      expect(out).to.equal(103)
    })
    it("return 104 if the structure is tecUNFUNDED_PAYMENT", function() {
      let out = tu.get_transaction_result("tecUNFUNDED_PAYMENT")
      expect(out).to.equal(104)
    })
    it("return 105 if the structure is tecFAILED_PROCESSING", function() {
      let out = tu.get_transaction_result("tecFAILED_PROCESSING")
      expect(out).to.equal(105)
    })
    it("return 121 if the structure is tecDIR_FULL", function() {
      let out = tu.get_transaction_result("tecDIR_FULL")
      expect(out).to.equal(121)
    })
    it("return 122 if the structure is tecINSUF_RESERVE_LINE", function() {
      let out = tu.get_transaction_result("tecINSUF_RESERVE_LINE")
      expect(out).to.equal(122)
    })
    it("return 141 if the structure is tecINSUFFICIENT_RESERVE", function() {
      let out = tu.get_transaction_result("tecINSUFFICIENT_RESERVE")
      expect(out).to.equal(141)
    })
    it("throw error if the structure is string but invalid", function() {
      expect(() => tu.get_transaction_result("aaaa")).to.throw(
        "Invalid transaction result!"
      )
    })

    it("throw error if the structure is not string and number", function() {
      expect(() => tu.get_transaction_result(null)).to.throw(
        "Invalid input type for transaction result!"
      )
    })
  })

  describe("test get_ledger_entry_type api", function() {
    it("return AccountRoot if the structure is 97", function() {
      let out = tu.get_ledger_entry_type(97)
      expect(out).to.equal("AccountRoot")
    })
    it("return Contract if the structure is 99", function() {
      let out = tu.get_ledger_entry_type(99)
      expect(out).to.equal("Contract")
    })
    it("return DirectoryNode if the structure is 100", function() {
      let out = tu.get_ledger_entry_type(100)
      expect(out).to.equal("DirectoryNode")
    })
    it("return EnabledFeatures if the structure is 102", function() {
      let out = tu.get_ledger_entry_type(102)
      expect(out).to.equal("EnabledFeatures")
    })
    it("return FeeSettings if the structure is 115", function() {
      let out = tu.get_ledger_entry_type(115)
      expect(out).to.equal("FeeSettings")
    })
    it("return GeneratorMap if the structure is 103", function() {
      let out = tu.get_ledger_entry_type(103)
      expect(out).to.equal("GeneratorMap")
    })
    it("return LedgerHashes if the structure is 104", function() {
      let out = tu.get_ledger_entry_type(104)
      expect(out).to.equal("LedgerHashes")
    })
    it("return Nickname if the structure is 110", function() {
      let out = tu.get_ledger_entry_type(110)
      expect(out).to.equal("Nickname")
    })
    it("return Offer if the structure is 111", function() {
      let out = tu.get_ledger_entry_type(111)
      expect(out).to.equal("Offer")
    })
    it("return SkywellState if the structure is 114", function() {
      let out = tu.get_ledger_entry_type(114)
      expect(out).to.equal("SkywellState")
    })
    it("throw error if the structure is number but invalid", function() {
      expect(() => tu.get_ledger_entry_type(142)).to.throw(
        "Invalid input type for ransaction result!"
      )
    })

    it("return 97 if the structure is AccountRoot", function() {
      let out = tu.get_ledger_entry_type("AccountRoot")
      expect(out).to.equal(97)
    })
    it("return 99 if the structure is Contract", function() {
      let out = tu.get_ledger_entry_type("Contract")
      expect(out).to.equal(99)
    })
    it("return 100 if the structure is DirectoryNode", function() {
      let out = tu.get_ledger_entry_type("DirectoryNode")
      expect(out).to.equal(100)
    })
    it("return 102 if the structure is EnabledFeatures", function() {
      let out = tu.get_ledger_entry_type("EnabledFeatures")
      expect(out).to.equal(102)
    })
    it("return 115 if the structure is FeeSettings", function() {
      let out = tu.get_ledger_entry_type("FeeSettings")
      expect(out).to.equal(115)
    })
    it("return 103 if the structure is GeneratorMap", function() {
      let out = tu.get_ledger_entry_type("GeneratorMap")
      expect(out).to.equal(103)
    })
    it("return 104 if the structure is LedgerHashes", function() {
      let out = tu.get_ledger_entry_type("LedgerHashes")
      expect(out).to.equal(104)
    })
    it("return 110 if the structure is Nickname", function() {
      let out = tu.get_ledger_entry_type("Nickname")
      expect(out).to.equal(110)
    })
    it("return 111 if the structure is Offer", function() {
      let out = tu.get_ledger_entry_type("Offer")
      expect(out).to.equal(111)
    })
    it("return 114 if the structure is SkywellState", function() {
      let out = tu.get_ledger_entry_type("SkywellState")
      expect(out).to.equal(114)
    })
    it("return 0 if the structure is string but invalid", function() {
      let out = tu.get_ledger_entry_type("sss")
      expect(out).to.equal(0)
    })

    it("return UndefinedLedgerEntry if the structure is not string and number", function() {
      let out = tu.get_ledger_entry_type(null)
      expect(out).to.equal("UndefinedLedgerEntry")
    })
  })

  describe("test STArray", function() {
    it("STArray's id is 15", function() {
      expect(tu.Array.id).to.equal(15)
    })

    it("success if serialize", function() {
      let so = new Serializer([])
      let data = [{
        Memo: {
          MemoData: "\u0000\u0000"
        }
      }]
      tu.Array.serialize(so, data)
      expect(so.buffer).to.deep.equal([234, 125, 2, 0, 0, 225, 241])
      expect(so.pointer).to.equal(7)
    })

    it("throw error if keys's length is not equal to 1 when serialize", function() {
      let so = new Serializer([])
      let data = [{
        Memo: {
          MemoData: "test"
        },
        test: "test"
      }]
      expect(() => tu.Array.serialize(so, data)).to.throw(
        "Cannot serialize an array containing non-single-key objects"
      )
    })

    it("success if parse", function() {
      let so = new Serializer([234, 125, 2, 0, 0, 225, 241])
      let value = tu.Array.parse(so)
      expect(value).to.deep.equal([{
        Memo: {
          MemoData: "0000"
        }
      }])
      expect(so.pointer).to.equal(7)
    })
  })

  describe("test STObject", function() {
    it("STObject's id is 14", function() {
      expect(tu.Object.id).to.equal(14)
    })

    it("success if serialize when no_marker is true", function() {
      let so = new Serializer([])
      let data = {
        Flags: 0,
        Fee: 0.01
      }
      tu.Object.serialize(so, data, true)
      expect(so.buffer).to.deep.equal([
        34,
        0,
        0,
        0,
        0,
        104,
        64,
        0,
        0,
        0,
        0,
        0,
        39,
        16
      ])
      expect(so.pointer).to.equal(so.buffer.length)
    })

    it("success if serialize when no_marker is false", function() {
      let so = new Serializer([])
      let data = {
        Flags: 0,
        Fee: 0.01
      }
      tu.Object.serialize(so, data, false)
      expect(so.buffer).to.deep.equal([
        34,
        0,
        0,
        0,
        0,
        104,
        64,
        0,
        0,
        0,
        0,
        0,
        39,
        16,
        225
      ])
      expect(so.pointer).to.equal(so.buffer.length)
    })
  })

  describe("test STHash128", function() {
    it("STHash128's id is 4", function() {
      expect(tu.Hash128.id).to.equal(4)
    })

    it("throw error if the hash is invalid", function() {
      let so = new Serializer([])
      expect(() =>
        tu.Hash128.serialize(so, "111111111111111111111111111111")
      ).to.throw()
    })
  })

  describe("test STInt8", function() {
    it("STInt8's id is 16", function() {
      expect(tu.Int8.id).to.equal(16)
    })

    it("success if serialize", function() {
      let so = new Serializer([])
      tu.Int8.serialize(so, 1)
      expect(so.buffer).to.deep.equal([1])
    })

    it("success if parse", function() {
      let so = new Serializer([1])
      let value = tu.Int8.parse(so)
      expect(value).to.equal(1)
    })
  })

  describe("test STInt16", function() {
    it("STInt16's id is 1", function() {
      expect(tu.Int16.id).to.equal(1)
    })

    it("success if serialize", function() {
      let so = new Serializer([])
      tu.Int16.serialize(so, 1)
      expect(so.buffer).to.deep.equal([0, 1])
    })

    it("success if parse", function() {
      let so = new Serializer([0, 1])
      let value = tu.Int16.parse(so)
      expect(value).to.equal(1)
    })
  })

  describe("test STInt32", function() {
    it("STInt32's id is 2", function() {
      expect(tu.Int32.id).to.equal(2)
    })

    it("success if serialize", function() {
      let so = new Serializer([])
      tu.Int32.serialize(so, 1)
      expect(so.buffer).to.deep.equal([0, 0, 0, 1])
    })

    it("success if parse", function() {
      let so = new Serializer([0, 0, 0, 1])
      let value = tu.Int32.parse(so)
      expect(value).to.equal(1)
    })
  })

  describe("test STInt64", function() {
    it("STInt64's id is 3", function() {
      expect(tu.Int64.id).to.equal(3)
    })

    it("success if serialize", function() {
      let so = new Serializer([])
      tu.Int64.serialize(so, 1)
      expect(so.buffer).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 1])
    })

    it("throw error if val is less than 0", function() {
      let so = new Serializer([])
      expect(() => tu.Int64.serialize(so, -1)).to.throw(
        "Negative value for unsigned Int64 is invalid."
      )
    })

    it("throw error if val is not valid hex int64", function() {
      let so = new Serializer([])
      expect(() => tu.Int64.serialize(so, "aaaaaaaaaaaaaaaaaa")).to.throw(
        "Not a valid hex Int64."
      )
    })

    it("throw error if val is not number and string", function() {
      let so = new Serializer([])
      expect(() => tu.Int64.serialize(so, null)).to.throw(
        "Invalid type for Int64"
      )
    })

    it("success if parse", function() {
      let so = new Serializer([0, 0, 0, 0, 0, 0, 0, 1])
      let value = tu.Int64.parse(so)
      expect(value.toString(10)).to.equal("1")
    })
  })
})