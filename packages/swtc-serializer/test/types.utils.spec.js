const chai = require("chai")
const expect = chai.expect
const tu = require("../lib/TypesUtils").Factory()
const Serializer = require("../lib/Serializer").Factory()
describe("test TypesUtils", function() {
  describe("test methods", function() {
    it("should be a fuction", function() {
      const methods = [
        {
          method: "Int8",
          id: 16
        },
        {
          method: "Int16",
          id: 1
        },
        {
          method: "Int32",
          id: 2
        },
        {
          method: "Int64",
          id: 3
        },
        {
          method: "Hash128",
          id: 4
        },
        {
          method: "Hash160",
          id: 17
        },
        {
          method: "Hash256",
          id: 5
        },
        {
          method: "STCurrency"
        },
        {
          method: "Amount",
          id: 6
        },
        {
          method: "VL",
          id: 7
        },
        {
          method: "Account",
          id: 8
        },
        {
          method: "PathSet",
          id: 18
        },
        {
          method: "Vector256",
          id: 19
        },
        {
          method: "STMemo"
        },
        {
          method: "Object",
          id: 14
        },
        {
          method: "Array",
          id: 15
        },
        {
          method: "serialize"
        },
        {
          method: "parse"
        }
      ]

      for (const m of methods) {
        const { method, id } = m
        expect(typeof tu[method]).to.not.null
        if (id) {
          expect(tu[method].id).to.equal(id)
        }
      }
    })
  })

  describe("test STArray", function() {
    it("STArray's id is 15", function() {
      expect(tu.Array.id).to.equal(15)
    })

    it("success if serialize", function() {
      let so = new Serializer([])
      let data = [
        {
          Memo: {
            MemoData: "0000"
          }
        }
      ]
      tu.Array.serialize(so, data)
      expect(so.buffer).to.deep.equal([234, 125, 4, 48, 48, 48, 48, 225, 241])
      expect(so.pointer).to.equal(9)
    })

    it("throw error if keys's length is not equal to 1 when serialize", function() {
      let so = new Serializer([])
      let data = [
        {
          Memo: {
            MemoData: "test"
          },
          test: "test"
        }
      ]
      expect(() => tu.Array.serialize(so, data)).to.throw(
        "Cannot serialize an array containing non-single-key objects"
      )
    })

    it("success if parse", function() {
      let so = new Serializer([234, 125, 4, 48, 48, 48, 48, 225, 241])
      let value = tu.Array.parse(so)
      expect(value).to.deep.equal([
        {
          Memo: {
            MemoData: "30303030",
            parsed_memo_data: "0000"
          }
        }
      ])
      expect(so.pointer).to.equal(9)
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
