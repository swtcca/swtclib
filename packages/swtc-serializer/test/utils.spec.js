const chai = require("chai")
const expect = chai.expect
const utils = require("../lib/Utils")
describe("test utils", function() {
  describe("test get_transaction_type api", function() {
    it("return Payment if the structure is 0", function() {
      let out = utils.get_transaction_type(0)
      expect(out).to.equal("Payment")
    })
    it("return AccountSet if the structure is 3", function() {
      let out = utils.get_transaction_type(3)
      expect(out).to.equal("AccountSet")
    })
    it("return SetRegularKey if the structure is 5", function() {
      let out = utils.get_transaction_type(5)
      expect(out).to.equal("SetRegularKey")
    })

    it("return OfferCreate if the structure is 7", function() {
      let out = utils.get_transaction_type(7)
      expect(out).to.equal("OfferCreate")
    })

    it("return OfferCancel if the structure is 8", function() {
      let out = utils.get_transaction_type(8)
      expect(out).to.equal("OfferCancel")
    })
    it("return Contract if the structure is 9", function() {
      let out = utils.get_transaction_type(9)
      expect(out).to.equal("Contract")
    })
    it("return RemoveContract if the structure is 10", function() {
      let out = utils.get_transaction_type(10)
      expect(out).to.equal("RemoveContract")
    })
    it("return TrustSet if the structure is 20", function() {
      let out = utils.get_transaction_type(20)
      expect(out).to.equal("TrustSet")
    })
    it("return RelationSet if the structure is 21", function() {
      let out = utils.get_transaction_type(21)
      expect(out).to.equal("RelationSet")
    })
    it("return RelationDel if the structure is 22", function() {
      let out = utils.get_transaction_type(22)
      expect(out).to.equal("RelationDel")
    })
    it("return ConfigContract if the structure is 30", function() {
      let out = utils.get_transaction_type(30)
      expect(out).to.equal("ConfigContract")
    })
    it("return EnableFeature if the structure is 100", function() {
      let out = utils.get_transaction_type(100)
      expect(out).to.equal("EnableFeature")
    })
    it("return SetFee if the structure is 101", function() {
      let out = utils.get_transaction_type(101)
      expect(out).to.equal("SetFee")
    })
    it("throw error if the structure is number but invalid", function() {
      expect(() => utils.get_transaction_type(102)).to.throw(
        "Invalid transaction type!"
      )
    })

    it("return 0 if the structure is Payment", function() {
      let out = utils.get_transaction_type("Payment")
      expect(out).to.equal(0)
    })
    it("return 3 if the structure is AccountSet", function() {
      let out = utils.get_transaction_type("AccountSet")
      expect(out).to.equal(3)
    })
    it("return 5 if the structure is SetRegularKey", function() {
      let out = utils.get_transaction_type("SetRegularKey")
      expect(out).to.equal(5)
    })

    it("return 7 if the structure is OfferCreate", function() {
      let out = utils.get_transaction_type("OfferCreate")
      expect(out).to.equal(7)
    })

    it("return 8 if the structure is OfferCancel", function() {
      let out = utils.get_transaction_type("OfferCancel")
      expect(out).to.equal(8)
    })
    it("return 9 if the structure is Contract", function() {
      let out = utils.get_transaction_type("Contract")
      expect(out).to.equal(9)
    })
    it("return 10 if the structure is RemoveContract", function() {
      let out = utils.get_transaction_type("RemoveContract")
      expect(out).to.equal(10)
    })
    it("return 20 if the structure is TrustSet", function() {
      let out = utils.get_transaction_type("TrustSet")
      expect(out).to.equal(20)
    })
    it("return 21 if the structure is RelationSet", function() {
      let out = utils.get_transaction_type("RelationSet")
      expect(out).to.equal(21)
    })
    it("return 22 if the structure is RelationDel", function() {
      let out = utils.get_transaction_type("RelationDel")
      expect(out).to.equal(22)
    })
    it("return 30 if the structure is ConfigContract", function() {
      let out = utils.get_transaction_type("ConfigContract")
      expect(out).to.equal(30)
    })
    it("return 100 if the structure is EnableFeature", function() {
      let out = utils.get_transaction_type("EnableFeature")
      expect(out).to.equal(100)
    })
    it("return 101 if the structure is SetFee", function() {
      let out = utils.get_transaction_type("SetFee")
      expect(out).to.equal(101)
    })
    it("throw error if the structure is string but invalid", function() {
      expect(() => utils.get_transaction_type("SetFees")).to.throw(
        "Invalid transaction type!"
      )
    })

    it("throw error if the structure is not string and number", function() {
      expect(() => utils.get_transaction_type(null)).to.throw(
        "Invalid input type for transaction type!"
      )
    })
  })

  describe("test get_transaction_result api", function() {
    it("return tesSUCCESS if the structure is 0", function() {
      let out = utils.get_transaction_result(0)
      expect(out).to.equal("tesSUCCESS")
    })
    it("return tecCLAIM if the structure is 100", function() {
      let out = utils.get_transaction_result(100)
      expect(out).to.equal("tecCLAIM")
    })
    it("return tecPATH_PARTIAL if the structure is 101", function() {
      let out = utils.get_transaction_result(101)
      expect(out).to.equal("tecPATH_PARTIAL")
    })
    it("return tecUNFUNDED_ADD if the structure is 102", function() {
      let out = utils.get_transaction_result(102)
      expect(out).to.equal("tecUNFUNDED_ADD")
    })
    it("return tecUNFUNDED_OFFER if the structure is 103", function() {
      let out = utils.get_transaction_result(103)
      expect(out).to.equal("tecUNFUNDED_OFFER")
    })
    it("return tecUNFUNDED_PAYMENT if the structure is 104", function() {
      let out = utils.get_transaction_result(104)
      expect(out).to.equal("tecUNFUNDED_PAYMENT")
    })
    it("return tecFAILED_PROCESSING if the structure is 105", function() {
      let out = utils.get_transaction_result(105)
      expect(out).to.equal("tecFAILED_PROCESSING")
    })
    it("return tecDIR_FULL if the structure is 121", function() {
      let out = utils.get_transaction_result(121)
      expect(out).to.equal("tecDIR_FULL")
    })
    it("return tecINSUF_RESERVE_LINE if the structure is 122", function() {
      let out = utils.get_transaction_result(122)
      expect(out).to.equal("tecINSUF_RESERVE_LINE")
    })
    it("return tecINSUFFICIENT_RESERVE if the structure is 141", function() {
      let out = utils.get_transaction_result(141)
      expect(out).to.equal("tecINSUFFICIENT_RESERVE")
    })
    it("throw error if the structure is number but invalid", function() {
      expect(() => utils.get_transaction_result(142)).to.throw(
        "Invalid transaction result!"
      )
    })

    it("return 0 if the structure is tesSUCCESS", function() {
      let out = utils.get_transaction_result("tesSUCCESS")
      expect(out).to.equal(0)
    })
    it("return 100 if the structure is tecCLAIM", function() {
      let out = utils.get_transaction_result("tecCLAIM")
      expect(out).to.equal(100)
    })
    it("return 101 if the structure is tecPATH_PARTIAL", function() {
      let out = utils.get_transaction_result("tecPATH_PARTIAL")
      expect(out).to.equal(101)
    })
    it("return 102 if the structure is tecUNFUNDED_ADD", function() {
      let out = utils.get_transaction_result("tecUNFUNDED_ADD")
      expect(out).to.equal(102)
    })
    it("return 103 if the structure is tecUNFUNDED_OFFER", function() {
      let out = utils.get_transaction_result("tecUNFUNDED_OFFER")
      expect(out).to.equal(103)
    })
    it("return 104 if the structure is tecUNFUNDED_PAYMENT", function() {
      let out = utils.get_transaction_result("tecUNFUNDED_PAYMENT")
      expect(out).to.equal(104)
    })
    it("return 105 if the structure is tecFAILED_PROCESSING", function() {
      let out = utils.get_transaction_result("tecFAILED_PROCESSING")
      expect(out).to.equal(105)
    })
    it("return 121 if the structure is tecDIR_FULL", function() {
      let out = utils.get_transaction_result("tecDIR_FULL")
      expect(out).to.equal(121)
    })
    it("return 122 if the structure is tecINSUF_RESERVE_LINE", function() {
      let out = utils.get_transaction_result("tecINSUF_RESERVE_LINE")
      expect(out).to.equal(122)
    })
    it("return 141 if the structure is tecINSUFFICIENT_RESERVE", function() {
      let out = utils.get_transaction_result("tecINSUFFICIENT_RESERVE")
      expect(out).to.equal(141)
    })
    it("throw error if the structure is string but invalid", function() {
      expect(() => utils.get_transaction_result("aaaa")).to.throw(
        "Invalid transaction result!"
      )
    })

    it("throw error if the structure is not string and number", function() {
      expect(() => utils.get_transaction_result(null)).to.throw(
        "Invalid input type for transaction result!"
      )
    })
  })

  describe("test get_ledger_entry_type api", function() {
    it("return AccountRoot if the structure is 97", function() {
      let out = utils.get_ledger_entry_type(97)
      expect(out).to.equal("AccountRoot")
    })
    it("return Contract if the structure is 99", function() {
      let out = utils.get_ledger_entry_type(99)
      expect(out).to.equal("Contract")
    })
    it("return DirectoryNode if the structure is 100", function() {
      let out = utils.get_ledger_entry_type(100)
      expect(out).to.equal("DirectoryNode")
    })
    it("return EnabledFeatures if the structure is 102", function() {
      let out = utils.get_ledger_entry_type(102)
      expect(out).to.equal("EnabledFeatures")
    })
    it("return FeeSettings if the structure is 115", function() {
      let out = utils.get_ledger_entry_type(115)
      expect(out).to.equal("FeeSettings")
    })
    it("return GeneratorMap if the structure is 103", function() {
      let out = utils.get_ledger_entry_type(103)
      expect(out).to.equal("GeneratorMap")
    })
    it("return LedgerHashes if the structure is 104", function() {
      let out = utils.get_ledger_entry_type(104)
      expect(out).to.equal("LedgerHashes")
    })
    it("return Nickname if the structure is 110", function() {
      let out = utils.get_ledger_entry_type(110)
      expect(out).to.equal("Nickname")
    })
    it("return Offer if the structure is 111", function() {
      let out = utils.get_ledger_entry_type(111)
      expect(out).to.equal("Offer")
    })
    it("return SkywellState if the structure is 114", function() {
      let out = utils.get_ledger_entry_type(114)
      expect(out).to.equal("SkywellState")
    })
    it("throw error if the structure is number but invalid", function() {
      expect(() => utils.get_ledger_entry_type(142)).to.throw(
        "Invalid input type for ransaction result!"
      )
    })

    it("return 97 if the structure is AccountRoot", function() {
      let out = utils.get_ledger_entry_type("AccountRoot")
      expect(out).to.equal(97)
    })
    it("return 99 if the structure is Contract", function() {
      let out = utils.get_ledger_entry_type("Contract")
      expect(out).to.equal(99)
    })
    it("return 100 if the structure is DirectoryNode", function() {
      let out = utils.get_ledger_entry_type("DirectoryNode")
      expect(out).to.equal(100)
    })
    it("return 102 if the structure is EnabledFeatures", function() {
      let out = utils.get_ledger_entry_type("EnabledFeatures")
      expect(out).to.equal(102)
    })
    it("return 115 if the structure is FeeSettings", function() {
      let out = utils.get_ledger_entry_type("FeeSettings")
      expect(out).to.equal(115)
    })
    it("return 103 if the structure is GeneratorMap", function() {
      let out = utils.get_ledger_entry_type("GeneratorMap")
      expect(out).to.equal(103)
    })
    it("return 104 if the structure is LedgerHashes", function() {
      let out = utils.get_ledger_entry_type("LedgerHashes")
      expect(out).to.equal(104)
    })
    it("return 110 if the structure is Nickname", function() {
      let out = utils.get_ledger_entry_type("Nickname")
      expect(out).to.equal(110)
    })
    it("return 111 if the structure is Offer", function() {
      let out = utils.get_ledger_entry_type("Offer")
      expect(out).to.equal(111)
    })
    it("return 114 if the structure is SkywellState", function() {
      let out = utils.get_ledger_entry_type("SkywellState")
      expect(out).to.equal(114)
    })
    it("return 0 if the structure is string but invalid", function() {
      let out = utils.get_ledger_entry_type("sss")
      expect(out).to.equal(0)
    })

    it("return UndefinedLedgerEntry if the structure is not string and number", function() {
      let out = utils.get_ledger_entry_type(null)
      expect(out).to.equal("UndefinedLedgerEntry")
    })
  })

  describe("test get_dec_from_hexchar", function() {
    it("return 0 if input string length is more than 1", function() {
      expect(utils.get_dec_from_hexchar("11")).to.equal(0)
    })
    it("if the input value is 0-9", function() {
      expect(utils.get_dec_from_hexchar("1")).to.equal(1)
      expect(utils.get_dec_from_hexchar("9")).to.equal(9)
    })

    it("if the input value is included in A-Z", function() {
      expect(utils.get_dec_from_hexchar("A")).to.equal(10)
      expect(utils.get_dec_from_hexchar("Z")).to.equal(35)
    })

    it("if the input value is included in a-z", function() {
      expect(utils.get_dec_from_hexchar("a")).to.equal(10)
      expect(utils.get_dec_from_hexchar("z")).to.equal(35)
    })

    it("return 0 if the input value is ' '", function() {
      expect(utils.get_dec_from_hexchar(" ")).to.equal(0)
    })
  })

  describe("test hex_str_to_byte_array", function() {
    it("if the input length is not even", function() {
      expect(utils.hex_str_to_byte_array("0x a0c")).to.deep.equal([160, 192])
      expect(utils.hex_str_to_byte_array("a0c")).to.deep.equal([160, 192])
      expect(utils.hex_str_to_byte_array("0xa0c")).to.deep.equal([160, 192])
    })

    it("if the inout length id odd", function() {
      expect(utils.hex_str_to_byte_array("0xa0c0")).to.deep.equal([160, 192])
    })
  })

  describe("test get_char_from_num", function() {
    it("if the input value is 0-9", function() {
      expect(utils.get_char_from_num(0)).to.equal(48)
      expect(utils.get_char_from_num(9)).to.equal(57)
    })

    it("if the input value is 10-15", function() {
      expect(utils.get_char_from_num(10)).to.equal(65)
      expect(utils.get_char_from_num(15)).to.equal(70)
    })

    it("if the input value is more than 15", function() {
      expect(utils.get_char_from_num(16)).to.equal(undefined)
    })
  })
})
