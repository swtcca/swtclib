import { convertIntegerToByteArray, readAndSum } from "../Utils"
import SerializedType from "./SerializedType"
const STInt16 = new SerializedType({
  id: 1,
  serialize(so, val) {
    so.append(convertIntegerToByteArray(val, 2))
  },
  parse(so) {
    return readAndSum(so, 2)
  }
})

export default STInt16
