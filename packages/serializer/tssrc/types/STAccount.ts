import SerializedType from "./SerializedType"
const STAccount = new SerializedType({
  id: 8,
  serialize(so, val) {
    const byte_data = this.KeyPair.convertAddressToBytes(val)
    SerializedType.serialize_varint(so, byte_data.length)
    so.append(byte_data)
  },
  parse(so) {
    const len = this.parse_varint(so)

    if (len !== 20) {
      throw new Error("Non-standard-length account ID")
    }
    const result = this.KeyPair.convertBytesToAddress(so.read(len)) // UInt160.from_bytes(so.read(len));
    // result.set_version(Base.VER_ACCOUNT_ID);
    // if (false && !result.is_valid()) {
    //     throw new Error('Invalid Account');
    // }
    return result
  }
})

export default STAccount
