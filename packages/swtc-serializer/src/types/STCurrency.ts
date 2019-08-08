import BigInteger = require("bn-plus.js")
import { convertHexToByteArray, convertHexToString } from "../Utils"
import SerializedType from "./SerializedType"

const STCurrency = new SerializedType({
  // Convert the input JSON format data INTO a BYTE array
  from_json_to_bytes(j) {
    // return (new Currency()).parse_json(j, shouldInterpretSWT);

    let val = new Array(20).fill(0)
    switch (typeof j) {
      case "string":
        // For Tum code with 40 chars, such as
        // 800000000000000000000000A95EFD7EC3101635
        // treat as HEX string, convert to the 20 bytes array
        if (this.dataCheck.isCustomTum(j)) {
          val = convertHexToByteArray(j)
        } else if (this.dataCheck.isCurrency(j)) {
          // For Tum code with 3 letters/digits, such as
          // CNY, USD,
          // treat
          //   const currencyCode = j.toUpperCase();
          const currencyCode = j
          const end = 14
          const len = currencyCode.length - 1
          for (let x = len; x >= 0; x--) {
            val[end - x] = currencyCode.charCodeAt(len - x) & 0xff
          }
        } else {
          // Input not match the naming format
          // Throw error
          throw new Error("Input tum code not valid!")
        }
        break
      default:
        throw new Error("Input tum code not valid!")
    }

    return val
  },

  serialize(so, val) {
    const currencyData = val.to_bytes()
    if (!currencyData) {
      throw new Error("Tried to serialize invalid/unimplemented currency type.")
    }
    so.append(currencyData)
  },

  // Convert the Tum/Currency code from a 20 bytes array
  // TODO, check the parse value
  from_bytes(j) {
    if (!Array.isArray(j) || j.length !== 20) {
      return NaN
    }
    return new BigInteger([0].concat(j), 256)
  },
  parse(so) {
    const bytes = so.read(20)
    const currency = this.from_bytes(bytes)
    // XXX Disabled check. Theoretically, the Currency class should support any
    //     UInt160 value and consider it valid. But it doesn't, so for the
    //     deserialization to be usable, we need to allow invalid results for now.
    // if (!currency.is_valid()) {
    //  throw new Error('Invalid currency: '+convertByteArrayToHex(bytes));
    // }
    let s = currency.toString(16).toUpperCase()
    if (!this.dataCheck.isCustomTum(s)) {
      s = convertHexToString(s).replace(/\u0000/g, "")
    }
    return s
  }
})

export default STCurrency
