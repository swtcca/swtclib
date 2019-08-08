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


  return EXPORTS
}

const stypes = Factory()

export { Factory, stypes }