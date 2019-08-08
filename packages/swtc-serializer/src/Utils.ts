

import BN = require("bn-plus.js")
import SerializedType from "./types/SerializedType"
import { INVERSE_FIELDS_MAP } from "./Constant"

/*
 * return the transaction type in string
 * Data defined in the TRANSACTION_TYPES
 */
const get_transaction_type = (structure: number | string): number | string => {
    let output
    switch (typeof structure) {
        case "number":
            switch (structure) {
                case 0:
                    output = "Payment"
                    break
                case 3:
                    output = "AccountSet"
                    break
                case 5:
                    output = "SetRegularKey"
                    break
                case 7:
                    output = "OfferCreate"
                    break
                case 8:
                    output = "OfferCancel"
                    break
                case 9:
                    output = "Contract"
                    break
                case 10:
                    output = "RemoveContract"
                    break
                case 20:
                    output = "TrustSet"
                    break
                case 21:
                    output = "RelationSet"
                    break
                case 22:
                    output = "RelationDel"
                    break
                case 30:
                    output = "ConfigContract"
                    break
                case 100:
                    output = "EnableFeature"
                    break
                case 101:
                    output = "SetFee"
                    break
                default:
                    throw new Error("Invalid transaction type!")
            }
            break
        case "string":
            switch (structure) {
                case "Payment":
                    output = 0
                    break
                case "AccountSet":
                    output = 3
                    break
                case "SetRegularKey":
                    output = 5
                    break
                case "OfferCreate":
                    output = 7
                    break
                case "OfferCancel":
                    output = 8
                    break
                case "Contract":
                    output = 9
                    break
                case "RemoveContract":
                    output = 10
                    break
                case "TrustSet":
                    output = 20
                    break
                case "RelationSet":
                    output = 21
                    break
                case "RelationDel":
                    output = 22
                    break
                case "ConfigContract":
                    output = 30
                    break
                case "EnableFeature":
                    output = 100
                    break
                case "SetFee":
                    output = 101
                    break
                default:
                    throw new Error("Invalid transaction type!")
            }
            break
        default:
            throw new Error("Invalid input type for transaction type!")
    }
    return output
}

/*
   * return the transaction result in string
   * Data defined in the TRANSACTION_RESULTS
   *  tesSUCCESS               : 0,
    tecCLAIM                 : 100,
    tecPATH_PARTIAL          : 101,
    tecUNFUNDED_ADD          : 102,
    tecUNFUNDED_OFFER        : 103,
    tecUNFUNDED_PAYMENT      : 104,
    tecFAILED_PROCESSING     : 105,
    tecDIR_FULL              : 121,
    tecINSUF_RESERVE_LINE    : 122,
    tecINSUF_RESERVE_OFFER   : 123,
    tecNO_DST                : 124,
    tecNO_DST_INSUF_SWT      : 125,
    tecNO_LINE_INSUF_RESERVE : 126,
    tecNO_LINE_REDUNDANT     : 127,
    tecPATH_DRY              : 128,
    tecMASTER_DISABLED       : 130,
    tecNO_REGULAR_KEY        : 131,
    tecOWNERS                : 132,
    tecNO_ISSUER             : 133,
    tecNO_AUTH               : 134,
    tecNO_LINE               : 135,
    tecINSUFF_FEE            : 136,
    tecFROZEN                : 137,
    tecNO_TARGET             : 138,
    tecNO_PERMISSION         : 139,
    tecNO_ENTRY              : 140,
    tecINSUFFICIENT_RESERVE  : 141
  */
