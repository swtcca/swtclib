import { convertByteArrayToHex, isString, serializeHex } from "../Utils"
import SerializedType from "./SerializedType"

const STVL = new SerializedType({
  id: 7,
  serialize(so, val) {
    if (isString(val)) {
      serializeHex(so, val)
    } else {
      throw new Error("Unknown datatype.")
    }
  },
  parse(so) {
    const len = this.parse_varint(so)
    return convertByteArrayToHex(so.read(len))
  }
})

export default STVL
