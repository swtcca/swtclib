import SerializedType from "./SerializedType"

const STArray = new SerializedType({
  id: 15,
  serialize(so, val) {
    for (let i = 0, l = val.length; i < l; i++) {
      const keys = Object.keys(val[i])

      if (keys.length !== 1) {
        throw Error(
          "Cannot serialize an array containing non-single-key objects"
        )
      }

      const field_name = keys[0]
      const value = val[i][field_name]
      this.customSerialize(so, field_name, value)
    }

    // Array ending marker
    this.STInt8.serialize(so, 0xf1)
  },
  parse(so) {
    const output = []

    while (so.peek(1)[0] !== 0xf1) {
      const keyval = this.customParse(so)
      const obj = {}
      obj[keyval[0]] = keyval[1]
      output.push(obj)
    }

    so.read(1)

    return output
  }
})

export default STArray
