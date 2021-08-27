import { Factory } from "./factory"
const Wallet = Factory("jingtum")
const WalletGm = Factory("guomi")
const KeyPair = Wallet.KeyPair
const KeyPairGm = WalletGm.KeyPair

export { Factory, KeyPair, KeyPairGm, Wallet, WalletGm }
