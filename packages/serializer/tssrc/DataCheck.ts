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

import {
  allNumeric,
  isCurrency,
  isCustomTum,
  isFloat,
  isLetterNumer,
  isRelation,
  isTumCode
} from "@swtc/common"
import { Factory as WalletFactory } from "@swtc/wallet"

const Factory = (Wallet = WalletFactory("jingtum")) => {
  if (!Wallet.hasOwnProperty("KeyPair")) {
    throw Error("Datacheck need a Wallet class")
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
      if (obj.currency !== Wallet.getCurrency()) {
        return false
      }
      // if currency is native,自动补全issuer.
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
    isLetterNumer,
    isAmount,
    isBalance
  }
}

export { Factory }
