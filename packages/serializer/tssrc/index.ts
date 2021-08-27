import { Factory } from "./Serializer"
import { WalletGm } from "@swtc/wallet"

const Serializer = Factory()
const SerializerGm = Factory(WalletGm)

export { Factory, Serializer, SerializerGm }
