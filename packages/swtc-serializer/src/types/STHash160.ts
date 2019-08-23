import { convertHexToByteArray, serializeHex } from "../Utils"
import SerializedType from "./SerializedType"
const STHash160 = new SerializedType({
  id: 17,
  serialize(so, val) {
    serializeHex(so, convertHexToByteArray(val), true)
  },
  parse(so) {
    return this.KeyPair.convertBytesToAddress(so.read(20))
  }
})

export default STHash160
