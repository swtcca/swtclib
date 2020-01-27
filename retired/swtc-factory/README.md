# The SWTC Base Factory JavaScript Library

swtc-factory == jcc-jingtum-base-lib

## with enhancements

1. supports more wallets for different chains
   > - ripple, bitcoin
   > - call, stream
   > - jingtum, bizain
2. supports `ed25519` algorithm for seed
3. typescript friendly since v1.2

## usages

```javascript
> .load test.js
const Wallet = require('swtc-factory').Wallet
const SwtcChains = require('swtc-chains')
var wallet
SwtcChains.forEach( chain => {
        let token = chain.currency
	console.log(`\t... with secp256k1 ...`)
	wallet = Wallet.generate(token)
	console.log(`${token} address:\t${wallet.address}`)
	console.log(`${token} secret:\t${wallet.secret}`)
	console.log(`\t... with ed25519 ...`)
	wallet = Wallet.generate(token, {algorithm: 'ed25519'})
	console.log(`${token} address:\t${wallet.address}`)
	console.log(`${token} secret:\t${wallet.secret}`)
})

	... with secp256k1 ...
BTC address:	16kXez5CogMiYjhYZt4ypiBKMdZMQLe2Kc
BTC secret:	35MDfeFj9ZF6WCYXpPcAbzw3Ymt65
	... with ed25519 ...
BTC address:	18r5HQz1MEhK3Figc66TnWfPYoKpRtkfmw
BTC secret:	3FdVDT7tbqK5uRny3jCSaN7pvm5ai5m
	... with secp256k1 ...
XRP address:	rsmSNgwLfx8s9GwKEarcWxsFuWxXUVzCJy
XRP secret:	snbratgKcMgQhfKQ8P4m7bsrXhmkQ
	... with ed25519 ...
XRP address:	rwrKqUvoycV9gK4DuHbESF39NnVXjMvor7
XRP secret:	sEd7kFD1erA33sVPsKNbqAaGp6NoAVE
	... with secp256k1 ...
XLM address:	gwErV7U7pKZRfpzHNZzVFQgHSdaYwpcENv
XLM secret:	paaoyoG2pCuVgtxduppVShVgN98VX
	... with ed25519 ...
XLM address:	gKpWGStT7EJ46Ze1TvS6A3EWhtvaATQT1K
XLM secret:	pEdSSeprhmqrtCcAvSRWrdAM6kcjw47
	... with secp256k1 ...
CALL address:	cHG4tRGC3ihGbqWY5fnoh1Fwhy2bJER5HP
CALL secret:	sh9Rta1dmEayh8o2ZftBYzb4kmmtZ
	... with ed25519 ...
CALL address:	cwmfZvrBsTuUV9tUhggVEVvFk63wm8kbo7
CALL secret:	sEdTvPQE5kFVta8f5AxBLZKZ8Z3XCmW
	... with secp256k1 ...
STM address:	v4U6Zw3EuDTuL6yyxmAgKpijAcXZwBKEAc
STM secret:	shuMxfHs7xKAkX4LYAkggnrzSduqb
	... with ed25519 ...
STM address:	vwHU7sV56ZffeVBc2ijXqztKGoiKX6TdFh
STM secret:	sEdVGc1nGor7HmmqfjN9bb1psyCvnjr
	... with secp256k1 ...
SWT address:	jfnxW6tgzuUEMSU8n1zi5PpP3rhX6XAjVo
SWT secret:	shaRNXjy6aDGbn6a8MgCpMcJCE2om
	... with ed25519 ...
SWT address:	jpMoHNKUSk1bxDTozCXvrbubr4CExAGkYP
SWT secret:	sEdSCykKdVPiREXCkek5ARSsE4PxmJ3
	... with secp256k1 ...
BWT address:	bHU4ap7ANtWihUoJ1qhABn1imtK4Jigain
BWT secret:	saNaU2fEHtRY4Vx5oQiWS15n2Hizz
	... with ed25519 ...
BWT address:	bShESv4x2Bj7XXLxav9FWD85AP4CLf44X
BWT secret:	sEdVMW7dRrD1qU7uYhbNRAkgKUx6MaU
```
