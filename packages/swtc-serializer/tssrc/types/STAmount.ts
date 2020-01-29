import BN = require("bn-plus.js")
import BigInteger from "jsbn"
import { convertHexToByteArray } from "../Utils"
import SerializedType from "./SerializedType"
const STAmount = new SerializedType({
  id: 6,
  serialize(so, val) {
    const amount = this.Amount.from_json(val)

    if (!amount.is_valid()) {
      throw new Error("Not a valid Amount object.")
    }

    // Amount (64-bit integer)
    let valueBytes = new Array(8).fill(0)

    // For SWT, offset is 0
    // only convert the value
    if (amount.is_native()) {
      const bn = new BN(amount._value, 10)
      let valueHex = bn.toString(16)

      // Enforce correct length (64 bits)
      if (valueHex.length > 16) {
        throw new Error("Amount Value out of bounds")
      }

      while (valueHex.length < 16) {
        valueHex = "0" + valueHex
      }

      // Convert the HEX value to bytes array
      valueBytes = convertHexToByteArray(valueHex) // bytes.fromBits(hex.toBits(valueHex));

      // Clear most significant two bits - these bits should already be 0 if
      // Amount enforces the range correctly, but we'll clear them anyway just
      // so this code can make certain guarantees about the encoded value.
      valueBytes[0] &= 0x3f

      if (!amount.is_negative()) {
        valueBytes[0] |= 0x40
      }

      so.append(valueBytes)
    } else {
      // For other non-native currency
      // 1. Serialize the currency value with offset
      // Put offset
      let hi = 0

      let lo = 0

      // First bit: non-native
      hi |= 1 << 31

      if (!amount.is_zero()) {
        // Second bit: non-negative?
        if (!amount.is_negative()) {
          hi |= 1 << 30
        }

        // Next eight bits: offset/exponent
        hi |= ((97 + amount._offset) & 0xff) << 22
        // Remaining 54 bits: mantissa
        hi |= amount._value.shrn(32).toNumber() & 0x3fffff
        lo = amount._value.toNumber() & 0xffffffff
      }

      /**
       * Convert from a bitArray to an array of bytes.
       */
      const arr = [hi, lo]
      const l = arr.length

      let x
      let bl
      let i
      let tmp

      if (l === 0) {
        bl = 0
      } else {
        x = arr[l - 1]
        bl = (l - 1) * 32 + (Math.round(x / 0x10000000000) || 32)
      }

      // Setup a new byte array and filled the byte data in
      // Results should not longer than 8 bytes as defined earlier
      const tmparray = []

      for (i = 0; i < bl / 8; i++) {
        if ((i & 3) === 0) {
          tmp = arr[i / 4]
        }
        tmparray.push(tmp >>> 24)
        // console.log("newPush:", i, tmp >>>24);
        tmp <<= 8
      }
      if (tmparray.length > 8) {
        throw new Error(
          "Invalid byte array length in AMOUNT value representation"
        )
      }
      valueBytes = tmparray

      so.append(valueBytes)

      // 2. Serialize the currency info with currency code
      //   and issuer
      // console.log("Serial non-native AMOUNT ......");
      // Currency (160-bit hash)
      const tum_bytes = amount.tum_to_bytes()
      so.append(tum_bytes)

      // Issuer (160-bit hash)
      // so.append(amount.issuer().to_bytes());
      so.append(this.KeyPair.convertAddressToBytes(amount.issuer()))
    }
  },
  parse(so) {
    const amount = new this.Amount()
    const value_bytes = so.read(8)
    let is_zero = !(value_bytes[0] & 0x7f)

    for (let i = 1; i < 8; i++) {
      is_zero = is_zero && !value_bytes[i]
    }

    if (value_bytes[0] & 0x80) {
      // non-native
      const currency = this.STCurrency.parse(so)

      const issuer_bytes = so.read(20)
      const issuer = this.KeyPair.convertBytesToAddress(issuer_bytes) // UInt160.from_bytes(issuer_bytes);

      // issuer.set_version(Base.VER_ACCOUNT_ID);
      const offset =
        ((value_bytes[0] & 0x3f) << 2) + (value_bytes[1] >>> 6) - 97
      const mantissa_bytes = value_bytes.slice(1)
      mantissa_bytes[0] &= 0x3f

      const value = new BigInteger(mantissa_bytes, 256)

      if (value.equals(BigInteger.ZERO) && !is_zero) {
        throw new Error("Invalid zero representation")
      }

      amount._value = value
      amount._offset = offset
      amount._currency = currency
      amount._issuer = issuer
      amount._is_native = false
    } else {
      // native
      const integer_bytes = value_bytes.slice()
      integer_bytes[0] &= 0x3f
      amount._value = new BigInteger(integer_bytes, 256)
      amount._is_native = true
    }
    amount._is_negative = !is_zero && !(value_bytes[0] & 0x40)
    return amount
  }
})

export default STAmount
