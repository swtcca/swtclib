import SerializedType from "./SerializedType"
import STHash256 from "./STHash256"
const STVector256 = new SerializedType({
  id: 19,
  serialize(so, val) {
    // Assume val is an array of STHash256 objects.
    for (let i = 0, l = val.length; i < l; i++) {
      STHash256.serialize(so, val[i])
    }
  },
  parse(so) {
    const length = this.parse_varint(so)
    const output = []
    // length is number of bytes not number of Hash256
    for (let i = 0; i < length / 32; i++) {
      output.push(STHash256.parse(so))
    }
    return output
  }
})

export default STVector256
