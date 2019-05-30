# The SWTC Wallet Package
  
## swtc-wallet == jingtum-base-lib

## but it is beyond 
### import
```javascript
const Wallet = require('swtc-wallet').Wallet  // 井通钱包
const wallet = Wallet.generate()
const base = new Wallet(wallet.secret)
console.log(wallet)
console.log(base.sign("hello world"))
const Factory = require('swtc-wallet').Factory
const BizainWallet = Factory('bizain')  // 商链钱包
console.log(BizainWallet.generate())
const RippleWallet = Factory('ripple')  // 瑞波钱包
console.log(RippleWallet.generate())
```
