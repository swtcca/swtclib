import { convertIntegerToByteArray, readAndSum } from "../Utils"
import SerializedType from "./SerializedType"

const STInt8 = new SerializedType({
  serialize(so, val) {
    so.append(convertIntegerToByteArray(val, 1))
  },
  parse(so) {
    return readAndSum(so, 1)
  }
})

export default STInt8
