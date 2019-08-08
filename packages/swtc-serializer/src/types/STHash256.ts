import { isHexInt64String, serializeHex } from "../Utils"
import SerializedType from "./SerializedType"
const STHash256 = new SerializedType({
  id: 5,
  serialize(so, val) {
    if (isHexInt64String(val)) {
      serializeHex(so, val, true)
    } else {
      throw new Error("Invalid Hash256")
    }
  },
  parse() {
    // return UInt256.from_bytes(so.read(32));
    return NaN
  }
})

export default STHash256
