export { IAlgorithm, IChainConfig, IGenerateOptions, IKeypair } from "./types"

import { Factory } from "./keypairs"
import { sm2 } from "@swtc/sm.js"
const Keypairs = Factory()
const KeypairsGm = Factory("guomi")

export { sm2, Factory, Keypairs, KeypairsGm }
