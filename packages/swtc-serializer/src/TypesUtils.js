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

  return EXPORTS
}

const stypes = Factory()

export { Factory, stypes }