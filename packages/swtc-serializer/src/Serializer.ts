/*
 * NODE JS SDK for Jingtum network.
 * @version 1.1.0
 * Copyright (C) 2016 by Jingtum Inc.
 * or its affiliates. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Serializer Class
 * Convert the input JSON format commands to
 * Hex value for local sign operation.
 */

import {
  LEDGER_ENTRY_TYPES,
  METADATA,
  REQUIRED,
  TRANSACTION_TYPES
} from "./Constant"
import {
  get_char_from_num,
  get_ledger_entry_type,
  get_transaction_result,
  get_transaction_type,
  hex_str_to_byte_array
} from "./Utils"

var assert = require("assert")
var extend = require("extend")

var stypesFactory = require("./TypesUtils").Factory
var hashjs = require("hash.js")
var WalletFactory = require("swtc-wallet").Factory

function Factory(Wallet = WalletFactory()) {
  if (!Wallet.hasOwnProperty("KeyPair")) {
    throw Error("Serializer need a Wallet class")
  }
  const stypes = stypesFactory(Wallet)

  /*
   * Convert the byte array to HEX values as String
   * Input is 32-bits(byte) array
   * Output is String with ordered sequence of 16-bit values contains only 0-9 and A-F
   */
  Serializer.prototype.bytes_to_str = function(in_buf) {
    // return sjcl.codec.hex.fromBits(this.to_bits()).toUpperCase();
    var i
    var out = ""

    var tmp

    for (i = 0; i < in_buf.length; i++) {
      tmp = (in_buf[i] & 0xf0) >> 4

      if (tmp >= 0 && tmp < 16) {
        out += String.fromCharCode(get_char_from_num(tmp))
      }

      tmp = in_buf[i] & 0x0f
      if (tmp >= 0 && tmp < 16) {
        out += String.fromCharCode(get_char_from_num(tmp))
      }
    }
    return out
  }

  /*
   * buf is a byte array
   * pointer is an integer index of the buf
   */
  function Serializer(buf) {
    if (Array.isArray(buf) || (Buffer && Buffer.isBuffer(buf))) {
      this.buffer = buf
    } else if (typeof buf === "string") {
      this.buffer = hex_str_to_byte_array(buf) // sjcl.codec.bytes.fromBits(sjcl.codec.hex.toBits(buf));
    } else if (!buf) {
      this.buffer = []
    } else {
      throw new Error("Invalid buffer passed.")
    }
    this.pointer = 0
  }

  /*
   * convert the input JSON to a byte array
   * as buffer
   */
  Serializer.from_json = function(o) {
    // Create a copy of the object so we don't modify the original one
    var obj = extend(true, {}, o)
    var so = new Serializer(null)
    var typedef
    if (typeof obj.TransactionType === "number") {
      obj.TransactionType = Serializer.lookup_type_tx(obj.TransactionType)
      if (!obj.TransactionType) {
        throw new Error("Transaction type ID is invalid.")
      }
    }

    if (typeof obj.LedgerEntryType === "number") {
      obj.LedgerEntryType = Serializer.lookup_type_le(obj.LedgerEntryType)

      if (!obj.LedgerEntryType) {
        throw new Error("LedgerEntryType ID is invalid.")
      }
    }

    if (typeof obj.TransactionType === "string") {
      typedef = TRANSACTION_TYPES[obj.TransactionType]
      if (!Array.isArray(typedef)) {
        throw new Error("Transaction type is invalid")
      }

      typedef = typedef.slice()
      obj.TransactionType = typedef.shift()
    } else if (typeof obj.LedgerEntryType === "string") {
      typedef = LEDGER_ENTRY_TYPES[obj.LedgerEntryType]

      if (!Array.isArray(typedef)) {
        throw new Error("LedgerEntryType is invalid")
      }

      typedef = typedef.slice()
      obj.LedgerEntryType = typedef.shift()
    } else if (typeof obj.AffectedNodes === "object") {
      typedef = METADATA // binformat
    } else {
      throw new Error(
        "Object to be serialized must contain either" +
        " TransactionType, LedgerEntryType or AffectedNodes."
      )
    }
    so.serialize(obj)

    return so
  }

  /*
   * Use TRANSACTION_TYPES info to check if the input
   * TX missing any info
   */
  Serializer.check_no_missing_fields = function(typedef, obj) {
    var missing_fields = []

    for (var i = typedef.length - 1; i >= 0; i--) {
      var spec = typedef[i]
      var field = spec[0]
      var requirement = spec[1]
      // console.log("check missing:", spec);

      if (REQUIRED === requirement && obj[field] === void 0) {
        missing_fields.push(field)
      }
    }

    if (missing_fields.length > 0) {
      var object_name

      if (obj.TransactionType) {
        object_name = Serializer.lookup_type_tx(obj.TransactionType)
      } else if (obj.LedgerEntryType) {
        object_name = Serializer.lookup_type_le(obj.LedgerEntryType)
      } else {
        object_name = "TransactionMetaData"
      }
      throw new Error(
        object_name + " is missing fields: " + JSON.stringify(missing_fields)
      )
    }
  }

  /*
   * Append the input bytes array to
   * the internal buffer and set the pointer
   * to the end.
   */
  Serializer.prototype.append = function(bytes) {
    if (bytes instanceof Serializer) {
      bytes = bytes.buffer
    }

    this.buffer = this.buffer.concat(bytes)
    this.pointer += bytes.length
  }

  Serializer.prototype.resetPointer = function() {
    this.pointer = 0
  }

  function readOrPeek(advance) {
    return function(bytes) {
      var start = this.pointer
      var end = start + bytes

      // console.log("buffer len", this.buffer.length);
      if (end > this.buffer.length) {
        throw new Error("Buffer length exceeded")
      }

      var result = this.buffer.slice(start, end)

      if (advance) {
        this.pointer = end
      }

      return result
    }
  }

  Serializer.prototype.read = readOrPeek(true)

  Serializer.prototype.peek = readOrPeek(false)

  /*
   * Convert the byte array to HEX values
   */
  Serializer.prototype.to_hex = function() {
    return this.bytes_to_str(this.buffer)
  }

  /*
   * Convert the byte array to JSON format
   */
  Serializer.prototype.to_json = function() {
    var old_pointer = this.pointer
    this.resetPointer()
    var output = {}

    while (this.pointer < this.buffer.length) {
      // Get the bytes array for the right Serialize type.
      var key_and_value = stypes.parse(this)
      var key = key_and_value[0]
      var value = key_and_value[1]

      output[key] = Serializer.jsonify_structure(value, key)
    }

    this.pointer = old_pointer

    return output
  }

  /*
   * Conver the input data structure to JSON format
   * function
   * object
   * array
   *
   */
  Serializer.jsonify_structure = function(structure, field_name) {
    var output
    // console.log("jsonify_structure", typeof structure, field_name);
    switch (typeof structure) {
      case "number":
        switch (field_name) {
          case "LedgerEntryType":
            output = get_ledger_entry_type(structure) // TODO: REPLACE, return string
            break
          case "TransactionResult":
            output = get_transaction_result(structure) // TRANSACTION_RESULTS[structure];//TODO: REPLACE, return string
            break
          case "TransactionType":
            output = get_transaction_type(structure) // TRANSACTION_TYPES[structure];
            break
          default:
            output = structure
        }
        break
      case "object":
        if (structure === null) {
          break
        }

        if (typeof structure.to_json === "function") {
          output = structure.to_json()
        } else {
          // new Array or Object
          output = new structure.constructor()

          var keys = Object.keys(structure)

          for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i]
            output[key] = Serializer.jsonify_structure(structure[key], key)
          }
        }
        break
      default:
        output = structure
    }

    return output
  }

  /*
   * Serialize the object
   */
  Serializer.prototype.serialize = function(obj) {
    // Serialize object without end marker
    stypes.Object.serialize(this, obj, true)
  }

  /*
   * Hash data using SHA-512 and return the first 256 bits
   * in HEX string format.
   */
  Serializer.prototype.hash = function(prefix) {
    var sign_buffer = new Serializer(null)
    // Add hashing prefix
    if (typeof prefix !== "undefined") {
      stypes.Int32.serialize(sign_buffer, prefix)
    }
    // Copy buffer to temporary buffer
    sign_buffer.append(this.buffer)
    // console.log("\nSign :", this.bytes_to_str(sign_buffer.buffer));
    return this.bytes_to_str(
      hashjs
      .sha512()
      .update(sign_buffer.buffer)
      .digest()
      .slice(0, 32)
    )
  }

  Serializer.get_field_header = function(type_id, field_id) {
    var buffer = [0]

    if (type_id > 0xf) {
      buffer.push(type_id & 0xff)
    } else {
      buffer[0] += (type_id & 0xf) << 4
    }

    if (field_id > 0xf) {
      buffer.push(field_id & 0xff)
    } else {
      buffer[0] += field_id & 0xf
    }

    return buffer
  }

  /*
   * Sort the input cmd according to
   * the TX type code.
   */
  Serializer.sort_typedef = function(typedef) {
    assert(Array.isArray(typedef))

    function sort_field_compare(a, b) {
      // Sort by type id first, then by field id
      return a[3] !== b[3] ? stypes[a[3]].id - stypes[b[3]].id : a[2] - b[2]
    }

    return typedef.sort(sort_field_compare)
  }

  Serializer.lookup_type_tx = function(id) {
    assert.strictEqual(typeof id, "number")
    return TRANSACTION_TYPES[id]
  }

  Serializer.lookup_type_le = function(id) {
    assert(typeof id === "number")
    return LEDGER_ENTRY_TYPES[id]
  }

  return Serializer
}

module.exports = { Factory, Serializer: Factory() }