import { Factory } from "./factory"
import { WalletGm } from "@swtc/wallet"

const Remote = Factory()
const RemoteGm = Factory(WalletGm)

export { Factory, Remote, RemoteGm }
