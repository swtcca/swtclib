export { IAlgorithm, IChainConfig } from "./address-codec"
import { Codec, Factory } from "./address-codec"
const addressCodec = Factory()
const addressCodecGm = Factory("guomi")

export { Codec, Factory, addressCodec, addressCodecGm }
