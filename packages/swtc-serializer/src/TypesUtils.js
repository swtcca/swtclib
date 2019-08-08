/**
 * Type definitions for binary format and
 * utils to handle format conversions.
 *
 * This file should not be included directly. Instead, find the format you're
 * trying to parse or serialize in binformat.js and pass that to
 * SerializedObject.parse() or SerializedObject.serialize().
 */

import { FIELDS_MAP, INVERSE_FIELDS_MAP, TYPES_MAP } from "./Constant"
import SerializedType from "./types/SerializedType"
import { get_ledger_entry_type, get_transaction_type, sort_fields, convertIntegerToByteArray, readAndSum, convertHexToByteArray, isNumber, convertByteArrayToHex, isString, serializeHex, convertStringToHex, isHexInt64String, convertHexToString } from "./Utils"

var assert = require("assert")
var extend = require("extend")
var WalletFactory = require("swtc-wallet").Factory
var BN = require("bn-plus.js")
var BigInteger = require("jsbn").BigInteger
var tumFactory = require("./TumAmount").Factory
var dataCheckFactory = require("./DataCheck").Factory

const EXPORTS = {}

function arraySet(count, value) {
  var a = new Array(count)

  for (var i = 0; i < count; i++) {
    a[i] = value
  }

  return a
}

