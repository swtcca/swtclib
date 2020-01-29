import BN = require("bn-plus.js")
import SerializedType from "./types/SerializedType"

/*
 * Input:  HEX data in string format
 * Output: byte array
 */
const serializeHex = (so, hexData, noLength?: boolean) => {
  const byteData = convertHexToByteArray(hexData) // bytes.fromBits(hex.toBits(hexData));
  if (!noLength) {
    SerializedType.serialize_varint(so, byteData.length)
  }
  so.append(byteData)
}

/*
 * Convert a HEX string to byte array
 * for a string, returns as byte array
 * Input is not even, add 0 to the end.
 * a0c -> a0 c0
 */
const convertHexToByteArray = in_str => {
  // If the input HEX string is odd,
  if (in_str.length % 2 !== 0) {
    in_str = in_str + "0"
  }
  return new BN(in_str, 16).toArray(null, in_str.length / 2)
}

export { convertHexToByteArray, serializeHex }

export {
  convertByteArrayToHex,
  convertIntegerToByteArray,
  convertHexToString,
  convertStringToHex,
  get_char_from_num,
  get_dec_from_hexchar,
  get_transaction_type,
  get_transaction_result,
  get_ledger_entry_type,
  hex_str_to_byte_array,
  isHexInt64String,
  isHexHASH256String,
  isNumber,
  isString,
  readAndSum,
  sort_fields
} from "swtc-chains"
