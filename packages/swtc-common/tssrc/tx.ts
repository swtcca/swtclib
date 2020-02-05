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
