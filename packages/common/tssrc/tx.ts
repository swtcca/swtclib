import {
  convertHexToString,
  convertStringToHex
  // isHexMemoString
} from "./serializer"

export function tx_json_filter(tx_json) {
  // 签名时，序列化之前的字段处理
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

// export function normalize_memo(tx_json, reverse = false) {
//   if (tx_json.Memos) {
//     for (const memo of tx_json.Memos) {
//       let data = memo.Memo.MemoData
//       if (!isHexMemoString(data)) {
//         data = convertStringToHex(data)
//         memo.Memo.MemoData = data
//       }
//       if (reverse) {
//         memo.Memo.MemoData = convertHexToString(data)
//       }
//     }
//   }
// }

// for multisigning
// treat hex as normal string for now, odd even do not pass signature check
export function normalize_memo(tx_json, reverse = false) {
  if (tx_json.Memos) {
    for (const memo of tx_json.Memos) {
      let data = memo.Memo.MemoData
      let format = memo.Memo.MemoFormat
      if (format === "json") {
        format = convertStringToHex(format)
        data = convertStringToHex(JSON.stringify(data))
      } else if (format === "hex") {
        format = convertStringToHex(format)
        if (data.length % 2 > 0) {
          data = `${data}0`
        }
      } else if (format) {
        format = convertStringToHex(format)
        data = convertStringToHex(data)
      } else {
        // no format, pure default text
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

      if (reverse) {
        // convert hex data and hex format back to data and format
        // do not use any more
        if (format) {
          format = convertHexToString(format)
          memo.Memo.MemoFormat = format
        }
        memo.Memo.MemoData = convertHexToString(data)
      }
    }
  }
}
