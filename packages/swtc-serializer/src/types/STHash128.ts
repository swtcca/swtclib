import { isHexInt64String, serializeHex } from "../Utils"
import SerializedType from "./SerializedType"

const STHash128 = new SerializedType({
  id: 4,
  serialize(so, val) {
    // const hash = UInt128.from_json(val);
    if (isHexInt64String(val)) {
      serializeHex(so, val, true) // noLength = true
    } else {
      throw new Error("Invalid Hash128")
    }
  },
  parse(so) {
    const val = so.read(16)
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
})

export default STHash128
