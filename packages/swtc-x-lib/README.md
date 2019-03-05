
# The SWTC JavaScript Library

## SWTC heavily adjust and repackage jingtum-lib and jcc_jingtum_lib and ripple-*-libs, but made it modular and **friendly** for developers
-  keep the same interface as jingtum-lib or jcc_jingtum_lib, pass all related tests
-  native node.js supporting LTS version including Boron-6, Carbon-8 and Dubnium-10
-  web applications with zero webpack support
-  nativescript mobile app support (use swtc-lib@nativescript)

## Getting `swtc-lib`

**Via npm for Node.js**

```
  $ npm install swtc-lib  // node.js and web app
  $ npm install swtc-lib@jcc   // if you wish to use jcc like interfaces, just note that Wallet is added to exports so there is no need for base-lib 
  $ npm install swtc-lib@nativescript   // mobile nativescript app, simplified one line configuration
```

**Via npm for Node.js**

```
const Wallet = require('swtc-lib').Wallet // cjs import
const Remote = require('swtc-lib').Remote // cjs import
import { Wallet, Remote } from 'swtc-lib' // esm import
```

**Build from the source and test**

```
  $ git clone https://github.com/swtcca/swtc-lib.git
  $ cd swtc-lib; npm install
  $ (optional) npm run build or npm run build:production
  $ npm run test
```

---------------------------------------------

# About Jingtum lib

Basic js lib to be used for interacting with jingtum blockchain network.
- Keep only one websocket connecttion to jingtum and handle exception
- Do transaction to jingtumd, and process response
- Subscribe events, include server, ledger, account and so on
- Get other information from jingtum

## INSTALL
```
$ npm install jingtum-lib
```

## Documents

For more information see `docs.md`
