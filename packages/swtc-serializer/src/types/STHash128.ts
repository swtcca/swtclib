import BigInteger = require("bn-plus.js")
import { isString, serializeHex } from "../Utils"
import SerializedType from "./SerializedType"

const STHash128 = new SerializedType({
  id: 4,
  serialize(so, val) {
    // const hash = UInt128.from_json(val);
    if (isString(val) && /^[0-9A-F]{32}$/i.test(val)) {
      serializeHex(so, val, true) // noLength = true
    } else {
      throw new Error("Invalid Hash128")
    }
  },
  parse(so) {
    const val = so.read(16)
    return new BigInteger([0].concat(val), 256).toString(16).toUpperCase()
  }
})

export default STHash128
