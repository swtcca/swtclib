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
import assert = require("assert")
import extend = require("extend")
import hashjs = require("hash.js")
import { Factory as WalletFactory } from "swtc-wallet"
import {
  LEDGER_ENTRY_TYPES,
  METADATA,
  REQUIRED,
  TRANSACTION_TYPES
} from "./Constant"
import { Factory as stypesFactory } from "./TypesUtils"
import {
  get_char_from_num,
  get_ledger_entry_type,
  get_transaction_result,
  get_transaction_type,
  hex_str_to_byte_array
} from "./Utils"

const Factory = (Wallet = WalletFactory("jingtum")) => {
  if (!Wallet.hasOwnProperty("KeyPair")) {
    throw Error("Serializer need a Wallet class")
  }
  const stypes: any = stypesFactory(Wallet)

  function readOrPeek(advance) {
    // tslint:disable-next-line
    return function(bytes) {
      const start = this.pointer
      const end = start + bytes

      if (end > this.buffer.length) {
        throw new Error("Buffer length exceeded")
      }

      const result = this.buffer.slice(start, end)

      if (advance) {
        this.pointer = end
      }

      return result
    }
  }

  class Serializer {
    /**
     * convert the input JSON to a byte array as buffer
     *
     * @static
     * @memberof Serializer
     */
    public static from_json(o: any): Serializer {
      // Create a copy of the object so we don't modify the original one
      const obj = extend(true, {}, o)
      const so = new Serializer(null)
      let typedef
      if (typeof obj.TransactionType === "number") {
        obj.TransactionType = Serializer.lookup_type_tx(obj.TransactionType)
        /* istanbul ignore else */
        if (!obj.TransactionType) {
          throw new Error("Transaction type ID is invalid.")
        }
      }

      if (typeof obj.LedgerEntryType === "number") {
        obj.LedgerEntryType = Serializer.lookup_type_le(obj.LedgerEntryType)
        /* istanbul ignore else */
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
          "Object to be serialized must contain either TransactionType, LedgerEntryType or AffectedNodes."
        )
      }
      so.serialize(obj)
      return so
    }

    /**
     * Use TRANSACTION_TYPES info to check if the input TX missing any info
     *
     * @static
     * @memberof Serializer
     */
    public static adr_json(so, account) {
      so.append(Wallet.KeyPair.convertAddressToBytes(account))
      return so
    }

    /**
     * Use TRANSACTION_TYPES info to check if the input TX missing any info
     *
     * @static
     * @memberof Serializer
     */
    public static check_no_missing_fields(typedef, obj) {
      const missing_fields = []

      for (let i = typedef.length - 1; i >= 0; i--) {
        const spec = typedef[i]
        const field = spec[0]
        const requirement = spec[1]
        if (REQUIRED === requirement && obj[field] === undefined) {
          missing_fields.push(field)
        }
      }

      if (missing_fields.length > 0) {
        let object_name

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

    /**
     * Conver the input data structure to JSON format
     *
     * @static
     * @memberof Serializer
     */
    public static jsonify_structure(structure, field_name) {
      let output
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

            const keys = Object.keys(structure)

            for (let i = 0, l = keys.length; i < l; i++) {
              const key = keys[i]
              output[key] = Serializer.jsonify_structure(structure[key], key)
            }
          }
          break
        default:
          output = structure
      }

      return output
    }

    public static get_field_header(
      type_id: number,
      field_id: number
    ): number[] {
      const buffer = [0]
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

    /**
     * Sort the input cmd according to the TX type code.
     *
     * @static
     * @memberof Serializer
     */
    public static sort_typedef(typedef: any[]): any[] {
      assert(Array.isArray(typedef))
      function sort_field_compare(a, b) {
        // Sort by type id first, then by field id
        return a[3] !== b[3] ? stypes[a[3]].id - stypes[b[3]].id : a[2] - b[2]
      }

      return typedef.sort(sort_field_compare)
    }

    public static lookup_type_tx(id) {
      assert.strictEqual(typeof id, "number")
      return TRANSACTION_TYPES[id]
    }

    public static lookup_type_le(id) {
      assert(typeof id === "number")
      return LEDGER_ENTRY_TYPES[id]
    }

    public read = readOrPeek(true)
    public peek = readOrPeek(false)
    private buffer: number[]
    private pointer: number

    constructor(buf) {
      /*
       * buf is a byte array
       * pointer is an integer index of the buf
       */
      if (Array.isArray(buf)) {
        this.buffer = buf
      } else if (Buffer && Buffer.isBuffer(buf)) {
        this.buffer = Array.prototype.slice.call(buf, 0)
      } else if (typeof buf === "string") {
        this.buffer = hex_str_to_byte_array(buf) // sjcl.codec.bytes.fromBits(sjcl.codec.hex.toBits(buf));
      } else if (!buf) {
        this.buffer = []
      } else {
        throw new Error("Invalid buffer passed.")
      }
      this.pointer = 0
    }

    /**
     * Convert the byte array to HEX values as String
     * Input is 32-bits(byte) array
     * Output is String with ordered sequence of 16-bit values contains only 0-9 and A-F
     *
     * @memberof Serializer
     */
    public bytes_to_str(in_buf) {
      // return sjcl.codec.hex.fromBits(this.to_bits()).toUpperCase();
      let i
      let out = ""
      let tmp

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

    /**
     * Append the input bytes array to the internal buffer and set the pointer to the end.
     *
     * @memberof Serializer
     */
    // tslint:disable-next-line
    public append = function(bytes) {
      if (bytes instanceof Serializer) {
        bytes = bytes.buffer
      }
      this.buffer = this.buffer.concat(bytes)
      this.pointer += bytes.length
    }

    public resetPointer() {
      this.pointer = 0
    }

    /**
     * Convert the byte array to HEX values
     *
     * @memberof Serializer
     */
    public to_hex() {
      return this.bytes_to_str(this.buffer)
    }

    /**
     * Convert the byte array to JSON format
     *
     * @memberof Serializer
     */
    public to_json() {
      const old_pointer = this.pointer
      this.resetPointer()
      const output = {}

      while (this.pointer < this.buffer.length) {
        // Get the bytes array for the right Serialize type.
        const key_and_value = stypes.parse(this)
        const key = key_and_value[0]
        const value = key_and_value[1]

        output[key] = Serializer.jsonify_structure(value, key)
      }

      this.pointer = old_pointer

      return output
    }

    /**
     * Serialize the object
     *
     * @memberof Serializer
     */
    public serialize(obj) {
      // Serialize object without end marker
      stypes.Object.serialize(this, obj, true)
    }

    /**
     * Hash data using SHA-512 and return the first 256 bits in HEX string format.
     *
     * @memberof Serializer
     */
    public hash(prefix) {
      const sign_buffer = new Serializer(null)
      // Add hashing prefix
      if (typeof prefix !== "undefined") {
        stypes.Int32.serialize(sign_buffer, prefix)
      }
      // Copy buffer to temporary buffer
      sign_buffer.append(this.buffer)

      return this.bytes_to_str(
        hashjs
          .sha512()
          .update(sign_buffer.buffer)
          .digest()
          .slice(0, 32)
      )
    }
  }

  return Serializer
}

const Serializer = Factory()

export { Factory, Serializer }