const get_transaction_result = (
    structure: number | string
): number | string => {
    let output
    switch (typeof structure) {
        case "number":
            switch (structure) {
                case 0:
                    output = "tesSUCCESS"
                    break
                case 100:
                    output = "tecCLAIM"
                    break
                case 101:
                    output = "tecPATH_PARTIAL"
                    break
                case 102:
                    output = "tecUNFUNDED_ADD"
                    break
                case 103:
                    output = "tecUNFUNDED_OFFER"
                    break
                case 104:
                    output = "tecUNFUNDED_PAYMENT"
                    break
                case 105:
                    output = "tecFAILED_PROCESSING"
                    break
                case 121:
                    output = "tecDIR_FULL"
                    break
                case 122:
                    output = "tecINSUF_RESERVE_LINE"
                    break
                case 141:
                    output = "tecINSUFFICIENT_RESERVE"
                    break
                default:
                    throw new Error("Invalid transaction result!")
            }
            break
        case "string":
            switch (structure) {
                case "tesSUCCESS":
                    output = 0
                    break
                case "tecCLAIM":
                    output = 100
                    break
                case "tecPATH_PARTIAL":
                    output = 101
                    break
                case "tecUNFUNDED_ADD":
                    output = 102
                    break
                case "tecUNFUNDED_OFFER":
                    output = 103
                    break
                case "tecUNFUNDED_PAYMENT":
                    output = 104
                    break
                case "tecFAILED_PROCESSING":
                    output = 105
                    break
                case "tecDIR_FULL":
                    output = 121
                    break
                case "tecINSUF_RESERVE_LINE":
                    output = 122
                    break
                case "tecINSUFFICIENT_RESERVE":
                    output = 141
                    break
                default:
                    throw new Error("Invalid transaction result!")
            }
            break
        default:
            throw new Error("Invalid input type for transaction result!")
    }

    return output
}

/*
   * return the transaction type in string
   * Data defined in the ledger entry:
    AccountRoot: [97].concat(sleBase,[
    Contract: [99].concat(sleBase,[
    DirectoryNode: [100].concat(sleBase,[
    EnabledFeatures: [102].concat(sleBase,[
    FeeSettings: [115].concat(sleBase,[
    GeneratorMap: [103].concat(sleBase,[
    LedgerHashes: [104].concat(sleBase,[
    Nickname: [110].concat(sleBase,[
    Offer: [111].concat(sleBase,[
    SkywellState: [114].concat(sleBase,[
    TODO: add string input handles
  */
const get_ledger_entry_type = (structure: number | string): number | string => {
    let output
    switch (typeof structure) {
        case "number":
            switch (structure) {
                case 97:
                    output = "AccountRoot"
                    break
                case 99:
                    output = "Contract"
                    break
                case 100:
                    output = "DirectoryNode"
                    break
                case 102:
                    output = "EnabledFeatures"
                    break
                case 115:
                    output = "FeeSettings"
                    break
                case 103:
                    output = "GeneratorMap"
                    break
                case 104:
                    output = "LedgerHashes"
                    break
                case 110:
                    output = "Nickname"
                    break
                case 111:
                    output = "Offer"
                    break
                case 114:
                    output = "SkywellState"
                    break
                default:
                    throw new Error("Invalid input type for ransaction result!")
            }
            break
        case "string":
            switch (structure) {
                case "AccountRoot":
                    output = 97
                    break
                case "Contract":
                    output = 99
                    break
                case "DirectoryNode":
                    output = 100
                    break
                case "EnabledFeatures":
                    output = 102
                    break
                case "FeeSettings":
                    output = 115
                    break
                case "GeneratorMap":
                    output = 103
                    break
                case "LedgerHashes":
                    output = 104
                    break
                case "Nickname":
                    output = 110
                    break
                case "Offer":
                    output = 111
                    break
                case "SkywellState":
                    output = 114
                    break
                default:
                    output = 0 // undefined results, should not come here.
            }
            break
        default:
            output = "UndefinedLedgerEntry"
    } // end typeof structure

    return output
}

/*
 * convert a HEX to dec number
 * 0-9 to the same digit
 * a-z, A-Z to 10 - 15,
 * all others to 0
 */

/**
 * convert a HEX to dec number
 * 0-9 to the same digit
 * a-z, A-Z to 10 - 35
 *
 * @param {string} in_char
 * @returns {number}
 */
const get_dec_from_hexchar = (in_char: string): number => {
    if (in_char.length > 1) {
        return 0
    }
    const asc_code = in_char.charCodeAt(0)
    if (asc_code > 48 && asc_code < 58) {
        // digit 1-9
        return asc_code - 48
    } else if (asc_code > 64 && asc_code < 91) {
        // A-Z
        return asc_code - 55
    } else if (asc_code > 96 && asc_code < 123) {
        // a-z
        return asc_code - 87
    }

    return 0
}

