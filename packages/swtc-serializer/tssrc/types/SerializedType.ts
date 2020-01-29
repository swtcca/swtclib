import extend = require("extend")

class SerializedType {
  public static serialize_varint(so, val) {
    if (val < 0) {
      throw new Error("Variable integers are unsigned.")
    }

    if (val <= 192) {
      so.append([val])
    } else if (val <= 12480) {
      val -= 193
      so.append([193 + (val >>> 8), val & 0xff])
    } else if (val <= 918744) {
      val -= 12481
      so.append([241 + (val >>> 16), (val >>> 8) & 0xff, val & 0xff])
    } else {
      throw new Error("Variable integer overflow.")
    }
  }

  public serialize
  public parse

  constructor(methods: any) {
    extend(this, methods)
  }

  public parse_varint(so): number {
    const b1 = so.read(1)[0]
    let b2
    let b3
    let result

    if (b1 > 254) {
      throw new Error("Invalid varint length indicator")
    }

    if (b1 <= 192) {
      result = b1
    } else if (b1 <= 240) {
      b2 = so.read(1)[0]
      result = 193 + (b1 - 193) * 256 + b2
    } else if (b1 <= 254) {
      b2 = so.read(1)[0]
      b3 = so.read(1)[0]
      result = 12481 + (b1 - 241) * 65536 + b2 * 256 + b3
    }

    return result
  }
}

export default SerializedType
export { SerializedType }
