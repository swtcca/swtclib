import { Factory } from "./factory"
const Wallet = Factory("jingtum")
const KeyPair = Wallet.KeyPair

export { Factory, KeyPair, Wallet }
