import { Codec, Factory } from "./address-codec"
const addressCodec = Factory()
const addressCodecGm = Factory("guomi")

export { Codec, Factory, addressCodec, addressCodecGm }
