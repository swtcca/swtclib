import { INVERSE_FIELDS_MAP } from "../Constant"
import { sort_fields } from "../Utils"
import SerializedType from "./SerializedType"

const STObject = new SerializedType({
  id: 14,
  serialize(so, val, no_marker) {
    let keys = []
    Object.keys(val).forEach(key => {
      // Ignore lowercase field names - they're non-serializable fields by
      // convention.
      if (key[0] === key[0].toLowerCase()) {
        return
      }

      if (typeof INVERSE_FIELDS_MAP[key] === "undefined") {
        throw new Error('JSON contains unknown field: "' + key + '"')
      }

      keys.push(key)
    })

    // Sort fields
    keys = sort_fields(keys)

    // tslint:disable-next-line
    for (let i = 0; i < keys.length; i++) {
      this.customSerialize(so, keys[i], val[keys[i]])
    }

    if (!no_marker) {
      // Object ending marker
      this.STInt8.serialize(so, 0xe1)
    }
  },
  parse(so) {
    const output = {}
    while (so.peek(1)[0] !== 0xe1) {
      const keyval = this.customParse(so)
      output[keyval[0]] = keyval[1]
    }
    so.read(1)
    return output
  }
})

export default STObject
