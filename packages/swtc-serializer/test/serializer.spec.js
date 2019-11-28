const chai = require("chai")
const expect = chai.expect
const Serializer = require("../lib/Serializer").Factory()
const sinon = require("sinon")
const TU = require("../lib/TypesUtils").Factory()

describe("test Serializer", function() {
  describe("test Factory", function() {
    it("throw error if KeyPair is undefined", function() {
      const Factory = require("../lib/Serializer").Factory
      expect(() => Factory({})).to.throw()
    })
  })

  describe("test constructor", function() {
    it("if the buf is array and token is undefined", function() {
      let inst = new Serializer([])
      expect(inst.buffer).to.deep.equal([])
      // expect(inst._token).to.equal("swt")
      expect(inst.pointer).to.equal(0)
    })

    it("if the buf is buffer", function() {
      let inst = new Serializer(Buffer.from("test"))
      expect(inst.buffer).to.deep.equal([116, 101, 115, 116])
      expect(inst.pointer).to.equal(0)
    })

    it("if the buf is string", function() {
      let inst = new Serializer("test", "bwt")
      expect(inst.buffer).to.deep.equal([478, 477])
      // expect(inst._token).to.equal("bwt")
      expect(inst.pointer).to.equal(0)
    })

    it("if the buf is empty", function() {
      let inst = new Serializer(undefined, "bwt")
      expect(inst.buffer).to.deep.equal([])
      // expect(inst._token).to.equal("bwt")
      expect(inst.pointer).to.equal(0)
    })

    it("if the buf is object", function() {
      expect(() => new Serializer({}, "bwt")).to.throw("Invalid buffer passed.")
    })
  })

  describe("test lookup_type_le", function() {
    it("throw error if the id is not number", function() {
      expect(() => Serializer.lookup_type_le("1")).to.throw()
    })

    it("not throw error if the id is number", function() {
      expect(() => Serializer.lookup_type_le(1)).to.not.throw()
    })
  })

  describe("test lookup_type_tx", function() {
    it("throw error if the id is not number", function() {
      expect(() => Serializer.lookup_type_tx("1")).to.throw()
    })

    it("not throw error if the id is number", function() {
      expect(() => Serializer.lookup_type_tx(1)).to.not.throw()
    })
  })

  describe("test sort_typedef", function() {
    it("throw error if the typedef is not array", function() {
      expect(() => Serializer.sort_typedef("1")).to.throw()
    })

    it("if a[3] is equal to b[3]", function() {
      let typedef = [
        ["Object", "Int8", "Int16", "Int16"],
        ["Int8", "Object", "Int16", "Int16"]
      ]
      let sort = Serializer.sort_typedef(typedef)
      expect(sort).to.deep.equal([
        ["Object", "Int8", "Int16", "Int16"],
        ["Int8", "Object", "Int16", "Int16"]
      ])
    })

    it("if a[3] is equal not to b[3]", function() {
      let typedef = [
        ["Object", "Int8", "Int16", "Int16"],
        ["Int8", "Object", "Int32", "Int32"]
      ]
      let sort = Serializer.sort_typedef(typedef)
      expect(sort).to.deep.equal([
        ["Object", "Int8", "Int16", "Int16"],
        ["Int8", "Object", "Int32", "Int32"]
      ])
    })
  })

  describe("test get_field_header", function() {
    it("if type id is more than 15 and field id is less than 15", function() {
      let buf = Serializer.get_field_header(16, 14)
      expect(buf).to.deep.equal([14, 16])
    })

    it("if type id is less than 15 and field id is more than 15", function() {
      let buf = Serializer.get_field_header(14, 16)
      expect(buf).to.deep.equal([224, 16])
    })
  })

  describe("test serialize", function() {
    it("serialize of TypesUtils Object should be called", function() {
      let inst = new Serializer([])
      let spy = sinon.spy(TU.Object, "serialize")
      inst.serialize({})
      expect(spy.calledOnce).to.equal(true)
      let args = spy.args[0]
      expect(args[0] instanceof Serializer).to.equal(true)
      expect(args[1]).to.deep.equal({})
      expect(args[2]).to.equal(true)
    })
  })

  describe("test hash", function() {
    it("if the prefix is undefined", function() {
      let inst = new Serializer([])
      let hash = inst.hash(undefined, "swt")
      expect(hash).to.equal(
        "CF83E1357EEFB8BDF1542850D66D8007D620E4050B5715DC83F4A921D36CE9CE"
      )
    })

    it("if the prefix is 0x53545800", function() {
      let inst = new Serializer([])
      let hash = inst.hash(0x53545800, "swt")
      expect(hash).to.equal(
        "5419F57EF22CCB2A13C6CA2EC96A898A35A1151823150B90CD2C1F17141721D5"
      )
    })
  })

  describe("test jsonify_structure", function() {
    it("if the structure is number and field_name is LedgerEntryType", function() {
      let value = Serializer.jsonify_structure(97, "LedgerEntryType")
      expect(value).to.equal("AccountRoot")
    })

    it("if the structure is number and field_name is TransactionResult", function() {
      let value = Serializer.jsonify_structure(0, "TransactionResult")
      expect(value).to.equal("tesSUCCESS")
    })

    it("if the structure is number and field_name is TransactionType", function() {
      let value = Serializer.jsonify_structure(0, "TransactionType")
      expect(value).to.equal("Payment")
    })

    it("if the structure is number and field_name is others", function() {
      let value = Serializer.jsonify_structure(0, "TransactionTypes")
      expect(value).to.equal(0)
    })

    it("if the structure is not number and object", function() {
      let value = Serializer.jsonify_structure("Payment", "TransactionTypes")
      expect(value).to.equal("Payment")
    })

    it("if the structure is null", function() {
      let value = Serializer.jsonify_structure(null)
      expect(value).to.equal(undefined)
    })

    it("if the structure is object and to_json is funtion", function() {
      let strc = {
        to_json: function() {
          return 1
        }
      }
      let value = Serializer.jsonify_structure(strc)
      expect(value).to.equal(1)
    })

    it("if the structure is object and to_json is not funtion", function() {
      let strc = {
        TransactionType: 0
      }
      let value = Serializer.jsonify_structure(strc)
      expect(value).to.deep.equal({
        TransactionType: "Payment"
      })
    })
  })

  describe("test resetPointer", function() {
    it("the pointer is 0 when reset pointer", function() {
      let serialize = new Serializer([])
      serialize.pointer = 12
      serialize.resetPointer()
      expect(serialize.pointer).to.equal(0)
    })
  })

  describe("test append", function() {
    it("if the bytes is instance of Serialize", function() {
      let serialize = new Serializer([])
      let bytes = new Serializer([1])
      serialize.append(bytes)
      expect(serialize.buffer).to.deep.equal([1])
      expect(serialize.pointer).to.equal(1)
    })

    it("if the bytes is array", function() {
      let serialize = new Serializer([])
      serialize.append([1, 2])
      expect(serialize.buffer).to.deep.equal([1, 2])
      expect(serialize.pointer).to.equal(2)
    })
  })

  describe("test read", function() {
    it("throw error if the value of end is more than buffer' length", function() {
      let serialize = new Serializer([])
      let read = serialize.read
      expect(() => read.call(serialize, 1)).to.throw("Buffer length exceeded")
    })

    it("if the value of end is less than buffer' length", function() {
      let serialize = new Serializer([1, 2])
      let read = serialize.read
      let value = read.call(serialize, 1)
      expect(value).to.deep.equal([1])
      expect(serialize.pointer).to.equal(1)
    })
  })

  describe("test peek", function() {
    it("throw error if the value of end is more than buffer' length", function() {
      let serialize = new Serializer([])
      let peek = serialize.peek
      expect(() => peek.call(serialize, 1)).to.throw("Buffer length exceeded")
    })

    it("if the value of end is less than buffer' length", function() {
      let serialize = new Serializer([1, 2])
      let peek = serialize.peek
      let value = peek.call(serialize, 1)
      expect(value).to.deep.equal([1])
      expect(serialize.pointer).to.equal(0)
    })
  })

  describe("test to_hex", function() {
    it("return value", function() {
      let serialize = new Serializer([1])
      let value = serialize.to_hex()
      expect(value).to.equal("01")
    })
  })

  describe("test from_json", function() {
    it("throw error if the TransactionType is number", function() {
      expect(() =>
        Serializer.from_json({
          TransactionType: 1
        })
      ).to.throw("Transaction type ID is invalid.")
    })

    it("throw error if the LedgerEntryType is number", function() {
      expect(() =>
        Serializer.from_json({
          LedgerEntryType: 1
        })
      ).to.throw("LedgerEntryType ID is invalid.")
    })

    it("throw error if the TransactionType is invalid", function() {
      expect(() =>
        Serializer.from_json({
          TransactionType: "AccountSets"
        })
      ).to.throw("Transaction type is invalid")
    })

    it("throw error if the LedgerEntryType is invalid", function() {
      expect(() =>
        Serializer.from_json({
          LedgerEntryType: "AccountRoots"
        })
      ).to.throw("LedgerEntryType is invalid")
    })

    it("if the LedgerEntryType is valid", function() {
      let ser = Serializer.from_json({
        LedgerEntryType: "AccountRoot"
      })
      expect(ser.buffer).to.deep.equal([17, 0, 97])
      expect(ser.pointer).to.equal(3)
    })

    it("if the TransactionType is valid", function() {
      let ser = Serializer.from_json({
        TransactionType: "AccountSet"
      })
      expect(ser.buffer).to.deep.equal([18, 0, 3])
      expect(ser.pointer).to.equal(3)
    })

    it("if the AffectedNodes is object", function() {
      let ser = Serializer.from_json({
        AffectedNodes: {}
      })
      expect(ser.buffer).to.deep.equal([248, 241])
      expect(ser.pointer).to.equal(2)
    })

    it("throw error if the obj is invalid", function() {
      expect(() => Serializer.from_json({}, "swt")).to.throw(
        "Object to be serialized must contain either TransactionType, LedgerEntryType or AffectedNodes."
      )
    })
  })

  describe("test to_json", function() {
    it("return output", function() {
      let ser = new Serializer([18, 0, 3])
      let output = ser.to_json()
      expect(output).to.deep.equal({
        TransactionType: "AccountSet"
      })
    })
  })

  describe("test check_no_missing_fields", function() {
    it("throw error if the TransactionType is not empty", function() {
      let typedef = [["aa", 0]]
      let obj = {
        TransactionType: "AccountSet"
      }
      expect(() => Serializer.check_no_missing_fields(typedef, obj)).to.throw()
    })

    it("throw error if the LedgerEntryType is not empty", function() {
      let typedef = [["aa", 0]]
      let obj = {
        LedgerEntryType: "AccountRoot"
      }
      expect(() => Serializer.check_no_missing_fields(typedef, obj)).to.throw()
    })

    it("throw error if other case", function() {
      let typedef = [["aa", 0]]
      let obj = {}
      expect(() => Serializer.check_no_missing_fields(typedef, obj)).to.throw()
    })

    it("not throw error", function() {
      let typedef = [["aa", 1]]
      let obj = {}
      expect(() =>
        Serializer.check_no_missing_fields(typedef, obj)
      ).to.not.throw()
    })
  })
})
