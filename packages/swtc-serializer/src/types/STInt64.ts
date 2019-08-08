import * as assert from "assert"
import BN = require("bn-plus.js")
import BigInteger from "jsbn"
import { isHexInt64String, isNumber, isString, serializeHex } from "../Utils"
import SerializedType from "./SerializedType"

/**
 * Convert int64 big number input
 * to HEX string, then serialize it.
 * -2,147,483,648 to +2,147,483,648
 */
const STInt64 = new SerializedType({
  id: 3,
  serialize(so, val) {
    let big_num_in_hex_str // NumObject;

    if (isNumber(val)) {
      val = Math.floor(val)
      if (val < 0) {
        throw new Error("Negative value for unsigned Int64 is invalid.")
      }
      // bigNumObject = new BigInteger(String(val), 10);
      const bn = new BN(val, 10)
      big_num_in_hex_str = bn.toString(16)
      // const a = new BN('dead', 16);
      // const b = new BN('101010', 2);
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
  parse(so) {
    const bytes = so.read(8)
    // We need to add a 0, so if the high bit is set it won't think it's a
    // pessimistic numeric fraek. What doth lief?
    const result = new BigInteger([0].concat(bytes), 256)
    assert(result instanceof BigInteger)
    return result.toString(10)
  }
})

export default STInt64
