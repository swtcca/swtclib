import { convertIntegerToByteArray, readAndSum } from "../Utils"
import SerializedType from "./SerializedType"
const STInt32 = new SerializedType({
  id: 2,
  serialize(so, val) {
    so.append(convertIntegerToByteArray(val, 4))
  },
  parse(so) {
    return readAndSum(so, 4)
  }
})

export default STInt32
