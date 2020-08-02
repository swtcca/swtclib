import { convertHexToString, convertStringToHex } from "./serializer"

export function normalize_swt(tx_json, reverse = false) {
  // 签名时，序列化之前的字段处理
  // assume that nobody spend more than 12 swt for transactions
  if (tx_json.Fee > 12) {
    tx_json.Fee = tx_json.Fee / 1000000
    // payment
    if (tx_json.Amount && !isNaN(tx_json.Amount)) {
      // 基础货币
      tx_json.Amount = tx_json.Amount / 1000000
    }
    if (tx_json.SendMax && !isNaN(tx_json.SendMax)) {
      tx_json.SendMax = Number(tx_json.SendMax) / 1000000
    }
    // order
    if (tx_json.TakerPays && !isNaN(tx_json.TakerPays)) {
      // 基础货币
      tx_json.TakerPays = Number(tx_json.TakerPays) / 1000000
    }
    if (tx_json.TakerGets && !isNaN(tx_json.TakerGets)) {
      // 基础货币
      tx_json.TakerGets = Number(tx_json.TakerGets) / 1000000
    }
  }
  if (reverse && tx_json.Fee < 12) {
    tx_json.Fee = tx_json.Fee * 1000000
    // payment
    if (tx_json.Amount && !isNaN(tx_json.Amount)) {
      // 基础货币
      tx_json.Amount = tx_json.Amount * 1000000
    }
    if (tx_json.SendMax && !isNaN(tx_json.SendMax)) {
      tx_json.SendMax = Number(tx_json.SendMax) * 1000000
    }
    // order
    if (tx_json.TakerPays && !isNaN(tx_json.TakerPays)) {
      // 基础货币
      tx_json.TakerPays = Number(tx_json.TakerPays) * 1000000
    }
    if (tx_json.TakerGets && !isNaN(tx_json.TakerGets)) {
      // 基础货币
      tx_json.TakerGets = Number(tx_json.TakerGets) * 1000000
    }
  }
}

// for multisigning
export function normalize_memo(tx_json, reverse = false) {
  // assume that nobody spend more than 12 swt for transactions
  if (tx_json.Fee > 12) {
    if (tx_json.Memos) {
      for (const memo of tx_json.Memos) {
        let data = memo.Memo.MemoData
        let format = memo.Memo.MemoFormat
        if (format === "json") {
          format = convertStringToHex(format)
          if (typeof data !== "string") {
            data = convertStringToHex(JSON.stringify(data))
          } else {
            data = convertStringToHex(data)
          }
        } else if (format === "hex") {
          format = convertStringToHex(format)
          if (data.length % 2 > 0) {
            data = `${data}0`
          }
        } else if (format) {
          // now format and data are in hexdecimal already
          if (/g-z/i.test(format)) {
            throw new Error("should be in hexdecial format now")
          }
        } else {
          // no format specified
          if (typeof data !== "string") {
            data = convertStringToHex(JSON.stringify(data))
            format = convertStringToHex("json")
          } else {
            data = convertStringToHex(data)
          }
        }
        memo.Memo.MemoData = data
        if (format) {
          memo.Memo.MemoFormat = format
        }
      }
    }
  }
  if (reverse) {
    if (tx_json.Memos) {
      for (const memo of tx_json.Memos) {
        let format = memo.Memo.MemoFormat
        // convert hex data and hex format back to data and format
        if (format) {
          format = convertHexToString(format)
          memo.Memo.MemoFormat = format
          if (format !== "hex") {
            memo.Memo.MemoData = convertHexToString(memo.Memo.MemoData)
          }
        } else {
          memo.Memo.MemoData = convertHexToString(memo.Memo.MemoData)
        }
      }
    }
  }
}
