/*
 * NODE JS SDK for Jingtum network； Wallet
 * Copyright (C) 2016 by Jingtum Inc.
 * or its affiliates. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Data functions used to check the valid data types.
 */

import { Factory as WalletFactory } from "swtc-wallet"
import { MAX_CURRENCY_LEN, MIN_CURRENCY_LEN, TUM_NAME_LEN } from "./Constant"

const Factory = (Wallet = WalletFactory("jingtum")) => {
  if (!Wallet.hasOwnProperty("KeyPair")) {
    throw Error("Datacheck need a Wallet class")
  }

  const allNumeric = (text: any): boolean => {
    // assign a string with numbers (0-9) in the HTML form
    const numbers = /^[0-9]+$/
    // Check if the input contains all numbers.
    return Boolean(String(text).match(numbers))
  }

  /*
   * Decide if the input is a valid string
   * for a float value.
   */
  const isFloat = (val: any): boolean => {
    const floatRegex = /^-?\d+(?:[.,]\d*?)?$/
    return Boolean(floatRegex.test(val) && !Number.isNaN(parseFloat(val)))
  }

  // Detect if the string contains only
  // numbers and capital letters.
  const isLetterNumer = (str: any): boolean => {
    const numbers = /^[0-9A-Z]+$/i
    return Boolean(String(str).match(numbers))
  }

  // return true if the code is 3 letters/numbers
  const isCurrency = (code: any): boolean => {
    return (
      typeof code === "string" &&
      Boolean(
        code &&
        code.length >= MIN_CURRENCY_LEN &&
        code.length <= MAX_CURRENCY_LEN
      )
    )
  }

  // return true if the code is 40 letters/numbers
  const isCustomTum = (code: any): boolean => {
    return isLetterNumer(code) && String(code).length === TUM_NAME_LEN
  }

  /*
   * Return true is the input string
   * is a valid TUM code
   */
  const isTumCode = (code: any): boolean => {
    // input must be defined and non-null
    // Make sure if the code meets the coding rule
    // tum: Custom tum, 40 capital letters or number
    return typeof code === "string" && (isCurrency(code) || isCustomTum(code))
  }

  /*
   * Only valid for freeze and authorize
   */
  const isRelation = (str: any): boolean => {
    return typeof str === "string" && (str === "freeze" || str === "autorize")
  }

  /*
   * Check if the input is a valid Amount object
   * Amount should have 3 properties
   * value
   * issuer/counterparty
   * currency
   */
  const isAmount = (obj: any): boolean => {
    if (
      obj === null ||
      typeof obj !== "object" ||
      typeof obj.value !== "string" ||
      !isFloat(obj.value) ||
      !isTumCode(obj.currency)
    ) {
      return false
    }
    // AMOUNT could have a field named
    // either as 'issuer'
    // or as 'counterparty'
    // for SWT, this can be undefined
    if (obj.issuer) {
      if (!Wallet.isValidAddress(obj.issuer)) {
        return false
      }
    } else {
      if (obj.currency !== "SWT") {
        return false
      }
      // if currency === 'SWT',自动补全issuer.
      obj.issuer = ""
    }
    return true
  }

  /*
   * balances  余额
   * value  String  余额
   * currency  String  货币名称，三个字母或是40个字符的字符串
   * counterparty  String  货币发行方
   * freezed  String  冻结的金额
   */
  const isBalance = (obj: any): boolean => {
    if (
      obj === null ||
      typeof obj !== "object" ||
      !isFloat(obj.freezed) ||
      !isFloat(obj.value) ||
      !isTumCode(obj.currency)
    ) {
      return false
    }
    // AMOUNT could have a field named
    // either as 'issuer'
    // or as 'counterparty'
    if (!Wallet.isValidAddress(obj.counterparty)) {
      return false
    }
    return true
  }

  return {
    allNumeric,
    isCustomTum,
    isRelation,
    isTumCode,
    isCurrency,
    isAmount,
    isBalance,
    isLetterNumer
  }
}

export { Factory }
