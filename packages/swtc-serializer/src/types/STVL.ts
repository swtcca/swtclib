import { convertByteArrayToHex, serializeHex } from "../Utils"
import SerializedType from "./SerializedType"

const STVL = new SerializedType({
  id: 7,
  serialize(so, val) {
    const flag = val === "" ? true : false
    serializeHex(so, val, flag)
  },
  parse(so) {
    const len = this.parse_varint(so)
    return convertByteArrayToHex(so.read(len))
  }
})

export default STVL