// HEX string to bytes
// for a string, returns as byte array
// Input is not even, add 0 to the end.
// a0c -> a0 c0
const hex_str_to_byte_array = (in_str: string): number[] => {
    let i
    const out = []
    const str = in_str.replace(/\s|0x/g, "")
    for (i = 0; i < str.length; i += 2) {
        // for even
        if (i + 1 === str.length) {
            out.push(get_dec_from_hexchar(str.charAt(i)) * 16)
        } else {
            out.push(
                get_dec_from_hexchar(str.charAt(i)) * 16 +
                get_dec_from_hexchar(str.charAt(i + 1))
            )
        }
    }
    return out
}

// defined results of transaction
const get_char_from_num = (in_num: number): number => {
    if (in_num >= 0 && in_num < 10) {
        return in_num + 48
    } // 0-9
    if (in_num >= 10 && in_num < 16) {
        return in_num + 55
    } // A-F
}

// Convert a certain number of bytes from the serialized object ('so') into an integer.
const readAndSum = (so, bytes) => {
    let sum = 0

    if (bytes > 4) {
        throw new Error("This function only supports up to four bytes.")
    }

    for (let i = 0; i < bytes; i++) {
        const byte = so.read(1)[0]
        sum += byte << (8 * (bytes - i - 1))
    }

    // Convert to unsigned integer
    return sum >>> 0
}

const isNumber = val => {
    return typeof val === "number" && isFinite(val)
}

/**
 * Convert an integer value into an array of bytes.
 * The result is appended to the serialized object ('so').
 * @param {*} val
 * @param {*} bytes
 * @returns
 */
const convertIntegerToByteArray = (val, bytes) => {
    if (!isNumber(val)) {
        throw new Error("Value is not a number " + bytes)
    }

    if (val < 0 || val >= Math.pow(256, bytes)) {
        throw new Error("Value out of bounds")
    }

    const newBytes = []

    for (let i = 0; i < bytes; i++) {
        newBytes.unshift((val >>> (i * 8)) & 0xff)
    }

    return newBytes
}

/*
 * input: UTF8 coding string
 * output: HEX code
 */
const convertStringToHex = in_str => {
    const str = unescape(encodeURIComponent(in_str))
    let out_str = ""

    let i
    for (i = 0; i < str.length; i++) {
        out_str += (" 00" + Number(str.charCodeAt(i)).toString(16)).substr(-2)
    }
    return out_str.toUpperCase() // hex.fromBits(utf8.toBits(in_str)).toUpperCase());
}

const convertHexToString = hexString => {
    let out_str = ""

    let i
    for (i = 0; i < hexString.length; i += 2) {
        const tmp = "0x" + hexString.slice(i, i + 2)
        out_str += String.fromCharCode(parseInt(tmp, 16))
    }
    return decodeURIComponent(escape(out_str)) // out_str.toUpperCase();/
}

const sort_fields = keys => {
    function sort_field_compare(a, b) {
        const a_field_coordinates = INVERSE_FIELDS_MAP[a]
        const a_type_bits = a_field_coordinates[0]
        const a_field_bits = a_field_coordinates[1]

        const b_field_coordinates = INVERSE_FIELDS_MAP[b]
        const b_type_bits = b_field_coordinates[0]
        const b_field_bits = b_field_coordinates[1]

        // Sort by type id first, then by field id
        return a_type_bits !== b_type_bits
            ? a_type_bits - b_type_bits
            : a_field_bits - b_field_bits
    }

    return keys.sort(sort_field_compare)
}

const isString = (val): boolean => {
    return typeof val === "string"
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

const convertByteArrayToHex = byte_array => {
    return byte_array
        .map(byteValue => {
            const hex = byteValue.toString(16).toUpperCase()
            return hex.length > 1 ? hex : "0" + hex
        })
        .join("")
}

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
 * Use RegExp match function
 * perform case-insensitive matching
 * for HEX chars 0-9 and a-f
 */
const isHexInt64String = val => {
    return isString(val) && /^[0-9A-F]{0,16}$/i.test(val)
}

export {
    convertByteArrayToHex,
    convertHexToByteArray,
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
    isNumber,
    isString,
    readAndSum,
    serializeHex,
    sort_fields
}
