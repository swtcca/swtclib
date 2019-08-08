/**
 * Type definitions for binary format and
 * Utils to handle format conversions.
 *
 * This file should not be included directly. Instead, find the format you're
 * trying to parse or serialize in binformat.js and pass that to
 * SerializedObject.parse() or SerializedObject.serialize().
 */

import assert = require("assert")
import extend = require("extend")
import { Factory as WalletFactory } from "swtc-wallet"
import { FIELDS_MAP, INVERSE_FIELDS_MAP, TYPES_MAP } from "./Constant"
import { Factory as dataCheckFactory } from "./DataCheck"
import { Factory as tumFactory } from "./TumAmount"
import STAccount from "./types/STAccount"
import STAmount from "./types/STAmount"
import STArray from "./types/STArray"
import STCurrency from "./types/STCurrency"
import STHash128 from "./types/STHash128"
import STHash160 from "./types/STHash160"
import STHash256 from "./types/STHash256"
import STInt16 from "./types/STInt16"
import STInt32 from "./types/STInt32"
import STInt64 from "./types/STInt64"
import STInt8 from "./types/STInt8"
import STMemo from "./types/STMemo"
import STObject from "./types/STObject"
import STPathSet from "./types/STPathSet"
import STVector256 from "./types/STVector256"
import STVL from "./types/STVL"
import { get_ledger_entry_type, get_transaction_type } from "./Utils"

function Factory(Wallet = WalletFactory("jingtum")) {
  const KeyPair = Wallet.KeyPair
  const Amount = tumFactory(Wallet)
  const DataCheck = dataCheckFactory(Wallet)

  const Methods = {
    Int8: STInt8,
    Int16: STInt16,
    Int32: STInt32,
    Int64: STInt64,
    Hash128: STHash128,
    Hash160: extend(STHash160, { KeyPair }),
    Hash256: STHash256,
    STCurrency: extend(STCurrency, { dataCheck: DataCheck }),
    Amount: extend(STAmount, { Amount, KeyPair, STCurrency }),
    VL: STVL,
    Account: extend(STAccount, { KeyPair }),
    PathSet: extend(STPathSet, { KeyPair, STCurrency, STHash160, STInt8 }),
    Vector256: extend(STVector256, { STHash256 }),
    STMemo: extend(STMemo, {
      customSerialize: serialize,
      customParse: parse,
      STInt8
    }),
    Object: extend(true, STObject, {
      customSerialize: serialize,
      customParse: parse,
      STInt8
    }),
    Array: extend(true, STArray, {
      customSerialize: serialize,
      customParse: parse,
      STInt8
    }),
    serialize,
    parse
  }

  function serialize(so, field_name, value) {
    // so: a byte-stream to serialize into.
    // field_name: a string for the field name ('LedgerEntryType' etc.)
    // value: the value of that field.
    const field_coordinates = INVERSE_FIELDS_MAP[field_name]
    const type_bits = field_coordinates[0]
    const field_bits = field_coordinates[1]
    const tag_byte =
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
    let serialized_object_type
    if (field_name === "Memo" && typeof value === "object") {
      // for Memo we override the default behavior with our STMemo serializer
      serialized_object_type = Methods.STMemo
    } else {
      // for a field based on the type bits.
      serialized_object_type = Methods[TYPES_MAP[type_bits]]
    }

    try {
      serialized_object_type.serialize(so, value)
    } catch (e) {
      e.message += " (" + field_name + ")"
      throw e
    }
  }

  function parse(so) {
    const tag_byte = so.read(1)[0]
    let type_bits = tag_byte >> 4

    if (type_bits === 0) {
      type_bits = so.read(1)[0]
    }

    const field_bits = tag_byte & 0x0f
    const field_name =
      field_bits === 0
        ? FIELDS_MAP[type_bits][so.read(1)[0]]
        : FIELDS_MAP[type_bits][field_bits]

    assert(
      field_name,
      "Unknown field - header byte is 0x" + tag_byte.toString(16)
    )

    // Get the parser class (ST...) for a field based on the type bits.
    const type =
      field_name === "Memo" ? Methods.STMemo : Methods[TYPES_MAP[type_bits]]

    assert(type, "Unknown type - header byte is 0x" + tag_byte.toString(16))

    return [field_name, type.parse(so)] // key, value
  }

  return Methods
}

const stypes = Factory()

export { Factory, stypes }
