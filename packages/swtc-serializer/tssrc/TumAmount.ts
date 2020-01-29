// Represent amounts and currencies objects
// in Jingtum.
// - Numbers in hex are big-endian.

import Bignumber from "bignumber.js"
import BigInteger = require("bn-plus.js")
import extend = require("extend")
import { Factory as WalletFactory } from "swtc-wallet"
import { AMOUNT_CONSTS } from "./Constant"
import { Factory as isTumCodeFactory } from "./DataCheck"
import { IAmount } from "./model"
import { isNumber } from "./Utils"
//
// Amount class in the style of Java's BigInteger class
// https://docs.oracle.com/javase/7/docs/api/java/math/BigInteger.html
//

const Factory = (Wallet = WalletFactory("jingtum")) => {
  const { isTumCode, isAmount, isCurrency, isCustomTum } = isTumCodeFactory(
    Wallet
  )
  class Amount {
    public static from_json(j): Amount {
      return new Amount().parse_json(j)
    }

    private _value
    private _offset
    private _is_native
    private _is_negative
    private _currency
    private _issuer
    private bi_xns_max

    constructor() {
      // Json format:
      //  integer : SWT
      //  { 'value' : ..., 'currency' : ..., 'issuer' : ...}
      this._value = new BigInteger() // NaN for bad value. Always positive.
      this._offset = 0 // Always 0 for SWT.
      this._is_native = true // Default to SWT. Only valid if value is not NaN.
      this._is_negative = false
      this._currency = null // new String;
      this._issuer = null // new String;
      // Add constants to Amount class
      extend(this, AMOUNT_CONSTS)
    }

    public is_valid(): boolean {
      if (this.is_native()) {
        return isNumber(this._value)
      }
      return isAmount({
        value: this._value.toString(),
        currency: this._currency,
        issuer: this._issuer
      })
    }

    public currency(): string {
      return this._currency
    }

    public is_native(): boolean {
      return this._is_native
    }

    public offset(): number {
      return this._offset
    }

    public is_negative(): boolean {
      return this._is_negative
    }

    public is_positive(): boolean {
      return !this.is_zero() && !this.is_negative()
    }

    public is_zero(): boolean {
      return this._value.isZero()
    }

    public issuer(): string {
      return this._issuer
    }

    /**
     * Only set the issuer if the input is a valid address.
     *
     * @param {string} issuer
     * @returns {Amount}
     * @memberof Amount
     */
    public parse_issuer(issuer: string): Amount {
      if (Wallet.isValidAddress(issuer)) {
        this._issuer = issuer
      }

      return this
    }

    /**
     * For SWT, only keep as the integer with precision
     *
     * @param {string} j
     * @returns {Amount}
     * @memberof Amount
     */
    public parse_swt_value(j: string): Amount {
      let m
      if (typeof j === "string") {
        m = j.match(/^(-?)(\d*)(\.\d{0,6})?$/)
      }
      if (m) {
        if (m[3] === undefined) {
          // Integer notation
          // Changed to agree with floating, values multiplied by 1,000,000.
          this._value = new Bignumber(m[2]).multipliedBy(1e6).toNumber() // new BigInteger(m[2]);
        } else {
          // Float notation : values multiplied by 1,000,000.
          // only keep 6 digits after the decimal point.
          this._value = new Bignumber(m[2] + m[3]).multipliedBy(1e6).toNumber() // int_part+fraction_part;//int_part.add(fraction_part);
        }

        this._is_native = true
        this._offset = 0
        this._is_negative = Boolean(m[1]) && this._value !== 0

        if (this._value > this.bi_xns_max) {
          this._value = NaN
        }
      } else {
        this._value = NaN
      }
      return this
    }

    /**
     * Parse a non-native Tum value for the json wire format.
     * Requires _currency not as SWT!
     *
     * @param {(number | string)} j
     * @returns {Amount}
     * @memberof Amount
     */
    public parse_tum_value(j: number | string): Amount {
      this._is_native = false
      switch (typeof j) {
        case "number":
          this._is_negative = j < 0
          this._value = new BigInteger(Math.abs(j))
          this._offset = 0
          break
        case "string":
          const i = j.match(/^(-?)(\d+)$/)
          const d = !i && j.match(/^(-?)(\d*)\.(\d*)$/)
          const e = !d && j.match(/^(-?)(\d*)e(-?\d+)$/) // ? !e

          if (e) {
            // e notation
            this._value = e[2] // new BigInteger(e[2]);
            this._offset = parseInt(e[3], 10)
            this._is_negative = Boolean(e[1])
          } else if (d) {
            // float notation
            const precision = d[3].length
            this._value = this._offset = -precision // integer.multiply(Amount.bi_10.clone().pow(precision)).add(fraction);
            this._is_negative = Boolean(d[1])
          } else if (i) {
            // integer notation
            this._value = i[2] // new BigInteger(i[2]);
            this._offset = 0
            this._is_negative = Boolean(i[1])
          } else {
            this._value = NaN
          }
          break

        default:
          this._value = NaN
      }
      return this
    }

    /**
     * Convert the internal obj to JSON
     *
     * @returns {IAmount}
     * @memberof Amount
     */
    public to_json(): IAmount {
      let result: any
      if (this._is_native) {
        result = new Bignumber(this._value.toString(10))
          .dividedBy(1e6)
          .toString(10)
      } else {
        result = {}
        result.value = new Bignumber(this._value.toString(10))
          .dividedBy(Math.pow(10, Math.abs(this._offset)))
          .toString(10)
        result.currency = this.currency()
        if (this.is_valid()) {
          result.issuer = this._issuer
        }
      }
      return result
    }

    /**
     * Convert the internal Tum Code to byte array for serialization.
     * Input: a string represents the Tum.
     * Output: Bytes array of size 20 (UINT160).
     *
     * @returns {number[]}
     * @memberof Amount
     */
    public tum_to_bytes(): number[] {
      let currencyData = new Array(20).fill(0)

      // Only handle the currency with correct symbol
      if (isCurrency(this._currency)) {
        const currencyCode = this._currency // 区分大小写
        const end = 14
        const len = currencyCode.length - 1
        for (let j = len; j >= 0; j--) {
          currencyData[end - j] = currencyCode.charCodeAt(len - j) & 0xff
        }
      } else if (isCustomTum(this._currency)) {
        // for TUM code start with 8
        // should be HEX code
        currencyData = new BigInteger(this._currency, 16).toArray(null, 20)
      } else {
        throw new Error("Incorrect currency code length.")
      }

      return currencyData
    }

    /**
     * Convert the input JSON data into a valid Amount object
     * Amount should have 3 properties: value、issuer/counterparty & currency
     *
     * Amount:
     *
     * number: 123456
     *
     * string: "123456"
     *
     * obj: {"value": 129757.754575, "issuer":"", "currency":"USD"}
     *
     * @param {(number | string | IAmount)} in_json
     * @returns {Amount}
     * @memberof Amount
     */
    public parse_json(in_json: number | string | IAmount): Amount {
      if (typeof in_json === "number" || typeof in_json === "string") {
        this.parse_swt_value(in_json.toString())
      } else if (in_json !== null && typeof in_json === "object") {
        if (!isTumCode(in_json.currency)) {
          throw new Error("Amount.parse_json: Input JSON has invalid Tum info!")
        }
        // AMOUNT could have a field named either as 'issuer' or as 'counterparty' for SWT, this can be undefined
        if (in_json.currency !== "SWT") {
          this._currency = in_json.currency
          this._is_native = false
          if (Wallet.isValidAddress(in_json.issuer)) {
            this._issuer = in_json.issuer
            // TODO, need to find a better way for extracting the exponent and digits
            const vpow = Number(in_json.value)
              .toExponential()
              .toString()
            const len = Number(vpow.substr(vpow.lastIndexOf("e") + 1))
            const offset = 15 - len
            const factor = Math.pow(10, offset)
            const newvalue = new Bignumber(in_json.value)
              .multipliedBy(factor)
              .toString()
            this._value = new BigInteger(newvalue, 10)
            this._offset = -1 * offset
          } else {
            throw new Error(
              "Amount.parse_json: Input JSON has invalid issuer info!"
            )
          }
        } else {
          this.parse_swt_value(in_json.value.toString())
        }
      } else {
        throw new Error("Amount.parse_json: Unsupported JSON type!")
      }
      return this
    }
  }

  return Amount
}

const Amount = Factory()

export { Factory, Amount }
