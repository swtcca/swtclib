import { INVERSE_FIELDS_MAP } from "../Constant"
import {
  convertHexToString,
  convertStringToHex,
  isString,
  sort_fields
} from "../Utils"
import SerializedType from "./SerializedType"

const STMemo = new SerializedType({
  serialize(so, val, no_marker) {
    let keys = []
    Object.keys(val).forEach(key => {
      // Ignore lowercase field names - they're non-serializable fields by
      // convention.
      if (key[0] === key[0].toLowerCase()) {
        return
      }

      // Check the field
      if (typeof INVERSE_FIELDS_MAP[key] === "undefined") {
        throw new Error('JSON contains unknown field: "' + key + '"')
      }

      keys.push(key)
    })

    // Sort fields
    keys = sort_fields(keys)

    // store that we're dealing with json
    const isJson = val.MemoFormat === "json"

    // tslint:disable-next-line
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      let value = val[key]
      switch (key) {
        // MemoType and MemoFormat are always ASCII strings
        case "MemoType":
        case "MemoFormat":
          value = convertStringToHex(value)
          break

        // MemoData can be a JSON object, otherwise it's a string
        case "MemoData":
          if (typeof value !== "string") {
            if (isJson) {
              try {
                value = convertStringToHex(JSON.stringify(value))
              } catch (e) {
                throw new Error(
                  "MemoFormat json with invalid JSON in MemoData field"
                )
              }
            } else {
              throw new Error(
                "MemoData can only be a JSON object with a valid json MemoFormat"
              )
            }
          } else if (isString(value)) {
            value = convertStringToHex(value)
          }
          break
      }

      this.customSerialize(so, key, value)
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

    /* tslint:disable */
    if (output["MemoType"] !== void 0) {
      output["parsed_memo_type"] = convertHexToString(output["MemoType"])
    }

    if (output["MemoFormat"] !== void 0) {
      output["parsed_memo_format"] = convertHexToString(output["MemoFormat"])
    }

    if (output["MemoData"] !== void 0) {
      // see if we can parse JSON
      if (output["parsed_memo_format"] === "json") {
        try {
          output["parsed_memo_data"] = JSON.parse(
            convertHexToString(output["MemoData"])
          )
        } catch (e) {
          // fail, which is fine, we just won't add the memo_data field
        }
      } else if (output["parsed_memo_format"] === "text") {
        output["parsed_memo_data"] = convertHexToString(output["MemoData"])
      }
    }

    so.read(1)
    return output
  }
})

export default STMemo
