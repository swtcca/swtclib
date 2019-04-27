# The COMMUNITY SWTC JavaScript Library for DEVELOPERS

## Swtc-lib heavily based on jingtum-lib and jcc_jingtum_lib and ripple-\*-libs

> ### keep the **same interface** as jingtum-lib or jcc_jingtum_lib, passing all related tests
>
> ### modularized/decoupled for later enhancement
>
> ### native node.js supporting **all major LTS version** including Boron-6, Carbon-8 and Dubnium-10
>
> ### web applications with **zero** webpack support
>
> ### nativescript **mobile app** support (use swtc-lib@nativescript)
>
> ### native **Async Actions** support

## Getting `swtc-lib`

**Via npm for Node.js**

```bash
  $ npm install swtc-lib  // node.js and web app
  $ npm install swtc-lib@next  // try to keep up with jingtum-lib@2.0.0 which introduces more dependancies
  $ npm install swtc-lib@jcc   // if you need to use jcc interfaces, just note that Wallet is added to exports
  $ npm install swtc-lib@nativescript   // mobile nativescript app, simplified one line configuration
```

## Using `swtc-lib`

```javascript
const Wallet = require("swtc-lib").Wallet // cjs import
const Remote = require("swtc-lib").Remote // cjs import
```

or

```javascript
import { Wallet, Remote } from "swtc-lib" // esm import
```

## Involving `swtc-lib`

**Build from the source and test**

```bash
  $ git clone https://github.com/swtcca/swtc-lib.git
  $ cd swtc-lib; npm install
  $ npm run build or npm run build:production (optional for static browser)
  $ npm run test
```

---

# About Jingtum lib

Basic js lib to be used for interacting with jingtum blockchain network.

- Keep only one websocket connecttion to jingtum and handle exception
- Do transaction to jingtumd, and process response
- Subscribe events, include server, ledger, account and so on
- Get other information from jingtum

## Documents

- For more information see `docs.md`
- Developer resource http://developer.jingtum.com/