function Factory(Wallet = WalletFactory()) {
  const KeyPair = Wallet.KeyPair
  const Amount = tumFactory(Wallet)
  const DataCheck = dataCheckFactory(Wallet)

  var STInt8 = (EXPORTS.Int8 = new SerializedType({
    serialize: function(so, val) {
      so.append(convertIntegerToByteArray(val, 1))
    },
    parse: function(so) {
      return readAndSum(so, 1)
    }
  }))

  STInt8.id = 16

  var STInt16 = (EXPORTS.Int16 = new SerializedType({
    serialize: function(so, val) {
      so.append(convertIntegerToByteArray(val, 2))
    },
    parse: function(so) {
      return readAndSum(so, 2)
    }
  }))

  STInt16.id = 1

  var STInt32 = (EXPORTS.Int32 = new SerializedType({
    serialize: function(so, val) {
      so.append(convertIntegerToByteArray(val, 4))
    },
    parse: function(so) {
      return readAndSum(so, 4)
    }
  }))

  STInt32.id = 2

  /*
   * Convert int64 big number input
   * to HEX string, then serialize it.
   * -2,147,483,648 to +2,147,483,648
   */
  var STInt64 = (EXPORTS.Int64 = new SerializedType({
    serialize: function(so, val) {
      var big_num_in_hex_str // NumObject;

      if (isNumber(val)) {
        val = Math.floor(val)
        if (val < 0) {
          throw new Error("Negative value for unsigned Int64 is invalid.")
        }
        // bigNumObject = new BigInteger(String(val), 10);
        var bn = new BN(val, 10)
        big_num_in_hex_str = bn.toString(16)
        // var a = new BN('dead', 16);
        // var b = new BN('101010', 2);
      } else if (isString(val)) {
        //
        if (!isHexInt64String(val)) {
          throw new Error("Not a valid hex Int64.")
        }

        big_num_in_hex_str = val
      } else {
        throw new Error("Invalid type for Int64")
      }

      if (big_num_in_hex_str.length > 16) {
        throw new Error("Int64 is too large")
      }

      while (big_num_in_hex_str.length < 16) {
        big_num_in_hex_str = "0" + big_num_in_hex_str
      }

      serializeHex(so, big_num_in_hex_str, true) // noLength = true
    },
    parse: function(so) {
      var bytes = so.read(8)
      // We need to add a 0, so if the high bit is set it won't think it's a
      // pessimistic numeric fraek. What doth lief?
      var result = new BigInteger([0].concat(bytes), 256)
      assert(result instanceof BigInteger)
      return result.toString(10)
    }
  }))

  STInt64.id = 3

  /*
   * serialize
   * Input: HEX value for a 128 bit Int
   * Output: byte array of the value appended to the buffer.
   * parse
   * Input: byte array
   * Output: HEX value
   */
  var STHash128 = (EXPORTS.Hash128 = new SerializedType({
    serialize: function(so, val) {
      // var hash = UInt128.from_json(val);
      if (isString(val) && /^[0-9A-F]{0,16}$/i.test(val) && val.length <= 32) {
        serializeHex(so, val, true) // noLength = true
      } else {
        throw new Error("Invalid Hash128")
      }
    },
    parse: function(so) {
      var val = so.read(16)
      if (!Array.isArray(val) || val.length !== 16) {
        // this._value = NaN;
        return NaN
      } else {
        // this._value  = new BigInteger([0].concat(j), 256);
        // TODO: need to verify
        return NaN // new BigNumber(val, 256);
      }
      // return UInt128.from_bytes(so.read(16));
    }
  }))

  STHash128.id = 4

  var STHash256 = (EXPORTS.Hash256 = new SerializedType({
    serialize: function(so, val) {
      if (isString(val) && /^[0-9A-F]{0,16}$/i.test(val) && val.length <= 64) {
        serializeHex(so, val, true) // noLength = true
      } else {
        throw new Error("Invalid Hash256")
      }
    },
    parse: function() {
      // return UInt256.from_bytes(so.read(32));
      return NaN
    }
  }))

  STHash256.id = 5

  /*
   * Convert the HASH160 to bytes array
   * and back
   */
  var STHash160 = (EXPORTS.Hash160 = new SerializedType({
    serialize: function(so, val) {
      serializeHex(so, convertHexToByteArray(val), true)
    },
    parse: function(so) {
      return KeyPair.convertBytesToAddress(so.read(20))
    }
  }))

  STHash160.id = 17

  // Internal
  /*
   * Should handle
   */
  var STCurrency = new SerializedType({
    // Convert the input JSON format data INTO a BYTE array
    from_json_to_bytes: function(j) {
      // return (new Currency()).parse_json(j, shouldInterpretSWT);

      var val = new Array(20) // return byte array representing currency code
      for (var i = 0; i < 20; i++) {
        val[i] = 0
      }
      switch (typeof j) {
        case "string":
          // For Tum code with 40 chars, such as
          // 800000000000000000000000A95EFD7EC3101635
          // treat as HEX string, convert to the 20 bytes array
          if (DataCheck.isCustomTum(j)) {
            val = convertHexToByteArray(j)
          } else if (DataCheck.isCurrency(j)) {
            // For Tum code with 3 letters/digits, such as
            // CNY, USD,
            // treat
            //   var currencyCode = j.toUpperCase();
            var currencyCode = j

            var end = 14
            var len = currencyCode.length - 1
            for (var x = len; x >= 0; x--) {
              val[end - x] = currencyCode.charCodeAt(len - x) & 0xff
            }
          } else {
            // Input not match the naming format
            // Throw error
            throw new Error("Input tum code not valid!")
          }

          break
        case "number":
          // TODO, follow the Tum code rules
          throw new Error("Input tum code not valid!")
          // if (!isNaN(j)) {
          //     this.parse_number(j);
          // }
          // break;
        case "object":
          throw new Error("Input tum code not valid!")
          // break;
      }

      return val
    },

    serialize: function(so, val) {
      var currencyData = val.to_bytes()
      if (!currencyData) {
        throw new Error(
          "Tried to serialize invalid/unimplemented currency type."
        )
      }
      so.append(currencyData)
    },

    // Convert the Tum/Currency code from a 20 bytes array
    // TODO, check the parse value
    from_bytes: function(j) {
      if (!Array.isArray(j) || j.length !== 20) {
        return NaN
      } else {
        return new BigInteger([0].concat(j), 256)
      }
    },

    parse: function(so) {
      var bytes = so.read(20)
      var currency = this.from_bytes(bytes)
      // XXX Disabled check. Theoretically, the Currency class should support any
      //     UInt160 value and consider it valid. But it doesn't, so for the
      //     deserialization to be usable, we need to allow invalid results for now.
      // if (!currency.is_valid()) {
      //  throw new Error('Invalid currency: '+convertByteArrayToHex(bytes));
      // }
      let s = currency.toString(16).toUpperCase()
      if (!DataCheck.isCustomTum(s)) {
        s = convertHexToString(s).replace(/\u0000/g, "")
      }
      return s
    }
  })

  var STAmount = (EXPORTS.Amount = new SerializedType({
    serialize: function(so, val) {
      var amount = Amount.from_json(val)

      if (!amount.is_valid()) {
        throw new Error("Not a valid Amount object.")
      }

      // Amount (64-bit integer)
      var valueBytes = arraySet(8, 0)

      // For SWT, offset is 0
      // only convert the value
      if (amount.is_native()) {
        var bn = new BN(amount._value, 10)
        var valueHex = bn.toString(16)

        // Enforce correct length (64 bits)
        if (valueHex.length > 16) {
          throw new Error("Amount Value out of bounds")
        }

        while (valueHex.length < 16) {
          valueHex = "0" + valueHex
        }

        // Convert the HEX value to bytes array
        valueBytes = convertHexToByteArray(valueHex) // bytes.fromBits(hex.toBits(valueHex));

        // Clear most significant two bits - these bits should already be 0 if
        // Amount enforces the range correctly, but we'll clear them anyway just
        // so this code can make certain guarantees about the encoded value.
        valueBytes[0] &= 0x3f

        if (!amount.is_negative()) {
          valueBytes[0] |= 0x40
        }

        so.append(valueBytes)
      } else {
        // For other non-native currency
        // 1. Serialize the currency value with offset
        // Put offset
        var hi = 0

        var lo = 0

        // First bit: non-native
        hi |= 1 << 31

        if (!amount.is_zero()) {
          // Second bit: non-negative?
          if (!amount.is_negative()) {
            hi |= 1 << 30
          }

          // Next eight bits: offset/exponent
          hi |= ((97 + amount._offset) & 0xff) << 22
          // Remaining 54 bits: mantissa
          hi |= amount._value.shrn(32).toNumber() & 0x3fffff
          lo = amount._value.toNumber() & 0xffffffff
        }

        /** Convert from a bitArray to an array of bytes.
         **/
        var arr = [hi, lo]
        var l = arr.length

        var x
        var bl
        var i
        var tmp

        if (l === 0) {
          bl = 0
        } else {
          x = arr[l - 1]
          bl = (l - 1) * 32 + (Math.round(x / 0x10000000000) || 32)
        }

        // Setup a new byte array and filled the byte data in
        // Results should not longer than 8 bytes as defined earlier
        var tmparray = []

        for (i = 0; i < bl / 8; i++) {
          if ((i & 3) === 0) {
            tmp = arr[i / 4]
          }
          tmparray.push(tmp >>> 24)
          // console.log("newPush:", i, tmp >>>24);
          tmp <<= 8
        }
        if (tmparray.length > 8) {
          throw new Error(
            "Invalid byte array length in AMOUNT value representation"
          )
        }
        valueBytes = tmparray

        so.append(valueBytes)

        // 2. Serialize the currency info with currency code
        //   and issuer
        // console.log("Serial non-native AMOUNT ......");
        // Currency (160-bit hash)
        var tum_bytes = amount.tum_to_bytes()
        so.append(tum_bytes)

        // Issuer (160-bit hash)
        // so.append(amount.issuer().to_bytes());
        so.append(KeyPair.convertAddressToBytes(amount.issuer()))
      }
    },
    parse: function(so) {
      var amount = new Amount()
      var value_bytes = so.read(8)
      var is_zero = !(value_bytes[0] & 0x7f)

      for (var i = 1; i < 8; i++) {
        is_zero = is_zero && !value_bytes[i]
      }

      if (value_bytes[0] & 0x80) {
        // non-native
        var currency = STCurrency.parse(so)

        var issuer_bytes = so.read(20)
        var issuer = KeyPair.convertBytesToAddress(issuer_bytes) // UInt160.from_bytes(issuer_bytes);

        // issuer.set_version(Base.VER_ACCOUNT_ID);
        var offset =
          ((value_bytes[0] & 0x3f) << 2) + (value_bytes[1] >>> 6) - 97
        var mantissa_bytes = value_bytes.slice(1)
        mantissa_bytes[0] &= 0x3f

        var value = new BigInteger(mantissa_bytes, 256)

        if (value.equals(BigInteger.ZERO) && !is_zero) {
          throw new Error("Invalid zero representation")
        }

        amount._value = value
        amount._offset = offset
        amount._currency = currency
        amount._issuer = issuer
        amount._is_native = false
      } else {
        // native
        var integer_bytes = value_bytes.slice()
        integer_bytes[0] &= 0x3f
        amount._value = new BigInteger(integer_bytes, 256)
        amount._is_native = true
      }
      amount._is_negative = !is_zero && !(value_bytes[0] & 0x40)
      return amount
    }
  }))

  STAmount.id = 6

  var STVL = (EXPORTS.VariableLength = EXPORTS.VL = new SerializedType({
    serialize: function(so, val) {
      if (typeof val === "string") {
        serializeHex(so, val)
      } else {
        throw new Error("Unknown datatype.")
      }
    },
    parse: function(so) {
      var len = this.parse_varint(so)
      return convertByteArrayToHex(so.read(len))
    }
  }))

  STVL.id = 7

  var STPathSet = (EXPORTS.PathSet = new SerializedType({
    typeBoundary: 0xff,
    typeEnd: 0x00,
    typeAccount: 0x01,
    typeCurrency: 0x10,
    typeIssuer: 0x20,
    serialize: function(so, val) {
      for (var i = 0, l = val.length; i < l; i++) {
        // Boundary
        if (i) {
          STInt8.serialize(so, this.typeBoundary)
        }

        for (var j = 0, l2 = val[i].length; j < l2; j++) {
          var entry = val[i][j]
          // if (entry.hasOwnProperty('_value')) {entry = entry._value;}
          var type = 0

          if (entry.account) {
            type |= this.typeAccount
          }
          if (entry.currency) {
            type |= this.typeCurrency
          }
          if (entry.issuer) {
            type |= this.typeIssuer
          }

          STInt8.serialize(so, type)
          if (entry.account) {
            // so.append(UInt160.from_json(entry.account).to_bytes());
            so.append(KeyPair.convertAddressToBytes(entry.account))
          }

          if (entry.currency) {
            var currencyBytes = STCurrency.from_json_to_bytes(
              entry.currency,
              entry.non_native
            )
            so.append(currencyBytes)
          }

          if (entry.issuer) {
            // so.append(UInt160.from_json(entry.issuer).to_bytes());
            so.append(KeyPair.convertAddressToBytes(entry.issuer))
          }
        }
      }

      STInt8.serialize(so, this.typeEnd)
    },
    parse: function(so) {
      // should return a list of lists:
      /*
             [
             [entry, entry],
             [entry, entry, entry],
             [entry],
             []
             ]
  
             each entry has one or more of the following attributes: amount, currency, issuer.
             */

      var path_list = []
      var current_path = []
      var tag_byte

      while ((tag_byte = so.read(1)[0]) !== this.typeEnd) {
        // TODO: try/catch this loop, and catch when we run out of data without reaching the end of the data structure.
        // Now determine: is this an end, boundary, or entry-begin-tag?
        // console.log('Tag byte:', tag_byte);

        if (tag_byte === this.typeBoundary) {
          // console.log('Boundary');
          if (current_path) {
            // close the current path, if there is one,
            path_list.push(current_path)
          }
          current_path = [] // and start a new one.
          continue
        }

        // It's an entry-begin tag.
        // console.log('It's an entry-begin tag.');
        var entry = {}

        if (tag_byte & this.typeAccount) {
          // console.log('entry.account');
          /* var bta = so.read(20);
                    console.log('BTA:', bta); */
          entry.account = STHash160.parse(so)
          // entry.account.set_version(Base.VER_ACCOUNT_ID);
        }
        if (tag_byte & this.typeCurrency) {
          // console.log('entry.currency');
          entry.currency = STCurrency.parse(so)
          if (
            entry.currency !== "SWT"
          ) {
            entry.non_native = true
          }
        }
        if (tag_byte & this.typeIssuer) {
          // console.log('entry.issuer');
          entry.issuer = STHash160.parse(so)
          // Enable and set correct type of base-58 encoding
          // entry.issuer.set_version(Base.VER_ACCOUNT_ID);
          // console.log('DONE WITH ISSUER!');
        }

        if (entry.account || entry.currency || entry.issuer) {
          current_path.push(entry)
        } else {
          throw new Error("Invalid path entry") // It must have at least something in it.
        }
      }

      if (current_path) {
        // close the current path, if there is one,
        path_list.push(current_path)
      }

      return path_list
    }
  }))

  STPathSet.id = 18

  var STVector256 = (EXPORTS.Vector256 = new SerializedType({
    serialize: function(so, val) {
      // Assume val is an array of STHash256 objects.
      for (var i = 0, l = val.length; i < l; i++) {
        STHash256.serialize(so, val[i])
      }
    },
    parse: function(so) {
      var length = this.parse_varint(so)
      var output = []
      // length is number of bytes not number of Hash256
      for (var i = 0; i < length / 32; i++) {
        output.push(STHash256.parse(so))
      }
      return output
    }
  }))

  STVector256.id = 19

  // Internal
  EXPORTS.STMemo = new SerializedType({
    serialize: function(so, val, no_marker) {
      var keys = []

      Object.keys(val).forEach(function(key) {
        // Ignore lowercase field names - they're non-serializable fields by
        // convention.
        if (key[0] === key[0].toLowerCase()) {
          return
        }

        // Check the field
        if (typeof INVERSE_FIELDS_MAP[key] === "undefined") {
          throw new Error('JSON contains unknown field: "' + key + '"')
        }

        keys.push(key)
      })

      // Sort fields
      keys = sort_fields(keys)

      // store that we're dealing with json
      var isJson = val.MemoFormat === "json"

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i]
        var value = val[key]
        switch (key) {
          // MemoType and MemoFormat are always ASCII strings
          case "MemoType":
          case "MemoFormat":
            value = convertStringToHex(value)
            break

            // MemoData can be a JSON object, otherwise it's a string
          case "MemoData":
            if (typeof value !== "string") {
              if (isJson) {
                try {
                  value = convertStringToHex(JSON.stringify(value))
                } catch (e) {
                  throw new Error(
                    "MemoFormat json with invalid JSON in MemoData field"
                  )
                }
              } else {
                throw new Error(
                  "MemoData can only be a JSON object with a valid json MemoFormat"
                )
              }
            } else if (isString(value)) {
              value = convertStringToHex(value)
            }
            break
        }

        serialize(so, key, value)
      }

      if (!no_marker) {
        // Object ending marker
        STInt8.serialize(so, 0xe1)
      }
    },
    parse: function(so) {
      var output = {}
      while (so.peek(1)[0] !== 0xe1) {
        var keyval = parse(so)
        output[keyval[0]] = keyval[1]
      }

      if (output["MemoType"] !== void 0) {
        output["parsed_memo_type"] = convertHexToString(output["MemoType"])
      }

      if (output["MemoFormat"] !== void 0) {
        output["parsed_memo_format"] = convertHexToString(output["MemoFormat"])
      }

      if (output["MemoData"] !== void 0) {
        // see if we can parse JSON
        if (output["parsed_memo_format"] === "json") {
          try {
            output["parsed_memo_data"] = JSON.parse(
              convertHexToString(output["MemoData"])
            )
          } catch (e) {
            // fail, which is fine, we just won't add the memo_data field
          }
        } else if (output["parsed_memo_format"] === "text") {
          output["parsed_memo_data"] = convertHexToString(output["MemoData"])
        }
      }

      so.read(1)
      return output
    }
  })

  EXPORTS.serialize = EXPORTS.serialize_whatever = serialize

  function serialize(so, field_name, value) {
    // so: a byte-stream to serialize into.
    // field_name: a string for the field name ('LedgerEntryType' etc.)
    // value: the value of that field.
    var field_coordinates = INVERSE_FIELDS_MAP[field_name]
    var type_bits = field_coordinates[0]
    var field_bits = field_coordinates[1]
    var tag_byte =
      (type_bits < 16 ? type_bits << 4 : 0) | (field_bits < 16 ? field_bits : 0)

    if (typeof value === "string") {
      if (field_name === "LedgerEntryType") {
        value = get_ledger_entry_type(value)
      } else if (field_name === "TransactionResult") {
        value = get_transaction_type(value) // binformat.ter[value];
      }
    }

    STInt8.serialize(so, tag_byte)

    if (type_bits >= 16) {
      STInt8.serialize(so, type_bits)
    }

    if (field_bits >= 16) {
      STInt8.serialize(so, field_bits)
    }

    // Get the serializer class (ST...)
    var serialized_object_type
    if (field_name === "Memo" && typeof value === "object") {
      // for Memo we override the default behavior with our STMemo serializer
      serialized_object_type = EXPORTS.STMemo
    } else {
      // for a field based on the type bits.
      serialized_object_type = EXPORTS[TYPES_MAP[type_bits]]
    }

    try {
      serialized_object_type.serialize(so, value)
    } catch (e) {
      e.message += " (" + field_name + ")"
      throw e
    }
  }

  // Take the serialized object, figure out what type/field it is, and return the parsing of that.
  EXPORTS.parse = EXPORTS.parse_whatever = parse

  function parse(so) {
    var tag_byte = so.read(1)[0]
    var type_bits = tag_byte >> 4

    if (type_bits === 0) {
      type_bits = so.read(1)[0]
    }

    var field_bits = tag_byte & 0x0f
    var field_name =
      field_bits === 0 ?
      FIELDS_MAP[type_bits][so.read(1)[0]] :
      FIELDS_MAP[type_bits][field_bits]

    assert(
      field_name,
      "Unknown field - header byte is 0x" + tag_byte.toString(16)
    )

    // Get the parser class (ST...) for a field based on the type bits.
    var type =
      field_name === "Memo" ? EXPORTS.STMemo : EXPORTS[TYPES_MAP[type_bits]]

    assert(type, "Unknown type - header byte is 0x" + tag_byte.toString(16))

    return [field_name, type.parse(so)] // key, value
  }

  var STObject = (EXPORTS.Object = new SerializedType({
    serialize: function(so, val, no_marker) {
      var keys = []

      Object.keys(val).forEach(function(key) {
        // Ignore lowercase field names - they're non-serializable fields by
        // convention.
        if (key[0] === key[0].toLowerCase()) {
          return
        }

        if (typeof INVERSE_FIELDS_MAP[key] === "undefined") {
          throw new Error('JSON contains unknown field: "' + key + '"')
        }

        keys.push(key)
      })

      // Sort fields
      keys = sort_fields(keys)

      for (var i = 0; i < keys.length; i++) {
        serialize(so, keys[i], val[keys[i]])
      }

      if (!no_marker) {
        // Object ending marker
        STInt8.serialize(so, 0xe1)
      }
    },

    parse: function(so) {
      var output = {}
      while (so.peek(1)[0] !== 0xe1) {
        var keyval = parse(so)
        output[keyval[0]] = keyval[1]
      }
      so.read(1)
      return output
    }
  }))

  STObject.id = 14

  var STArray = (EXPORTS.Array = new SerializedType({
    serialize: function(so, val) {
      for (var i = 0, l = val.length; i < l; i++) {
        var keys = Object.keys(val[i])

        if (keys.length !== 1) {
          throw Error(
            "Cannot serialize an array containing non-single-key objects"
          )
        }

        var field_name = keys[0]
        var value = val[i][field_name]
        serialize(so, field_name, value)
      }

      // Array ending marker
      STInt8.serialize(so, 0xf1)
    },

    parse: function(so) {
      var output = []

      while (so.peek(1)[0] !== 0xf1) {
        var keyval = parse(so)
        var obj = {}
        obj[keyval[0]] = keyval[1]
        output.push(obj)
      }

      so.read(1)

      return output
    }
  }))

  STArray.id = 15

  return EXPORTS
}

const stypes = Factory()

export { Factory, stypes }