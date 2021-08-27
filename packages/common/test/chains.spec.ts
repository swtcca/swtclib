import { CHAINS, funcGetChain } from "../"

describe("SWTC_CHAINS:[]", function () {
  for (const code of CHAINS.map(chain => chain.code)) {
    const currency = CHAINS.filter(chain => chain.code === code)[0].currency
    it(`has ${code} ${currency}`, function () {
      expect(CHAINS.filter(c => c.code === "bitcoin").length).toBe(1)
    })
  }
})

describe("get_chain :()=>{}", function () {
  for (const code of CHAINS.map(chain => chain.code)) {
    const currency = CHAINS.filter(chain => chain.code === code)[0].currency
    it(`has ${code} ${currency}`, function () {
      expect(funcGetChain(code).code).toBe(code)
      expect(funcGetChain(code).currency).toBe(currency)
      // expect(funcGetChain(currency).code).toBe(code)
      // expect(funcGetChain(currency).currency).toBe(currency)
    })
  }
})
